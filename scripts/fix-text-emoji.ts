#!/usr/bin/env node

/**
 * fix-text-emoji.ts — Replace text-based emoji with Unicode emoji in SKILL.md frontmatter
 *
 * Run: node --experimental-strip-types scripts/fix-text-emoji.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EMOJI_MAP: Record<string, string> = {
  palette: "🎨",
  world_map: "🗺️",
  sparkle: "✨",
  spider_web: "🕸️",
  art: "🎨",
  link: "🔗",
  wrench: "🔧",
  grid: "📊",
  table: "📋",
  ledger: "📒",
  survey: "📋",
  chart_with_downwards_trend: "📉",
  triangular_ruler: "📐",
  balance_scale: "⚖️",
  chart_with_upwards_trend: "📈",
  target: "🎯",
  network: "🌐",
  hourglass_flowing_sand: "⏳",
  broom: "🧹",
  jigsaw: "🧩",
  clipboard: "📋",
  mag: "🔍",
  eye: "👁️",
  brain: "🧠",
  robot: "🤖",
  hospital: "🏥",
  microscope: "🔬",
  "light-bulb": "💡",
  gear: "⚙️",
  chess_pawn: "♟️",
  "atom-symbol": "⚛️",
  flask: "🧪",
  "globe-with-meridians": "🌐",
  "check-mark": "✅",
  code: "💻",
  leaf: "🍃",
  deciduous_tree: "🌳",
  "paw-prints": "🐾",
  earth_africa: "🌍",
  books: "📚",
  "chart-increasing": "📈",
  money_with_wings: "💸",
  briefcase: "💼",
  bar_chart: "📊",
  "chart-decreasing": "📉",
  cloud: "☁️",
  earth_americas: "🌎",
  satellite: "🛰️",
  "globe-showing-asia-australia": "🌏",
  scroll: "📜",
  owl: "🦉",
  "balance-scale": "⚖️",
  scales: "⚖️",
  "page-with-curl": "📃",
  abacus: "🧮",
  "linked-paperclips": "🖇️",
  syringe: "💉",
  "test-tube": "🧪",
  pill: "💊",
  warning: "⚠️",
  telescope: "🔭",
  atom: "⚛️",
  cyclone: "🌀",
  atom_symbol: "⚛️",
  globe_with_meridians: "🌐",
  busts_in_silhouette: "👥",
  bell: "🔔",
  speech_balloon: "💬",
  map: "🗺️",
  ai: "🤖",
  unlock: "🔓",
  paper: "📄",
  chart: "📊",
  medal: "🏅",
  id: "🪪",
  mag_right: "🔎",
  chain: "🔗",
  db: "🗄️",
  dna: "🧬",
  dart: "🎯",
  chains: "⛓️",
  scope: "🔭",
  magnify: "🔍",
  eu: "🇪🇺",
  moneybag: "💰",
  handshake: "🤝",
  test_tube: "🧪",
  seedling: "🌱",
  blend: "🔀",
  town: "🏘️",
  detective: "🕵️",
  reader: "📖",
  memo: "📝",
  envelope: "✉️",
  gpu: "🖥️",
  notebook: "📓",
  terminal: "💻",
  snake: "🐍",
  repeat: "🔁",
  shield: "🛡️",
  flow: "🔄",
  sketch: "✏️",
  blueprint: "📐",
  diagram: "📊",
  crayon: "🖍️",
  book: "📖",
  page_facing_up: "📄",
  doc: "📄",
  fountain_pen: "🖋️",
  bookmark: "🔖",
  card_file_box: "🗃️",
  card_index_dividers: "🗂️",
  thought_balloon: "💭",
  pen: "🖊️",
  bookmark_tabs: "📑",
  sigma: "∑",
  team: "👥",
  mortar_board: "🎓",
  globe: "🌐",
  pencil2: "✏️",
  scissors: "✂️",
  slides: "📊",
  tractor: "🚜",
  database: "🗄️",
};

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...collectFiles(fullPath));
      else if (entry.name === "SKILL.md") files.push(fullPath);
    }
  } catch {}
  return files;
}

const ROOT = join(import.meta.dirname ?? ".", "..");
const files = collectFiles(join(ROOT, "skills"));
let fixed = 0;
const changes: string[] = [];

for (const file of files) {
  const content = readFileSync(file, "utf-8");

  // Match emoji field in frontmatter: emoji: "text_value" or emoji: text_value
  const emojiMatch = content.match(/^([\s\S]*?)((\s+)emoji:\s*"?)([A-Za-z][A-Za-z0-9_-]*)("?\s*\n)([\s\S]*)$/m);
  if (!emojiMatch) continue;

  const textEmoji = emojiMatch[4];
  const unicodeEmoji = EMOJI_MAP[textEmoji];

  if (!unicodeEmoji) {
    console.log(`  UNMAPPED: ${textEmoji} in ${file}`);
    continue;
  }

  // Replace the emoji field value
  const newContent = content.replace(
    new RegExp(`(emoji:\\s*)"?${textEmoji.replace(/[-]/g, "\\$&")}"?`),
    `$1"${unicodeEmoji}"`,
  );

  if (newContent !== content) {
    writeFileSync(file, newContent, "utf-8");
    fixed++;
    changes.push(`  ${textEmoji.padEnd(35)} -> ${unicodeEmoji}  ${file.replace(ROOT + "/", "")}`);
  }
}

console.log(`Fixed ${fixed} files with text-based emoji:\n`);
for (const c of changes) console.log(c);
if (fixed === 0) console.log("  (no files needed fixing)");
