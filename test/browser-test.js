const { spawn } = require('child_process');
const http = require('http');

// Simple script to test http server response and run headless edge to check for console errors
console.log('Testing server availability on http://localhost:8080 ...');

http.get('http://localhost:8080', (res) => {
  console.log('Server HTTP status:', res.statusCode);
  if (res.statusCode !== 200) {
    console.error('Server returned non-200 status');
    process.exit(1);
  }
  runHeadlessEdge();
}).on('error', (err) => {
  console.error('Server connection error:', err.message);
  process.exit(1);
});

function runHeadlessEdge() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const args = [
    '--headless',
    '--disable-gpu',
    '--dump-dom',
    'http://localhost:8080'
  ];

  console.log('Running headless Edge to verify page rendering...');
  const child = spawn(edgePath, args);

  let output = '';
  let errOutput = '';

  child.stdout.on('data', (d) => { output += d.toString(); });
  child.stderr.on('data', (d) => { errOutput += d.toString(); });

  child.on('close', (code) => {
    console.log('Headless Edge exited with code:', code);
    if (output.includes('LANDGUARD') && output.includes('stat-total') && output.includes('PLT-2001')) {
      console.log('✅ DOM contains rendered LANDGUARD content and demo plots!');
      console.log('Dashboard rendered successfully.');
    } else {
      console.error('❌ Rendered output does not contain expected tokens.');
      console.log('Output preview:', output.substring(0, 500));
    }
  });
}
