const fs = require('fs');

const content = fs.readFileSync('submission/demo-video-script.md', 'utf8');

const quoteLines = content.split('\n')
  .filter(l => l.trim().startsWith('>'))
  .map(l => l.replace(/^>\s*"?|"?,?\s*$/g, '').trim())
  .filter(l => l.length > 0);

const fullText = quoteLines.join(' ');
const words = fullText.split(/\s+/).filter(Boolean);

console.log('Total Spoken Lines:', quoteLines.length);
console.log('Total Spoken Words:', words.length);
console.log('Estimated speaking time at 130 wpm:', (words.length / 130).toFixed(2), 'minutes (' + Math.round((words.length / 130) * 60) + ' seconds)');
console.log('Estimated speaking time at 140 wpm:', (words.length / 140).toFixed(2), 'minutes (' + Math.round((words.length / 140) * 60) + ' seconds)');
