/**
 * LANDGUARD — Land Conflict Intelligence System
 * i18n Module — English-Only Interface
 *
 * The bilingual (bn/en) toggle has been removed. English is now the sole
 * interface language. This module retains the same public API so that all
 * other files (app.js, risk-engine.js) continue to work without modification.
 *
 * Public API (unchanged):
 *   I18n.t(key)             → English string for key
 *   I18n.getLang()          → always returns 'en'
 *   I18n.setLang(lang)      → no-op (kept for compatibility)
 *   I18n.toggleLang()       → no-op (kept for compatibility)
 *   I18n.formatDate(str)    → '22 July, 2015' (timezone-safe)
 *   I18n.formatNumber(num)  → plain ASCII string
 *   I18n.init()             → sets lang attribute on <html>
 *   I18n.translations       → the translations object (for test access)
 */

const I18n = (() => {
  // ──────────────────────────────────────────────────────────────
  // LANGUAGE (English-only)
  // ──────────────────────────────────────────────────────────────
  const LANG = "en";

  // ──────────────────────────────────────────────────────────────
  // NUMBER FORMATTING  (plain ASCII — no Bengali numerals)
  // ──────────────────────────────────────────────────────────────
  function formatNumber(num) {
    if (num === null || num === undefined) return "";
    if (typeof num === "string" && num.includes("₦")) {
      return num.replace(/₦/g, "৳");
    }
    return String(num);
  }

  // ──────────────────────────────────────────────────────────────
  // CURRENCY FORMATTING  (Bangladeshi Taka — BDT, ৳, en-BD locale)
  // ──────────────────────────────────────────────────────────────
  function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === "") return "Not recorded";
    if (typeof amount === "string") {
      let str = amount.trim();
      if (str.startsWith("₦")) str = "৳" + str.slice(1);
      if (str.startsWith("৳")) return str;
      const num = parseFloat(str.replace(/[^0-9.-]+/g, ""));
      if (isNaN(num)) return str;
      amount = num;
    }
    try {
      return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `৳${Number(amount).toLocaleString("en-US")}`;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // DATE FORMATTING  (timezone-safe, English locale)
  //
  // Dates in the demo dataset are date-only strings: "YYYY-MM-DD".
  // new Date("2015-07-22") parses as UTC midnight, which can shift
  // the calendar day by ±1 in non-UTC timezones.  We parse the
  // components directly to avoid that offset.
  // ──────────────────────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return "Not recorded";
    try {
      let year, month, day;
      const isDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.test(String(dateStr).trim());
      if (isDateOnly) {
        const parts = String(dateStr).trim().split("-");
        year  = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10); // 1-based
        day   = parseInt(parts[2], 10);
      } else {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        year  = d.getFullYear();
        month = d.getMonth() + 1;
        day   = d.getDate();
      }
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${day} ${monthNames[month - 1]}, ${year}`;
    } catch {
      return String(dateStr);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // TRANSLATION DICTIONARY  (English strings only)
  // ──────────────────────────────────────────────────────────────
  const translations = {
    // ── Brand & Navigation ──────────────────────────────────────
    brandName:    "LANDGUARD",
    brandTagline: "Land Conflict Intelligence",
    prototypeBadge:    "DEMO DATA",
    educationalBadge:  "Educational Prototype",

    navMain:          "Main",
    navDashboard:     "Dashboard",
    navScenarios:     "Demo Scenarios",
    navAnalysis:      "Analysis",
    navPlotDetail:    "Plot Records",
    navConflictReplay:"Conflict Replay",
    navRiskPanel:     "Risk Explanation",
    navReference:     "Reference",
    navAbout:         "About & Rules",

    // ── Search & Header ─────────────────────────────────────────
    searchPlaceholder:     "Search Plot ID (e.g. PLT-2002)...",
    searchBtn:             "Search",
    heroSearchPlaceholder: "Enter a Plot ID to begin (e.g. PLT-2002)...",
    themeLight: "Light Mode",
    themeDark:  "Dark Mode",

    // ── Dashboard Hero & Stats ───────────────────────────────────
    heroTitlePrefix: "LANDGUARD",
    heroTitleSuffix: "Land Conflict Intelligence",
    heroDesc: "Inspect synthetic land records, detect potential inconsistencies, and understand conflict indicators through transparent, rule-based analysis. Built for the Land Technology Innovation Hackathon.",

    statTotalPlots:     "Total Demo Plots",
    statTotalPlotsSub:  "In synthetic dataset",
    statConflicts:      "Potential Conflicts",
    statConflictsSub:   "Medium or High risk level",
    statIncomplete:     "Incomplete Records",
    statIncompleteSub:  "Partial or incomplete data",
    statReviewed:       "Records Reviewed",
    statReviewedSub:    "In this demo session",

    exploreScenariosBtn:    "Explore Demo Scenarios →",
    demoRecordsTitle:       "📋 Demo Land Records",
    quickScenariosTitle:    "⚡ Quick Demo Scenarios",
    activeScenarioBadge:    "Active",
    riskDistributionTitle:  "📊 Dataset Risk Distribution",
    landUseBreakdownTitle:  "🗺 Land Use Breakdown",

    colPlotId:    "Plot ID",
    colLocation:  "Location",
    colScenario:  "Scenario",
    colRiskLevel: "Risk Level",
    colAction:    "Action",
    actionView:   "View →",
    actionReplay: "Replay →",

    // ── Responsible Use Disclaimer ───────────────────────────────
    disclaimerTitle: "Responsible Use Disclaimer",
    disclaimerBody:  "LANDGUARD is an educational prototype using synthetic demonstration data. It is not an official land-record verification service, legal opinion, or proof of fraud. Results indicate potential inconsistencies in the demo dataset and require verification through authorized sources and qualified professionals. All names, plot IDs, deed IDs, and property descriptions are entirely fictional.",
    footerNotice:    "EDUCATIONAL PROTOTYPE: All data is synthetic and fictional. Not an official legal opinion.",

    // ── Risk Levels & Badges ─────────────────────────────────────
    riskNoConflict: "Low Risk",
    riskLow:        "Low Risk",
    riskMedium:     "Medium Risk",
    riskHigh:       "High Risk",
    riskIncomplete: "Incomplete Data",

    statusActive:      "Active",
    statusUnderReview: "Under Review",
    statusLegacy:      "Inactive / Legacy",
    statusApproved:    "Approved",
    statusVerified:    "Verified",
    statusPending:     "Pending Review",
    statusUnverified:  "Unverified",
    statusDisputed:    "Disputed",

    compComplete:   "Complete",
    compPartial:    "Partial",
    compIncomplete: "Incomplete",

    // ── Scenarios Page ───────────────────────────────────────────
    scenariosPageTitle:    "📂 Demo Scenarios",
    scenariosPageSubtitle: "Five ready-to-run scenarios demonstrating different conflict indicator patterns. Click 'Replay →' on any plot to open the Land Conflict Replay view.",
    whatToLookFor: "What to look for:",
    demoPlotsLabel: "Demo Plots:",

    scenario1Title:     "Scenario 1: Low Risk — Consistent Ownership Records",
    scenario1Desc:      "Deed and mutation records agree on the owner. No conflict rules are triggered. All available transfer history is complete.",
    scenario1Highlight: "Matching owner names, single active deed, approved mutation, complete transfer history.",

    scenario2Title:     "Scenario 2: Ownership Mismatch",
    scenario2Desc:      "The deed record and mutation record list different owner names for the same plot. This is a potential ownership conflict indicator (RULE-01).",
    scenario2Highlight: "Highlighted mismatched owner fields in the Record Comparison table.",

    scenario3Title:     "Scenario 3: Duplicate Active Deeds",
    scenario3Desc:      "Two deed records both have Active status for the same plot. Only one active deed should typically exist per plot. This triggers RULE-02.",
    scenario3Highlight: "Both deeds listed in the comparison table and the duplicate active deed warning.",

    scenario4Title:     "Scenario 4: Incomplete Records",
    scenario4Desc:      "Legacy record with significant missing fields — no mutation, no area, no consideration amount. Analysis is limited due to insufficient data.",
    scenario4Highlight: "Missing fields list, incomplete data completeness badge, limited timeline.",

    scenario5Title:     "Scenario 5: Medium Risk — Incomplete Ownership History",
    scenario5Desc:      "Deed and mutation records agree on the owner, and there are no duplicate active deeds. However, the ownership transfer history is incomplete — a key supporting record is absent. Further manual verification is recommended.",
    scenario5Highlight: "Matching owner names, no duplicate active deeds, but missing transfer documentation flags Medium Risk.",

    // ── Plot Details Page ────────────────────────────────────────
    plotOverviewTitle:     "📋 Plot Overview",
    deedRecordsTitle:      "📜 Deed Records",
    mutationRecordsTitle:  "🗂 Mutation Records",
    transferHistoryTitle:  "📅 Transfer History",

    fieldPlotId:        "Plot ID",
    fieldLocation:      "Location",
    fieldArea:          "Area",
    fieldLandUse:       "Land Use",
    fieldRegDate:       "Registration Date",
    fieldCurrentOwner:  "Current Owner (Demo)",
    fieldCompleteness:  "Data Completeness",
    fieldScenario:      "Scenario",

    fieldDeedId:        "Deed ID",
    fieldDeedStatus:    "Deed Status",
    fieldDeedType:      "Deed Type",
    fieldDeedOffice:    "Registry Office",
    fieldConsideration: "Consideration Amount",
    fieldWitness:       "Witness",
    fieldVerification:  "Verification Status",

    fieldMutationId:     "Mutation ID",
    fieldRecordedOwner:  "Recorded Owner",
    fieldPreviousOwner:  "Previous Owner",
    fieldMutationDate:   "Mutation Date",
    fieldMutationReason: "Mutation Reason",
    fieldApprovedBy:     "Approved By",
    fieldMutationStatus: "Mutation Status",

    missingFieldsAlert: "Missing Fields:",
    noDeedsFound:       "No deed records in demo dataset.",
    noMutationsFound:   "No mutation record found. A mutation record is typically expected after a deed transfer.",
    noTransfersFound:   "No transfer history in demo dataset.",

    btnViewConflictReplay: "🔍 View Land Conflict Replay",
    btnViewRiskPanel:      "📊 View Risk Explanation",
    btnBackToPlotDetail:   "← Back to Plot Detail",
    btnBackToReplay:       "← Back to Conflict Replay",
    btnNextScenario:       "Next Demo Scenario →",

    // ── Land Conflict Replay ─────────────────────────────────────
    conflictReplayTitle: "Land Conflict Replay",
    inferenceNotice: "System Notice: The comparison below is derived from the synthetic demo dataset using documented rule-based logic. Highlighted differences are observed data inconsistencies, not confirmed legal findings. All verification must be performed through authorized sources.",
    recordComparisonTitle: "📊 Record Comparison",
    recordComparisonSub:   "Deed vs Mutation cross-check",
    colDeedRecord:     "Deed Records",
    colMutationRecord: "Mutation Records",
    colAssessment:     "Assessment",

    mismatchOwnerAlert:  "Potential Ownership Conflict Detected: The recorded owner names in the deed and mutation records do not match. Manual verification is recommended through authorized sources.",
    duplicateDeedAlert:  "Duplicate Active Deed Indicator: Multiple deeds with Active status exist for the same plot ID. This requires manual investigation by a qualified professional.",

    timelineTitle:          "📅 Chronological Event Timeline",
    relationshipTitle:      "🔗 Ownership Relationship Overview",
    relationshipSub:        "Based on demo transfer history. Not a verified legal chain.",
    relationshipLegendOwner:    "Owner",
    relationshipLegendConflict: "Potentially Disputed",
    relationshipLegendUnknown:  "Unknown",
    relationshipDisclaimer: "This diagram reflects observed synthetic demo data only. It does not constitute a legal ownership determination.",

    rulesTriggeredTitle: "⚡ Rules Triggered",
    allClearTitle:       "✅ Passed Verification Checks",
    allClearDesc:        "No ownership conflicts detected in the available demo records.",
    allClearNote:        "Low risk is a preliminary screening result, not a guarantee of legal ownership.",

    // ── Risk Explanation Panel ───────────────────────────────────
    riskExplanationTitle:  "Risk Explanation",
    assessmentSummaryLabel:"Assessment Summary",
    scoreGaugeLabel:       "Risk Score",
    scoreBreakdownTitle:   "📊 Score Breakdown",
    colRuleId:   "Rule ID",
    colRuleName: "Rule Name",
    colSeverity: "Severity",
    colPoints:   "Points",
    colEvidence: "Evidence",
    totalScoreLabel: "Total Score (capped at 100)",

    missingInfoTitle:  "⚠ Missing Information",
    nextStepsTitle:    "✅ Recommended Next Steps",
    nextStepsNotice:   "These steps are suggested based on triggered rules in the demo dataset. They are for educational guidance only and do not constitute legal advice.",
    allRulesRefTitle:  "📋 All Rules Reference",
    allRulesRefSub:    "The complete scoring system — transparent and reproducible",

    // ── Empty States & Errors ────────────────────────────────────
    emptyPlotDetailTitle: "Plot Records",
    emptyPlotDetailDesc:  "Search for a Plot ID using the bar above, or select a demo plot below:",
    emptyReplayTitle:     "Land Conflict Replay",
    emptyReplayDesc:      "Select a demo plot below to inspect its record comparison and conflict replay:",
    emptyRiskTitle:       "Risk Explanation",
    emptyRiskDesc:        "Select a demo plot below to inspect its rule-based risk score breakdown:",
    browseAllScenariosBtn:"Browse All Demo Scenarios →",

    plotNotFoundTitle:        "Plot Not Found",
    plotNotFoundDesc:         "No demo record exists for Plot ID",
    plotNotFoundSuggestions:  "Try one of the demo Plot IDs:"
  };

  // ──────────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────────

  /** Return the English string for the given translation key. */
  function t(key, defaultVal = "") {
    if (translations[key] !== undefined) return translations[key];
    return defaultVal || key;
  }

  /** Always returns 'en'. Kept for API compatibility. */
  function getLang() {
    return LANG;
  }

  /**
   * No-op — kept for API compatibility.
   * Dispatches the lang-changed event so the app still re-renders if called.
   */
  function setLang(lang) {
    // English is the only language; nothing to change.
    // Still dispatch the event in case callers rely on it.
    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("landguard_lang_changed", { detail: { lang: LANG } }));
    }
  }

  /** No-op — kept for API compatibility. */
  function toggleLang() {
    // No-op.
  }

  /** Sets lang="en" on <html>. Called once on boot. */
  function init() {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("lang", LANG);
      document.body && document.body.classList.add("lang-en");
      document.body && document.body.classList.remove("lang-bn");
    }
  }

  return { t, getLang, setLang, toggleLang, formatNumber, formatCurrency, formatDate, init, translations };

})();

// Set lang attribute immediately (prevents FOUC for font/CSS lang selectors)
if (typeof document !== "undefined" && document.documentElement) {
  document.documentElement.setAttribute("lang", "en");
}
