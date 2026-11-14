import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, "../public/images");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const notes = [
  {
    filename: "dummy-catatan-01.jpg",
    title: "Meja 4 - Pesanan 1",
    lines: [
      "- MA 2 (1 tnp sawi)",
      "- bks tmbh 1",
      "- Es Teh 2 (sdg)",
      "- kerupuk kaleng putih 2",
    ],
    blur: false,
  },
  {
    filename: "dummy-catatan-02.jpg",
    title: "Takeaway Pak Anton",
    lines: [
      "- MAP 3 (pgr pisah)",
      "- PGR 1 porsi",
      "- Teh Hangat 3",
    ],
    blur: false,
  },
  {
    filename: "dummy-catatan-03.jpg",
    title: "Catatan Buram (Tes Gagal)",
    lines: [
      "- ??? ??? 2",
      "- mie ... 1",
      "- es ... 2",
    ],
    blur: true,
  },
];

async function createNoteImage(note) {
  const width = 800;
  const height = 1000;

  // Render SVG lined paper with handwritten-style cursive text
  const svgTextLines = note.lines
    .map(
      (line, i) =>
        `<text x="100" y="${280 + i * 80}" font-family="'Comic Sans MS', cursive, sans-serif" font-size="34" font-weight="bold" fill="#1C1917" transform="rotate(${
          (i % 2 === 0 ? -0.8 : 0.6)
        }, 100, ${280 + i * 80})">${line}</text>`
    )
    .join("\n");

  const linedRules = Array.from({ length: 10 })
    .map((_, i) => `<line x1="60" y1="${290 + i * 80}" x2="740" y2="${290 + i * 80}" stroke="#CBD5E1" stroke-width="1.5" />`)
    .join("\n");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0.98  0 1 0 0 0.96  0 0 1 0 0.92  0 0 0 1 0" />
        </filter>
      </defs>
      <!-- Background Paper -->
      <rect width="100%" height="100%" fill="#FDFBF7" />
      <rect width="100%" height="100%" fill="#000" opacity="0.02" />

      <!-- Red vertical margin line -->
      <line x1="85" y1="50" x2="85" y2="950" stroke="#EF4444" stroke-width="2" opacity="0.6" />

      <!-- Horizontal lined rules -->
      ${linedRules}

      <!-- Header Title -->
      <text x="100" y="140" font-family="'Comic Sans MS', cursive, sans-serif" font-size="28" fill="#64748B" font-style="italic">${note.title}</text>
      <text x="600" y="140" font-family="sans-serif" font-size="20" fill="#94A3B8">14/11/2026</text>

      <!-- Handwritten order lines -->
      ${svgTextLines}
    </svg>
  `;

  let pipeline = sharp(Buffer.from(svg));

  if (note.blur) {
    // Foto buram untuk simulasi gagal
    pipeline = pipeline.blur(9).modulate({ brightness: 0.7, saturation: 0.5 });
  }

  const outPath = path.join(outDir, note.filename);
  await pipeline.jpeg({ quality: 85 }).toFile(outPath);
  console.log(`Generated: ${outPath}`);
}

async function run() {
  for (const n of notes) {
    await createNoteImage(n);
  }
}

run().catch(console.error);
