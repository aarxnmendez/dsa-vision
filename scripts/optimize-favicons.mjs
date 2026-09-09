import sharp from "sharp";
import { stat } from "node:fs/promises";

const SOURCE = "scripts/assets/logo-512.png";
const OUTPUTS = [
  { path: "public/favicon-32.png", size: 32 },
  { path: "public/apple-touch-icon.png", size: 180 },
];

for (const { path, size } of OUTPUTS) {
  await sharp(SOURCE)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({
      compressionLevel: 9,
      palette: size <= 32,
    })
    .toFile(path);

  const info = await stat(path);
  console.log(`${path}: ${size}x${size}, ${info.size} bytes`);
}
