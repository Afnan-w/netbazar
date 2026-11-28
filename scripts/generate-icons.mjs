import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = await readFile(new URL("../app/icon.svg", import.meta.url));
const outputDir = new URL("../public/icons/", import.meta.url);

await mkdir(outputDir, { recursive: true });

for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await sharp(source, { density: 512 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(name, outputDir)));
  console.log(`wrote ${name}`);
}
