import sharp from "sharp";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";

const IMAGE_DIR = "public/images";
const MAX_DIMENSION = 960;
const WEBP_QUALITY = 82;

const files = (await readdir(IMAGE_DIR)).filter((file) =>
  /\.(jpe?g|png)$/i.test(file),
);

for (const file of files) {
  const input = path.join(IMAGE_DIR, file);
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const output = path.join(IMAGE_DIR, `${base}.webp`);
  const info = await sharp(input)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(output);

  await unlink(input);
  console.log(
    `${file} -> ${base}.webp (${info.width}x${info.height}, ${info.size} bytes)`,
  );
}
