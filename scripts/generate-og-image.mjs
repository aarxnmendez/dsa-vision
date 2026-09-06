import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = "public/og-image.png";
const LOGO = "public/favicon-icon.png";

const backgroundSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#004396" />
      <stop offset="40%" stop-color="#0057bf" />
      <stop offset="72%" stop-color="#026fef" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="18%" r="50%">
      <stop offset="0%" stop-color="#c4b5fd" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="12%" cy="88%" r="45%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#60a5fa" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)" />
  <g opacity="0.14" stroke="#ffffff" stroke-width="2.5" fill="#ffffff">
    <circle cx="930" cy="470" r="10" />
    <circle cx="1040" cy="360" r="10" />
    <circle cx="880" cy="300" r="10" />
    <circle cx="1110" cy="520" r="10" />
    <line x1="930" y1="470" x2="1040" y2="360" />
    <line x1="1040" y1="360" x2="880" y2="300" />
    <line x1="930" y1="470" x2="1110" y2="520" />
  </g>
  <text x="340" y="255" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="700" fill="#ffffff">DSAVision</text>
  <text x="340" y="325" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="600" fill="#d8e2ff">Interactive Algorithm Visualizer</text>
  <text x="340" y="395" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#aec6ff">Master Data Structures &amp; Algorithms with step-by-step visualizers</text>
</svg>`;

const logo = await sharp(LOGO)
  .resize(220, 220, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer();

await sharp(Buffer.from(backgroundSvg))
  .composite([{ input: logo, left: 60, top: 205 }])
  .png({ compressionLevel: 6, palette: false })
  .toFile(OUTPUT);

const meta = await sharp(OUTPUT).metadata();
console.log(`${OUTPUT}: ${meta.width}x${meta.height}`);
