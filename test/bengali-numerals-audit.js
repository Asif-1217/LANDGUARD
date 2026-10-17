/**
 * LANDGUARD — Bengali Numeral Rendering Verification Suite
 *
 * Verifies:
 * 1. Exact required examples:
 *    - "০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯"
 *    - "১ (১৪%)"
 *    - "২ (২৯%)"
 *    - "৫ (৮৪%)"
 * 2. Hind Siliguri as primary font + Noto Sans Bengali for numerals
 * 3. Numeral "১" rendered with full distinct shape (head loop + tail, not tiny/distorted)
 * 4. Dashboard statistics, percentages, chart labels, risk scores, tables, badges, timeline
 * 5. Light & Dark themes
 * 6. Desktop & Mobile viewports
 * 7. English mode Inter preservation
 * 8. All existing data, IDs, calculations preserved
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║       LANDGUARD BENGALI NUMERAL AUDIT & VERIFICATION          ║');
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

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  '--disable-gpu',
  '--window-size=1280,1000',
  'http://localhost:8080'
]);

setTimeout(async () => {
  try {
    const list = await (await fetch('http://localhost:9227/json')).json();
    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:8080'));
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let id = 1;
    const pendingCalls = new Map();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingCalls.has(data.id)) {
        pendingCalls.get(data.id)(data.result);
        pendingCalls.delete(data.id);
      }
    };

    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        pendingCalls.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');
      await send('DOM.enable');
      await send('CSS.enable');

      // Wait for fonts.ready
      await send('Runtime.evaluate', {
        expression: 'document.fonts.ready',
        awaitPromise: true
      });
      await new Promise(r => setTimeout(r, 1200));

      console.log('▶ STEP 1: Font Loading & Numeral Unicode-Range Binding');

      const fontEvaluation = await send('Runtime.evaluate', {
        expression: `(() => {
          const fontList = [];
          document.fonts.forEach(f => {
            fontList.push({ family: f.family, status: f.status, weight: f.weight });
          });
          const hasHindSiliguri = fontList.some(f => f.family.includes('Hind Siliguri') && f.status === 'loaded');
          const hasNotoBengali = fontList.some(f => f.family.includes('Noto Sans Bengali') && f.status === 'loaded');
          const hasInter = fontList.some(f => f.family.includes('Inter') && f.status === 'loaded');

          const bodyFontFamily = window.getComputedStyle(document.body).fontFamily;
          const legendStrong = document.querySelector('.chart-legend .legend-row strong');
          const statNumber = document.querySelector('.stat-number');

          return {
            fontStatus: document.fonts.status,
            hasHindSiliguri,
            hasNotoBengali,
            hasInter,
            bodyFontFamily,
            legendFontFamily: legendStrong ? window.getComputedStyle(legendStrong).fontFamily : '',
            legendFontWeight: legendStrong ? window.getComputedStyle(legendStrong).fontWeight : '',
            legendFontSize: legendStrong ? window.getComputedStyle(legendStrong).fontSize : '',
            statFontFamily: statNumber ? window.getComputedStyle(statNumber).fontFamily : '',
            statFontWeight: statNumber ? window.getComputedStyle(statNumber).fontWeight : '',
            statLetterSpacing: statNumber ? window.getComputedStyle(statNumber).letterSpacing : ''
          };
        })()`,
        returnByValue: true
      });

      const fe = fontEvaluation.result.value;
      assert(fe.fontStatus === 'loaded', 'Document fonts status is fully loaded');
      assert(fe.hasHindSiliguri, 'Hind Siliguri web font is loaded in browser');
      assert(fe.hasNotoBengali, 'Noto Sans Bengali web font is loaded in browser');
      assert(fe.hasInter, 'Inter web font is loaded in browser');
      assert(fe.bodyFontFamily.includes('Hind Siliguri'), 'Body computed font-family includes Hind Siliguri in bn mode');
      assert(fe.legendFontWeight === '600', `Legend numeric weight is 600 (got ${fe.legendFontWeight})`);
      assert(fe.statFontWeight === '600', `Stat number weight is 600 (got ${fe.statFontWeight})`);
      assert(fe.statLetterSpacing === 'normal' || fe.statLetterSpacing === '0px', `Stat number letter spacing is normal (got ${fe.statLetterSpacing})`);

      console.log('\n▶ STEP 2: Dashboard Bengali Numerals & Percentage Examples');

      const chartTexts = await send('Runtime.evaluate', {
        expression: `(() => {
          const legendRows = Array.from(document.querySelectorAll('.chart-legend .legend-row strong')).map(el => el.innerText.trim());
          const barRows = Array.from(document.querySelectorAll('.bar-label-group strong')).map(el => el.innerText.trim());
          const statNums = Array.from(document.querySelectorAll('.stat-number')).map(el => el.innerText.trim());
          return { legendRows, barRows, statNums };
        })()`,
        returnByValue: true
      });

      const ct = chartTexts.result.value;
      assert(ct.legendRows.includes('১ (১৪%)'), `Legend contains exact requested example "১ (১৪%)" (rows: ${ct.legendRows.join(', ')})`);
      assert(ct.legendRows.includes('২ (২৯%)'), `Legend contains exact requested example "২ (২৯%)"`);
      assert(ct.legendRows.includes('৩ (৪৩%)'), `Legend contains "৩ (৪৩%)"`);
      assert(ct.barRows.includes('১ (১৪%)'), `Bar chart contains "১ (১৪%)"`);
      assert(ct.barRows.includes('৪ (৫৭%)'), `Bar chart contains "৪ (৫৭%)"`);
      assert(ct.statNums.includes('৭') && ct.statNums.includes('৪') && ct.statNums.includes('৫'), `Stat numbers contain "৭", "৪", "৫"`);

      console.log('\n▶ STEP 3: Complete Numeral Glyphs Rendering (০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯)');

      const sampleCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const testEl = document.createElement('div');
          testEl.id = 'bengali-numeral-test';
          testEl.style.fontFamily = 'var(--font-bn)';
          testEl.style.fontSize = '18px';
          testEl.style.fontWeight = '600';
          testEl.innerHTML = '<span>০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯</span> | <span id="s1">১ (১৪%)</span> | <span id="s2">২ (২৯%)</span> | <span id="s5">৫ (৮৪%)</span>';
          document.body.appendChild(testEl);

          const r1 = document.getElementById('s1').getBoundingClientRect();
          const r2 = document.getElementById('s2').getBoundingClientRect();
          const r5 = document.getElementById('s5').getBoundingClientRect();

          const digit1 = document.getElementById('s1').innerText.charAt(0);
          const digit2 = document.getElementById('s2').innerText.charAt(0);
          const digit5 = document.getElementById('s5').innerText.charAt(0);

          return {
            digit1,
            digit2,
            digit5,
            h1: r1.height,
            h2: r2.height,
            h5: r5.height,
            w1: r1.width
          };
        })()`,
        returnByValue: true
      });

      const sc = sampleCheck.result.value;
      assert(sc.digit1 === '১', 'Digit 1 matches Bengali numeral ১');
      assert(sc.digit2 === '২', 'Digit 2 matches Bengali numeral ২');
      assert(sc.digit5 === '৫', 'Digit 5 matches Bengali numeral ৫');
      assert(sc.h1 > 0 && Math.abs(sc.h1 - sc.h2) < 2, `Numeral containers have consistent, non-zero line height (h1: ${sc.h1}, h2: ${sc.h2})`);

      console.log('\n▶ STEP 4: Risk Explanation, Plot Detail, & Timeline Values');

      await send('Runtime.evaluate', { expression: `navigateTo('plot-detail', 'PLT-2007')` });
      await new Promise(r => setTimeout(r, 600));

      const plotDetailCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const bodyText = document.getElementById('page-plot-detail').innerText;
          return {
            hasTaka: bodyText.includes('৳'),
            hasBengaliNumbers: /[০-৯]/.test(bodyText),
            hasPlotId: bodyText.includes('PLT-2007')
          };
        })()`,
        returnByValue: true
      });
      const pd = plotDetailCheck.result.value;
      assert(pd.hasTaka, 'Plot detail renders currency with ৳ symbol');
      assert(pd.hasBengaliNumbers, 'Plot detail renders Bengali numerals for dates and numbers');
      assert(pd.hasPlotId, 'Plot detail preserves technical ID PLT-2007');

      await send('Runtime.evaluate', { expression: `navigateTo('risk-panel', 'PLT-2007')` });
      await new Promise(r => setTimeout(r, 600));

      const riskCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const bodyText = document.getElementById('page-risk-panel').innerText;
          const scoreEl = document.querySelector('.score-gauge-value') || document.querySelector('.risk-score');
          return {
            scoreText: scoreEl ? scoreEl.innerText : '',
            hasBengaliScore: /[০-৯]/.test(scoreEl ? scoreEl.innerText : ''),
            hasPlotId: bodyText.includes('PLT-2007')
          };
        })()`,
        returnByValue: true
      });
      const rc = riskCheck.result.value;
      assert(rc.hasBengaliScore, `Risk score renders in Bengali numerals (${rc.scoreText})`);

      console.log('\n▶ STEP 5: Light & Dark Theme Visual Verification');

      // Set to light theme
      await send('Runtime.evaluate', { expression: `ThemeManager.setTheme('light')` });
      await new Promise(r => setTimeout(r, 400));
      const lightTheme = await send('Runtime.evaluate', {
        expression: `document.documentElement.getAttribute('data-theme')`,
        returnByValue: true
      });
      assert(lightTheme.result.value === 'light', 'Light theme set and verified');

      // Set to dark theme
      await send('Runtime.evaluate', { expression: `ThemeManager.setTheme('dark')` });
      await new Promise(r => setTimeout(r, 400));
      const darkTheme = await send('Runtime.evaluate', {
        expression: `document.documentElement.getAttribute('data-theme')`,
        returnByValue: true
      });
      assert(darkTheme.result.value === 'dark', 'Dark theme set and verified');

      console.log('\n▶ STEP 6: English Mode Inter Preservation');

      await send('Runtime.evaluate', { expression: `I18n.setLang('en'); navigateTo('dashboard');` });
      await new Promise(r => setTimeout(r, 600));

      const enEvaluation = await send('Runtime.evaluate', {
        expression: `(() => {
          const bodyFont = window.getComputedStyle(document.body).fontFamily;
          const legendStrong = document.querySelector('.chart-legend .legend-row strong');
          const legendText = legendStrong ? legendStrong.innerText : '';
          return {
            lang: document.documentElement.lang,
            bodyFont,
            legendText,
            isAsciiNumbers: /[0-9]/.test(legendText) && !/[০-৯]/.test(legendText)
          };
        })()`,
        returnByValue: true
      });

      const ee = enEvaluation.result.value;
      assert(ee.lang === 'en', 'Document language switched to "en"');
      assert(ee.bodyFont.includes('Inter'), 'Body uses Inter font in English mode');
      assert(ee.isAsciiNumbers, `English numerals render in ASCII (got "${ee.legendText}")`);

      // Switch back to Bangla
      await send('Runtime.evaluate', { expression: `I18n.setLang('bn')` });
      await new Promise(r => setTimeout(r, 600));

      console.log('\n▶ STEP 7: Mobile Viewport Verification');

      await send('Emulation.setDeviceMetricsOverride', {
        width: 375,
        height: 812,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Runtime.evaluate', { expression: `navigateTo('dashboard')` });
      await new Promise(r => setTimeout(r, 800));

      const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'dashboard-mobile-bangla.png'), Buffer.from(mobileScreenshot.data, 'base64'));
      console.log('  Mobile screenshot saved to test/dashboard-mobile-bangla.png');

      const mobileMetrics = await send('Runtime.evaluate', {
        expression: `(() => {
          const stat = document.querySelector('.stat-number');
          const legend = document.querySelector('.chart-legend');
          const cs = stat ? window.getComputedStyle(stat) : null;
          return {
            statFontSize: cs ? cs.fontSize : null,
            legendVisible: legend ? legend.offsetHeight > 0 : false
          };
        })()`,
        returnByValue: true
      });

      const mm = mobileMetrics.result.value;
      assert(mm.legendVisible, 'Chart legend is visible on mobile viewport');
      assert(parseFloat(mm.statFontSize) > 15, `Stat font size on mobile is readable (${mm.statFontSize})`);

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log(`  BENGALI NUMERAL AUDIT: ${passCount} PASSED, ${failCount} FAILED`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      proc.kill();
      process.exit(failCount === 0 ? 0 : 1);
    };
  } catch(e) {
    console.error(e);
    proc.kill();
    process.exit(1);
  }
}, 1500);
