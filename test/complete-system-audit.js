/**
 * LANDGUARD — Complete Final System Audit Suite
 *
 * Runs comprehensive automated verification covering:
 * 1. HTTP server availability & asset loading
 * 2. Headless Edge browser DOM rendering & CDP console error verification
 * 3. Navigation across all 6 main views
 * 4. All Demo Scenarios (Low, Medium, High Mismatch, High Duplicate, Incomplete)
 * 5. PLT-2007 Medium Risk scenario verification
 * 6. Total absence of LG-1005 and LG-1004
 * 7. Dashboard Dataset Risk Distribution (Low, Medium, High counts and percentages)
 * 8. Light and Dark theme toggling and persistence
 * 9. Mobile responsive drawer and layout
 * 10. Search field, live suggestions, and unknown plot error states
 * 11. Synthetic data and educational disclaimer verification
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║       LANDGUARD COMPLETE SYSTEM AUDIT & VERIFICATION          ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
    failCount++;
  }
}

// ─────────────────────────────────────────────────────────────
// PART 1: SOURCE CODE & DATA INTEGRITY
// ─────────────────────────────────────────────────────────────
console.log('▶ STEP 1: Static Source Code & Dataset Audit');

const dataCode   = fs.readFileSync(path.join(__dirname, '../data/demo-data.js'), 'utf8');
const i18nCode   = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');
const themeCode  = fs.readFileSync(path.join(__dirname, '../js/theme.js'), 'utf8');
const engineCode = fs.readFileSync(path.join(__dirname, '../js/risk-engine.js'), 'utf8');
const appCode    = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const indexHtml  = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const readmeMd   = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');

// Check no LG-1005 or LG-1004 in active code
assert(!dataCode.includes('LG-1005'), 'demo-data.js contains no reference to LG-1005');
assert(!dataCode.includes('LG-1004'), 'demo-data.js contains no reference to LG-1004');
assert(!indexHtml.includes('LG-1005'), 'index.html contains no reference to LG-1005');
assert(!indexHtml.includes('LG-1004'), 'index.html contains no reference to LG-1004');
assert(!appCode.includes('LG-1005'), 'app.js contains no reference to LG-1005');
assert(!appCode.includes('LG-1004'), 'app.js contains no reference to LG-1004');
assert(!engineCode.includes('LG-1005'), 'risk-engine.js contains no reference to LG-1005');
assert(!engineCode.includes('LG-1004'), 'risk-engine.js contains no reference to LG-1004');

// Check currency symbol update (Bangladeshi Taka ৳ instead of Naira ₦)
assert(!dataCode.includes('₦'), 'demo-data.js contains no Nigerian Naira symbol (₦)');
assert(!indexHtml.includes('₦'), 'index.html contains no Nigerian Naira symbol (₦)');
assert(!appCode.includes('₦'), 'app.js contains no Nigerian Naira symbol (₦)');
assert(dataCode.includes('৳8,200,000'), 'demo-data.js uses Bangladeshi Taka (৳8,200,000) for PLT-2002');
assert(dataCode.includes('৳9,500,000'), 'demo-data.js uses Bangladeshi Taka (৳9,500,000) for PLT-2007');

// Verify PLT-2007 exists in demo data
assert(dataCode.includes('PLT-2007'), 'demo-data.js contains PLT-2007');
assert(indexHtml.includes('PLT-2007'), 'index.html includes PLT-2007 in datalist and buttons');
assert(appCode.includes('PLT-2007'), 'app.js references PLT-2007 in quick scenarios');

// Verify disclaimers present
assert(indexHtml.includes('Educational Prototype'), 'index.html contains Educational Prototype badge');
assert(indexHtml.includes('Not an official legal opinion'), 'index.html contains legal disclaimer');
assert(dataCode.includes('ALL DATA IS ENTIRELY FICTIONAL'), 'demo-data.js contains synthetic disclaimer');
assert(readmeMd.includes('Synthetic Demo Data Only'), 'README.md contains synthetic demo disclaimer');

// ─────────────────────────────────────────────────────────────
// PART 2: DETERMINISTIC RISK ENGINE & STATS AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n▶ STEP 2: Deterministic Risk Engine & Scenario Analysis');

const ctx = { console, process, setInterval: () => {}, clearInterval: () => {} };
vm.createContext(ctx);

function evalCode(code, name) {
  vm.runInContext(code.replace(/\bconst\s+/g, 'var ').replace(/\blet\s+/g, 'var '), ctx, { filename: name });
}

evalCode(dataCode, 'demo-data.js');
evalCode(i18nCode, 'i18n.js');
evalCode(themeCode, 'theme.js');
evalCode(engineCode, 'risk-engine.js');

const plots = ctx.LANDGUARD_DATA.plots;
assert(Array.isArray(plots) && plots.length === 7, 'Exact total of 7 demo plots in dataset');

const stats = ctx.RiskEngine.computeDashboardStats(plots);
assert(stats.totalPlots === 7, 'Stats total plots = 7');
assert(stats.potentialConflicts === 4, 'Stats potential conflicts = 4 (3 High + 1 Medium)');
assert(stats.incompleteRecords === 5, 'Stats incomplete records = 5');
assert(stats.reviewed === 7, 'Stats reviewed = 7');

// Test all individual scenarios
// Scenario 1: Low Risk (PLT-2001)
const p2001 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2001'));
assert(p2001.riskLevel === 'No Conflict Detected' && p2001.score === 0, 'Scenario 1 (PLT-2001) evaluates to No Conflict Detected (Score 0)');
assert(p2001.triggeredRules.length === 0, 'Scenario 1 (PLT-2001) has 0 triggered rules');

// Scenario 1: Low Risk (PLT-2005)
const p2005 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2005'));
assert(p2005.riskLevel === 'No Conflict Detected' && p2005.score === 0, 'Scenario 1 (PLT-2005) evaluates to No Conflict Detected (Score 0)');

// Scenario 2: High Risk — Ownership Mismatch (PLT-2002)
const p2002 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2002'));
assert(p2002.riskLevel === 'High', 'Scenario 2 (PLT-2002) evaluates to High Risk');
assert(p2002.triggeredRules.includes('RULE-01'), 'Scenario 2 (PLT-2002) triggers RULE-01 (Ownership Mismatch)');

// Scenario 2: High Risk — Ownership Mismatch (PLT-2006)
const p2006 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2006'));
assert(p2006.riskLevel === 'High' && p2006.triggeredRules.includes('RULE-01'), 'Scenario 2 (PLT-2006) triggers RULE-01');

// Scenario 3: High Risk — Duplicate Active Deeds (PLT-2003)
const p2003 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2003'));
assert(p2003.riskLevel === 'High', 'Scenario 3 (PLT-2003) evaluates to High Risk');
assert(p2003.triggeredRules.includes('RULE-02'), 'Scenario 3 (PLT-2003) triggers RULE-02 (Duplicate Active Deeds)');

// Scenario 4: Incomplete Data (PLT-2004)
const p2004 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2004'));
assert(p2004.riskLevel === 'Incomplete Data', 'Scenario 4 (PLT-2004) evaluates to Incomplete Data');
assert(p2004.triggeredRules.includes('RULE-07'), 'Scenario 4 (PLT-2004) triggers RULE-07 (Missing Fields)');

// Scenario 5: Medium Risk — Incomplete Ownership History (PLT-2007)
const p2007 = ctx.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2007'));
assert(p2007.riskLevel === 'Medium', 'Scenario 5 (PLT-2007) evaluates to Medium Risk');
assert(p2007.score === 20, 'Scenario 5 (PLT-2007) score is exactly 20');
assert(p2007.triggeredRules.includes('RULE-04'), 'Scenario 5 (PLT-2007) triggers RULE-04 (Unlinked Transfer)');
assert(p2007.triggeredRules.includes('RULE-07'), 'Scenario 5 (PLT-2007) triggers RULE-07 (Missing Critical Fields)');
assert(!p2007.triggeredRules.includes('RULE-01'), 'Scenario 5 (PLT-2007) does NOT trigger RULE-01 (Owners match)');
assert(!p2007.triggeredRules.includes('RULE-02'), 'Scenario 5 (PLT-2007) does NOT trigger RULE-02 (Single active deed)');

// Currency formatting tests (Bangladeshi Taka BDT with ৳ in en and bn)
assert(typeof ctx.I18n.formatCurrency === 'function', 'I18n.formatCurrency is defined and exported');
ctx.I18n.setLang('en');
const formatted82 = ctx.I18n.formatCurrency(8200000);
assert(formatted82 === '৳8,200,000', `I18n.formatCurrency(8200000) in en formats as "৳8,200,000" (got "${formatted82}")`);
const formattedStr = ctx.I18n.formatCurrency('৳9,500,000');
assert(formattedStr === '৳9,500,000', `I18n.formatCurrency("৳9,500,000") in en preserves valid Taka string (got "${formattedStr}")`);
const formattedNull = ctx.I18n.formatCurrency(null);
assert(formattedNull === 'Not recorded', `I18n.formatCurrency(null) in en returns "Not recorded"`);

ctx.I18n.setLang('bn');
const formatted82Bn = ctx.I18n.formatCurrency(8200000);
assert(formatted82Bn === '৳৮,২০০,০০০', `I18n.formatCurrency(8200000) in bn formats as "৳৮,২০০,০০০" (got "${formatted82Bn}")`);
const formattedNullBn = ctx.I18n.formatCurrency(null);
assert(formattedNullBn === 'রেকর্ড নেই', `I18n.formatCurrency(null) in bn returns "রেকর্ড নেই"`);

// ─────────────────────────────────────────────────────────────
// PART 3: DATASET RISK DISTRIBUTION CALCULATIONS
// ─────────────────────────────────────────────────────────────
console.log('\n▶ STEP 3: Dataset Risk Distribution Breakdown');

let highCount = 0;
let mediumCount = 0;
let lowCount = 0;
let incompCount = 0;

plots.forEach(p => {
  const r = ctx.RiskEngine.analysePlot(p).riskLevel;
  if (r === 'High') highCount++;
  else if (r === 'Medium') mediumCount++;
  else if (r === 'Incomplete Data') incompCount++;
  else lowCount++;
});

assert(highCount === 3, `High Risk count = 3 (got ${highCount})`);
assert(mediumCount === 1, `Medium Risk count = 1 (got ${mediumCount})`);
assert(lowCount === 2, `Low Risk count = 2 (got ${lowCount})`);
assert(incompCount === 1, `Incomplete count = 1 (got ${incompCount})`);
assert(highCount + mediumCount + lowCount + incompCount === 7, 'Total sum of categories equals total plots (7)');

const highPct = Math.round((highCount / 7) * 100);
const medPct = Math.round((mediumCount / 7) * 100);
const lowPct = Math.round((lowCount / 7) * 100);
const incompPct = Math.round((incompCount / 7) * 100);

assert(highPct === 43, 'High Risk percentage = 43%');
assert(medPct === 14, 'Medium Risk percentage = 14%');
assert(lowPct === 29, 'Low Risk percentage = 29%');
assert(incompPct === 14, 'Incomplete percentage = 14%');

// ─────────────────────────────────────────────────────────────
// PART 4: HEADLESS BROWSER AUDIT VIA EDGE & CDP
// ─────────────────────────────────────────────────────────────
console.log('\n▶ STEP 4: Live Headless Browser & CDP Console Verification');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browserProc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  '--window-size=1280,800',
  'http://localhost:8080'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9223/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('localhost:8080'));

    if (!pageTarget) {
      assert(false, 'Edge page target located');
      browserProc.kill();
      finishAudit();
      return;
    }

    assert(true, 'Edge headless browser connected via CDP (port 9223)');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pendingCalls = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingCalls.has(data.id)) {
        pendingCalls.get(data.id)(data.result);
        pendingCalls.delete(data.id);
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        if (data.params.type === 'error') {
          consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(data.params.exceptionDetails.text + ' ' + (data.params.exceptionDetails.exception?.description || ''));
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        pendingCalls.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    function evaluate(expression) {
      return sendCommand('Runtime.evaluate', { expression, returnByValue: true })
        .then(res => res?.result?.value);
    }

    ws.onopen = async () => {
      await sendCommand('Page.enable');
      await sendCommand('Runtime.enable');
      await sendCommand('Console.enable');
      await new Promise(r => setTimeout(r, 1500));

      // 1. Check title & basic DOM
      const title = await evaluate('document.title');
      assert(title && title.includes('LANDGUARD'), 'Page title contains LANDGUARD');

      // 2. Check no console errors on initial load
      assert(consoleErrors.length === 0, 'Zero browser console errors / exceptions on initial load', consoleErrors.join('; '));

      // 3. Check Dashboard elements in initial default language (Bangla bn)
      const currentLang = await evaluate('I18n.getLang()');
      assert(currentLang === 'bn', 'Initial default language is Bangla (bn)');

      const statTotal = await evaluate('document.getElementById("stat-total")?.textContent');
      assert(statTotal === '৭' || statTotal === '7', `Dashboard stat-total displays 7 in bn/en (got "${statTotal}")`);

      const statConflicts = await evaluate('document.getElementById("stat-conflicts")?.textContent');
      assert(statConflicts === '৪' || statConflicts === '4', `Dashboard stat-conflicts displays 4 in bn/en (got "${statConflicts}")`);

      const statIncomplete = await evaluate('document.getElementById("stat-incomplete")?.textContent');
      assert(statIncomplete === '৫' || statIncomplete === '5', `Dashboard stat-incomplete displays 5 in bn/en (got "${statIncomplete}")`);

      // 4. Check Risk Distribution Chart in DOM
      const chartHtml = await evaluate('document.getElementById("dashboard-charts-container")?.innerHTML');
      assert(chartHtml.includes('মাঝারি ঝুঁকি') || chartHtml.includes('Medium Risk'), 'Dashboard chart contains Medium Risk label');
      assert(chartHtml.includes('উচ্চ ঝুঁকি') || chartHtml.includes('High Risk'), 'Dashboard chart contains High Risk label');
      assert(chartHtml.includes('কম ঝুঁকি') || chartHtml.includes('Low Risk'), 'Dashboard chart contains Low Risk label');
      assert(chartHtml.includes('১ (১৪%)') || chartHtml.includes('1 (14%)'), 'Dashboard chart displays Medium Risk count');
      assert(chartHtml.includes('৩ (৪৩%)') || chartHtml.includes('3 (43%)'), 'Dashboard chart displays High Risk count');
      assert(chartHtml.includes('২ (২৯%)') || chartHtml.includes('2 (29%)'), 'Dashboard chart displays Low Risk count');

      // 5. Test Navigation to all 6 pages
      const pages = ['dashboard', 'scenarios', 'plot-detail', 'conflict-replay', 'risk-panel', 'about'];
      for (const p of pages) {
        await evaluate(`navigateTo('${p}')`);
        const isVisible = await evaluate(`document.getElementById('page-${p}')?.classList.contains('active')`);
        assert(isVisible === true, `Navigation: page-${p} activates cleanly`);
      }

      // 6. Test Demo Scenario Cards Page
      await evaluate("navigateTo('scenarios')");
      const scenariosHtml = await evaluate('document.getElementById("scenarios-container")?.innerHTML');
      assert(scenariosHtml.includes('Scenario 1') || scenariosHtml.includes('দৃশ্যপট ১'), 'Scenarios page renders Scenario 1');
      assert(scenariosHtml.includes('Scenario 2') || scenariosHtml.includes('দৃশ্যপট ২'), 'Scenarios page renders Scenario 2');
      assert(scenariosHtml.includes('Scenario 3') || scenariosHtml.includes('দৃশ্যপট ৩'), 'Scenarios page renders Scenario 3');
      assert(scenariosHtml.includes('Scenario 4') || scenariosHtml.includes('দৃশ্যপট ৪'), 'Scenarios page renders Scenario 4');
      assert(scenariosHtml.includes('Scenario 5') || scenariosHtml.includes('দৃশ্যপট ৫'), 'Scenarios page renders Scenario 5');
      assert(scenariosHtml.includes('PLT-2007'), 'Scenarios page includes plot PLT-2007');
      assert(!scenariosHtml.includes('LG-1005'), 'Scenarios page does NOT include LG-1005');

      // 7. Test PLT-2007 in Plot Detail
      await evaluate("loadPlotDetail('PLT-2007')");
      const detailHtml = await evaluate('document.getElementById("plot-detail-content")?.innerHTML');
      assert(detailHtml.includes('PLT-2007'), 'Plot Detail renders PLT-2007');
      assert(detailHtml.includes('Adaeze Nwofor'), 'Plot Detail displays owner Adaeze Nwofor');
      assert(detailHtml.includes('Medium Risk') || detailHtml.includes('মাঝারি ঝুঁকি'), 'Plot Detail displays Medium Risk badge');
      assert(detailHtml.includes('DEED-1004'), 'Plot Detail displays DEED-1004');
      assert(detailHtml.includes('MUT-9901'), 'Plot Detail displays MUT-9901');
      assert(detailHtml.includes('৳৯,৫০০,০০০') || detailHtml.includes('৳9,500,000'), 'Plot Detail displays consideration amount in Bangladeshi Taka (৳)');
      assert(!detailHtml.includes('₦'), 'Plot Detail contains no Naira (₦) symbol');

      // 8. Test PLT-2007 in Conflict Replay
      await evaluate("loadConflictReplay('PLT-2007')");
      const replayHtml = await evaluate('document.getElementById("conflict-replay-content")?.innerHTML');
      assert(replayHtml.includes('PLT-2007'), 'Conflict Replay renders PLT-2007');
      assert(replayHtml.includes('Medium Risk') || replayHtml.includes('মাঝারি'), 'Conflict Replay displays Medium Risk');
      assert(replayHtml.includes('RULE-04'), 'Conflict Replay displays RULE-04 (Unlinked Transfer)');
      assert(replayHtml.includes('RULE-07'), 'Conflict Replay displays RULE-07 (Missing Critical Fields)');
      assert(replayHtml.includes('Names match') || replayHtml.includes('মালিকের নাম মিল রয়েছে'), 'Conflict Replay confirms deed and mutation owners match');

      // 9. Test PLT-2007 in Risk Panel
      await evaluate("loadRiskPanel('PLT-2007')");
      const riskHtml = await evaluate('document.getElementById("risk-panel-content")?.innerHTML');
      assert(riskHtml.includes('PLT-2007'), 'Risk Panel renders PLT-2007');
      assert(riskHtml.includes('Medium Risk') || riskHtml.includes('মাঝারি'), 'Risk Panel displays Medium Risk level');
      assert(riskHtml.includes('20 / 100') || riskHtml.includes('২০ / ১০০'), 'Risk Panel displays Score 20 / 100');
      assert(riskHtml.includes('Assessment Summary') || riskHtml.includes('মূল্যায়ন সারসংক্ষেপ'), 'Risk Panel renders Assessment Summary');

      // 10. Test Search Bar functionality
      await evaluate("doSearch('PLT-2003')");
      const searchedDetail = await evaluate('document.getElementById("plot-detail-content")?.innerHTML');
      assert(searchedDetail.includes('PLT-2003'), 'Search: "PLT-2003" loads plot details for PLT-2003');

      // Search unknown plot
      await evaluate("doSearch('UNKNOWN-PLOT-999')");
      const notFoundHtml = await evaluate('document.getElementById("plot-detail-content")?.innerHTML');
      assert(notFoundHtml.includes('Plot Not Found') || notFoundHtml.includes('প্লট পাওয়া যায়নি'), 'Search: Unknown plot displays Plot Not Found message');
      assert(notFoundHtml.includes('PLT-2007'), 'Search: Not found suggestions include PLT-2007');
      assert(!notFoundHtml.includes('LG-1005'), 'Search: Not found suggestions do not include LG-1005');

      // 11. Test Language Toggle in Browser (BN <-> EN)
      await evaluate('I18n.setLang("en")');
      const enLang = await evaluate('I18n.getLang()');
      const enSaved = await evaluate('localStorage.getItem("landguard-language")');
      const enHtmlLang = await evaluate('document.documentElement.getAttribute("lang")');
      assert(enLang === 'en' && enSaved === 'en' && enHtmlLang === 'en', 'Language Toggle: switches to English, persists in localStorage and html lang attribute');

      await evaluate('I18n.setLang("bn")');
      const bnLang = await evaluate('I18n.getLang()');
      const bnSaved = await evaluate('localStorage.getItem("landguard-language")');
      const bnHtmlLang = await evaluate('document.documentElement.getAttribute("lang")');
      assert(bnLang === 'bn' && bnSaved === 'bn' && bnHtmlLang === 'bn', 'Language Toggle: switches back to Bangla, persists in localStorage and html lang attribute');

      // 12. Test Theme Switching (Light & Dark)
      const initialTheme = await evaluate('document.documentElement.getAttribute("data-theme")');
      await evaluate('ThemeManager.setTheme("dark")');
      const darkTheme = await evaluate('document.documentElement.getAttribute("data-theme")');
      const darkStorage = await evaluate('localStorage.getItem("landguard_theme")');
      assert(darkTheme === 'dark' && darkStorage === 'dark', 'Theme: switches to Dark theme and persists');

      await evaluate('ThemeManager.setTheme("light")');
      const lightTheme = await evaluate('document.documentElement.getAttribute("data-theme")');
      const lightStorage = await evaluate('localStorage.getItem("landguard_theme")');
      assert(lightTheme === 'light' && lightStorage === 'light', 'Theme: switches back to Light theme and persists');

      // 12. Test Mobile Viewport & Navigation Drawer
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        mobile: true
      });

      const menuBtnDisplay = await evaluate('window.getComputedStyle(document.getElementById("mobile-menu-btn")).display');
      assert(menuBtnDisplay !== 'none', 'Mobile Viewport (375px): mobile menu button is visible');

      // Click menu button
      await evaluate('document.getElementById("mobile-menu-btn").click()');
      const drawerOpen = await evaluate('document.getElementById("sidebar").classList.contains("open")');
      assert(drawerOpen === true, 'Mobile Viewport: clicking hamburger opens mobile navigation drawer');

      // Click a nav link inside drawer
      await evaluate('document.querySelector("#sidebar .nav-link[data-nav=\'scenarios\']").click()');
      const drawerClosed = await evaluate('!document.getElementById("sidebar").classList.contains("open")');
      const onScenarios = await evaluate('document.getElementById("page-scenarios").classList.contains("active")');
      assert(drawerClosed === true && onScenarios === true, 'Mobile Viewport: clicking nav link closes drawer and navigates');

      // Verify no runtime console errors accumulated during full interactive walk
      assert(consoleErrors.length === 0, 'Zero browser console errors across all interactive page actions', consoleErrors.join('; '));

      ws.close();
      browserProc.kill();
      finishAudit();
    };

  } catch (err) {
    console.error('Browser audit error:', err);
    browserProc.kill();
    finishAudit();
  }
}, 2500);

function finishAudit() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  if (failCount === 0) {
    console.log('  ✅ ALL SYSTEM AUDIT CHECKS PASSED PERFECTLY');
  } else {
    console.log('  ❌ SOME AUDIT CHECKS FAILED');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
  process.exit(failCount > 0 ? 1 : 0);
}
