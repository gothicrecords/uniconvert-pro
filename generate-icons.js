/* generate-icons.js
   Run with: node generate-icons.js
   Generates placeholder SVG icons (replace with real ones before deploying)
   Requires: npm install canvas (or use a real icon tool like https://realfavicongenerator.net)
*/

// For quick deployment, copy this SVG and convert manually:
// https://realfavicongenerator.net or https://pwa-asset-generator

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#0a0a1a"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="#6366f1" font-family="Arial">⚡</text>
  <text x="256" y="440" font-size="68" text-anchor="middle" fill="#a78bfa" font-family="Arial" font-weight="bold">UC</text>
</svg>`;

const fs = require('fs');
fs.writeFileSync('icons/icon.svg', svgIcon);
console.log('SVG icon written to icons/icon.svg');
console.log('Use https://realfavicongenerator.net to generate all PNG sizes.');
console.log('Or use: npx pwa-asset-generator icons/icon.svg icons/ --index index.html');
