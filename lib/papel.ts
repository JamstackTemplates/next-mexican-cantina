// Papel picado: the cut-paper flags strung across the site. Each flag is generated from a menu section's
// `motif` and a pattern seeded by its id, so every section has its own banner and a new section needs no
// image files. Pure functions with no imports beyond types, so they are unit tested directly.
//
// A flag is drawn as an SVG mask (components/papel-banner.tsx): the paper outline in white, then a list
// of operations in order. `cut` paints black (a hole in the paper), `keep` paints white again (a bridge
// of paper left inside a hole, like the veins of a leaf). Order matters, so details survive.
import type { Motif } from '../content/menu';

export type Op = { kind: 'cut' | 'keep'; d: string; transform?: string };

export type EdgeStyle = 'scallop' | 'zigzag' | 'fringe' | 'swallow';
export type BorderStyle = 'dot' | 'diamond' | 'drop' | 'dash';
export type SatelliteStyle = 'petal' | 'diamond' | 'mini' | 'dot';

export interface FlagDesign {
  /** viewBox width and height. */
  width: number;
  height: number;
  /** Paper silhouette, including the cut bottom edge. */
  outline: string;
  /** Mask operations, in paint order. */
  ops: Op[];
  edge: EdgeStyle;
  border: BorderStyle;
  satellites: { style: SatelliteStyle; count: number };
}

export const FLAG_W = 100;
export const FLAG_H = 130;
/** The hem folded over the string. */
export const HEM = 10;
/** Where the flag body ends and the cut edge begins. */
const BODY_END = 116;
/** Centre of the motif. */
const CX = 50;
const CY = 64;

// ------------------------------------------------------------------------------------------------
// Seeded randomness: the same key always gives the same flag.
// ------------------------------------------------------------------------------------------------

/** FNV-1a 32-bit hash of a string. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: a tiny, fast, deterministic PRNG returning numbers in [0, 1). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)];

// ------------------------------------------------------------------------------------------------
// Path helpers. Numbers are rounded so the SVG stays small.
// ------------------------------------------------------------------------------------------------

const n = (value: number) => Math.round(value * 100) / 100;

export function circle(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`;
}

export function polygon(points: [number, number][]): string {
  return `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join('L')}Z`;
}

function rect(x: number, y: number, w: number, h: number): string {
  return polygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
}

function polar(cx: number, cy: number, r: number, degrees: number): [number, number] {
  const a = (degrees - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** A pointed leaf/petal from `start` units out from (cx, cy), pointing at `angle`, `length` long and about `width` wide. */
function leaf(cx: number, cy: number, angle: number, length: number, width: number, start = 0): string {
  const [bx, by] = polar(cx, cy, start, angle);
  const [tx, ty] = polar(cx, cy, start + length, angle);
  const [mx, my] = polar(cx, cy, start + length * .5, angle);
  const a = (angle - 180) * Math.PI / 180; // perpendicular to the leaf's axis
  const dx = Math.cos(a) * width;
  const dy = Math.sin(a) * width;
  return `M${n(bx)} ${n(by)}Q${n(mx + dx)} ${n(my + dy)} ${n(tx)} ${n(ty)}Q${n(mx - dx)} ${n(my - dy)} ${n(bx)} ${n(by)}Z`;
}

/** A star polygon with `points` tips. */
function star(cx: number, cy: number, outer: number, inner: number, points: number, rotate = 0): string {
  const vertices: [number, number][] = [];
  for (let i = 0; i < points * 2; i++) vertices.push(polar(cx, cy, i % 2 ? inner : outer, rotate + i * 180 / points));
  return polygon(vertices);
}

function diamond(cx: number, cy: number, w: number, h: number): string {
  return polygon([[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]]);
}

// ------------------------------------------------------------------------------------------------
// Motifs, each drawn in a 100 × 100 box centred on (50, 50).
// ------------------------------------------------------------------------------------------------

const cut = (d: string): Op => ({ kind: 'cut', d });
const keep = (d: string): Op => ({ kind: 'keep', d });

