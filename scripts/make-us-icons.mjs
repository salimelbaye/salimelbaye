/**
 * Generates the home-screen icons for /us.
 *
 * iOS will not use an SVG for an apple-touch-icon, so the PNGs are rasterised
 * here with a tiny encoder (zlib is built into Node) rather than pulling in an
 * image library the app would otherwise never need.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

const BG = [0x0a, 0x09, 0x0b];
const ROSE = [0xd0, 0x8c, 0x86];

/* ----------------------------------- PNG ---------------------------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  // 10–12: compression, filter, interlace — all 0.

  // One filter byte (0 = None) per scanline.
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const src = y * width * 4;
    const dst = y * (width * 4 + 1);
    raw[dst] = 0;
    rgba.copy(raw, dst + 1, src, src + width * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------------------------------- shape --------------------------------- */

/**
 * Classic implicit heart: (x² + y² − 1)³ − x²y³ ≤ 0, in a unit-ish space.
 * Sampled 4×4 per pixel so the curve reads as a smooth edge, not stairs.
 */
function insideHeart(x, y) {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function render(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const SS = 4;
  // The glyph occupies ~56% of the canvas: small enough to breathe, and
  // inside the safe zone a maskable icon gets cropped to. Nudged down so the
  // lobes and the point read as optically centred.
  const scale = size * 0.207;
  const cx = size / 2;
  const cy = size * 0.465;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS - cx) / scale;
          const y = -(py + (sy + 0.5) / SS - cy) / scale;
          if (insideHeart(x, y)) hits++;
        }
      }
      const alpha = hits / (SS * SS);
      const i = (py * size + px) * 4;
      for (let c = 0; c < 3; c++) {
        rgba[i + c] = Math.round(BG[c] * (1 - alpha) + ROSE[c] * alpha);
      }
      rgba[i + 3] = 255; // opaque: iOS masks the corners itself
    }
  }
  return rgba;
}

for (const size of [180, 192, 512]) {
  const name = size === 180 ? 'apple-icon.png' : `icon-${size}.png`;
  const png = encodePng(size, size, render(size));
  writeFileSync(join(OUT, name), png);
  console.log(`${name}  ${size}×${size}  ${(png.length / 1024).toFixed(1)} kB`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Hajar and Salim">
  <rect width="100" height="100" fill="#0A090B"/>
  <path fill="#D08C86" d="M50 78C50 78 18 58.4 18 37.6 18 26.8 26.4 19 36.2 19c5.8 0 11 2.9 13.8 7.4C52.8 21.9 58 19 63.8 19 73.6 19 82 26.8 82 37.6 82 58.4 50 78 50 78Z"/>
</svg>
`;
writeFileSync(join(OUT, 'icon.svg'), svg);
console.log('icon.svg');
