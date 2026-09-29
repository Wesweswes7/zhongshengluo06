import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Export the supplied cover at its original aspect ratio. No crop, retouch,
// color adjustment or upscaling is applied, and the source file is never edited.
const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = process.argv[2];
if (!source) {
  throw new Error('Usage: node scripts/prepare-cover-photo.mjs <source-image>');
}
const cover = JSON.parse(
  await fs.readFile(path.join(project, 'data/cover-photo.json'), 'utf8'),
);
const input = await fs.readFile(source);
const metadata = await sharp(input).metadata();
if (metadata.width !== cover.width || metadata.height !== cover.height) {
  throw new Error('Source dimensions do not match data/cover-photo.json.');
}
const outputBase = path.join(project, 'public', cover.image.replace(/^\//, ''));
await fs.mkdir(path.dirname(outputBase), { recursive: true });
const exported = [];
for (const width of cover.responsiveWidths) {
  if (!Number.isInteger(width) || width <= 0 || width > cover.width) {
    throw new Error(`Invalid or upscaled cover width: ${width}`);
  }
  const filename = `${outputBase}-${width}.webp`;
  const result = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(filename);
  exported.push({ filename: path.basename(filename), ...result });
}
const fallback = `${outputBase}.jpg`;
const fallbackResult = await sharp(input)
  .jpeg({ quality: 91, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(fallback);
exported.push({ filename: path.basename(fallback), ...fallbackResult });
console.log(JSON.stringify(exported, null, 2));
