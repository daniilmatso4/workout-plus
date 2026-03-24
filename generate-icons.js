const { createCanvas } = (() => { try { return require('canvas'); } catch { return { createCanvas: null }; } })();
// Simple fallback: create a minimal valid PNG using pure Node.js
const fs = require('fs');

function createMinimalPNG(size) {
  // Create SVG and note it for now - use a placeholder approach
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#6366f1"/>
    <text x="50%" y="52%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="${size * 0.35}">W+</text>
  </svg>`;
  return svg;
}

// Write SVG icons that work as apple-touch-icon fallbacks
fs.writeFileSync('public/icon-192.svg', createMinimalPNG(192));
fs.writeFileSync('public/icon-512.svg', createMinimalPNG(512));

// Create a favicon
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#6366f1"/>
  <text x="50%" y="52%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="12">W+</text>
</svg>`;
fs.writeFileSync('public/favicon.svg', favicon);

console.log('Icons created');
