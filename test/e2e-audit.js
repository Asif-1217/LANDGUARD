const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('   LANDGUARD COMPREHENSIVE END-TO-END AUDIT SUITE   ');
console.log('====================================================\n');

// 1. Mock Minimal Browser Environment for Node.js
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  contains(c) { return this.classes.has(c); }
  toggle(c, force) {
    if (force === undefined) {
      if (this.classes.has(c)) { this.classes.delete(c); return false; }
      else { this.classes.add(c); return true; }
    } else if (force) { this.classes.add(c); return true; }
    else { this.classes.delete(c); return false; }
  }
}

class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.classList = new MockClassList();
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.attributes = {};
    this.dataset = {};
    this.children = [];
    this.eventListeners = {};
  }
  addEventListener(event, fn) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(fn);
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  contains(el) { return true; }
}

const elementsById = {};
const elementsByQuery = {};

function getOrCreateElement(id, tag = 'div') {
  if (!elementsById[id]) elementsById[id] = new MockElement(id, tag);
  return elementsById[id];
}

const mockDocument = {
  documentElement: new MockElement('html', 'html'),
  body: new MockElement('body', 'body'),
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: (selector) => {
    if (selector === '[data-nav]') {
      return ['dashboard', 'scenarios', 'plot-detail', 'conflict-replay', 'risk-panel', 'about'].map(nav => {
        const el = new MockElement('nav-' + nav, 'a');
        el.dataset.nav = nav;
        return el;
      });
    }
    if (selector === '.page') {
      return ['dashboard', 'scenarios', 'plot-detail', 'conflict-replay', 'risk-panel', 'about'].map(p => getOrCreateElement('page-' + p));
    }
    return [];
  },
  querySelector: (selector) => {
    return new MockElement('mock-' + selector);
  },
  addEventListener: (event, fn) => {}
};

const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

class MockCustomEvent {
  constructor(type, params) {
    this.type = type;
    this.detail = params ? params.detail : {};
  }
}

const mockWindow = {
  listeners: {},
  scrollTo: () => {},
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  },
  dispatchEvent(evt) {
    if (this.listeners[evt.type]) {
      this.listeners[evt.type].forEach(fn => fn(evt));
    }
  },
  matchMedia: () => ({ matches: false, addEventListener: () => {} })
};

// 2. Load and execute files in sandbox
const sandbox = {
  console,
  document: mockDocument,
  window: mockWindow,
  localStorage: mockLocalStorage,
  CustomEvent: MockCustomEvent,
  setInterval: (fn, ms) => { fn(); return 1; },
  clearInterval: () => {},
  Date
};

vm.createContext(sandbox);

function runFile(relPath) {
  const code = fs.readFileSync(path.join(__dirname, '..', relPath), 'utf8')
    .replace(/\bconst\s+([A-Za-z0-9_]+)\s*=/g, 'var $1 =')
    .replace(/\blet\s+([A-Za-z0-9_]+)\s*=/g, 'var $1 =');
  vm.runInContext(code, sandbox, { filename: relPath });
}

