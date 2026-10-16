/**
 * LANDGUARD — Automated Logic Test
 * Tests the risk engine rules against the demo data.
 * Run with: node test/validate.js
 *
 * Strategy: strip "const " from variable declarations so they
 * become global assignments, then run in vm context.
 */

const fs   = require("fs");
const path = require("path");
const vm   = require("vm");

// Read source files and strip "const " so vars land on the context object
function loadAsGlobals(filePath) {
  return fs.readFileSync(filePath, "utf8")
           .replace(/\bconst\s+/g, "");    // const X = ... → X = ...
}

const dataCode   = loadAsGlobals(path.join(__dirname, "../data/demo-data.js"));
const engineCode = loadAsGlobals(path.join(__dirname, "../js/risk-engine.js"));

const ctx = { console, process };
vm.createContext(ctx);
vm.runInContext(dataCode,   ctx, { filename: "demo-data.js" });
vm.runInContext(engineCode, ctx, { filename: "risk-engine.js" });

const LANDGUARD_DATA = ctx.LANDGUARD_DATA;
const RiskEngine     = ctx.RiskEngine;

if (!LANDGUARD_DATA) throw new Error("LANDGUARD_DATA not loaded — check demo-data.js");
if (!RiskEngine)     throw new Error("RiskEngine not loaded — check risk-engine.js");

