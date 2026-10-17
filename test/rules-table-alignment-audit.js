/**
 * LANDGUARD — About & Rules Table Alignment Automated Audit
 *
 * Verifies:
 * 1. Rule ID column: All Rule IDs (RULE-01 to RULE-07) remain strictly on a single line (no wrapping at hyphen).
 * 2. Points column: All point values align consistently in the same column (centered matching header).
 * 3. Table layout: Fixed layout with consistent column widths in both Bangla and English modes.
 */

const { spawn } = require('child_process');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║       ALL RULES REFERENCE TABLE ALIGNMENT AUDIT               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failed++;
  }
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserProc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--disable-gpu',
  '--window-size=1280,900',
  'http://localhost:8080'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9226/json');
    const targets = await listRes.json();
    const target = targets.find(t => t.type === 'page' && t.url.includes('localhost:8080'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

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
      return new Promise((resolve) => {
        const curId = id++;
        pendingCalls.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');

      // Wait for page load
      await new Promise(r => setTimeout(r, 1200));

      // Navigate to about page
      await send('Runtime.evaluate', {
        expression: 'navigateTo("about"); renderAboutRules();'
      });
      await new Promise(r => setTimeout(r, 500));

      // Audit Bangla Mode
      console.log('▶ STEP 1: Bangla Mode Table Layout & Alignment');
      const evalBn = await send('Runtime.evaluate', {
        expression: `(() => {
          const table = document.querySelector('#page-about .score-table');
          const ths = Array.from(table.querySelectorAll('th')).map(th => ({
            text: th.innerText.trim(),
            width: Math.round(th.getBoundingClientRect().width),
            textAlign: window.getComputedStyle(th).textAlign
          }));
          const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
            const tds = Array.from(tr.querySelectorAll('td'));
            const idBadge = tds[0].querySelector('.rule-id-badge');
            const pointsCell = tds[3];
            return {
              ruleId: idBadge ? idBadge.innerText.trim() : '',
              badgeHeight: idBadge ? Math.round(idBadge.getBoundingClientRect().height) : 0,
              pointsText: pointsCell ? pointsCell.innerText.trim() : '',
              pointsTextAlign: pointsCell ? window.getComputedStyle(pointsCell).textAlign : '',
              pointsWidth: pointsCell ? Math.round(pointsCell.getBoundingClientRect().width) : 0,
              pointsX: pointsCell ? Math.round(pointsCell.getBoundingClientRect().x) : 0
            };
          });
          return { ths, rows };
        })()`,
        returnByValue: true
      });

      const bn = evalBn.result.value;
      assert(bn.ths[0].width === 110, `Rule ID column width is fixed at 110px (got ${bn.ths[0].width}px)`);
      assert(bn.ths[2].textAlign === 'center', 'Severity header is text-align: center');
      assert(bn.ths[3].textAlign === 'center', 'Points header is text-align: center');
      assert(bn.ths[3].width === 160, `Points column width is fixed at 160px (got ${bn.ths[3].width}px)`);

      bn.rows.forEach(r => {
        assert(r.badgeHeight > 0 && r.badgeHeight <= 26, `${r.ruleId} badge is on a single line (height: ${r.badgeHeight}px)`);
        assert(r.pointsTextAlign === 'center', `${r.ruleId} points "${r.pointsText}" is centered in column`);
        assert(r.pointsWidth === 160, `${r.ruleId} points cell width matches 160px column width`);
      });

      // Audit English Mode
      console.log('\n▶ STEP 2: English Mode Table Layout & Alignment');
      await send('Runtime.evaluate', {
        expression: 'I18n.setLang("en"); renderAboutRules();'
      });
      await new Promise(r => setTimeout(r, 400));

      const evalEn = await send('Runtime.evaluate', {
        expression: `(() => {
          const table = document.querySelector('#page-about .score-table');
          const ths = Array.from(table.querySelectorAll('th')).map(th => ({
            text: th.innerText.trim(),
            width: Math.round(th.getBoundingClientRect().width),
            textAlign: window.getComputedStyle(th).textAlign
          }));
          const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) => {
            const tds = Array.from(tr.querySelectorAll('td'));
            const idBadge = tds[0].querySelector('.rule-id-badge');
            const pointsCell = tds[3];
            return {
              ruleId: idBadge ? idBadge.innerText.trim() : '',
              badgeHeight: idBadge ? Math.round(idBadge.getBoundingClientRect().height) : 0,
              pointsText: pointsCell ? pointsCell.innerText.trim() : '',
              pointsTextAlign: pointsCell ? window.getComputedStyle(pointsCell).textAlign : '',
              pointsWidth: pointsCell ? Math.round(pointsCell.getBoundingClientRect().width) : 0
            };
          });
          return { ths, rows };
        })()`,
        returnByValue: true
      });

      const en = evalEn.result.value;
      assert(en.ths[0].width === 110, `English Rule ID column width is fixed at 110px (got ${en.ths[0].width}px)`);
      assert(en.ths[3].textAlign === 'center', 'English Points header is text-align: center');

      en.rows.forEach(r => {
        assert(r.badgeHeight > 0 && r.badgeHeight <= 26, `English ${r.ruleId} badge is on a single line (height: ${r.badgeHeight}px)`);
        assert(r.pointsTextAlign === 'center', `English ${r.ruleId} points "${r.pointsText}" is centered in column`);
      });

      // Reset back to bn
      await send('Runtime.evaluate', {
        expression: 'I18n.setLang("bn"); renderAboutRules();'
      });

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log(`  AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      browserProc.kill();
      process.exit(failed > 0 ? 1 : 0);
    };
  } catch (err) {
    console.error('Audit Error:', err);
    browserProc.kill();
    process.exit(1);
  }
}, 1500);
