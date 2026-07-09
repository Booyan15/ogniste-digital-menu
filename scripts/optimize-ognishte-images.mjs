import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ognishteImageInventory } from '../src/data/ognishteImageInventory.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = path.join(projectRoot, 'public/menu-images/ognishte');
const selectedImages = ognishteImageInventory.filter((image) => image.shouldUse);

await mkdir(outputDirectory, { recursive: true });

for (const image of selectedImages) {
  if (!image.optimizedPath) {
    throw new Error(`Selected image is missing optimizedPath: ${image.originalPath}`);
  }

  const sourcePath = path.join(projectRoot, image.originalPath);
  const outputPath = path.join(outputDirectory, path.basename(image.optimizedPath));

  await sharp(sourcePath)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(outputPath);
}

console.log(`Optimized ${selectedImages.length} images to ${outputDirectory}`);
