import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PROMPT_CARD_SURFACE_CLASSES,
  SOFT_PINK_LILAC_GRADIENT_CLASSES,
} from './uiTheme';

test('uses a soft pink-lilac accent gradient token', () => {
  assert.match(SOFT_PINK_LILAC_GRADIENT_CLASSES, /from-rose-/);
  assert.match(SOFT_PINK_LILAC_GRADIENT_CLASSES, /via-fuchsia-/);
  assert.match(SOFT_PINK_LILAC_GRADIENT_CLASSES, /to-violet-/);
});

test('uses a white prompt card surface token', () => {
  assert.match(PROMPT_CARD_SURFACE_CLASSES, /bg-white/);
});
