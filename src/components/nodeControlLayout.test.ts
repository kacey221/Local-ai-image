import assert from 'node:assert/strict';
import test from 'node:test';
import { NODE_CONTROL_STRIP_CLASSES } from './nodeControlLayout';

test('node control strip keeps overlay pickers visible', () => {
  assert.match(NODE_CONTROL_STRIP_CLASSES, /overflow-visible/);
  assert.doesNotMatch(NODE_CONTROL_STRIP_CLASSES, /overflow-x-auto/);
});
