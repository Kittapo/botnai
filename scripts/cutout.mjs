#!/usr/bin/env node
/**
 * scripts/cutout.mjs
 *
 * One-time image preparation script (Spec B3):
 * - Reads ./_inbox/durex-kingtex.jpg and ./_inbox/durex-comfort.jpg
 * - Removes the studio white background strictly via edge-seeded flood fill
 *   with a conservative tolerance so interior white logos and text remain 100% intact.
 * - Softens 1px boundary fringes and writes:
 *     public/products/durex-kingtex.jpg
 *     public/products/durex-kingtex-cutout.webp
 *     public/products/durex-comfort.jpg
 *     public/products/durex-comfort-cutout.webp
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const INBOX_DIR = path.join(ROOT, "_inbox");
const OUT_DIR = path.join(ROOT, "public", "products");

const TARGETS = [
  { slug: "durex-kingtex", baseName: "durex-kingtex" },
  { slug: "durex-comfort", baseName: "durex-comfort" },
  { slug: "durex-kingtex-back", baseName: "durex-kingtex-back" },
  { slug: "durex-comfort-back", baseName: "durex-comfort-back" },
];

async function findInputFile(baseName) {
  const candidates = [
    `${baseName}.jpg`,
    `${baseName}.jpeg`,
    `${baseName}.png`,
    `${baseName}.webp`,
  ];
  for (const name of candidates) {
    const full = path.join(INBOX_DIR, name);
    try {
      await fs.access(full);
      return full;
    } catch {
      // continue checking
    }
  }
  return null;
}

function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function estimateCornerBackground(data, width, height) {
  const sampleOffsets = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.min(4, width - 1), Math.min(4, height - 1)],
    [Math.max(0, width - 5), Math.min(4, height - 1)],
  ];

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  for (const [x, y] of sampleOffsets) {
    const idx = (y * width + x) * 4;
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
  }
  const n = sampleOffsets.length;
  return [rSum / n, gSum / n, bSum / n];
}

async function processProductImage(sharp, inputPath, slug) {
  const jpgOut = path.join(OUT_DIR, `${slug}.jpg`);
  const webpOut = path.join(OUT_DIR, `${slug}-cutout.webp`);

  // Save clean normalized JPEG original without altering logos
  await sharp(inputPath)
    .rotate()
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(jpgOut);

  const { data, info } = await sharp(inputPath)
    .rotate()
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);
  const bgMask = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const [bgR, bgG, bgB] = estimateCornerBackground(data, width, height);

  // Conservative thresholds: prevents crossing box borders into white Durex logo
  const GLOBAL_TOLERANCE = 32;
  const STEP_TOLERANCE = 15;
  const MIN_BRIGHTNESS = 214;

  const trySeed = (x, y) => {
    const p = y * width + x;
    if (visited[p]) return;
    const idx = p * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (
      a < 16 ||
      (Math.min(r, g, b) >= MIN_BRIGHTNESS &&
        colorDist(r, g, b, bgR, bgG, bgB) <= GLOBAL_TOLERANCE)
    ) {
      visited[p] = 1;
      bgMask[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = (curr - cx) / width;
    const cIdx = curr * 4;
    const cr = data[cIdx];
    const cg = data[cIdx + 1];
    const cb = data[cIdx + 2];

    for (const [dx, dy] of neighbors) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const np = ny * width + nx;
      if (visited[np]) continue;

      const nIdx = np * 4;
      const nr = data[nIdx];
      const ng = data[nIdx + 1];
      const nb = data[nIdx + 2];
      const na = data[nIdx + 3];

      const isTransparent = na < 16;
      const withinGlobal =
        Math.min(nr, ng, nb) >= MIN_BRIGHTNESS &&
        colorDist(nr, ng, nb, bgR, bgG, bgB) <= GLOBAL_TOLERANCE;
      const withinStep = colorDist(nr, ng, nb, cr, cg, cb) <= STEP_TOLERANCE;

      if (isTransparent || (withinGlobal && withinStep)) {
        visited[np] = 1;
        bgMask[np] = 1;
        queue[tail++] = np;
      }
    }
  }

  // Connected component filtering: keeps the main product box and discards
  // small disconnected watermark islands (e.g. corner seller text / numbers)
  const fgVisited = new Uint8Array(totalPixels);
  const components = [];
  const compQueue = new Int32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    if (bgMask[i] === 0 && fgVisited[i] === 0) {
      let compHead = 0;
      let compTail = 0;
      compQueue[compTail++] = i;
      fgVisited[i] = 1;
      const compPixels = [i];

      while (compHead < compTail) {
        const curr = compQueue[compHead++];
        const cx = curr % width;
        const cy = (curr - cx) / width;

        for (const [dx, dy] of neighbors) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const np = ny * width + nx;
          if (bgMask[np] === 0 && fgVisited[np] === 0) {
            fgVisited[np] = 1;
            compQueue[compTail++] = np;
            compPixels.push(np);
          }
        }
      }

      components.push(compPixels);
    }
  }

  if (components.length > 1) {
    components.sort((a, b) => b.length - a.length);
    const mainBoxSize = components[0].length;
    for (let c = 1; c < components.length; c++) {
      if (components[c].length < mainBoxSize * 0.1) {
        for (const p of components[c]) {
          bgMask[p] = 1;
        }
      }
    }
  }

  // Apply alpha mask and feather 1px edge transitions to avoid white halo fringes
  const out = Buffer.from(data);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const idx = p * 4;

      if (bgMask[p] === 1) {
        out[idx + 3] = 0;
        continue;
      }

      // Count background neighbors in 8-neighborhood for smooth anti-aliased edge
      let bgNeighbors = 0;
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (ox === 0 && oy === 0) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            bgNeighbors++;
          } else if (bgMask[ny * width + nx] === 1) {
            bgNeighbors++;
          }
        }
      }

      if (bgNeighbors > 0) {
        const distFromBg = colorDist(
          out[idx],
          out[idx + 1],
          out[idx + 2],
          bgR,
          bgG,
          bgB
        );
        // Soften pixels that blend into the white background right on the silhouette
        const edgeFactor = Math.min(1, Math.max(0.18, distFromBg / 55));
        const neighborFactor = 1 - (bgNeighbors / 8) * 0.45;
        out[idx + 3] = Math.round(out[idx + 3] * Math.min(1, edgeFactor * neighborFactor + 0.25));
      }

      if (out[idx + 3] > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Crop tightly with consistent breathing room so the product sits centered on the 3D billboard
  const pad = Math.round(Math.max(width, height) * 0.04);
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, maxX - minX + 1 + pad * 2);
  const cropHeight = Math.min(height - cropTop, maxY - minY + 1 + pad * 2);

  let pipeline = sharp(out, {
    raw: { width, height, channels: 4 },
  });

  if (maxX > minX && maxY > minY && cropWidth > 10 && cropHeight > 10) {
    pipeline = pipeline.extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    });
  }

  await pipeline
    .webp({ quality: 92, alphaQuality: 96, effort: 5 })
    .toFile(webpOut);

  console.log(`[cutout] Generated ${path.relative(ROOT, jpgOut)} and ${path.relative(ROOT, webpOut)}`);
}

async function main() {
  const allowMissing = process.argv.includes("--allow-missing");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const found = [];
  const missing = [];

  for (const target of TARGETS) {
    const file = await findInputFile(target.baseName);
    if (file) {
      found.push({ ...target, file });
    } else {
      missing.push(`${target.baseName}.jpg`);
    }
  }

  if (found.length === 0) {
    const msg = `[cutout] Waiting for product photos in ./_inbox/: ${missing.join(", ")}`;
    if (allowMissing) {
      console.warn(msg);
      return;
    }
    console.error(msg);
    process.exitCode = 1;
    return;
  }

  const sharpMod = await import("sharp");
  const sharp = sharpMod.default ?? sharpMod;

  for (const item of found) {
    await processProductImage(sharp, item.file, item.slug);
  }

  if (missing.length > 0) {
    console.warn(`[cutout] Still missing in ./_inbox/: ${missing.join(", ")}`);
    if (!allowMissing) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[cutout] Error:", err);
  process.exitCode = 1;
});
