import assert from 'node:assert/strict';
import test from 'node:test';
import { getPreviewFrameHeight } from './previewLayout';

test('calculates a square preview for 1:1 ratios', () => {
  assert.equal(getPreviewFrameHeight(320, '1:1', 0), 320);
});

test('calculates a taller preview for 3:4 ratios', () => {
  assert.equal(getPreviewFrameHeight(320, '3:4', 0), 427);
});

test('accounts for selected card inner padding before calculating height', () => {
  assert.equal(getPreviewFrameHeight(320, '1:1', 16), 304);
});

test('calculates a shorter preview for 16:9 ratios', () => {
  assert.equal(getPreviewFrameHeight(400, '16:9', 0), 225);
});

test('uses actual image dimensions for auto preview sizing', () => {
  assert.equal(getPreviewFrameHeight(320, 'auto' as any, 0, {
    width: 400,
    height: 200,
  }), 160);
});
