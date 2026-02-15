/**
 * Icon Generation Script
 * Generates PWA icons from a source image
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Note: This script requires sharp package
 * Install: npm install --save-dev sharp
 * 
 * Or use an online tool like:
 * - https://realfavicongenerator.net/
 * - https://www.pwabuilder.com/imageGenerator
 */

const fs = require("fs");
const path = require("path");

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon as placeholder
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">AQI</text>
</svg>`;
};

// Generate placeholder icons
console.log("Generating placeholder icons...");
iconSizes.forEach((size) => {
  const svg = createSVGIcon(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Created: icon-${size}x${size}.svg`);
});

console.log("\n✅ Placeholder icons generated!");
console.log("⚠️  Note: Replace these with your actual app icons");
console.log("   You can use tools like:");
console.log("   - https://realfavicongenerator.net/");
console.log("   - https://www.pwabuilder.com/imageGenerator");