runFile('data/demo-data.js');
runFile('js/i18n.js');
runFile('js/theme.js');
runFile('js/risk-engine.js');
runFile('js/app.js');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName}: ${details}`);
    failedCount++;
  }
}

// ─────────────────────────────────────────────────────────────
// AUDIT 1: DATA INTEGRITY & METRIC REPRODUCIBILITY
// ─────────────────────────────────────────────────────────────
console.log('Audit 1: Data Integrity & Metric Reproducibility');
const plots = sandbox.LANDGUARD_DATA.plots;
assert(Array.isArray(plots) && plots.length === 7, 'Dataset contains exactly 7 plots');

const stats = sandbox.RiskEngine.computeDashboardStats(plots);
assert(stats.totalPlots === 7, 'Total plots count evaluates to 7');
assert(stats.potentialConflicts === 4, 'Potential conflicts count evaluates to 4 (PLT-2002, PLT-2003, PLT-2006, PLT-2007)');
assert(stats.incompleteRecords === 5, 'Incomplete/Partial count evaluates to 5 (PLT-2002, PLT-2003, PLT-2004, PLT-2006, PLT-2007)');
assert(stats.reviewed === 7, 'Reviewed plots count evaluates to 7');

// ─────────────────────────────────────────────────────────────
// AUDIT 2: SCENARIOS VALIDATION
// ─────────────────────────────────────────────────────────────
console.log('\nAudit 2: Scenario Testing (Rules & Outputs)');

// Scenario 1: PLT-2001
const s1 = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2001'));
assert(s1.riskLevel === 'No Conflict Detected', 'Scenario 1 (PLT-2001) has riskLevel "No Conflict Detected"');
assert(s1.score === 0, 'Scenario 1 (PLT-2001) score is 0');
assert(s1.triggeredRules.length === 0, 'Scenario 1 (PLT-2001) triggers 0 conflict rules');

// Scenario 1 (Second Plot): PLT-2005
const s1b = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2005'));
assert(s1b.riskLevel === 'No Conflict Detected' && s1b.score === 0, 'Scenario 1 (PLT-2005) clean pass');

// Scenario 2: PLT-2002 (Ownership Mismatch)
const s2 = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2002'));
assert(s2.riskLevel === 'High', 'Scenario 2 (PLT-2002) has riskLevel "High"');
assert(s2.triggeredRules.includes('RULE-01'), 'Scenario 2 (PLT-2002) triggers RULE-01 (Ownership Mismatch)');
assert(s2.score >= 40, 'Scenario 2 (PLT-2002) score reflects RULE-01 penalty (>= 40)');

// Scenario 2 (Second Plot): PLT-2006
const s2b = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2006'));
assert(s2b.triggeredRules.includes('RULE-01') && s2b.riskLevel === 'High', 'Scenario 2 (PLT-2006) triggers RULE-01');

// Scenario 3: PLT-2003 (Duplicate Active Deeds)
const s3 = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2003'));
assert(s3.riskLevel === 'High', 'Scenario 3 (PLT-2003) has riskLevel "High"');
assert(s3.triggeredRules.includes('RULE-02'), 'Scenario 3 (PLT-2003) triggers RULE-02 (Duplicate Active Deeds)');
assert(s3.score >= 45, 'Scenario 3 (PLT-2003) score reflects RULE-02 penalty (>= 45)');

// Scenario 4: PLT-2004 (Incomplete Data)
const s4 = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2004'));
assert(s4.riskLevel === 'Incomplete Data', 'Scenario 4 (PLT-2004) has riskLevel "Incomplete Data"');
assert(s4.triggeredRules.includes('RULE-07'), 'Scenario 4 (PLT-2004) triggers RULE-07 (Missing Critical Fields)');

// Scenario 5: PLT-2007 (Medium Risk — Incomplete Ownership History)
const s5 = sandbox.RiskEngine.analysePlot(plots.find(p => p.plotId === 'PLT-2007'));
assert(s5.riskLevel === 'Medium', 'Scenario 5 (PLT-2007) has riskLevel "Medium"');
assert(s5.score === 20, 'Scenario 5 (PLT-2007) score is 20');
assert(s5.triggeredRules.includes('RULE-04'), 'Scenario 5 (PLT-2007) triggers RULE-04 (Unlinked Transfer)');
assert(s5.triggeredRules.includes('RULE-07'), 'Scenario 5 (PLT-2007) triggers RULE-07 (Missing Critical Fields)');
assert(!s5.triggeredRules.includes('RULE-01'), 'Scenario 5 (PLT-2007) deed and mutation owners match (no RULE-01)');
assert(!s5.triggeredRules.includes('RULE-02'), 'Scenario 5 (PLT-2007) single active deed (no RULE-02)');

// ─────────────────────────────────────────────────────────────
// AUDIT 3: PAGE RENDERING & DOM MUTATIONS
// ─────────────────────────────────────────────────────────────
console.log('\nAudit 3: Interactive Page Rendering');

// Test Plot Detail Rendering
sandbox.loadPlotDetail('PLT-2002');
const detailContent = elementsById['plot-detail-content'].innerHTML;
assert(detailContent.includes('PLT-2002'), 'Plot detail rendered for PLT-2002');
assert(detailContent.includes('Fatima Okonkwo'), 'Plot detail includes registered owner');
assert(detailContent.includes('Riverstone Estate') || detailContent.includes('রিভারস্টোন এস্টেট'), 'Plot detail includes location');

// Test PLT-2007 Plot Detail Rendering
sandbox.loadPlotDetail('PLT-2007');
const detailContent7 = elementsById['plot-detail-content'].innerHTML;
assert(detailContent7.includes('PLT-2007'), 'Plot detail rendered for PLT-2007');
assert(detailContent7.includes('Adaeze Nwofor'), 'Plot detail includes owner Adaeze Nwofor');
assert(detailContent7.includes('Medium Risk') || detailContent7.includes('মাঝারি ঝুঁকি'), 'Plot detail displays Medium Risk badge');

// Test Conflict Replay Rendering
sandbox.loadConflictReplay('PLT-2002');
const replayContent = elementsById['conflict-replay-content'].innerHTML;
assert(replayContent.includes('PLT-2002') && (replayContent.includes('Conflict Replay') || replayContent.includes('বিরোধ')), 'Conflict replay header rendered');
assert(replayContent.includes('RULE-01'), 'Conflict replay contains RULE-01 card');
assert(replayContent.includes('Fatima Okonkwo') && replayContent.includes('Emmanuel Tarfa'), 'Conflict replay table includes mismatched owners');
assert(replayContent.includes('Chronological Event Timeline') || replayContent.includes('সময়রেখা'), 'Conflict replay includes chronological event timeline');
assert(replayContent.includes('Ownership Relationship Overview') || replayContent.includes('মালিকানা'), 'Conflict replay includes relationship chain');

// Test Duplicate Deeds Replay Rendering
sandbox.loadConflictReplay('PLT-2003');
const replayContent3 = elementsById['conflict-replay-content'].innerHTML;
assert(replayContent3.includes('DEED-9901') && replayContent3.includes('DEED-9902'), 'Conflict replay for PLT-2003 shows both active deed IDs');
assert(replayContent3.includes('RULE-02'), 'Conflict replay for PLT-2003 shows RULE-02 triggered');

// Test Medium Risk Replay Rendering (PLT-2007)
sandbox.loadConflictReplay('PLT-2007');
const replayContent5 = elementsById['conflict-replay-content'].innerHTML;
assert(replayContent5.includes('PLT-2007'), 'Conflict replay for PLT-2007 rendered');
assert(replayContent5.includes('Medium') || replayContent5.includes('মাঝারি'), 'Conflict replay for PLT-2007 shows Medium Risk');

// Test Risk Panel Rendering
sandbox.loadRiskPanel('PLT-2003');
const riskContent = elementsById['risk-panel-content'].innerHTML;
assert(riskContent.includes('PLT-2003') && (riskContent.includes('Risk Explanation') || riskContent.includes('ঝুঁকি')), 'Risk panel header rendered');
assert(riskContent.includes('Score Breakdown') || riskContent.includes('স্কোর বিভাজন'), 'Risk panel includes score breakdown table');
assert(riskContent.includes('Recommended Next Steps') || riskContent.includes('প্রস্তাবিত পরবর্তী পদক্ষেপ'), 'Risk panel includes next steps recommendations');
assert(riskContent.includes('All Rules Reference') || riskContent.includes('সকল নিয়মের রেফারেন্স তালিকা'), 'Risk panel includes transparent all-rules table');

// Test PLT-2007 Risk Panel Rendering
sandbox.loadRiskPanel('PLT-2007');
const riskContent5 = elementsById['risk-panel-content'].innerHTML;
assert(riskContent5.includes('PLT-2007'), 'Risk panel for PLT-2007 rendered');
assert(riskContent5.includes('Medium') || riskContent5.includes('মাঝারি'), 'Risk panel for PLT-2007 shows Medium risk');
assert(riskContent5.includes('Assessment Summary') || riskContent5.includes('মূল্যায়ন সারসংক্ষেপ'), 'Risk panel for PLT-2007 renders Assessment Summary');

// ─────────────────────────────────────────────────────────────
// AUDIT 4: SEARCH & NOT-FOUND HANDLING
// ─────────────────────────────────────────────────────────────
console.log('\nAudit 4: Search & Unknown ID Handling');

sandbox.doSearch('PLT-2001');
assert(sandbox.App.currentPage === 'plot-detail', 'Searching PLT-2001 navigates to plot-detail');
assert(sandbox.App.currentPlot.plotId === 'PLT-2001', 'Current plot updated to PLT-2001');

sandbox.doSearch('PLT-UNKNOWN-999');
assert(elementsById['plot-detail-content'].innerHTML.includes('Plot Not Found') || elementsById['plot-detail-content'].innerHTML.includes('প্লট পাওয়া যায়নি'), 'Searching unknown ID displays Plot Not Found state');
assert(elementsById['plot-detail-content'].innerHTML.includes('PLT-UNKNOWN-999'), 'Not found message reflects searched ID');

sandbox.selectSuggestion('PLT-2003');
assert(sandbox.App.currentPlot.plotId === 'PLT-2003', 'Selecting suggestion sets current plot to PLT-2003');

// ─────────────────────────────────────────────────────────────
// AUDIT 5: NAVIGATION TAB PRESERVATION
// ─────────────────────────────────────────────────────────────
console.log('\nAudit 5: Tab Navigation & Context Preservation');

sandbox.navigateTo('conflict-replay');
assert(sandbox.App.currentPage === 'conflict-replay', 'Navigated to conflict-replay');
assert(elementsById['conflict-replay-content'].innerHTML.includes('PLT-2003'), 'Conflict replay preserved active plot PLT-2003');

sandbox.navigateTo('risk-panel');
assert(sandbox.App.currentPage === 'risk-panel', 'Navigated to risk-panel');
assert(elementsById['risk-panel-content'].innerHTML.includes('PLT-2003'), 'Risk panel preserved active plot PLT-2003');

// ─────────────────────────────────────────────────────────────
// AUDIT 6: BILINGUAL (BANGLA & ENGLISH) LOCALIZATION & THEME TOGGLING
// ─────────────────────────────────────────────────────────────
console.log('\nAudit 6: Bilingual (Bangla & English) Localization & Theme Toggling');

// 1. Initial / Default Language is Bangla (bn)
assert(sandbox.I18n.getLang() === 'bn', 'First-time visitors get Bangla (bn) as default language');
assert(sandbox.I18n.formatNumber(123) === '১২৩', 'Bangla numeral formatting converts ASCII to Bengali numerals (১২৩)');
assert(sandbox.I18n.formatDate('2015-07-22') === '২২ জুলাই, ২০১৫', 'Bangla date formatting produces "২২ জুলাই, ২০১৫"');
assert(sandbox.I18n.formatCurrency(8200000) === '৳৮,২০০,০০০', 'Bangla currency formatting produces "৳৮,২০০,০০০"');

// 2. Switch to English
sandbox.I18n.setLang('en');
assert(sandbox.I18n.getLang() === 'en', 'Interface switches to English (en)');
assert(sandbox.localStorage.getItem('landguard-language') === 'en', 'Language preference persisted in localStorage under landguard-language');
assert(sandbox.I18n.formatNumber(123) === '123', 'English numeral formatting preserves ASCII numbers');
assert(sandbox.I18n.formatDate('2015-07-22') === '22 July 2015', 'English date formatting produces "22 July 2015"');
assert(sandbox.I18n.formatCurrency(8200000) === '৳8,200,000', 'English currency formatting produces "৳8,200,000"');

sandbox.loadPlotDetail('PLT-2002');
const enDetail = elementsById['plot-detail-content'].innerHTML;
assert(enDetail.includes('Deed Records'), 'English plot detail renders English titles (Deed Records)');

// 3. Switch back to Bangla
sandbox.I18n.setLang('bn');
assert(sandbox.I18n.getLang() === 'bn', 'Interface switches back to Bangla (bn)');
assert(sandbox.localStorage.getItem('landguard-language') === 'bn', 'Bangla preference persisted in localStorage');
sandbox.loadPlotDetail('PLT-2002');
const bnDetail = elementsById['plot-detail-content'].innerHTML;
assert(bnDetail.includes('দলিল রেকর্ডসমূহ'), 'Bangla plot detail renders Bangla titles (দলিল রেকর্ডসমূহ)');

// 4. Test Toggle
sandbox.I18n.toggleLang();
assert(sandbox.I18n.getLang() === 'en', 'I18n.toggleLang() toggles bn to en');
sandbox.I18n.toggleLang();
assert(sandbox.I18n.getLang() === 'bn', 'I18n.toggleLang() toggles en back to bn');

// 5. Test ThemeManager
sandbox.ThemeManager.setTheme('dark');
assert(sandbox.ThemeManager.getTheme() === 'dark', 'Theme manager set to dark theme');
assert(sandbox.localStorage.getItem('landguard_theme') === 'dark', 'Theme preference persisted in localStorage');
sandbox.ThemeManager.setTheme('light');
assert(sandbox.ThemeManager.getTheme() === 'light', 'Theme manager set to light theme');

// ─────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────
console.log('\n====================================================');
console.log(`TOTAL AUDIT CHECKS: ${passedCount + failedCount}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${failedCount}`);
console.log('====================================================');

process.exit(failedCount > 0 ? 1 : 0);
