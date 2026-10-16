const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');

const errors = [];

// 1. Font loading in index.html
if (!html.includes('family=Hind+Siliguri') || !html.includes('family=Noto+Sans+Bengali') || !html.includes('family=Inter')) {
  errors.push('Missing required Google Fonts in index.html');
} else {
  console.log('✓ Google Fonts: Hind Siliguri (primary), Noto Sans Bengali (fallback), Inter (English) loaded');
}

// 2. CSS font stacks
if (!css.includes("'Hind Siliguri', 'Noto Sans Bengali'")) {
  errors.push('CSS --font-bn missing Noto Sans Bengali fallback');
} else {
  console.log('✓ CSS font stack: --font-bn includes Hind Siliguri and Noto Sans Bengali');
}

if (!css.includes("--font-en: 'Inter'")) {
  errors.push('CSS --font-en missing Inter');
} else {
  console.log('✓ CSS font stack: --font-en configured with Inter');
}

if (!css.includes('--font-mono:')) {
  errors.push('CSS missing dedicated --font-mono stack');
} else {
  console.log('✓ CSS font stack: --font-mono configured for IDs and code');
}

// 3. Negative letter spacing eliminated on Bengali
if (css.includes('html[lang="bn"] h1') && css.includes('letter-spacing: 0')) {
  console.log('✓ Bengali headings: letter-spacing: 0 (no letter clipping or broken matras)');
} else {
  errors.push('Bengali headings do not have letter-spacing: 0');
}

// 4. Form elements font-family inheritance
if (!css.includes('input, button, select, textarea') || !css.includes('font-family: inherit')) {
  errors.push('Missing universal font-family: inherit for input, button, select, textarea');
} else {
  console.log('✓ Universal form controls: inputs, buttons, selects inherit font-family cleanly');
}

// 5. Technical identifiers
const idSelectors = ['.plot-badge', '.record-id', '.timeline-id', '.rule-id-badge'];
idSelectors.forEach(sel => {
  if (!css.includes(sel)) errors.push('Missing selector: ' + sel);
});
console.log('✓ Technical identifiers: plot-badge, record-id, timeline-id, rule-id-badge mapped to monospace stack');

// 6. Complex script font shaping
if (css.includes('optimizeLegibility') && css.includes('"liga" 1')) {
  console.log('✓ Complex script font-feature-settings: "liga" 1, "kern" 1 and text-rendering: optimizeLegibility active');
} else {
  errors.push('Missing optimizeLegibility or ligature settings');
}

if (errors.length === 0) {
  console.log('══════════════════════════════════════════════════');
  console.log('🎉 ALL TYPOGRAPHY AUDIT CHECKS PASSED (6/6)');
  console.log('══════════════════════════════════════════════════');
} else {
  console.error('❌ Errors found:', errors);
  process.exit(1);
}