const MOTIF_OPS: Record<Motif, () => Op[]> = {
  taco: () => [
    // Fillings piled along the top, then the folded tortilla.
    cut('M14 60Q16 40 28 48Q32 30 44 42Q52 26 60 42Q70 30 74 48Q86 40 86 60Z'),
    cut('M8 58A42 34 0 0 0 92 58Z'),
    keep('M10 58H90V61.5H10Z'),
    keep(circle(30, 72, 2.6)), keep(circle(46, 80, 2.2)), keep(circle(62, 74, 2.6)), keep(circle(74, 66, 2)),
  ],
  chilli: () => [
    cut('M32 26C22 44 30 72 66 90C76 95 84 86 74 78C52 62 46 44 48 28C49 18 37 16 32 26Z'),
    cut('M38 24C36 14 42 6 52 8L53 13C47 13 45 17 45 24Z'),
    keep('M38 36C36 50 42 64 58 76L56 79C38 66 32 52 35 36Z'),
  ],
  agave: () => [
    ...[-72, -48, -24, 0, 24, 48, 72].map(angle => cut(leaf(50, 88, angle, angle === 0 ? 78 : 70 - Math.abs(angle) / 5, 10))),
    keep(rect(30, 88, 40, 6)),
  ],
  lime: () => [
    cut(circle(50, 50, 42)),
    keep(circle(50, 50, 36)),
    cut(circle(50, 50, 33)),
    ...Array.from({ length: 8 }, (_, i) => keep(polygon([polar(50, 50, 0, i * 45 - 2.5), polar(50, 50, 34, i * 45 - 3.5), polar(50, 50, 34, i * 45 + 3.5), polar(50, 50, 0, i * 45 + 2.5)]))),
    keep(circle(50, 50, 6)),
  ],
  corn: () => [
    cut('M50 8C66 8 72 40 68 70C66 84 58 92 50 92C42 92 34 84 32 70C28 40 34 8 50 8Z'),
    ...[22, 32, 42, 52, 62, 72, 82].map(y => keep(rect(30, y, 40, 2.2))),
    keep(rect(49, 8, 2.2, 84)),
    cut('M50 94C30 90 16 72 18 44C28 60 38 76 50 94Z'),
    cut('M50 94C70 90 84 72 82 44C72 60 62 76 50 94Z'),
  ],
  star: () => [
    cut(star(50, 50, 46, 20, 8)),
    keep(star(50, 50, 16, 7, 8, 22.5)),
    cut(circle(50, 50, 4.5)),
  ],
  flower: () => [
    ...Array.from({ length: 6 }, (_, i) => cut(leaf(50, 50, i * 60, 40, 16, 6))),
    cut(circle(50, 50, 14)),
    keep(circle(50, 50, 10)),
    cut(circle(50, 50, 5.5)),
  ],
  glass: () => [
    cut('M12 20H88L56 52V78L72 86V90H28V86L44 78V52Z'),
    keep(rect(18, 26, 64, 2.6)),
    keep(circle(43, 36, 2.2)), keep(circle(55, 32, 1.8)), keep(circle(50, 42, 1.6)),
    cut(circle(84, 18, 10)),
    keep(rect(83, 8, 2.2, 20)),
  ],
};

/** A motif's mask operations in its own 100 × 100 box. */
export function motifOps(motif: Motif): Op[] {
  return MOTIF_OPS[motif]();
}

/** Wrap ops in a transform that places a 100 × 100 motif at (x, y), `size` wide, turned `rotate` degrees. */
function place(ops: Op[], x: number, y: number, size: number, rotate = 0): Op[] {
  const s = n(size / 100);
  const transform = `translate(${n(x)} ${n(y)})${rotate ? ` rotate(${n(rotate)})` : ''} scale(${s}) translate(-50 -50)`;
  return ops.map(op => ({ ...op, transform }));
}

// ------------------------------------------------------------------------------------------------
// Flags
// ------------------------------------------------------------------------------------------------

function outlineFor(edge: EdgeStyle): string {
  const top = `M0 0H${FLAG_W}V${BODY_END}`;
  switch (edge) {
    case 'scallop': {
      const count = 5;
      const w = FLAG_W / count;
      let d = top;
      for (let i = count - 1; i >= 0; i--) d += `A${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(i * w)} ${BODY_END}`;
      return `${d}Z`;
    }
    case 'zigzag': {
      const count = 6;
      const w = FLAG_W / count;
      const points: string[] = [];
      for (let i = count; i > 0; i--) points.push(`L${n(i * w - w / 2)} ${FLAG_H - 2}L${n((i - 1) * w)} ${BODY_END}`);
      return `${top}${points.join('')}Z`;
    }
    case 'fringe':
      return `M0 0H${FLAG_W}V${FLAG_H - 4}H0Z`;
    case 'swallow':
      return `M0 0H${FLAG_W}V${FLAG_H - 2}L${CX} ${BODY_END - 4}L0 ${FLAG_H - 2}Z`;
  }
}

function edgeOps(edge: EdgeStyle): Op[] {
  if (edge !== 'fringe') return [];
  // Slits cut up into the bottom edge.
  return Array.from({ length: 16 }, (_, i) => cut(rect(3 + i * 6.1, BODY_END + 1, 1.6, FLAG_H)));
}

function borderOps(style: BorderStyle): Op[] {
  const ops: Op[] = [];
  const inset = 7;
  const top = HEM + 7;
  const bottom = BODY_END - 6;
  const mark = (x: number, y: number, vertical: boolean) => {
    switch (style) {
      case 'dot': return cut(circle(x, y, 1.7));
      case 'diamond': return cut(diamond(x, y, 2, 2.6));
      case 'drop': return cut(leaf(x, y + (vertical ? 0 : 2.4), 0, 5, 2.2));
      case 'dash': return cut(vertical ? rect(x - .9, y - 2.4, 1.8, 4.8) : rect(x - 2.4, y - .9, 4.8, 1.8));
    }
  };
  for (let x = inset; x <= FLAG_W - inset + .01; x += (FLAG_W - inset * 2) / 9) {
    ops.push(mark(x, top, false), mark(x, bottom, false));
  }
  const rows = 9;
  for (let i = 1; i < rows; i++) {
    const y = top + (bottom - top) * i / rows;
    ops.push(mark(inset, y, true), mark(FLAG_W - inset, y, true));
  }
  return ops;
}

