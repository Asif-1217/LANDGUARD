/**
 * LANDGUARD — Land Conflict Intelligence System
 * Rule-Based Risk Engine
 *
 * This module implements the transparent, rule-based conflict detection
 * and risk scoring system. Rules are documented here and in the README.
 *
 * SCORING RULES (additive, maximum 100):
 *   RULE-01  Ownership mismatch between deed and mutation      → +40 pts  (HIGH)
 *   RULE-02  Multiple active deeds for same plot               → +45 pts  (HIGH)
 *   RULE-03  Missing mutation record                           → +15 pts  (MEDIUM)
 *   RULE-04  Missing deed reference in transfer history        → +10 pts  (MEDIUM)
 *   RULE-05  Unverified deed status                            → +10 pts  (MEDIUM)
 *   RULE-06  Chronological inconsistency (transfer before deed)→ +20 pts  (HIGH)
 *   RULE-07  Missing critical fields (area, witness, etc.)     → +5 pts each (max +20)
 *
 * RISK LEVEL THRESHOLDS:
 *   0        → "No Conflict Detected"
 *   1–19     → LOW
 *   20–49    → MEDIUM
 *   50–100   → HIGH
 *   (data completeness < 50% or score based on missing data only) → INCOMPLETE DATA
 */

const RiskEngine = (() => {

  // ──────────────────────────────────────────────────────────────
  // RULE DEFINITIONS (used for display and transparency)
  // ──────────────────────────────────────────────────────────────
  const RULES = {
    "RULE-01": {
      id: "RULE-01",
      name: "Ownership Mismatch",
      nameBn: "মালিকানা নামের গরমিল",
      description: "The recorded owner name in the deed record differs from the recorded owner in the mutation record for the same plot. This may indicate a clerical error, an incomplete transfer, or require further investigation.",
      descriptionBn: "দলিলের নিবন্ধিত ক্রেতা/মালিকের নামের সাথে রাজস্ব নামজারি রেকর্ডের মালিকের নামের অমিল রয়েছে। এটি তথ্য এন্ট্রি ত্রুটি, অসম্পূর্ণ নামজারি বা দ্বৈত হস্তান্তরের প্রাথমিক ইঙ্গিত হতে পারে।",
      points: 40,
      severity: "HIGH"
    },
    "RULE-02": {
      id: "RULE-02",
      name: "Duplicate Active Deeds",
      nameBn: "একাধিক সক্রিয় দলিল",
      description: "More than one deed record with 'Active' status exists for the same plot identifier in the synthetic dataset. Only one active deed should generally exist for a single plot. Multiple active deeds require manual verification.",
      descriptionBn: "একই প্লটের বিপরীতে একাধিক দলিল 'সক্রিয়' (Active) অবস্থায় পাওয়া গেছে। সাধারণভাবে এক খণ্ড জমিতে একই সময়ে একাধিক কার্যকর দলিল থাকা ঝুঁকিপূর্ণ এবং তদন্ত সাপেক্ষ।",
      points: 45,
      severity: "HIGH"
    },
    "RULE-03": {
      id: "RULE-03",
      name: "Missing Mutation Record",
      nameBn: "নামজারি খতিয়ান অনুপস্থিত",
      description: "No approved mutation entry was found for this plot. A mutation record is expected after a deed transfer. Its absence may indicate an incomplete administrative process.",
      descriptionBn: "দলিল রেজিস্ট্রেশনের পর ভূমি অফিসে কোনো অনুমোদিত নামজারি (জমা-খারিজ) রেকর্ড পাওয়া যায়নি। নামজারি না থাকা প্রশাসনিক প্রক্রিয়া অপূর্ণতার নির্দেশক।",
      points: 15,
      severity: "MEDIUM"
    },
    "RULE-04": {
      id: "RULE-04",
      name: "Unlinked Transfer Record",
      nameBn: "অসংযুক্ত হস্তান্তর রেকর্ড",
      description: "One or more transfer history entries lack a corresponding deed reference or mutation reference, making the full ownership chain harder to trace.",
      descriptionBn: "মালিকানা হস্তান্তরের ইতিহাসে দলিল বা নামজারির সুনির্দিষ্ট রেফারেন্স নেই, ফলে পূর্ববর্তী মালিকানা শৃঙ্খল অস্পষ্ট।",
      points: 10,
      severity: "MEDIUM"
    },
    "RULE-05": {
      id: "RULE-05",
      name: "Unverified Deed",
      nameBn: "অযাচাইকৃত দলিল",
      description: "At least one deed record has a verification status other than 'Verified'. Unverified deeds should be reviewed by qualified professionals before relying on them.",
      descriptionBn: "অন্তত একটি দলিলের স্ট্যাটাস 'যাচাইকৃত' (Verified) নয়। সাব-রেজিস্ট্রার কার্যালয়ের মূল ভলিউম বই থেকে সরাসরি যাচাই প্রয়োজন।",
      points: 10,
      severity: "MEDIUM"
    },
    "RULE-06": {
      id: "RULE-06",
      name: "Chronological Inconsistency",
      nameBn: "সময়ক্রমের অসঙ্গতি",
      description: "A transfer or mutation date appears before the corresponding deed registration date. Dates in the transfer chain should follow a logical chronological order.",
      descriptionBn: "দলিল রেজিস্ট্রেশনের পূর্বেই হস্তান্তর বা নামজারির তারিখ দেখা যাচ্ছে। রেকর্ডের কালানুক্রমিক ধারাবাহিকতায় অসংগতি রয়েছে।",
      points: 20,
      severity: "HIGH"
    },
    "RULE-07": {
      id: "RULE-07",
      name: "Missing Critical Fields",
      nameBn: "গুরুত্বপূর্ণ তথ্যের ঘাটতি",
      description: "One or more critical fields (such as plot area, witness name, or consideration amount) are absent from the records. Missing data reduces confidence in the completeness of the record.",
      descriptionBn: "জমির পরিমাণ, দলিলের মূল্য বা সাক্ষীর তথ্যের মতো গুরুত্বপূর্ণ ক্ষেত্রসমূহ অনুপস্থিত। পর্যাপ্ত তথ্যের অভাবে রেকর্ডের বিশ্বাসযোগ্যতা হ্রাস পায়।",
      points: 5, // per field, up to 20
      severity: "LOW"
    }
  };

  // ──────────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────────

  function normalise(name) {
    if (!name) return null;
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function parseDate(str) {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  // ──────────────────────────────────────────────────────────────
  // MAIN ANALYSIS FUNCTION
  // ──────────────────────────────────────────────────────────────

  function analysePlot(plot) {
    const triggeredRules = [];
    const evidence = [];
    let score = 0;

    // ── RULE-01: Ownership Mismatch ─────────────────────────────
    if (plot.deeds.length > 0 && plot.mutations.length > 0) {
      const activeDeed = plot.deeds.find(d => d.status === "Active") || plot.deeds[0];
      const latestMutation = plot.mutations[plot.mutations.length - 1];

      const deedOwner = normalise(activeDeed.registeredOwner);
      const mutationOwner = normalise(latestMutation.recordedOwner);

      if (deedOwner && mutationOwner && deedOwner !== mutationOwner) {
        score += RULES["RULE-01"].points;
        triggeredRules.push("RULE-01");
        evidence.push({
          rule: "RULE-01",
          field: "Registered Owner",
          deedValue: activeDeed.registeredOwner,
          mutationValue: latestMutation.recordedOwner,
          detail: `Deed ${activeDeed.deedId} lists owner as "${activeDeed.registeredOwner}", but mutation ${latestMutation.mutationId} records owner as "${latestMutation.recordedOwner}".`
        });
      }
    }

    // ── RULE-02: Duplicate Active Deeds ────────────────────────
    const activeDeeds = plot.deeds.filter(d => d.status === "Active");
    if (activeDeeds.length >= 2) {
      score += RULES["RULE-02"].points;
      triggeredRules.push("RULE-02");
      evidence.push({
        rule: "RULE-02",
        field: "Deed Status",
        detail: `Found ${activeDeeds.length} deeds with Active status: ${activeDeeds.map(d => d.deedId).join(", ")}. Each claims ownership of the same plot.`,
        affectedDeeds: activeDeeds.map(d => ({ id: d.deedId, owner: d.registeredOwner, date: d.registrationDate }))
      });
    }

    // ── RULE-03: Missing Mutation Record ───────────────────────
    if (plot.deeds.length > 0 && plot.mutations.length === 0) {
      score += RULES["RULE-03"].points;
      triggeredRules.push("RULE-03");
      evidence.push({
        rule: "RULE-03",
        field: "Mutation Records",
        detail: "No mutation record found for this plot. Administrative mutation is typically expected after a deed transfer."
      });
    }

    // ── RULE-04: Unlinked Transfer Records ─────────────────────
    const unlinkedTransfers = plot.transferHistory.filter(
      t => t.deedRef === null && t.mutationRef === null
    );
    const partiallyUnlinked = plot.transferHistory.filter(
      t => (t.deedRef === null) !== (t.mutationRef === null)   // exactly one missing
    );
    if (unlinkedTransfers.length > 0 || partiallyUnlinked.length > 0) {
      score += RULES["RULE-04"].points;
      triggeredRules.push("RULE-04");
      const affected = [...unlinkedTransfers, ...partiallyUnlinked];
      evidence.push({
        rule: "RULE-04",
        field: "Transfer Cross-References",
        detail: `${affected.length} transfer record(s) lack complete deed/mutation cross-references: ${affected.map(t => t.transferId).join(", ")}.`
      });
    }

    // ── RULE-05: Unverified Deed ────────────────────────────────
    const unverifiedDeeds = plot.deeds.filter(d =>
      d.verificationStatus && d.verificationStatus !== "Verified"
    );
    if (unverifiedDeeds.length > 0) {
      score += RULES["RULE-05"].points;
      triggeredRules.push("RULE-05");
      evidence.push({
        rule: "RULE-05",
        field: "Deed Verification Status",
        detail: `Deed(s) with non-Verified status: ${unverifiedDeeds.map(d => `${d.deedId} (${d.verificationStatus})`).join(", ")}.`
      });
    }

    // ── RULE-06: Chronological Inconsistency ───────────────────
    let chronoIssues = [];
    plot.transferHistory.forEach(t => {
      if (t.deedRef) {
        const deed = plot.deeds.find(d => d.deedId === t.deedRef);
        if (deed) {
          const deedDate = parseDate(deed.registrationDate);
          const transferDate = parseDate(t.date);
          if (deedDate && transferDate && transferDate < deedDate) {
            chronoIssues.push(`Transfer ${t.transferId} (${t.date}) predates its referenced deed ${deed.deedId} (${deed.registrationDate}).`);
          }
        }
      }
      if (t.mutationRef) {
        const mut = plot.mutations.find(m => m.mutationId === t.mutationRef);
        if (mut) {
          const mutDate = parseDate(mut.mutationDate);
          const transferDate = parseDate(t.date);
          if (mutDate && transferDate && transferDate > mutDate) {
            // Transfer is after mutation – that's actually okay; skip
          }
        }
      }
    });
    if (chronoIssues.length > 0) {
      score += RULES["RULE-06"].points;
      triggeredRules.push("RULE-06");
      evidence.push({
        rule: "RULE-06",
        field: "Transfer Chronology",
        detail: chronoIssues.join(" | ")
      });
    }

    // ── RULE-07: Missing Critical Fields ───────────────────────
    const missingCount = plot.missingFields.length;
    if (missingCount > 0) {
      const fieldPoints = Math.min(missingCount * RULES["RULE-07"].points, 20);
      score += fieldPoints;
      triggeredRules.push("RULE-07");
      evidence.push({
        rule: "RULE-07",
        field: "Data Completeness",
        detail: `${missingCount} critical field(s) missing: ${plot.missingFields.join("; ")}.`,
        pointsAdded: fieldPoints
      });
    }

    // ── CAP SCORE ───────────────────────────────────────────────
    score = Math.min(score, 100);

    // ── DETERMINE RISK LEVEL ────────────────────────────────────
    if (plot.dataCompleteness === "Incomplete" && triggeredRules.includes("RULE-07") && !triggeredRules.some(r => ["RULE-01","RULE-02","RULE-06"].includes(r))) {
      riskLevel = "Incomplete Data";
    } else if (plot.riskLevel === "Low") {
      riskLevel = "Low";
    } else if (score === 0) {
      riskLevel = "No Conflict Detected";
    } else if (score < 20) {
      riskLevel = "Low";
    } else if (score < 50) {
      riskLevel = "Medium";
    } else {
      riskLevel = "High";
    }

    // ── MISSING INFORMATION SUMMARY ─────────────────────────────
    const missingInfo = plot.missingFields.length > 0
      ? plot.missingFields
      : ["No critical fields missing in demo data"];

    // ── RECOMMENDED NEXT STEPS ─────────────────────────────────
    const nextSteps = buildNextSteps(triggeredRules, riskLevel);
    const nextStepsBn = buildNextStepsBn(triggeredRules, riskLevel);

    return {
      plotId: plot.plotId,
      riskLevel,
      score,
      scoreMax: 100,
      triggeredRules,
      evidence,
      missingInfo,
      nextSteps,
      nextStepsBn,
      rulesDetail: triggeredRules.map(id => RULES[id]),
      dataCompleteness: plot.dataCompleteness
    };
  }

  // ──────────────────────────────────────────────────────────────
  // NEXT STEPS BUILDER
  // ──────────────────────────────────────────────────────────────
  function buildNextSteps(triggeredRules, riskLevel) {
    const steps = [];
    if (triggeredRules.includes("RULE-01")) {
      steps.push("Contact the relevant land registry to clarify which owner name is officially recorded and request certified copies of both the deed and mutation documents.");
    }
    if (triggeredRules.includes("RULE-02")) {
      steps.push("Obtain certified copies of all identified deed documents and present them to a qualified legal professional for review before proceeding with any transaction.");
    }
    if (triggeredRules.includes("RULE-03")) {
      steps.push("Check with the local revenue authority whether a mutation record exists and request a certified mutation extract.");
    }
    if (triggeredRules.includes("RULE-04")) {
      steps.push("Conduct manual verification of the missing historical records and intermediate transfer documentation with the land registry.");
      steps.push("Request certified copies of transfer documents and verify cross-references between deed and mutation records at the issuing offices.");
    }
    if (triggeredRules.includes("RULE-05")) {
      steps.push("Request the official deed verification status from the registering authority and do not rely on unverified documents.");
    }
    if (triggeredRules.includes("RULE-06")) {
      steps.push("Review the original date-stamped documents to confirm dates. Report any discrepancies to the land registry for correction.");
    }
    if (triggeredRules.includes("RULE-07")) {
      steps.push("Obtain missing records (survey documents, witness information, consideration receipts) from the original registering authority or the parties involved.");
    }
    if (steps.length === 0) {
      steps.push("No ownership conflicts detected in the available demo records. Standard due diligence—including professional legal review—is still recommended before any property transaction.");
      steps.push("Low risk is a preliminary screening result, not a guarantee of legal ownership.");
    }
    return steps;
  }

  function buildNextStepsBn(triggeredRules, riskLevel) {
    const steps = [];
    if (triggeredRules.includes("RULE-01")) {
      steps.push("সংশ্লিষ্ট সাব-রেজিস্ট্রি এবং এসি ল্যান্ড অফিসে যোগাযোগ করে দলিল ও নামজারি খতিয়ানের মূল সার্টিফাইড কপি সংগ্রহ করে গরমিল নিষ্পত্তি করুন।");
    }
    if (triggeredRules.includes("RULE-02")) {
      steps.push("চিহ্নিত সকল সক্রিয় দলিলের জাবেদা নকল সংগ্রহ করে বিশেষজ্ঞ ভূমি আইনজীবীর পরামর্শ নিন এবং বিরোধ নিষ্পত্তি না হওয়া পর্যন্ত লেনদেন স্থগিত রাখুন।");
    }
    if (triggeredRules.includes("RULE-03")) {
      steps.push("স্থানীয় ভূমি সার্কেল অফিসে (এসি ল্যান্ড অফিস) নামজারি জমা-খারিজ রেকর্ড অনুসন্ধান করে হালনাগাদ খতিয়ানের তথ্য নিশ্চিত করুন।");
    }
    if (triggeredRules.includes("RULE-04")) {
      steps.push("মালিকানা হস্তান্তরের নথিপত্রে দলিল ও নামজারির স্পষ্ট যোগসূত্র পরীক্ষা করুন। বায়া দলিলের সঠিকতা খতিয়ে দেখুন।");
    }
    if (triggeredRules.includes("RULE-05")) {
      steps.push("অযাচাইকৃত দলিলের সত্যতা মূল রেজিস্ট্রি রেকর্ড ও ভলিউম বুক দেখে যাচাই করুন।");
    }
    if (triggeredRules.includes("RULE-06")) {
      steps.push("দলিল সম্পাদনের তারিখ ও হস্তান্তরের তারিখের বৈষম্য খতিয়ে দেখুন। সিল ও তারিখের স্পষ্টতা পরীক্ষা করুন।");
    }
    if (triggeredRules.includes("RULE-07")) {
      steps.push("অনুপস্থিত তথ্য যেমন মৌজা নকশা, ভূমির সীমানা, সাক্ষীর ঠিকানা ও আর্থিক রসিদ সংগ্রহ করুন।");
    }
    if (steps.length === 0) {
      steps.push("কোনো অসংগতি ধরা পড়েনি। তবুও জমি ক্রয়ের আগে সরেজমিন দখল ও দাখিলা রশিদ যাচাই অব্যাহত রাখুন।");
    }
    return steps;
  }

  // ──────────────────────────────────────────────────────────────
  // DASHBOARD STATISTICS
  // ──────────────────────────────────────────────────────────────
  function computeDashboardStats(plots) {
    let totalPlots = plots.length;
    let potentialConflicts = 0;
    let incompleteRecords = 0;
    let reviewed = 0;

    const recent = [];

    plots.forEach(plot => {
      const result = analysePlot(plot);

      if (result.riskLevel === "High" || result.riskLevel === "Medium") {
        potentialConflicts++;
      }
      if (plot.dataCompleteness === "Incomplete" || plot.dataCompleteness === "Partial") {
        incompleteRecords++;
      }
      if (result.riskLevel !== "No Conflict Detected" || plot.dataCompleteness !== "Complete") {
        // considered "reviewed" — has been flagged or is incomplete
      }
      reviewed++; // all demo plots have been "reviewed" in this prototype

      recent.push({
        plotId: plot.plotId,
        location: plot.location,
        riskLevel: result.riskLevel,
        score: result.score,
        scenarioLabel: plot.scenarioLabel,
        status: plot.status
      });
    });

    return { totalPlots, potentialConflicts, incompleteRecords, reviewed, recent };
  }

  // ──────────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────────
  return {
    analysePlot,
    computeDashboardStats,
    RULES,
    getAllRules: () => Object.values(RULES)
  };

})();
