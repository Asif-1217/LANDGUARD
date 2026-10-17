/**
 * LANDGUARD — Demo Scenarios Page Redesign Audit
 * Tests:
 * 1. Scenario header wrap & stat pills presence and counts
 * 2. Card count and structure (5 scenario cards with number chips, icons, titles, badges, highlights, plot action units)
 * 3. Responsive grid layout at desktop (>=1200px), tablet (1024px), mobile (375px)
 * 4. Language switching (BN <-> EN) for scenario headers, badges, highlights, and buttons
 * 5. Theme switching (Dark <-> Light) on scenario cards
 * 6. Interactive navigation: Plot detail button & Replay button navigations
 * 7. Zero console errors
 */

const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browserProc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  '--window-size=1280,800',
  'http://localhost:8080'
]);

setTimeout(async () => {
  let passed = 0;
  let failed = 0;
  const consoleErrors = [];

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      failed++;
    }
  }

  function finish() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`  AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(failed === 0 ? '  ✅ SCENARIOS REDESIGN AUDIT PASSED PERFECTLY' : '  ❌ SCENARIOS REDESIGN AUDIT HAS FAILURES');
    console.log('═══════════════════════════════════════════════════════════════\n');
    try { browserProc.kill(); } catch (e) {}
    process.exit(failed === 0 ? 0 : 1);
  }

  try {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║       DEMO SCENARIOS PAGE REDESIGN AUDIT                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const listRes = await fetch('http://127.0.0.1:9223/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page' && (t.url.includes('localhost:8080') || t.title.includes('LANDGUARD')));
    if (!pageTarget) {
      assert(false, 'Edge page target located');
      finish();
      return;
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let idCounter = 1;
    const pending = new Map();

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      }
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    await send('Runtime.enable');
    await send('Page.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
      }
      return res.result.value;
    }

    // 1. Navigate to Scenarios page
    console.log('▶ STEP 1: Scenarios Page Navigation & Stats Bar');
    await evaluate("navigateTo('scenarios')");
    
    const isScenariosActive = await evaluate("document.getElementById('page-scenarios').classList.contains('active')");
    assert(isScenariosActive, "Scenarios page is active");

    const statPillsCount = await evaluate("document.querySelectorAll('.scenarios-stat-pill').length");
    assert(statPillsCount === 5, `Found exactly 5 stat pills in summary bar (got ${statPillsCount})`);

    const statPillTexts = await evaluate("Array.from(document.querySelectorAll('.scenarios-stat-pill')).map(el => el.textContent.trim())");
    assert(statPillTexts.some(t => t.includes('দৃশ্যপট') || t.includes('Scenarios')), `Total scenarios pill rendered (${statPillTexts[0]})`);
    assert(statPillTexts.some(t => t.includes('কম ঝুঁকি') || t.includes('Low Risk')), `Low risk pill rendered (${statPillTexts[1]})`);
    assert(statPillTexts.some(t => t.includes('মাঝারি ঝুঁকি') || t.includes('Medium Risk')), `Medium risk pill rendered (${statPillTexts[2]})`);
    assert(statPillTexts.some(t => t.includes('উচ্চ ঝুঁকি') || t.includes('High Risk')), `High risk pill rendered (${statPillTexts[3]})`);
    assert(statPillTexts.some(t => t.includes('অসম্পূর্ণ') || t.includes('Incomplete')), `Incomplete pill rendered (${statPillTexts[4]})`);

    // 2. Scenario Cards Structure & Elements
    console.log('\n▶ STEP 2: Scenario Cards Anatomy & Content');
    const cardCount = await evaluate("document.querySelectorAll('.scenario-card').length");
    assert(cardCount === 5, `Found exactly 5 scenario cards (got ${cardCount})`);

    const cardIds = await evaluate("Array.from(document.querySelectorAll('.scenario-card')).map(c => c.id)");
    assert(JSON.stringify(cardIds) === JSON.stringify(['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4', 'scenario-5']), `Cards have standard scenario-1 through scenario-5 IDs`);

    const numberChips = await evaluate("Array.from(document.querySelectorAll('.scenario-number-chip')).map(c => c.textContent.trim())");
    assert(numberChips.length === 5, `Found 5 scenario number chips`);
    assert(numberChips[0] === '০১' || numberChips[0] === '01', `First chip is 01 / ০১ (got "${numberChips[0]}")`);
    assert(numberChips[4] === '০৫' || numberChips[4] === '05', `Fifth chip is 05 / ০৫ (got "${numberChips[4]}")`);

    const highlightLabels = await evaluate("Array.from(document.querySelectorAll('.scenario-highlight-label')).map(c => c.textContent.trim())");
    assert(highlightLabels.length === 5, `All 5 cards contain "What to Check" callout headers`);
    assert(highlightLabels[0].includes('পর্যবেক্ষণ') || highlightLabels[0].includes('Check'), `Callout header is properly localized (${highlightLabels[0]})`);

    // Verify plot action units
    const plotUnitsCount = await evaluate("document.querySelectorAll('.scenario-plot-unit').length");
    assert(plotUnitsCount === 7, `Found 7 plot action units across 5 scenarios (2 + 2 + 1 + 1 + 1 = 7, got ${plotUnitsCount})`);

    const plot5Exists = await evaluate("document.getElementById('scenario-5').textContent.includes('PLT-2007')");
    assert(plot5Exists, "Scenario 5 card contains PLT-2007 action buttons");

    // 3. Interactive Navigation
    console.log('\n▶ STEP 3: Interactive Button Navigations');
    // Click Replay on PLT-2007
    await evaluate("document.querySelector('#scenario-5 .scenario-replay-action').click()");
    const currentPlotInReplay = await evaluate("App.currentPlot?.plotId");
    const isReplayActive = await evaluate("document.getElementById('page-conflict-replay').classList.contains('active')");
    const replayContent = await evaluate("document.getElementById('conflict-replay-content')?.innerHTML");
    assert(isReplayActive && currentPlotInReplay === 'PLT-2007' && replayContent.includes('PLT-2007'), `Clicking Scenario 5 Replay navigates to Conflict Replay for PLT-2007 (plot: ${currentPlotInReplay})`);

    // Return to Scenarios
    await evaluate("navigateTo('scenarios')");

    // Click Plot Detail on PLT-2002
    await evaluate("document.querySelector('#scenario-2 .scenario-plot-btn:not(.scenario-replay-action)').click()");
    const isPlotDetailActive = await evaluate("document.getElementById('page-plot-detail').classList.contains('active')");
    const detailContent = await evaluate("document.getElementById('plot-detail-content')?.innerHTML");
    assert(isPlotDetailActive && detailContent.includes('PLT-2002'), `Clicking Plot ID button on Scenario 2 navigates to Plot Detail for PLT-2002`);

    // Return to Scenarios
    await evaluate("navigateTo('scenarios')");

    // 4. Responsive Layout Verification
    console.log('\n▶ STEP 4: Responsive Layout Across Viewports');
    
    // Desktop 1280px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 100));
    const desktopCols = await evaluate("getComputedStyle(document.getElementById('scenarios-container')).gridTemplateColumns.split(' ').length");
    assert(desktopCols === 3, `Desktop (1280px) uses 3-column grid (computed cols: ${desktopCols})`);

    // Tablet 1024px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 100));
    const tabletCols = await evaluate("getComputedStyle(document.getElementById('scenarios-container')).gridTemplateColumns.split(' ').length");
    assert(tabletCols === 2, `Tablet (1024px) uses 2-column grid (computed cols: ${tabletCols})`);

    // Mobile 375px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 100));
    const mobileCols = await evaluate("getComputedStyle(document.getElementById('scenarios-container')).gridTemplateColumns.split(' ').length");
    assert(mobileCols === 1, `Mobile (375px) uses 1-column grid (computed cols: ${mobileCols})`);

    // Reset to default desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // 5. Language Switching Verification
    console.log('\n▶ STEP 5: Language Switching (BN <-> EN)');
    await evaluate("I18n.setLang('en')");
    const enTotalText = await evaluate("document.querySelector('.stat-pill--total').textContent.trim()");
    const enNumChip = await evaluate("document.querySelector('.scenario-number-chip').textContent.trim()");
    const enCheckLabel = await evaluate("document.querySelector('.scenario-highlight-label').textContent.trim()");
    assert(enTotalText === '5 Scenarios', `English total stat pill is "5 Scenarios" (got "${enTotalText}")`);
    assert(enNumChip === '01', `English number chip is "01" (got "${enNumChip}")`);
    assert(enCheckLabel.includes('What to Check'), `English check label is "What to Check" (got "${enCheckLabel}")`);

    await evaluate("I18n.setLang('bn')");
    const bnTotalText = await evaluate("document.querySelector('.stat-pill--total').textContent.trim()");
    const bnNumChip = await evaluate("document.querySelector('.scenario-number-chip').textContent.trim()");
    assert(bnTotalText === '৫টি দৃশ্যপট', `Bangla total stat pill is "৫টি দৃশ্যপট" (got "${bnTotalText}")`);
    assert(bnNumChip === '০১', `Bangla number chip is "০১" (got "${bnNumChip}")`);

    // 6. Theme Switching Verification
    console.log('\n▶ STEP 6: Theme Switching & Contrast');
    await evaluate("document.documentElement.setAttribute('data-theme', 'dark')");
    const darkThemeAttr = await evaluate("document.documentElement.getAttribute('data-theme')");
    const cardDarkBorder = await evaluate("getComputedStyle(document.querySelector('.scenario-card')).borderColor");
    assert(darkThemeAttr === 'dark', 'Dark theme applied');
    assert(cardDarkBorder && cardDarkBorder !== 'transparent', `Dark theme card border is styled (${cardDarkBorder})`);

    await evaluate("document.documentElement.setAttribute('data-theme', 'light')");
    const lightThemeAttr = await evaluate("document.documentElement.getAttribute('data-theme')");
    assert(lightThemeAttr === 'light', 'Light theme applied');

    // 7. Console Errors
    console.log('\n▶ STEP 7: Console Cleanliness');
    assert(consoleErrors.length === 0, `Zero console errors during all actions (got ${consoleErrors.length})`);

    finish();
  } catch (err) {
    console.error('Audit execution error:', err);
    try { browserProc.kill(); } catch (e) {}
    process.exit(1);
  }
}, 1500);
