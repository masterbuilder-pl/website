#!/usr/bin/env node
// Generates .thumb.webp (400px) and .web.webp (1200px) alongside each source image.
// Skips files that already have both derivatives. Safe to re-run at any time.

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const PUBLIC = new URL('../public', import.meta.url).pathname;
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.jfif']);
const SKIP_DIRS = new Set(['flags']);
const SKIP_FILES = new Set(['favicon.png', 'logo.png', 'logo-tiny.png', 'masterbuilder-gold.png', 'masterbuilder-gold-round.png']);

const SIZES = [
  { suffix: '.thumb.webp', width: 400, height: 400, fit: 'cover' },
  { suffix: '.web.webp',   width: 1200,              fit: 'inside' },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full);
    } else {
      yield full;
    }
  }
}

function derivativePath(src, suffix) {
  const base = basename(src, extname(src));
  return join(dirname(src), base + suffix);
}

function isDerivative(file) {
  return SIZES.some(s => file.endsWith(s.suffix));
}

let processed = 0, skipped = 0, errors = 0;

for await (const file of walk(PUBLIC)) {
  const ext = extname(file).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) continue;
  if (SKIP_FILES.has(basename(file))) continue;
  if (isDerivative(file)) continue;

  const missing = [];
  for (const size of SIZES) {
    const dest = derivativePath(file, size.suffix);
    try { await stat(dest); } catch { missing.push({ dest, width: size.width, height: size.height, fit: size.fit }); }
  }

  if (missing.length === 0) { skipped++; continue; }

  for (const { dest, width, height, fit } of missing) {
    try {
      await sharp(file)
        .resize({ width, height, fit, withoutEnlargement: true, position: 'centre' })
        .webp({ quality: 82 })
        .toFile(dest);
      console.log(`  ✓ ${dest.replace(PUBLIC + '/', '')}`);
      processed++;
    } catch (err) {
      console.error(`  ✗ ${file.replace(PUBLIC + '/', '')}: ${err.message}`);
      errors++;
    }
  }
}

console.log(`\nDone: ${processed} generated, ${skipped} already up to date, ${errors} errors`);
if (errors > 0) process.exit(1);