// ─────────────────────────────────────────────────────────────────────────────
// TEST CASES
// ─────────────────────────────────────────────────────────────────────────────
const tests = [
  {
    name: "PLT-2001 (Consistent) → No Conflict Detected, Score 0",
    plotId: "PLT-2001",
    expectRiskLevel: "No Conflict Detected",
    expectScore: 0,
    expectNoRules: ["RULE-01", "RULE-02"]
  },
  {
    name: "PLT-2005 (Consistent) → No Conflict Detected, Score 0",
    plotId: "PLT-2005",
    expectRiskLevel: "No Conflict Detected",
    expectScore: 0,
    expectNoRules: ["RULE-01", "RULE-02"]
  },
  {
    name: "PLT-2002 (Ownership Mismatch) → High Risk, RULE-01 triggered",
    plotId: "PLT-2002",
    expectRiskLevel: "High",
    expectMinScore: 40,
    mustIncludeRules: ["RULE-01"],
    expectNoRules: ["RULE-02"]
  },
  {
    name: "PLT-2006 (Ownership Mismatch) → High Risk, RULE-01 triggered",
    plotId: "PLT-2006",
    expectRiskLevel: "High",
    expectMinScore: 40,
    mustIncludeRules: ["RULE-01"],
    expectNoRules: ["RULE-02"]
  },
  {
    name: "PLT-2003 (Duplicate Deeds) → High Risk, RULE-02 triggered",
    plotId: "PLT-2003",
    expectRiskLevel: "High",
    expectMinScore: 45,
    mustIncludeRules: ["RULE-02"]
  },
  {
    name: "PLT-2004 (Incomplete) → Incomplete Data, RULE-07 triggered",
    plotId: "PLT-2004",
    expectRiskLevel: "Incomplete Data",
    mustIncludeRules: ["RULE-07"]
  },
  {
    name: "PLT-2007 (Medium Risk — Incomplete History) → Medium Risk, RULE-04 and RULE-07 triggered",
    plotId: "PLT-2007",
    expectRiskLevel: "Medium",
    expectScore: 20,
    mustIncludeRules: ["RULE-04", "RULE-07"],
    expectNoRules: ["RULE-01", "RULE-02"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TEST RUNNER
// ─────────────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

console.log("\n══════════════════════════════════════════════════");
console.log("  LANDGUARD Risk Engine Validation Tests");
console.log("══════════════════════════════════════════════════\n");

tests.forEach((test, i) => {
  const plot = LANDGUARD_DATA.plots.find(p => p.plotId === test.plotId);
  if (!plot) {
    console.log(`✗ TEST ${i+1}: ${test.name}`);
    console.log(`  ERROR: Plot ${test.plotId} not found in demo data!\n`);
    failed++;
    return;
  }

  const result = RiskEngine.analysePlot(plot);
  let testPassed = true;
  const failures = [];

  if (test.expectRiskLevel && result.riskLevel !== test.expectRiskLevel) {
    testPassed = false;
    failures.push(`Expected riskLevel "${test.expectRiskLevel}", got "${result.riskLevel}"`);
  }

  if (test.expectScore !== undefined && result.score !== test.expectScore) {
    testPassed = false;
    failures.push(`Expected score ${test.expectScore}, got ${result.score}`);
  }

  if (test.expectMinScore !== undefined && result.score < test.expectMinScore) {
    testPassed = false;
    failures.push(`Expected score ≥ ${test.expectMinScore}, got ${result.score}`);
  }

  if (test.mustIncludeRules) {
    test.mustIncludeRules.forEach(ruleId => {
      if (!result.triggeredRules.includes(ruleId)) {
        testPassed = false;
        failures.push(`Expected rule ${ruleId} to be triggered`);
      }
    });
  }

  if (test.expectNoRules) {
    test.expectNoRules.forEach(ruleId => {
      if (result.triggeredRules.includes(ruleId)) {
        testPassed = false;
        failures.push(`Expected rule ${ruleId} NOT to be triggered`);
      }
    });
  }

  if (testPassed) {
    console.log(`✓ TEST ${i+1}: ${test.name}`);
    console.log(`  Risk: ${result.riskLevel} | Score: ${result.score} | Rules: [${result.triggeredRules.join(", ") || "none"}]`);
    passed++;
  } else {
    console.log(`✗ TEST ${i+1}: ${test.name}`);
    failures.forEach(f => console.log(`  FAIL: ${f}`));
    console.log(`  Actual — Risk: ${result.riskLevel} | Score: ${result.score} | Rules: [${result.triggeredRules.join(", ") || "none"}]`);
    failed++;
  }
  console.log();
});

// Dashboard stats test
// Actual breakdown:
//   Conflicts (High or Medium risk): PLT-2002, PLT-2003, PLT-2006, PLT-2007 = 4
//   PLT-2004 is classified "Incomplete Data" risk level, separate from conflict count
//   Incomplete records (Partial/Incomplete completeness): PLT-2002, PLT-2003, PLT-2004, PLT-2006, PLT-2007 = 5
console.log("── Dashboard Stats Test ──────────────────────────");
const stats = RiskEngine.computeDashboardStats(LANDGUARD_DATA.plots);
console.log(`Total plots:        ${stats.totalPlots}  (expected 7)`);
console.log(`Potential conflicts:${stats.potentialConflicts}  (expected 4)`);
console.log(`Incomplete records: ${stats.incompleteRecords}  (expected 5)`);
console.log(`Reviewed:           ${stats.reviewed}  (expected 7)`);

if (stats.totalPlots === 7) { console.log("✓ Total plots correct"); passed++; }
else { console.log(`✗ Total plots: expected 7, got ${stats.totalPlots}`); failed++; }

if (stats.potentialConflicts === 4) { console.log("✓ Conflict count correct (4 High/Medium-risk plots)"); passed++; }
else { console.log(`✗ Conflict count: expected 4, got ${stats.potentialConflicts}`); failed++; }

if (stats.incompleteRecords === 5) { console.log("✓ Incomplete count correct (5 Partial/Incomplete plots)"); passed++; }
else { console.log(`✗ Incomplete count: expected 5, got ${stats.incompleteRecords}`); failed++; }

console.log("\n══════════════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("  ✅ ALL TESTS PASSED");
} else {
  console.log("  ❌ SOME TESTS FAILED — review output above");
}
console.log("══════════════════════════════════════════════════\n");

process.exit(failed > 0 ? 1 : 0);
