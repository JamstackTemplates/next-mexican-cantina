// The papel-picado pattern generator: deterministic, every motif renders, and flags keep a sensible size.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { menu, MOTIFS } from '../content/menu.ts';
import {
  FLAG_H, FLAG_SIZE, FLAG_W, flagDesign, flagsAcross, flagWidth, flagWidthCss, hash, motifOps, navFlagWidth, random, sectionFlags,
} from '../lib/papel.ts';

const NUMBERS = /-?\d*\.?\d+(?:e-?\d+)?/g;
const PATH = /^[MmLlHhVvCcQqAaZz0-9 .,\-e]+$/;

test('the same key always cuts the same flag', () => {
  assert.deepEqual(flagDesign('tacos#0', 'taco'), flagDesign('tacos#0', 'taco'));
  assert.deepEqual(sectionFlags('bebidas', 'glass', 6), sectionFlags('bebidas', 'glass', 6));
  assert.equal(hash('tacos'), hash('tacos'));
  const a = random(42); const b = random(42);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test('different keys and sections give different flags', () => {
  const designs = new Set(sectionFlags('antojitos', 'corn', 12).map(flag => JSON.stringify(flag)));
  assert.ok(designs.size >= 10, 'flags along one banner should vary');
  assert.notDeepEqual(flagDesign('tacos#0', 'taco'), flagDesign('postres#0', 'taco'));
});

test('every motif renders inside the flag', () => {
  for (const motif of MOTIFS) {
    const ops = motifOps(motif);
    assert.ok(ops.some(op => op.kind === 'cut'), `${motif} cuts something`);
    for (const op of ops) {
      assert.match(op.d, PATH, `${motif}: ${op.d}`);
      for (const value of op.d.match(NUMBERS) ?? []) assert.ok(Number.isFinite(Number(value)), `${motif}: ${value}`);
    }
    for (let i = 0; i < 8; i++) {
      const design = flagDesign(`check#${i}`, motif);
      const text = JSON.stringify(design);
      assert.doesNotMatch(text, /NaN|undefined|Infinity/, `${motif} flag ${i}`);
      assert.equal(design.width, FLAG_W);
      assert.equal(design.height, FLAG_H);
      assert.match(design.outline, PATH);
      // Motifs are placed around the flag's centre at a size that stays inside the paper.
      for (const op of design.ops.filter(op => op.transform)) {
        const [, x, y] = op.transform!.match(/translate\((-?[\d.]+) (-?[\d.]+)\)/)!.map(Number);
        const scale = Number(op.transform!.match(/scale\(([\d.]+)\)/)![1]);
        assert.ok(x > 0 && x < FLAG_W && y > 0 && y < FLAG_H, `${motif}: motif placed at ${x}, ${y}`);
        assert.ok(scale > 0 && scale <= .5, `${motif}: motif scale ${scale}`);
      }
    }
  }
});

test('every menu section has a motif and a valid banner', () => {
  for (const section of menu.sections) {
    assert.ok(MOTIFS.includes(section.motif), `${section.id}.motif must be one of ${MOTIFS.join(', ')}`);
    assert.equal(sectionFlags(section.id, section.motif, 3).length, 3);
  }
});

test('flags stay a sensible width from 360px to wide screens', () => {
  assert.equal(flagWidth(360), FLAG_SIZE.min);
  assert.ok(flagWidth(360) >= 44 && flagWidth(360) <= 72, `flags at 360px are ${flagWidth(360)}px`);
  assert.ok(flagsAcross(360) >= 5 && flagsAcross(360) <= 8, `${flagsAcross(360)} flags across 360px`);
  assert.equal(flagWidth(2560), FLAG_SIZE.max);
  assert.ok(flagWidth(1440) <= FLAG_SIZE.max && flagWidth(1440) >= FLAG_SIZE.min);
  assert.equal(flagWidthCss(), `clamp(${FLAG_SIZE.min}px, ${FLAG_SIZE.vw}vw, ${FLAG_SIZE.max}px)`);
  // The menu's section navigation: one flag per section must fit across a 360px phone.
  const nav = navFlagWidth(360, menu.sections.length);
  assert.ok(nav >= 52, `menu nav flags at 360px are ${nav.toFixed(1)}px; fewer sections or a shorter gap needed`);
  assert.ok(navFlagWidth(1440, menu.sections.length) <= FLAG_SIZE.max + 18);
});
