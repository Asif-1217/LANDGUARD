const fs = require("fs");

const errors = [];
const html   = fs.readFileSync("index.html", "utf8");
const js     = fs.readFileSync("js/app.js", "utf8");
const engine = fs.readFileSync("js/risk-engine.js", "utf8");
const data   = fs.readFileSync("data/demo-data.js", "utf8");

// Script loading order
const demoIdx   = html.indexOf("demo-data.js");
const engineIdx = html.indexOf("risk-engine.js");
const appIdx    = html.indexOf("app.js");
if (demoIdx > engineIdx) errors.push("demo-data.js must come before risk-engine.js");
if (engineIdx > appIdx)  errors.push("risk-engine.js must come before app.js");

// Page IDs and nav links
["dashboard","scenarios","plot-detail","conflict-replay","risk-panel","about"].forEach(id => {
  if (!html.includes('id="page-' + id + '"')) errors.push("Missing page div: page-" + id);
  if (!html.includes('data-nav="' + id + '"')) errors.push("Missing nav link: data-nav=" + id);
});

// Key element IDs
["stat-total","stat-conflicts","stat-incomplete","stat-reviewed","recent-cases","scenarios-container",
 "plot-detail-content","conflict-replay-content","risk-panel-content","search-input","search-btn",
 "dash-search-input","dash-search-btn","explore-demo-btn"].forEach(id => {
  if (!html.includes('id="' + id + '"')) errors.push("Missing element ID: " + id);
});

// Key JS functions
["navigateTo","loadPlotDetail","loadConflictReplay","loadRiskPanel","renderDashboard",
 "renderOwnerComparisonTable","renderTriggeredRules","populateScenarioCards"].forEach(fn => {
  if (!js.includes("function " + fn)) errors.push("Missing function: " + fn);
});

// Rules in engine
["RULE-01","RULE-02","RULE-03","RULE-04","RULE-05","RULE-06","RULE-07"].forEach(r => {
  if (!engine.includes(r)) errors.push("Missing rule in engine: " + r);
});

// All 7 plots in data
["PLT-2001","PLT-2002","PLT-2003","PLT-2004","PLT-2005","PLT-2006","PLT-2007"].forEach(pid => {
  if (!data.includes(pid)) errors.push("Missing plot in data: " + pid);
});

// All 5 scenario IDs in data
["scenario-1","scenario-2","scenario-3","scenario-4","scenario-5"].forEach(s => {
  if (!data.includes(s)) errors.push("Missing scenario in data: " + s);
});

if (errors.length === 0) {
  console.log("✅ Structure validation PASSED — no issues found");
} else {
  errors.forEach(e => console.log("✗ " + e));
  process.exit(1);
}
