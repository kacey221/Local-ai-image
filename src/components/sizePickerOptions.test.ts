import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SIZE_DETAIL_OPTIONS,
  SIZE_RATIO_OPTIONS,
} from './sizePickerOptions';

test('size picker exposes only clarity choices and supported aspect ratios', () => {
  assert.deepEqual(
    SIZE_DETAIL_OPTIONS.map((option) => option.id),
    ['1K', '2K', '4K'],
  );

  assert.deepEqual(
    SIZE_RATIO_OPTIONS.map((option) => option.id),
    ['auto', '1:1', '9:16', '16:9', '3:4', '4:3'],
  );

  assert.equal(
    SIZE_RATIO_OPTIONS.some((option) =>
      ['1:2', '2:1', '3:2', '2:3', '5:4', '4:5', '21:9', '9:21'].includes(option.id),
    ),
    false,
  );
});
