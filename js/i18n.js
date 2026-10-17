/**
 * LANDGUARD — Land Conflict Intelligence System
 * i18n Module — Complete Bangla (bn) and English (en) Translation Engine
 *
 * Requirements:
 * - Default language: Bangla (bn) for first-time visitors
 * - Storage key: 'landguard-language' in localStorage
 * - Dynamic language switching without full page reload
 * - High-quality typography support for Bengali and English
 * - Bengali numeral conversion for user-facing numbers in bn mode
 * - Technical identifiers (PLT-2001..PLT-2007, DEED-xxxx, RULE-01..07) preserved verbatim
 */

const I18n = (() => {
  const STORAGE_KEY = "landguard-language";
  const DEFAULT_LANG = "bn";

  // Bengali numerals mapping (0-9 -> ০-৯)
  const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  // Detect initial language: localStorage -> default 'bn'
  let currentLang = DEFAULT_LANG;
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "bn") {
        currentLang = saved;
      }
    }
  } catch (e) {}

  // ──────────────────────────────────────────────────────────────
  // BILINGUAL TRANSLATION DICTIONARY
  // ──────────────────────────────────────────────────────────────
  const dictionary = {
    // ══════════════════════════════════════════════════════════════
    // ENGLISH DICTIONARY
    // ══════════════════════════════════════════════════════════════
    en: {
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
      searchPlaceholder:     "Search Plot ID (e.g. PLT-2002, PLT-2007)...",
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

      rulesTriggeredTitle: "⚡ Active Conflict Detection Rules",
      activeConflictRulesTitle: "Active Conflict Detection Rules",
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
      maxScoreLabel:   "Maximum Score",

      searchPlot:           "Search Plot",
      viewDetails:          "View Details",
      noResultsFound:       "No Results Found",
      transferRecordsTitle: "Transfer Records",
      crossReferences:      "Cross-References",
      missingFields:        "Missing Fields",
      linkedMutation:       "Linked Mutation",
      deedReference:        "Deed Reference",
      riskThresholdsTitle:  "Risk Level Thresholds:",
      riskThresholdsBody:   "Score 0 = No Conflict Detected | 1–19 = Low Risk | 20–49 = Medium Risk | 50–100 = High Risk | RULE-07 only (Incomplete data) = Incomplete Data",

      missingInfoTitle:  "⚠ Missing Information",
      nextStepsTitle:    "✅ Recommended Next Steps",
      nextStepsNotice:   "These steps are suggested based on triggered rules in the demo dataset. They are for educational guidance only and do not constitute legal advice.",
      allRulesRefTitle:  "📋 All Rules Reference",
      allRulesRefSub:    "The complete scoring system — transparent and reproducible",
      allRulesRefIntro:  "Risk scores are calculated by summing the points of all triggered rules. Maximum score is 100. Scores are capped if multiple rules would exceed this.",
      colDescription:    "Description",

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
      plotNotFoundSuggestions:  "Try one of the demo Plot IDs:",

      // ── About Page Sections ─────────────────────────────────────
      aboutWhatIsTitle:    "🛡 What is LANDGUARD?",
      aboutWhatIsP1:       "LANDGUARD is an educational hackathon prototype that simulates a land conflict intelligence system. It helps users understand what kinds of inconsistencies can appear in land records, and how they might be identified through transparent, rule-based checks.",
      aboutWhatIsP2:       "The system operates entirely on synthetic, fictional demo data. It does not connect to any government database, does not access real land records, and does not make legal determinations. No real person's information is used or referenced.",
      aboutCannotDoTitle:  "⚠ What LANDGUARD Cannot Do",
      aboutCannotDo1:      "It cannot access, query, or verify real government land records.",
      aboutCannotDo2:      "It cannot make legally binding ownership determinations.",
      aboutCannotDo3:      "It cannot confirm or deny that fraud has occurred.",
      aboutCannotDo4:      "It cannot replace advice from a qualified legal professional or licensed surveyor.",
      aboutCannotDo5:      "Results are based only on the fictional demo dataset included with this prototype.",
      aboutTechTitle:      "🔬 Technology Stack",
      aboutTech1:          "Frontend: HTML5, CSS3 (Custom Design Tokens, Light/Dark Modes), Vanilla JavaScript ES6+",
      aboutTech2:          "Language & Localization: Full bilingual (Bangla & English) support with high-quality typography",
      aboutTech3:          "Data: Local synthetic JavaScript records representing land conflict patterns",
      aboutTech4:          "Backend: None required — 100% transparent client-side evaluation engine",
      aboutTech5:          "Dependencies: Zero external frameworks or paid APIs — runs locally in any modern browser",
      aboutHackathonTitle: "🎓 Hackathon Context",
      aboutHackathonP1:    "LANDGUARD was built as a prototype for the Land Technology Innovation Hackathon. It demonstrates how transparent, rule-based logic can surface potential inconsistencies in land record datasets, and how a responsible, explainable approach can be taken without making unsubstantiated legal claims. The scoring algorithm is fully documented and reproducible from the rules above."
    },

    // ══════════════════════════════════════════════════════════════
    // BANGLA DICTIONARY (প্রফেশনাল ও সহজবোধ্য বাংলা)
    // ══════════════════════════════════════════════════════════════
    bn: {
      // ── Brand & Navigation ──────────────────────────────────────
      brandName:    "LANDGUARD",
      brandTagline: "ভূমি বিরোধ গোয়েন্দা ব্যবস্থা",
      prototypeBadge:    "ডেমো ডেটা",
      educationalBadge:  "শিক্ষামূলক প্রোটোটাইপ",

      navMain:          "প্রধান মেনু",
      navDashboard:     "ড্যাশবোর্ড",
      navScenarios:     "ডেমো দৃশ্যপট",
      navAnalysis:      "বিশ্লেষণ",
      navPlotDetail:    "প্লট রেকর্ড",
      navConflictReplay:"বিরোধ বিশ্লেষণ",
      navRiskPanel:     "ঝুঁকি ব্যাখ্যা",
      navReference:     "রেফারেন্স",
      navAbout:         "পরিচিতি ও নিয়মাবলী",

      // ── Search & Header ─────────────────────────────────────────
      searchPlaceholder:     "প্লট আইডি খুঁজুন (যেমন PLT-2002, PLT-2007)...",
      searchBtn:             "অনুসন্ধান",
      heroSearchPlaceholder: "প্লট আইডি লিখে অনুসন্ধান শুরু করুন (যেমন PLT-2002)...",
      themeLight: "লাইট মোড",
      themeDark:  "ডার্ক মোড",

      // ── Dashboard Hero & Stats ───────────────────────────────────
      heroTitlePrefix: "LANDGUARD",
      heroTitleSuffix: "ভূমি বিরোধ গোয়েন্দা ব্যবস্থা",
      heroDesc: "কৃত্রিম ভূমি রেকর্ড যাচাই করুন, সম্ভাব্য অসংগতি চিহ্নিত করুন এবং উন্মুক্ত নিয়মের মাধ্যমে বিরোধের কারণসমূহ পর্যালোচনা করুন। ভূমি প্রযুক্তি উদ্ভাবন হ্যাকাথনের জন্য তৈরি।",

      statTotalPlots:     "মোট ডেমো প্লট",
      statTotalPlotsSub:  "কৃত্রিম ডেটাসেটে অন্তর্ভুক্ত",
      statConflicts:      "সম্ভাব্য বিরোধ",
      statConflictsSub:   "মাঝারি বা উচ্চ ঝুঁকিপূর্ণ",
      statIncomplete:     "অসম্পূর্ণ রেকর্ড",
      statIncompleteSub:  "আংশিক বা অপর্যাপ্ত তথ্য",
      statReviewed:       "পর্যালোচিত রেকর্ড",
      statReviewedSub:    "বর্তমান সেশনে পর্যালোচিত",

      exploreScenariosBtn:    "ডেমো দৃশ্যপটসমূহ দেখুন →",
      demoRecordsTitle:       "📋 ডেমো ভূমি রেকর্ডসমূহ",
      quickScenariosTitle:    "⚡ দ্রুত ডেমো দৃশ্যপট",
      activeScenarioBadge:    "সক্রিয়",
      riskDistributionTitle:  "📊 ডেটাসেট ঝুঁকি বণ্টন",
      landUseBreakdownTitle:  "🗺 ভূমির ব্যবহার বণ্টন",

      colPlotId:    "প্লট আইডি",
      colLocation:  "অবস্থান",
      colScenario:  "দৃশ্যপট",
      colRiskLevel: "ঝুঁকির মাত্রা",
      colAction:    "পদক্ষেপ",
      actionView:   "দেখুন →",
      actionReplay: "রিপ্লে →",

      // ── Responsible Use Disclaimer ───────────────────────────────
      disclaimerTitle: "দায়মুক্তি ও দায়িত্বশীল ব্যবহারের সতর্কবার্তা",
      disclaimerBody:  "ল্যান্ডগার্ড একটি শিক্ষামূলক প্রোটোটাইপ যা সম্পূর্ণ কৃত্রিম ডেমো ডেটা ব্যবহার করে। এটি কোনো প্রাতিষ্ঠানিক ভূমি রেকর্ড যাচাইকরণ পরিষেবা, আইনি মতামত বা প্রতারণার প্রমাণ নয়। ফলাফলগুলো শুধুমাত্র ডেমো ডেটাসেটের সম্ভাব্য অসংগতি প্রদর্শন করে এবং প্রকৃত জমি যাচাইয়ের জন্য অনুমোদিত সরকারি সূত্র ও অভিজ্ঞ ভূমি পেশাজীবীর পরামর্শ আবশ্যক। সমস্ত নাম, প্লট আইডি, দলিল নম্বর এবং বিবরণ সম্পূর্ণ কাল্পনিক।",
      footerNotice:    "শিক্ষামূলক প্রোটোটাইপ: সমস্ত ডেটা কৃত্রিম ও কাল্পনিক। কোনো প্রাতিষ্ঠানিক আইনি মতামত নয়।",

      // ── Risk Levels & Badges ─────────────────────────────────────
      riskNoConflict: "কম ঝুঁকি (বিরোধমুক্ত)",
      riskLow:        "কম ঝুঁকি",
      riskMedium:     "মাঝারি ঝুঁকি",
      riskHigh:       "উচ্চ ঝুঁকি",
      riskIncomplete: "অসম্পূর্ণ তথ্য",

      statusActive:      "সক্রিয়",
      statusUnderReview: "পর্যালোচনাধীন",
      statusLegacy:      "নিষ্ক্রিয় / পূর্ববর্তী",
      statusApproved:    "অনুমোদিত",
      statusVerified:    "যাচাইকৃত",
      statusPending:     "অপেক্ষমান",
      statusUnverified:  "অযাচাইকৃত",
      statusDisputed:    "বিরোধপূর্ণ",

      compComplete:   "সম্পূর্ণ",
      compPartial:    "আংশিক",
      compIncomplete: "অসম্পূর্ণ",

      // ── Scenarios Page ───────────────────────────────────────────
      scenariosPageTitle:    "📂 ডেমো দৃশ্যপটসমূহ",
      scenariosPageSubtitle: "পাঁচটি বাস্তবসম্মত দৃশ্যপট যা ভূমি রেকর্ডের বিভিন্ন অসংগতির নমুনা প্রদর্শন করে। যে কোনো প্লটের 'রিপ্লে →' বাটনে ক্লিক করে বিস্তারিত বিরোধ বিশ্লেষণ দেখুন।",
      whatToLookFor: "কী লক্ষ্য করবেন:",
      demoPlotsLabel: "ডেমো প্লটসমূহ:",

      scenario1Title:     "দৃশ্যপট ১: কম ঝুঁকি — সামঞ্জস্যপূর্ণ মালিকানা রেকর্ড",
      scenario1Desc:      "দলিল ও নামজারি রেকর্ডে একই মালিকের নাম রয়েছে। কোনো বিরোধ সংক্রান্ত নিয়ম কার্যকর হয়নি। হস্তান্তরের সম্পূর্ণ ইতিহাস সংরক্ষিত আছে।",
      scenario1Highlight: "মালিকের নাম হুবহু মিলে গেছে, একক কার্যকর দলিল বিদ্যমান, অনুমোদিত নামজারি এবং পূর্ণাঙ্গ শৃঙ্খল।",

      scenario2Title:     "দৃশ্যপট ২: মালিকানা নামের গরমিল",
      scenario2Desc:      "একই প্লটের ক্ষেত্রে দলিল ও নামজারি রেকর্ডে ভিন্ন ভিন্ন ব্যক্তির নাম লিপিবদ্ধ রয়েছে। এটি সম্ভাব্য মালিকানা বিরোধের সূচক (RULE-01)।",
      scenario2Highlight: "রেকর্ড তুলনা টেবিলে অসমঞ্জস মালিকানা ক্ষেত্রসমূহ স্পষ্টভাবে চিহ্নিত।",

      scenario3Title:     "দৃশ্যপট ৩: দ্বৈত সক্রিয় দলিল",
      scenario3Desc:      "একই প্লটের বিপরীতে একাধিক দলিলের স্ট্যাটাস 'সক্রিয়' (Active) রয়েছে। সাধারণত এক প্লটে একটি মাত্র সক্রিয় দলিল থাকা উচিত। এটি RULE-02 কার্যকর করে।",
      scenario3Highlight: "তুলনা টেবিলে উভয় দলিল ও দ্বৈত দলিলের সতর্কতা প্রদর্শিত।",

      scenario4Title:     "দৃশ্যপট ৪: অসম্পূর্ণ রেকর্ড",
      scenario4Desc:      "পূর্ববর্তী আমলের রেকর্ড যাতে গুরুত্বপূর্ণ তথ্য অনুপস্থিত — নামজারি নেই, জমির পরিমাপ নেই, দলিলের মূল্য নেই। অপর্যাপ্ত তথ্যের কারণে বিশ্লেষণ সীমিত।",
      scenario4Highlight: "অনুপস্থিত তথ্যের তালিকা, অসম্পূর্ণ ডেটা স্ট্যাটাস ব্যাজ এবং সীমিত সময়রেখা।",

      scenario5Title:     "দৃশ্যপট ৫: মাঝারি ঝুঁকি — অসম্পূর্ণ হস্তান্তরের ইতিহাস",
      scenario5Desc:      "দলিল ও নামজারির মালিকের নামে মিল রয়েছে এবং কোনো দ্বৈত দলিল নেই। তবে হস্তান্তরের ইতিহাসে গুরুত্বপূর্ণ প্রমাণ অনুপস্থিত থাকায় ম্যানুয়াল যাচাই সুপারিশ করা হয়েছে।",
      scenario5Highlight: "মালিকানা নামের মিল থাকলেও সহায়ক হস্তান্তর দলিলের অনুপস্থিতি মাঝারি ঝুঁকি নির্দেশ করে।",

      // ── Plot Details Page ────────────────────────────────────────
      plotOverviewTitle:     "📋 প্লট পরিচিতি",
      deedRecordsTitle:      "📜 দলিল রেকর্ডসমূহ",
      mutationRecordsTitle:  "🗂 নামজারি রেকর্ডসমূহ",
      transferHistoryTitle:  "📅 মালিকানা হস্তান্তরের ইতিহাস",

      fieldPlotId:        "প্লট আইডি",
      fieldLocation:      "অবস্থান",
      fieldArea:          "জমির পরিমাণ",
      fieldLandUse:       "জমির শ্রেণি/ব্যবহার",
      fieldRegDate:       "রেজিস্ট্রেশনের তারিখ",
      fieldCurrentOwner:  "বর্তমান মালিক (ডেমো)",
      fieldCompleteness:  "তথ্যের সম্পূর্ণতা",
      fieldScenario:      "দৃশ্যপট",

      fieldDeedId:        "দলিল নম্বর",
      fieldDeedStatus:    "দলিলের অবস্থা",
      fieldDeedType:      "দলিলের ধরন",
      fieldDeedOffice:    "সাব-রেজিস্ট্রি অফিস",
      fieldConsideration: "দলিলের মূল্য",
      fieldWitness:       "সাক্ষীর নাম",
      fieldVerification:  "যাচাইকরণ অবস্থা",

      fieldMutationId:     "নামজারি খতিয়ান নম্বর",
      fieldRecordedOwner:  "নথিভুক্ত মালিক",
      fieldPreviousOwner:  "পূর্ববর্তী মালিক",
      fieldMutationDate:   "নামজারির তারিখ",
      fieldMutationReason: "নামজারির কারণ",
      fieldApprovedBy:     "অনুমোদনকারী কর্মকর্তা",
      fieldMutationStatus: "নামজারির অবস্থা",

      missingFieldsAlert: "অনুপস্থিত তথ্যক্ষেত্র:",
      noDeedsFound:       "ডেমো ডেটাসেটে কোনো দলিল রেকর্ড নেই।",
      noMutationsFound:   "কোনো নামজারি রেকর্ড পাওয়া যায়নি। দলিল হস্তান্তরের পর সাধারণ নিয়মে নামজারি সম্পন্ন হওয়া আবশ্যক।",
      noTransfersFound:   "ডেমো ডেটাসেটে কোনো হস্তান্তরের ইতিহাস নেই।",

      btnViewConflictReplay: "🔍 বিরোধ রিপ্লে বিশ্লেষণ দেখুন",
      btnViewRiskPanel:      "📊 ঝুঁকি ব্যাখ্যা প্যানেল দেখুন",
      btnBackToPlotDetail:   "← প্লট বিবরণে ফিরে যান",
      btnBackToReplay:       "← বিরোধ রিপ্লেতে ফিরে যান",
      btnNextScenario:       "পরবর্তী ডেমো দৃশ্যপট →",

      // ── Land Conflict Replay ─────────────────────────────────────
      conflictReplayTitle: "ভূমি বিরোধ রিপ্লে",
      inferenceNotice: "সিস্টেম নোটিশ: নিচের তুলনামূলক তথ্যটি উন্মুক্ত নিয়মভিত্তিক যুক্তির মাধ্যমে কৃত্রিম ডেমো ডেটাসেট থেকে প্রস্তুত করা হয়েছে। প্রদর্শিত বৈসাদৃশ্যগুলো সংরক্ষিত তথ্যের অসংগতি নির্দেশ করে, চূড়ান্ত আইনি রায় নয়। প্রাতিষ্ঠানিক সূত্র থেকে সঠিকতা নিশ্চিত করতে হবে।",
      recordComparisonTitle: "📊 রেকর্ড তুলনা",
      recordComparisonSub:   "দলিল বনাম নামজারি ক্রস-চেক",
      colDeedRecord:     "দলিল রেকর্ড",
      colMutationRecord: "নামজারি রেকর্ড",
      colAssessment:     "মূল্যায়ন",

      mismatchOwnerAlert:  "সম্ভাব্য মালিকানা বিরোধ শনাক্ত: দলিল এবং নামজারি রেকর্ডে লিপিবদ্ধ মালিকের নামে অমিল রয়েছে। প্রাতিষ্ঠানিক সূত্র থেকে ম্যানুয়াল যাচাইকরণ প্রয়োজন।",
      duplicateDeedAlert:  "দ্বৈত সক্রিয় দলিলের ইঙ্গিত: একই প্লট আইডির বিপরীতে একাধিক সক্রিয় দলিল রয়েছে। অভিজ্ঞ পেশাজীবী দ্বারা তদন্ত প্রয়োজন।",

      timelineTitle:          "📅 কালানুক্রমিক ঘটনাবলি ও সময়রেখা",
      relationshipTitle:      "🔗 মালিকানা শৃঙ্খল রূপরেখা",
      relationshipSub:        "ডেমো হস্তান্তর ইতিহাসের ভিত্তিতে। কোনো চূড়ান্ত আইনি উত্তরাধিকার শৃঙ্খল নয়।",
      relationshipLegendOwner:    "মালিক",
      relationshipLegendConflict: "সম্ভাব্য বিতর্কিত",
      relationshipLegendUnknown:  "অজ্ঞাত",
      relationshipDisclaimer: "এই চিত্রটি কৃত্রিম ডেমো তথ্যের পারস্পরিক সংযোগ নির্দেশ করে। এটি চূড়ান্ত আইনি মালিকানা নির্ধারণ করে না।",

      rulesTriggeredTitle: "⚡ সক্রিয় ভূমি বিরোধ শনাক্তকরণ বিধি",
      activeConflictRulesTitle: "সক্রিয় ভূমি বিরোধ শনাক্তকরণ বিধি",
      allClearTitle:       "✅ সকল যাচাইকরণ পরীক্ষায় উত্তীর্ণ",
      allClearDesc:        "উপলব্ধ ডেমো রেকর্ডে কোনো ধরনের মালিকানা সংঘাত বা অসংগতি পাওয়া যায়নি।",
      allClearNote:        "কম ঝুঁকি একটি প্রাথমিক মূল্যায়ন মাত্র, এটি চূড়ান্ত আইনি মালিকানার নিশ্চয়তা প্রদান করে না।",

      // ── Risk Explanation Panel ───────────────────────────────────
      riskExplanationTitle:  "ঝুঁকি ব্যাখ্যা প্যানেল",
      assessmentSummaryLabel:"মূল্যায়ন সারসংক্ষেপ",
      scoreGaugeLabel:       "ঝুঁকির স্কোর",
      scoreBreakdownTitle:   "📊 স্কোর বিভাজন",
      colRuleId:   "বিধির আইডি",
      colRuleName: "বিধির নাম",
      colSeverity: "ঝুঁকির মাত্রা",
      colPoints:   "স্কোর",
      colEvidence: "প্রমাণ",
      totalScoreLabel: "মোট স্কোর (সর্বোচ্চ ১০০)",
      maxScoreLabel:   "সর্বোচ্চ স্কোর",

      searchPlot:           "জমির প্লট খুঁজুন",
      viewDetails:          "বিস্তারিত দেখুন",
      noResultsFound:       "কোনো ফলাফল পাওয়া যায়নি",
      transferRecordsTitle: "হস্তান্তরের রেকর্ড",
      crossReferences:      "পারস্পরিক তথ্যসূত্র",
      missingFields:        "অনুপস্থিত তথ্যের ঘর",
      linkedMutation:       "সংশ্লিষ্ট নামজারি",
      deedReference:        "দলিলের তথ্যসূত্র",
      riskThresholdsTitle:  "ঝুঁকির মাত্রার মানদণ্ড:",
      riskThresholdsBody:   "স্কোর ০ = কোনো বিরোধ শনাক্ত হয়নি | ১–১৯ = কম ঝুঁকি | ২০–৪৯ = মাঝারি ঝুঁকি | ৫০–১০০ = উচ্চ ঝুঁকি | শুধুমাত্র RULE-07 (অসম্পূর্ণ তথ্য) = অসম্পূর্ণ তথ্য",

      missingInfoTitle:  "⚠ অনুপস্থিত তথ্য",
      nextStepsTitle:    "✅ প্রস্তাবিত পরবর্তী পদক্ষেপ",
      nextStepsNotice:   "এই পদক্ষেপগুলো ডেমো ডেটাসেটের অসংগতির ওপর ভিত্তি করে প্রস্তাবিত। এগুলো শিক্ষামূলক নির্দেশনার জন্য এবং কোনো আইনি পরামর্শ নয়।",
      allRulesRefTitle:  "📋 সকল নিয়মের রেফারেন্স তালিকা",
      allRulesRefSub:    "স্বচ্ছ ও সুনির্দিষ্ট স্কোরিং নীতি — কোনো অস্পষ্ট অ্যালগরিদম নয়",
      allRulesRefIntro:  "সকল সক্রিয় নিয়মের পয়েন্ট যোগ করে মোট ঝুঁকি স্কোর নির্ধারিত হয়। সর্বোচ্চ স্কোর ১০০। একাধিক নিয়মে ১০০ এর বেশি হলে তা ১০০ তে সীমাবদ্ধ থাকে।",
      colDescription:    "বিবরণ",

      // ── Empty States & Errors ────────────────────────────────────
      emptyPlotDetailTitle: "প্লট রেকর্ড",
      emptyPlotDetailDesc:  "উপরের সার্চ বারে প্লট আইডি খুঁজুন অথবা নিচের যে কোনো ডেমো প্লট নির্বাচন করুন:",
      emptyReplayTitle:     "ভূমি বিরোধ রিপ্লে",
      emptyReplayDesc:      "রেকর্ড তুলনা ও বিরোধ রিপ্লে বিশ্লেষণ দেখতে নিচের ডেমো প্লটগুলো থেকে বেছে নিন:",
      emptyRiskTitle:       "ঝুঁকি ব্যাখ্যা",
      emptyRiskDesc:        "নিয়মভিত্তিক ঝুঁকি স্কোরের বিস্তারিত ব্যাখ্যা দেখতে নিচের যে কোনো ডেমো প্লট নির্বাচন করুন:",
      browseAllScenariosBtn:"সকল ডেমো দৃশ্যপট দেখুন →",

      plotNotFoundTitle:        "প্লট পাওয়া যায়নি",
      plotNotFoundDesc:         "এই প্লট আইডির জন্য কোনো ডেমো রেকর্ড সংরক্ষিত নেই:",
      plotNotFoundSuggestions:  "নিম্নোক্ত ডেমো প্লট আইডিগুলো দিয়ে চেষ্টা করতে পারেন:",

      // ── About Page Sections ─────────────────────────────────────
      aboutWhatIsTitle:    "🛡 ল্যান্ডগার্ড কী?",
      aboutWhatIsP1:       "ল্যান্ডগার্ড হলো একটি শিক্ষামূলক হ্যাকাথন প্রোটোটাইপ যা ভূমি বিরোধ গোয়েন্দা ব্যবস্থার অনুকরণ করে। এটি ব্যবহারকারীদের বুঝতে সাহায্য করে কীভাবে ভূমি নথিপত্রে অসংগতি তৈরি হয় এবং কীভাবে উন্মুক্ত, নিয়মভিত্তিক নিরীক্ষার মাধ্যমে তা শনাক্ত করা যায়।",
      aboutWhatIsP2:       "সিস্টেমটি সম্পূর্ণভাবে কৃত্রিম, কাল্পনিক ডেমো তথ্যের ওপর কাজ করে। এটি কোনো সরকারি ডাটাবেজের সাথে যুক্ত নয়, প্রকৃত ভূমির তথ্য স্পর্শ করে না এবং কোনো আইনি সিদ্ধান্ত দেয় না। কোনো বাস্তব ব্যক্তির তথ্য এখানে ব্যবহৃত হয়নি।",
      aboutCannotDoTitle:  "⚠ ল্যান্ডগার্ড যা করতে পারে না",
      aboutCannotDo1:      "এটি প্রকৃত সরকারি ভূমি রেকর্ড অনুসন্ধান বা যাচাই করতে পারে না।",
      aboutCannotDo2:      "এটি কোনো আইনগতভাবে বাধ্যতামূলক মালিকানা নির্ধারণ করতে পারে না।",
      aboutCannotDo3:      "এটি কোনো প্রতারণা বা জালিয়াতি নিশ্চিত বা অস্বীকার করতে পারে না।",
      aboutCannotDo4:      "এটি কোনো আইনজীবী বা অনুমোদিত সার্ভেয়ারের পেশাদার পরামর্শের বিকল্প নয়।",
      aboutCannotDo5:      "ফলাফল শুধুমাত্র এই প্রোটোটাইপে অন্তর্ভুক্ত কাল্পনিক ডেমো ডেটার ওপর নির্ভরশীল।",
      aboutTechTitle:      "🔬 প্রযুক্তি কাঠামো",
      aboutTech1:          "ফ্রন্টএন্ড: এইচটিএমএল৫, সিএসএস৩ (কাস্টম ডিজাইন টোকেন, লাইট/ডার্ক মোড), ভ্যানিলা জাভাস্ক্রিপ্ট ইএস৬+",
      aboutTech2:          "ভাষা ও স্থানীয়করণ: মানসম্মত ফন্ট ও টাইপোগ্রাফিসহ সম্পূর্ণ দ্বিভাষিক (বাংলা ও ইংরেজি) সাপোর্ট",
      aboutTech3:          "ডেটা: ভূমি বিরোধের প্যাটার্ন সম্বলিত স্থানীয় সিন্থেটিক জাভাস্ক্রিপ্ট রেকর্ড",
      aboutTech4:          "ব্যাকএন্ড: কোনো ব্যাকএন্ডের প্রয়োজন নেই — ১০০% স্বচ্ছ ক্লায়েন্ট-সাইড মূল্যায়ন ইঞ্জিন",
      aboutTech5:          "নির্ভরশীলতা: কোনো বহিরাগত ফ্রেমওয়ার্ক বা পেইড এপিআই নেই — যেকোনো আধুনিক ব্রাউজারে অফলাইনে চলে",
      aboutHackathonTitle: "🎓 হ্যাকাথন পরিপ্রেক্ষিত",
      aboutHackathonP1:    "ল্যান্ডগার্ড 'ল্যান্ড টেকনোলজি ইনোভেশন হ্যাকাথন'-এর জন্য একটি প্রোটোটাইপ হিসেবে তৈরি করা হয়েছে। এটি প্রদর্শন করে কীভাবে উন্মুক্ত নিয়মভিত্তিক অ্যালগরিদম ব্যবহার করে ভূমির তথ্যে গরমিল খুঁজে বের করা যায় এবং ভিত্তিহীন আইনি দাবি না করে একটি দায়িত্বশীল, ব্যাখ্যাযোগ্য পদ্ধতি গ্রহণ করা যায়। এর পুরো স্কোরিং পদ্ধতি সম্পূর্ণ স্বচ্ছ এবং পুনরুৎপাদনযোগ্য।"
    }
  };

  // Proxy to support I18n.translations.someKey as well as I18n.translations.en / I18n.translations.bn
  const translations = new Proxy(dictionary.en, {
    get(target, prop) {
      if (prop === "en") return dictionary.en;
      if (prop === "bn") return dictionary.bn;
      const currentDict = dictionary[currentLang] || dictionary.en;
      if (currentDict[prop] !== undefined) return currentDict[prop];
      return dictionary.en[prop] !== undefined ? dictionary.en[prop] : "";
    }
  });

  // ──────────────────────────────────────────────────────────────
  // PUBLIC TRANSLATION FUNCTIONS
  // ──────────────────────────────────────────────────────────────

  /** Return translated string for key, falling back to defaultVal or key */
  function t(key, defaultVal = "") {
    const currentDict = dictionary[currentLang] || dictionary.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    if (dictionary.en && dictionary.en[key] !== undefined) {
      return dictionary.en[key];
    }
    return defaultVal || key;
  }

  /** Get active language ('bn' or 'en') */
  function getLang() {
    return currentLang;
  }

  /** Set language ('bn' or 'en'), save to localStorage, update DOM, dispatch event */
  function setLang(lang) {
    if (lang !== "en" && lang !== "bn") return;
    currentLang = lang;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (e) {}

    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("lang", lang);
      if (document.body) {
        document.body.classList.toggle("lang-bn", lang === "bn");
        document.body.classList.toggle("lang-en", lang === "en");
      }
    }

    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("landguard_lang_changed", { detail: { lang } }));
    }
  }

  /** Toggle between 'bn' and 'en' */
  function toggleLang() {
    setLang(currentLang === "bn" ? "en" : "bn");
  }

  // ──────────────────────────────────────────────────────────────
  // NUMBER FORMATTING
  // ──────────────────────────────────────────────────────────────

  /**
   * Format numbers: converts 0-9 to ০-৯ in Bangla mode unless preserveDigits is true.
   * Technical IDs (e.g. PLT-2001, RULE-01) should pass preserveDigits=true.
   */
  function formatNumber(num, preserveDigits = false) {
    if (num === null || num === undefined) return "";
    let str = String(num);
    if (str.includes("₦")) str = str.replace(/₦/g, "৳");
    if (preserveDigits || currentLang !== "bn") return str;
    return str.replace(/[0-9]/g, d => BN_DIGITS[parseInt(d, 10)]);
  }

  // ──────────────────────────────────────────────────────────────
  // CURRENCY FORMATTING (BDT ৳)
  // ──────────────────────────────────────────────────────────────

  /**
   * Format currency in Bangladeshi Taka (৳).
   * In English mode: ৳8,200,000
   * In Bangla mode: ৳৮,২০০,০০০
   */
  function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === "") {
      return currentLang === "bn" ? "রেকর্ড নেই" : "Not recorded";
    }
    let num = amount;
    if (typeof amount === "string") {
      let str = amount.trim().replace(/₦/g, "৳");
      if (str.startsWith("৳")) str = str.slice(1);
      const parsed = parseFloat(str.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(parsed)) {
        num = parsed;
      } else {
        return amount;
      }
    }
    const formattedEn = Number(num).toLocaleString("en-US");
    if (currentLang === "bn") {
      const bnStr = formattedEn.replace(/[0-9]/g, d => BN_DIGITS[parseInt(d, 10)]);
      return `৳${bnStr}`;
    }
    return `৳${formattedEn}`;
  }

  // ──────────────────────────────────────────────────────────────
  // DATE FORMATTING (Timezone-safe)
  // ──────────────────────────────────────────────────────────────

  /**
   * Format date strings safely without timezone shifts:
   * Bangla mode: "২২ জুলাই, ২০১৫"
   * English mode: "22 July 2015"
   */
  function formatDate(dateStr, lang = currentLang) {
    if (!dateStr) return lang === "bn" ? "রেকর্ড নেই" : "Not recorded";
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

      if (lang === "bn") {
        const bnMonths = [
          "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
          "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
        ];
        return `${formatNumber(day, false)} ${bnMonths[month - 1]}, ${formatNumber(year, false)}`;
      } else {
        const localDate = new Date(year, month - 1, day);
        return localDate.toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric"
        });
      }
    } catch {
      return String(dateStr);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // DOMAIN-SPECIFIC TRANSLATION HELPERS
  // ──────────────────────────────────────────────────────────────

  function translateSeverity(sev) {
    if (currentLang !== "bn" || !sev) return sev;
    const s = String(sev).toUpperCase();
    if (s === "HIGH") return "উচ্চ ঝুঁকি";
    if (s === "MEDIUM") return "মাঝারি ঝুঁকি";
    if (s === "LOW") return "কম ঝুঁকি";
    return sev;
  }

  function translateLocation(loc) {
    if (currentLang !== "bn" || !loc) return loc;
    const LOC_MAP = {
      "Greenfield Township, Block 7, Survey No. 112": "গ্রিনফিল্ড টাউনশিপ, ব্লক ৭, জরিপ নং ১১২",
      "Riverstone Estate, Block 3, Survey No. 87": "রিভারস্টোন এস্টেট, ব্লক ৩, জরিপ নং ৮৭",
      "Palmview Heights, Block 12, Survey No. 203": "পামভিউ হাইটস, ব্লক ১২, জরিপ নং ২০৩",
      "Westgate Quarters, Block 2, Survey No. 55": "ওয়েস্টগেট কোয়ার্টার্স, ব্লক ২, জরিপ নং ৫৫",
      "Crescent Gardens, Block 5, Survey No. 178": "ক্রিসেন্ট গার্ডেনস, ব্লক ৫, জরিপ নং ১৭৮",
      "Hilltop View Estate, Block 9, Survey No. 320": "হিলটপ ভিউ এস্টেট, ব্লক ৯, জরিপ নং ৩২০",
      "Maplewood District, Block 4, Survey No. 241": "ম্যাপেলউড ডিস্ট্রিক্ট, ব্লক ৪, জরিপ নং ২৪১"
    };
    if (LOC_MAP[loc]) return LOC_MAP[loc];
    return String(loc)
      .replace(/Block\s*(\d+)/gi, (m, p) => `ব্লক ${formatNumber(p)}`)
      .replace(/Survey\s*No\.\s*(\d+)/gi, (m, p) => `জরিপ নং ${formatNumber(p)}`);
  }

  function translateArea(area) {
    if (currentLang !== "bn" || !area) return area;
    if (area === "Unknown") return "অজ্ঞাত";
    const m = String(area).match(/^([\d.]+)\s*acres?$/i);
    if (m) {
      return `${formatNumber(m[1])} একর`;
    }
    return formatNumber(area);
  }

  function translateOwner(owner) {
    if (currentLang !== "bn" || !owner) return owner;
    if (owner === "Disputed") return "বিতর্কিত";
    if (owner === "Unknown / Not Recorded") return "অজ্ঞাত / নথিতে নেই";
    if (owner.includes("(unverified)")) {
      return owner.replace(/\(unverified\)/g, "(অযাচাইকৃত)");
    }
    return owner;
  }

  function translateDeedType(dt) {
    if (currentLang !== "bn" || !dt) return dt;
    if (dt === "Conveyance") return "হস্তান্তর দলিল";
    if (dt === "Customary Right of Occupancy") return "প্রথাগত দখলিস্বত্ব দলিল";
    return dt;
  }

  function translateDeedOffice(office) {
    if (currentLang !== "bn" || !office) return office;
    const OFFICE_MAP = {
      "Greenfield Sub-Registry": "গ্রিনফিল্ড সাব-রেজিস্ট্রি",
      "Riverstone Land Registry": "রিভারস্টোন ভূমি রেজিস্ট্রি",
      "Palmview Land Registry": "পামভিউ ভূমি রেজিস্ট্রি",
      "Central Land Bureau — Annex B": "সেন্ট্রাল ল্যান্ড ব্যুরো — অ্যানেক্স বি",
      "Westgate District Office": "ওয়েস্টগেট জেলা কার্যালয়",
      "Crescent Sub-Registry": "ক্রিসেন্ট সাব-রেজিস্ট্রি",
      "Hilltop Commercial Registry": "হিলটপ বাণিজ্যিক রেজিস্ট্রি",
      "Maplewood Land Registry": "ম্যাপেলউড ভূমি রেজিস্ট্রি"
    };
    return OFFICE_MAP[office] || office;
  }

  function translateMutationReason(reason) {
    if (currentLang !== "bn" || !reason) return reason;
    if (reason === "Sale") return "বিক্রয়";
    if (reason === "Inheritance") return "উত্তরাধিকার";
    if (reason === "Court Order") return "আদালতের আদেশ";
    return reason;
  }

  function translateTransferType(type) {
    if (currentLang !== "bn" || !type) return type;
    if (type === "Sale") return "বিক্রয়";
    if (type === "Internal Transfer") return "অভ্যন্তরীণ হস্তান্তর";
    if (type === "Original Grant") return "মূল বরাদ্দ";
    return type;
  }

  function translateTransferNote(note, transferId) {
    if (currentLang !== "bn" || !note) return note;
    const NOTE_MAP = {
      "TXF-001": "স্বাভাবিক বিক্রয়। সকল রেকর্ড সামঞ্জস্যপূর্ণ।",
      "TXF-002": "Fatima Okonkwo-এর নামে দলিল হস্তান্তর।",
      "TXF-003": "নামজারি রেকর্ডে দলিলের চেয়ে ভিন্ন ক্রেতার নাম দেখা যাচ্ছে।",
      "TXF-004": "মূল বিক্রয়। এই পর্যন্ত সকল রেকর্ড সামঞ্জস্যপূর্ণ ছিল।",
      "TXF-005": "কয়েক বছর পর দ্বিতীয় দলিল ইস্যু করা হয়। কোনো নামজারি রেকর্ড নেই। পূর্ববর্তী মালিকের সাথে সুস্পষ্ট যোগসূত্র নেই।",
      "TXF-006": "মূল বরাদ্দ। ডেমো ডেটাসেটে পরবর্তী কোনো নামজারি বা হস্তান্তর রেকর্ড পাওয়া যায়নি।",
      "TXF-007": "সকল রেকর্ড সামঞ্জস্যপূর্ণ। কোনো বিরোধ শনাক্ত হয়নি।",
      "TXF-008": "দলিলে Tunde Abiodun-এর কাছে বিক্রয়ের রেকর্ড রয়েছে।",
      "TXF-009": "নামজারিতে ভিন্ন ক্রেতার নাম রেকর্ড করা হয়েছে। পূর্ববর্তী মালিক একই (Cynthia Osei), যা দ্বৈত বিক্রয়ের সম্ভাব্য ইঙ্গিত দেয়।",
      "TXF-010": "মূল যাচাইকৃত বিক্রয়। দলিল ও নামজারি রেকর্ড সামঞ্জস্যপূর্ণ।",
      "TXF-011": "২০১৬ সালে দলিল বা নামজারির তথ্যসূত্র ছাড়াই একটি মধ্যবর্তী হস্তান্তর রেকর্ড করা হয়। এই সময়ের মালিকানা শৃঙ্খল সম্পূর্ণ নিশ্চিত করা যায় না।"
    };
    if (transferId && NOTE_MAP[transferId]) return NOTE_MAP[transferId];
    return note;
  }

  function translateMissingField(field) {
    if (currentLang !== "bn" || !field) return field;
    const MISSING_MAP = {
      "Linked mutation for DEED-8802": "DEED-8802-এর সংশ্লিষ্ট নামজারি",
      "Deed reference for MUT-5502": "MUT-5502-এর দলিলের তথ্যসূত্র",
      "Deed reference for MUT-6603 mutation chain": "MUT-6603 নামজারি শৃঙ্খলের দলিলের তথ্যসূত্র",
      "Prior ownership evidence for DEED-9902": "DEED-9902-এর পূর্ববর্তী মালিকানার প্রমাণ",
      "Plot area / survey dimensions": "জমির পরিমাণ / জরিপ পরিমাপ",
      "Mutation records": "নামজারি রেকর্ড",
      "Consideration amount": "দলিলের মূল্য",
      "Witness information": "সাক্ষীর তথ্য",
      "Verification status of existing deed": "বিদ্যমান দলিলের যাচাইকরণ অবস্থা",
      "Linked mutation for DEED-5501": "DEED-5501-এর সংশ্লিষ্ট নামজারি",
      "Deed reference for MUT-8806": "MUT-8806-এর দলিলের তথ্যসূত্র",
      "Deed reference for 2016 internal transfer (TXF-011)": "২০১৬ সালের অভ্যন্তরীণ হস্তান্তরের (TXF-011) দলিলের তথ্যসূত্র",
      "Mutation reference for 2016 internal transfer (TXF-011)": "২০১৬ সালের অভ্যন্তরীণ হস্তান্তরের (TXF-011) নামজারির তথ্যসূত্র",
      "No critical fields missing in demo data": "ডেমো তথ্যে কোনো গুরুত্বপূর্ণ ক্ষেত্র অনুপস্থিত নেই"
    };
    return MISSING_MAP[field] || field;
  }

  function translatePlotDescription(plotId, desc) {
    if (currentLang !== "bn" || !desc) return desc;
    const DESC_MAP = {
      "PLT-2001": "সকল কৃত্রিম রেকর্ড সামঞ্জস্যপূর্ণ। এই প্লটের জন্য কোনো বিরোধ শনাক্তকরণ বিধি কার্যকর হয়নি।",
      "PLT-2002": "দলিল এবং নামজারি রেকর্ডে ভিন্ন ভিন্ন মালিকের নাম দেখা যাচ্ছে। এটি একটি প্রধান বিরোধ নির্দেশক।",
      "PLT-2003": "এই প্লট আইডির বিপরীতে দুটি সক্রিয় দলিল বিদ্যমান। উভয় দলিলই পূর্ণ মালিকানা দাবি করছে। এটি বিস্তারিত তদন্ত সাপেক্ষ।",
      "PLT-2004": "উল্লেখযোগ্য তথ্যের ঘাটতিযুক্ত পুরনো রেকর্ড। বেশ কয়েকটি মূল ক্ষেত্র অনুপস্থিত থাকায় বিরোধ বিশ্লেষণ অসম্পূর্ণ।",
      "PLT-2005": "নিখুঁত ও পরিষ্কার রেকর্ড। দলিল ও নামজারিতে মালিকের নাম অভিন্ন। হস্তান্তর ইতিহাস কালানুক্রমিকভাবে সামঞ্জস্যপূর্ণ।",
      "PLT-2006": "দলিলের মালিক এবং নামজারির মালিকের নাম মেলেনি। হস্তান্তরের তারিখের ধারাবাহিকতায়ও অসংগতি রয়েছে।",
      "PLT-2007": "নিবন্ধিত দলিল ও নামজারি রেকর্ডে মালিকের নাম মিলে গেছে। তবে অসম্পূর্ণ মালিকানা হস্তান্তর ইতিহাসের কারণে পূর্ণাঙ্গ মূল্যায়ন সম্ভব নয়। মধ্যবর্তী একটি হস্তান্তরে দলিল ও নামজারির তথ্যসূত্র নেই, যা অধিকতর যাচাইকরণ দাবি করে।"
    };
    return DESC_MAP[plotId] || desc;
  }

  function translateEvidenceDetail(ev) {
    if (!ev) return "";
    if (currentLang === "bn") {
      if (ev.detailBn) return ev.detailBn;
      if (ev.rule === "RULE-01") {
        return `দলিলে মালিক হিসেবে '${ev.deedValue}'-এর নাম রয়েছে, কিন্তু নামজারি রেকর্ডে মালিক হিসেবে '${ev.mutationValue}'-এর নাম উল্লেখ করা হয়েছে।`;
      }
      if (ev.rule === "RULE-03") {
        return "এই প্লটের জন্য কোনো নামজারি রেকর্ড পাওয়া যায়নি। দলিল হস্তান্তরের পর সাধারণ নিয়মে প্রশাসনিক নামজারি প্রত্যাশিত।";
      }
      return ev.detail || "";
    }
    return ev.detail || "";
  }

  function translateApprovedBy(name) {
    if (currentLang !== "bn" || !name) return name;
    return String(name)
      .replace(/Revenue Inspector Olawale/g, "রাজস্ব পরিদর্শক ওলাওয়ালে")
      .replace(/Revenue Inspector Musa/g, "রাজস্ব পরিদর্শক মুসা")
      .replace(/Revenue Inspector Eze/g, "রাজস্ব পরিদর্শক ইজে")
      .replace(/Revenue Inspector Okafor/g, "রাজস্ব পরিদর্শক ওকাফর")
      .replace(/Revenue Inspector Bello/g, "রাজস্ব পরিদর্শক বেলো")
      .replace(/Revenue Inspector Adamu/g, "রাজস্ব পরিদর্শক আদামু")
      .replace(/Revenue Inspector/g, "রাজস্ব পরিদর্শক");
  }

  function translateEncumbrance(enc) {
    if (currentLang !== "bn" || !enc) return enc;
    return {
      type: enc.type === "Dispute Flag" ? "বিরোধ সতর্কতা" : enc.type,
      raisedBy: enc.raisedBy === "Registry Quality Control" ? "রেজিস্ট্রি মান নিয়ন্ত্রণ বিভাগ" : enc.raisedBy,
      notes: enc.notes === "Duplicate deed indicator noted in internal audit." ? "অভ্যন্তরীণ নিরীক্ষায় দ্বৈত দলিলের ইঙ্গিত পাওয়া গেছে।" : enc.notes
    };
  }

  // ──────────────────────────────────────────────────────────────
  // INITIALIZATION & DOM UPDATES
  // ──────────────────────────────────────────────────────────────

  /** Initializes language state from storage/default and marks document */
  function init() {
    let saved = null;
    try {
      if (typeof localStorage !== "undefined") {
        saved = localStorage.getItem(STORAGE_KEY);
      }
    } catch (e) {}

    currentLang = (saved === "en" || saved === "bn") ? saved : DEFAULT_LANG;

    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("lang", currentLang);
      if (document.body) {
        document.body.classList.toggle("lang-bn", currentLang === "bn");
        document.body.classList.toggle("lang-en", currentLang === "en");
      }
    }
    return currentLang;
  }

  return {
    t,
    getLang,
    setLang,
    toggleLang,
    formatNumber,
    formatCurrency,
    formatDate,
    init,
    translations,
    dictionary,
    translateSeverity,
    translateLocation,
    translateArea,
    translateOwner,
    translateDeedType,
    translateDeedOffice,
    translateMutationReason,
    translateTransferType,
    translateTransferNote,
    translateMissingField,
    translatePlotDescription,
    translateEvidenceDetail,
    translateApprovedBy,
    translateEncumbrance
  };
})();

// Immediate bootstrap execution
if (typeof document !== "undefined" && document.documentElement) {
  try {
    const saved = localStorage.getItem("landguard-language");
    const lang = (saved === "en" || saved === "bn") ? saved : "bn";
    document.documentElement.setAttribute("lang", lang);
  } catch (e) {
    document.documentElement.setAttribute("lang", "bn");
  }
}