function satelliteOps(style: SatelliteStyle, count: number, motif: Motif, turn: number): Op[] {
  const radius = 33;
  const ops: Op[] = [];
  for (let i = 0; i < count; i++) {
    const angle = turn + i * 360 / count;
    const [x, y] = polar(CX, CY, radius, angle);
    switch (style) {
      case 'petal': ops.push(cut(leaf(CX, CY, angle, 10, 3.6, radius - 5))); break;
      case 'diamond': ops.push(cut(diamond(x, y, 3.2, 5))); break;
      case 'dot': ops.push(cut(circle(x, y, 3.2)), keep(circle(x, y, 1.2))); break;
      case 'mini': ops.push(...place(motifOps(motif), x, y, 12, angle)); break;
    }
  }
  return ops;
}

/**
 * One flag, fully determined by `key` (e.g. "tacos#2") and the motif. Changing the key changes the cut
 * pattern; the motif always sits in the middle so the section stays recognisable.
 */
export function flagDesign(key: string, motif: Motif): FlagDesign {
  const rand = random(hash(`${key}|${motif}`));
  const edge = pick(rand, ['scallop', 'zigzag', 'fringe', 'swallow'] as const);
  const border = pick(rand, ['dot', 'diamond', 'drop', 'dash'] as const);
  const style = pick(rand, ['petal', 'diamond', 'mini', 'dot'] as const);
  const count = pick(rand, style === 'mini' ? [4, 6] as const : [6, 8, 10] as const);
  const turn = pick(rand, [0, 15, 22.5, 30, 45] as const);
  const corners = rand() < .5;
  const frame = rand() < .6;

  const ops: Op[] = [];
  // A row of slits under the hem, where the paper folds over the string.
  for (let x = 6; x < FLAG_W - 4; x += 5.5) ops.push(cut(rect(x, HEM + 1.2, 2.4, 2.4)));
  if (frame) {
    // A thin cut frame: cut a rectangle, then keep its middle.
    ops.push(cut(rect(12, HEM + 12, FLAG_W - 24, BODY_END - HEM - 23)), keep(rect(14, HEM + 14, FLAG_W - 28, BODY_END - HEM - 27)));
  }
  ops.push(...borderOps(border));
  if (corners) {
    for (const [x, y, a] of [[17, HEM + 17, 135], [FLAG_W - 17, HEM + 17, 225], [17, BODY_END - 16, 45], [FLAG_W - 17, BODY_END - 16, 315]] as const) {
      ops.push(cut(leaf(x, y, a, 7, 2.6)));
    }
  }
  ops.push(...satelliteOps(style, count, motif, turn));
  ops.push(...place(motifOps(motif), CX, CY, 48));
  ops.push(...edgeOps(edge));

  return { width: FLAG_W, height: FLAG_H, outline: outlineFor(edge), ops, edge, border, satellites: { style, count } };
}

/** `count` flags for one section, keyed "id#0", "id#1", ... */
export function sectionFlags(id: string, motif: Motif, count: number): FlagDesign[] {
  return Array.from({ length: count }, (_, i) => flagDesign(`${id}#${i}`, motif));
}

// ------------------------------------------------------------------------------------------------
// Sizing: flags keep a sensible width on every screen. The banner component turns these numbers into
// a CSS clamp(), so the same rule is used in the browser and in the tests.
// ------------------------------------------------------------------------------------------------

export const FLAG_SIZE = { min: 52, max: 92, vw: 6.4, gap: 6 } as const;

/** Rendered flag width in CSS pixels at a viewport width: clamp(min, vw, max). */
export function flagWidth(viewport: number, size = FLAG_SIZE): number {
  return Math.min(size.max, Math.max(size.min, viewport * size.vw / 100));
}

/** How many whole flags fit across a viewport. */
export function flagsAcross(viewport: number, size = FLAG_SIZE): number {
  return Math.floor((viewport + size.gap) / (flagWidth(viewport, size) + size.gap));
}

/** CSS width for a banner flag, e.g. "clamp(52px, 6.4vw, 92px)". */
export function flagWidthCss(size = FLAG_SIZE): string {
  return `clamp(${size.min}px, ${size.vw}vw, ${size.max}px)`;
}

/**
 * Width of each flag when a fixed number of them must share a row (the menu's section navigation),
 * never wider than the normal maximum.
 */
export function navFlagWidth(viewport: number, count: number, gutter = 16, size = FLAG_SIZE): number {
  const available = viewport - gutter * 2 - size.gap * (count - 1);
  return Math.min(size.max + 18, available / count);
}
