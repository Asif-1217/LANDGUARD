const fs = require('fs');

const js = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

function findHandlers(content, filename) {
  const regex = /on\w+\s*=\s*(["'])(.*?)\1/gi;
  let m;
  console.log('=== Handlers in ' + filename + ' ===');
  while ((m = regex.exec(content)) !== null) {
    console.log(m[0]);
  }
}

findHandlers(html, 'index.html');
findHandlers(js, 'js/app.js');
