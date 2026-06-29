import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldShowOutputPort } from './nodePortPolicy';

test('selected image nodes keep their output port even before a src exists', () => {
  assert.equal(
    shouldShowOutputPort({
      isSelected: true,
      layerType: 'image',
    }),
    true,
  );
});

test('unselected image nodes hide their output port', () => {
  assert.equal(
    shouldShowOutputPort({
      isSelected: false,
      layerType: 'image',
    }),
    false,
  );
});

test('non-image layers do not show an output port', () => {
  assert.equal(
    shouldShowOutputPort({
      isSelected: true,
      layerType: 'text',
    }),
    false,
  );
});
