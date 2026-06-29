import assert from 'node:assert/strict';
import test from 'node:test';
import { fitImportedImageDimensions } from './imageImport';

test('scales down large landscape images proportionally', () => {
  assert.deepEqual(fitImportedImageDimensions(2000, 1000), {
    width: 520,
    height: 260,
  });
});

test('scales down large portrait images proportionally', () => {
  assert.deepEqual(fitImportedImageDimensions(1000, 2000), {
    width: 260,
    height: 520,
  });
});

test('does not enlarge small images', () => {
  assert.deepEqual(fitImportedImageDimensions(300, 200), {
    width: 300,
    height: 200,
  });
});

test('falls back safely for invalid dimensions', () => {
  assert.deepEqual(fitImportedImageDimensions(0, 0), {
    width: 320,
    height: 320,
  });
});
