import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

// Brand colors
const BLUE = "#00B4FF";
const AMBER = "#FF6B00";
const VOID = "#0A0A0F";
const CARD = "#14141F";
const DEEP_CARBON = "#0F0F1A";
const BORDER_LIGHT = "#3A3A4A";
const BORDER_DARK = "#2A2A3A";
const FG = "#D4D4E0";
const MUTED = "#7A7A90";

// ─── Helper: carbon fiber checkerboard SVG pattern ──────────────────────────
function carbonFiberPattern(w, h, squareSize = 4, opacity = 0.025) {
  // Alternating squares in a checkerboard
  let rects = "";
  for (let y = 0; y < h; y += squareSize) {
    for (let x = 0; x < w; x += squareSize) {
      const isOdd = ((x / squareSize) + (y / squareSize)) % 2 === 1;
      if (isOdd) {
        rects += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="white" opacity="${opacity}"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${rects}</svg>`;
}

// ─── Helper: horizontal scan lines ──────────────────────────────────────────
function scanLines(w, h, spacing = 3, opacity = 0.03) {
  let lines = "";
  for (let y = 0; y < h; y += spacing) {
    lines += `<rect x="0" y="${y}" width="${w}" height="1" fill="white" opacity="${opacity}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${lines}</svg>`;
}

// ─── The "T" letterform as SVG path (blocky/angular) ────────────────────────
function tLetterSVG(size, color) {
  // A blocky angular T that fits within `size` x `size`
  // The T has a thick top bar and a thick vertical stem
  const pad = Math.round(size * 0.15);
  const barH = Math.round(size * 0.18);
  const stemW = Math.round(size * 0.28);
  const left = pad;
  const right = size - pad;
  const top = pad;
  const barBottom = top + barH;
  const stemLeft = Math.round((size - stemW) / 2);
  const stemRight = stemLeft + stemW;
  const bottom = size - pad;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <polygon points="${left},${top} ${right},${top} ${right},${barBottom} ${stemRight},${barBottom} ${stemRight},${bottom} ${stemLeft},${bottom} ${stemLeft},${barBottom} ${left},${barBottom}" fill="${color}"/>
  </svg>`;
}

// ─── 1. X Profile Picture (400x400) ─────────────────────────────────────────
async function generateProfilePic() {
  const W = 400;
  const H = 400;
  const markSize = 280;
  const markOffset = Math.round((W - markSize) / 2);
  const cornerR = 48;

  // Base canvas
  const base = sharp({
    create: { width: W, height: H, channels: 4, background: VOID },
  }).png();

  // Carbon fiber texture
  const carbonSVG = carbonFiberPattern(W, H, 4, 0.025);
  const carbonBuf = Buffer.from(carbonSVG);

  // Blue glow behind the mark (a soft radial ellipse)
  const glowSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="40%">
        <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.18"/>
        <stop offset="60%" stop-color="${BLUE}" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </svg>`;
  const glowBuf = Buffer.from(glowSVG);

  // Rounded rectangle mark with brushed metal border gradient
  const markSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${markSize}" height="${markSize}">
    <defs>
      <linearGradient id="border-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${BORDER_LIGHT}"/>
        <stop offset="100%" stop-color="${BORDER_DARK}"/>
      </linearGradient>
    </defs>
    <!-- outer border rect -->
    <rect x="0" y="0" width="${markSize}" height="${markSize}" rx="${cornerR}" ry="${cornerR}" fill="url(#border-grad)"/>
    <!-- inner fill -->
    <rect x="4" y="4" width="${markSize - 8}" height="${markSize - 8}" rx="${cornerR - 3}" ry="${cornerR - 3}" fill="${DEEP_CARBON}"/>
  </svg>`;
  const markBuf = Buffer.from(markSVG);

  // T letterform centered inside the mark
  const tSize = Math.round(markSize * 0.7);
  const tSVG = tLetterSVG(tSize, BLUE);
  const tBuf = Buffer.from(tSVG);
  const tOffset = markOffset + Math.round((markSize - tSize) / 2);

  // Amber accent line at bottom-right of the mark
  const accentW = 40;
  const accentH = 4;
  const accentSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${accentW}" height="${accentH}">
    <rect width="${accentW}" height="${accentH}" rx="2" fill="${AMBER}"/>
  </svg>`;
  const accentBuf = Buffer.from(accentSVG);
  const accentX = markOffset + markSize - accentW - 24;
  const accentY = markOffset + markSize - accentH - 20;

  const result = await base.composite([
    { input: carbonBuf, top: 0, left: 0, blend: "over" },
    { input: glowBuf, top: 0, left: 0, blend: "screen" },
    { input: markBuf, top: markOffset, left: markOffset, blend: "over" },
    { input: tBuf, top: tOffset, left: tOffset, blend: "over" },
    { input: accentBuf, top: accentY, left: accentX, blend: "over" },
  ]).toBuffer();

  await sharp(result).png().toFile(path.join(PUBLIC, "x-profile.png"));
  console.log("x-profile.png generated (400x400)");
}

// ─── 2. X Banner (1500x500) ─────────────────────────────────────────────────
async function generateBanner() {
  const W = 1500;
  const H = 500;

  // Base canvas
  const base = sharp({
    create: { width: W, height: H, channels: 4, background: VOID },
  }).png();

  // Carbon fiber texture
  const carbonSVG = carbonFiberPattern(W, H, 4, 0.02);
  const carbonBuf = Buffer.from(carbonSVG);

  // Scan lines
  const scanSVG = scanLines(W, H, 3, 0.03);
  const scanBuf = Buffer.from(scanSVG);

  // Gradient sweep from bottom-left (blue tint)
  const sweepSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="sweep" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.07"/>
        <stop offset="50%" stop-color="${BLUE}" stop-opacity="0.02"/>
        <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sweep)"/>
  </svg>`;
  const sweepBuf = Buffer.from(sweepSVG);

  // Logo mark (rounded rect + T) at left side
  const logoSize = 120;
  const logoX = 120;
  const logoY = Math.round((H - logoSize) / 2);
  const logoR = 22;

  const logoMarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}">
    <defs>
      <linearGradient id="lb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${BORDER_LIGHT}"/>
        <stop offset="100%" stop-color="${BORDER_DARK}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="${logoR}" ry="${logoR}" fill="url(#lb)"/>
    <rect x="3" y="3" width="${logoSize - 6}" height="${logoSize - 6}" rx="${logoR - 2}" ry="${logoR - 2}" fill="${DEEP_CARBON}"/>
  </svg>`;
  const logoMarkBuf = Buffer.from(logoMarkSVG);

  // T inside banner logo
  const tBannerSize = Math.round(logoSize * 0.7);
  const tBannerSVG = tLetterSVG(tBannerSize, BLUE);
  const tBannerBuf = Buffer.from(tBannerSVG);
  const tBannerX = logoX + Math.round((logoSize - tBannerSize) / 2);
  const tBannerY = logoY + Math.round((logoSize - tBannerSize) / 2);

  // Small amber accent on the banner logo
  const logoAccentW = 18;
  const logoAccentH = 3;
  const logoAccentSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${logoAccentW}" height="${logoAccentH}">
    <rect width="${logoAccentW}" height="${logoAccentH}" rx="1.5" fill="${AMBER}"/>
  </svg>`;
  const logoAccentBuf = Buffer.from(logoAccentSVG);
  const logoAccentX = logoX + logoSize - logoAccentW - 12;
  const logoAccentY = logoY + logoSize - logoAccentH - 10;

  // "TENTHS" wordmark via SVG text
  const wordmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80">
    <text x="0" y="58" font-family="Arial Black, Impact, Helvetica, sans-serif" font-weight="900" font-size="62" letter-spacing="14" fill="${FG}">TENTHS</text>
  </svg>`;
  const wordmarkBuf = Buffer.from(wordmarkSVG);
  const wordmarkX = logoX + logoSize + 40;
  const wordmarkY = Math.round(H / 2) - 40;

  // Tagline: "Every Tenth Matters."
  const taglineSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="40">
    <text x="0" y="26" font-family="Helvetica Neue, Arial, sans-serif" font-weight="400" font-size="22" letter-spacing="3" fill="${MUTED}">Every Tenth Matters.</text>
  </svg>`;
  const taglineBuf = Buffer.from(taglineSVG);
  const taglineX = W - 400 - 80;
  const taglineY = Math.round(H / 2) - 14;

  // Bottom amber accent line (full width, 2px)
  const bottomLineSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="2">
    <rect width="${W}" height="2" fill="${AMBER}"/>
  </svg>`;
  const bottomLineBuf = Buffer.from(bottomLineSVG);

  const result = await base.composite([
    { input: carbonBuf, top: 0, left: 0, blend: "over" },
    { input: scanBuf, top: 0, left: 0, blend: "over" },
    { input: sweepBuf, top: 0, left: 0, blend: "screen" },
    { input: logoMarkBuf, top: logoY, left: logoX, blend: "over" },
    { input: tBannerBuf, top: tBannerY, left: tBannerX, blend: "over" },
    { input: logoAccentBuf, top: logoAccentY, left: logoAccentX, blend: "over" },
    { input: wordmarkBuf, top: wordmarkY, left: wordmarkX, blend: "over" },
    { input: taglineBuf, top: taglineY, left: taglineX, blend: "over" },
    { input: bottomLineBuf, top: H - 2, left: 0, blend: "over" },
  ]).toBuffer();

  await sharp(result).png().toFile(path.join(PUBLIC, "x-banner.png"));
  console.log("x-banner.png generated (1500x500)");
}

// ─── 3. Facebook Profile Picture (400x400) ──────────────────────────────────
// Facebook displays profile photos as a circle, so we use the same 400x400
// approach as X but with a slightly larger mark to fill the circular crop.
async function generateFBProfile() {
  const W = 400;
  const H = 400;
  const markSize = 300;
  const markOffset = Math.round((W - markSize) / 2);
  const cornerR = 50;

  const base = sharp({
    create: { width: W, height: H, channels: 4, background: VOID },
  }).png();

  const carbonBuf = Buffer.from(carbonFiberPattern(W, H, 4, 0.025));

  const glowSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="42%">
        <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.20"/>
        <stop offset="50%" stop-color="${AMBER}" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </svg>`;
  const glowBuf = Buffer.from(glowSVG);

  const markSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${markSize}" height="${markSize}">
    <defs>
      <linearGradient id="border-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${BORDER_LIGHT}"/>
        <stop offset="100%" stop-color="${BORDER_DARK}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${markSize}" height="${markSize}" rx="${cornerR}" ry="${cornerR}" fill="url(#border-grad)"/>
    <rect x="4" y="4" width="${markSize - 8}" height="${markSize - 8}" rx="${cornerR - 3}" ry="${cornerR - 3}" fill="${DEEP_CARBON}"/>
  </svg>`;
  const markBuf = Buffer.from(markSVG);

  const tSize = Math.round(markSize * 0.7);
  const tBuf = Buffer.from(tLetterSVG(tSize, BLUE));
  const tOffset = markOffset + Math.round((markSize - tSize) / 2);

  const accentW = 44;
  const accentH = 4;
  const accentBuf = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${accentW}" height="${accentH}"><rect width="${accentW}" height="${accentH}" rx="2" fill="${AMBER}"/></svg>`
  );
  const accentX = markOffset + markSize - accentW - 26;
  const accentY = markOffset + markSize - accentH - 22;

  const result = await base.composite([
    { input: carbonBuf, top: 0, left: 0, blend: "over" },
    { input: glowBuf, top: 0, left: 0, blend: "screen" },
    { input: markBuf, top: markOffset, left: markOffset, blend: "over" },
    { input: tBuf, top: tOffset, left: tOffset, blend: "over" },
    { input: accentBuf, top: accentY, left: accentX, blend: "over" },
  ]).toBuffer();

  await sharp(result).png().toFile(path.join(PUBLIC, "fb-profile.png"));
  console.log("fb-profile.png generated (400x400)");
}

// ─── 4. Facebook Banner (820x312) ───────────────────────────────────────────
async function generateFBBanner() {
  const W = 820;
  const H = 312;

  const base = sharp({
    create: { width: W, height: H, channels: 4, background: VOID },
  }).png();

  const carbonBuf = Buffer.from(carbonFiberPattern(W, H, 4, 0.02));
  const scanBuf = Buffer.from(scanLines(W, H, 3, 0.03));

  // Gradient sweep — blue from left, amber hint from right
  const sweepSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="sweep" x1="0" y1="0.5" x2="1" y2="0.5">
        <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.08"/>
        <stop offset="50%" stop-color="${BLUE}" stop-opacity="0.02"/>
        <stop offset="85%" stop-color="${AMBER}" stop-opacity="0.03"/>
        <stop offset="100%" stop-color="${AMBER}" stop-opacity="0.06"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sweep)"/>
  </svg>`;
  const sweepBuf = Buffer.from(sweepSVG);

  // Logo mark — left side, smaller for the narrower banner
  const logoSize = 80;
  const logoX = 60;
  const logoY = Math.round((H - logoSize) / 2);
  const logoR = 16;

  const logoMarkBuf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}">
    <defs><linearGradient id="lb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${BORDER_LIGHT}"/><stop offset="100%" stop-color="${BORDER_DARK}"/></linearGradient></defs>
    <rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="${logoR}" ry="${logoR}" fill="url(#lb)"/>
    <rect x="3" y="3" width="${logoSize - 6}" height="${logoSize - 6}" rx="${logoR - 2}" ry="${logoR - 2}" fill="${DEEP_CARBON}"/>
  </svg>`);

  const tBannerSize = Math.round(logoSize * 0.7);
  const tBannerBuf = Buffer.from(tLetterSVG(tBannerSize, BLUE));
  const tBannerX = logoX + Math.round((logoSize - tBannerSize) / 2);
  const tBannerY = logoY + Math.round((logoSize - tBannerSize) / 2);

  // Amber logo accent
  const logoAccentBuf = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="3"><rect width="14" height="3" rx="1.5" fill="${AMBER}"/></svg>`
  );
  const logoAccentX = logoX + logoSize - 14 - 10;
  const logoAccentY = logoY + logoSize - 3 - 8;

  // "TENTHS" wordmark — sized for FB banner
  const wordmarkBuf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60">
    <text x="0" y="44" font-family="Arial Black, Impact, Helvetica, sans-serif" font-weight="900" font-size="46" letter-spacing="10" fill="${FG}">TENTHS</text>
  </svg>`);
  const wordmarkX = logoX + logoSize + 28;
  const wordmarkY = Math.round(H / 2) - 30;

  // Tagline
  const taglineBuf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="30">
    <text x="0" y="20" font-family="Helvetica Neue, Arial, sans-serif" font-weight="400" font-size="16" letter-spacing="2" fill="${MUTED}">Every Tenth Matters.</text>
  </svg>`);
  const taglineX = wordmarkX + 4;
  const taglineY = wordmarkY + 52;

  // Bottom amber accent line
  const bottomLineBuf = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="2"><rect width="${W}" height="2" fill="${AMBER}"/></svg>`
  );

  // Top-right decorative arc (subtle racing feel)
  const arcSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <circle cx="200" cy="0" r="160" fill="none" stroke="${BLUE}" stroke-width="1" opacity="0.12"/>
    <circle cx="200" cy="0" r="130" fill="none" stroke="${AMBER}" stroke-width="0.5" opacity="0.10"/>
  </svg>`;
  const arcBuf = Buffer.from(arcSVG);

  const result = await base.composite([
    { input: carbonBuf, top: 0, left: 0, blend: "over" },
    { input: scanBuf, top: 0, left: 0, blend: "over" },
    { input: sweepBuf, top: 0, left: 0, blend: "screen" },
    { input: arcBuf, top: 0, left: W - 200, blend: "over" },
    { input: logoMarkBuf, top: logoY, left: logoX, blend: "over" },
    { input: tBannerBuf, top: tBannerY, left: tBannerX, blend: "over" },
    { input: logoAccentBuf, top: logoAccentY, left: logoAccentX, blend: "over" },
    { input: wordmarkBuf, top: wordmarkY, left: wordmarkX, blend: "over" },
    { input: taglineBuf, top: taglineY, left: taglineX, blend: "over" },
    { input: bottomLineBuf, top: H - 2, left: 0, blend: "over" },
  ]).toBuffer();

  await sharp(result).png().toFile(path.join(PUBLIC, "fb-banner.png"));
  console.log("fb-banner.png generated (820x312)");
}

// ─── Run ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Generating Tenths social media images...\n");
  await generateProfilePic();
  await generateBanner();
  await generateFBProfile();
  await generateFBBanner();
  console.log("\nDone! Images saved to public/");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
