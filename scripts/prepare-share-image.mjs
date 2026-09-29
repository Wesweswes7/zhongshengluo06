import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cover = JSON.parse(
  await fs.readFile(path.join(project, 'data/cover-photo.json'), 'utf8'),
);
const source = path.join(project, 'public', `${cover.image}.jpg`);
const input = await sharp(source).metadata();
if (input.width !== cover.width || input.height !== cover.height)
  throw new Error('Unexpected cover dimensions');
// A separate sharing crop preserves the head and hand. Only the laptop's lower
// edge is trimmed; the approved website image is never overwritten.
const result = await sharp(source)
  .extract({
    left: 0,
    top: 0,
    width: input.width,
    height: Math.round((input.width * 630) / 1200),
  })
  .resize(1200, 630, { withoutEnlargement: true })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(project, 'public', `${cover.image}-share.jpg`));
console.log(JSON.stringify(result));
