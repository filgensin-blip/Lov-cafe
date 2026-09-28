// Verifies WCAG 2.x contrast for every text/background pairing the site uses.
// Run with: npm run check:contrast   (exits non-zero if any pair fails)

const hex = (h) => h.replace("#", "").match(/../g).map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const [r, g, b] = hex(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const C = {
  cream: "#F7F5EF",
  cream2: "#EFEBE0",
  field: "#FFFDF8",
  ink: "#1E2119",
  muted: "#5E6155",
  mutedBrief: "#6B6E60",
  matcha: "#4A5D3A",
  matchaDeep: "#3B4A2E",
  error: "#8A3425",
  errorBg: "#F6E9E3",
};

// [label, foreground, background, minimum ratio]
const pairs = [
  ["ink on cream", C.ink, C.cream, 4.5],
  ["ink on cream-2", C.ink, C.cream2, 4.5],
  ["ink on field", C.ink, C.field, 4.5],
  ["muted on cream", C.muted, C.cream, 4.5],
  ["muted on cream-2", C.muted, C.cream2, 4.5],
  ["matcha on cream", C.matcha, C.cream, 4.5],
  ["matcha on cream-2", C.matcha, C.cream2, 4.5],
  ["cream on matcha (buttons, hero)", C.cream, C.matcha, 4.5],
  ["cream on matcha-deep (button hover)", C.cream, C.matchaDeep, 4.5],
  ["matcha-deep on cream (light button)", C.matchaDeep, C.cream, 4.5],
  ["error on cream", C.error, C.cream, 4.5],
  ["ink on error bg", C.ink, C.errorBg, 4.5],
];

let failed = false;
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed = true;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${label}`);
}

const brief = ratio(C.mutedBrief, C.cream2);
console.log(
  `\ninfo: the brief's original muted ${C.mutedBrief} on cream-2 is ${brief.toFixed(2)}:1 (${brief >= 4.5 ? "passes" : "fails"} AA) — hence ${C.muted}.`,
);

process.exit(failed ? 1 : 0);
