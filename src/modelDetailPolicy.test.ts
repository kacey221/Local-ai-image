import assert from 'node:assert/strict';
import test from 'node:test';

import {
  coerceDetailLevelForModel,
  getSupportedDetailLevelsForModel,
} from './modelDetailPolicy';

test('gpt-image-2 only supports 1K detail', () => {
  assert.deepEqual(getSupportedDetailLevelsForModel('gpt-image-2'), ['1K']);
});

test('gpt-image-2-vip supports 1K, 2K, and 4K detail', () => {
  assert.deepEqual(getSupportedDetailLevelsForModel('gpt-image-2-vip'), ['1K', '2K', '4K']);
});

test('nano-banana-2 supports 1K, 2K, and 4K detail', () => {
  assert.deepEqual(getSupportedDetailLevelsForModel('nano-banana-2'), ['1K', '2K', '4K']);
});

test('nano-banana-pro supports 1K, 2K, and 4K detail', () => {
  assert.deepEqual(getSupportedDetailLevelsForModel('nano-banana-pro'), ['1K', '2K', '4K']);
});

test('nano-banana falls back conservatively to 1K detail only', () => {
  assert.deepEqual(getSupportedDetailLevelsForModel('nano-banana'), ['1K']);
});

test('keeps a supported detail level for the selected model', () => {
  assert.equal(coerceDetailLevelForModel('gpt-image-2-vip', '4K'), '4K');
});

test('coerces an unsupported detail level to the model default', () => {
  assert.equal(coerceDetailLevelForModel('gpt-image-2', '4K'), '1K');
});

test('coerces a missing detail level to the model default', () => {
  assert.equal(coerceDetailLevelForModel('nano-banana-pro', undefined), '1K');
});
