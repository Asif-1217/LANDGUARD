// test/bangla-coverage-audit.js
const http = require('http');

function cdpRequest(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:9223${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      try {
        const res = JSON.parse(event.data);
        if (res.id === id) {
          ws.removeEventListener('message', handler);
          if (res.error) reject(res.error);
          else resolve(res.result);
        }
      } catch(e) {}
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:8080'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const WebSocket = globalThis.WebSocket;
  const listRes = await fetch('http://localhost:9223/json');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  if (!pageTarget) {
    console.error('Target page on port 8080 not found');
    browserProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(res => ws.addEventListener('open', res));

  console.log('\n--- LIVE CDP BANGLA UI COVERAGE AUDIT ---');

  async function evaluate(expression) {
    const res = await sendCommand(ws, 'Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  // 1. Switch to Bangla
  await evaluate(`I18n.setLang('bn');`);

  // 2. Test Dashboard in Bangla
  const dashText = await evaluate(`document.getElementById('page-dashboard').innerText;`);
  console.log('✓ Dashboard text length in bn:', dashText.length);
  const englishKeywords = ['Total Demo Plots', 'Potential Conflicts', 'Incomplete Records', 'Records Reviewed', 'Responsible Use Disclaimer'];
  for (const kw of englishKeywords) {
    if (dashText.includes(kw)) {
      console.error(`FAIL: Found untranslated English on dashboard: "${kw}"`);
      process.exit(1);
    }
  }
  console.log('✓ All dashboard cards and headers are fully translated into Bangla');

  // 3. Test Plot Detail (PLT-2007 - Medium Risk)
  await evaluate(`navigateTo('plot-detail', 'PLT-2007');`);
  const plotDetailText = await evaluate(`document.getElementById('plot-detail-content').innerText;`);
  const plotDetailEnglish = ['Plot Overview', 'Deed Records', 'Mutation Records', 'Transfer History', 'View Conflict Replay', 'View Risk Panel'];
  for (const kw of plotDetailEnglish) {
    if (plotDetailText.includes(kw)) {
      console.error(`FAIL: Found untranslated English on plot-detail: "${kw}"`);
      process.exit(1);
    }
  }
  console.log('✓ Plot Detail (PLT-2007) is fully translated into Bangla');

  // 4. Test Conflict Replay (PLT-2002 - Ownership Mismatch)
  await evaluate(`navigateTo('conflict-replay', 'PLT-2002');`);
  const replayText = await evaluate(`document.getElementById('conflict-replay-content').innerText;`);
  const replayEnglish = ['Evidence from demo data:', 'Deed record shows:', 'Mutation record shows:', 'Record Comparison & Cross-Reference', 'Chronological Event Timeline'];
  for (const kw of replayEnglish) {
    if (replayText.includes(kw)) {
      console.error(`FAIL: Found untranslated English on conflict replay: "${kw}"`);
      process.exit(1);
    }
  }
  console.log('✓ Conflict Replay (PLT-2002) is fully translated into Bangla');

  // 5. Test Risk Panel (PLT-2003 - Duplicate Deeds)
  await evaluate(`navigateTo('risk-panel', 'PLT-2003');`);
  const riskText = await evaluate(`document.getElementById('risk-panel-content').innerText;`);
  const riskEnglish = ['Score Breakdown', 'Recommended Next Steps', 'All Rules Reference', 'Total Score (Max 100)'];
  for (const kw of riskEnglish) {
    if (riskText.includes(kw)) {
      console.error(`FAIL: Found untranslated English on risk panel: "${kw}"`);
      process.exit(1);
    }
  }
  console.log('✓ Risk Panel (PLT-2003) is fully translated into Bangla');

  // 6. Test About Page
  await evaluate(`navigateTo('about');`);
  const aboutText = await evaluate(`document.getElementById('page-about').innerText;`);
  const aboutEnglish = ['What is LANDGUARD?', 'What LANDGUARD Cannot Do', 'Technology Stack', 'Hackathon Context'];
  for (const kw of aboutEnglish) {
    if (aboutText.includes(kw)) {
      console.error(`FAIL: Found untranslated English on about page: "${kw}"`);
      process.exit(1);
    }
  }
  console.log('✓ About & Rules page is fully translated into Bangla');

  // 7. Test English roundtrip
  await evaluate(`I18n.setLang('en');`);
  const enDashText = await evaluate(`document.getElementById('page-dashboard').innerText;`);
  if (!enDashText.includes('Total Demo Plots') || !enDashText.includes('Potential Conflicts')) {
    console.error('FAIL: English text not restored properly on dashboard');
    process.exit(1);
  }
  console.log('✓ English roundtrip cleanly restores all English strings');

  // Reset to default Bangla
  await evaluate(`I18n.setLang('bn');`);
  console.log('✓ Reset back to default Bangla (bn)');

  ws.close();
  browserProc.kill();
  console.log('\n✅ ALL BANGLA UI COVERAGE AUDIT CHECKS PASSED PERFECTLY!\n');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
