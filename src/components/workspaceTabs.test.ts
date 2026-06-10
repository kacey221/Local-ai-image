import assert from 'node:assert/strict';
import test from 'node:test';
import { WORKSPACE_TABS } from './workspaceTabs';

test('uses short bilingual labels and curated icons for the workspace tabs', () => {
  assert.deepEqual(WORKSPACE_TABS, [
    {
      id: 'canvas',
      label: '画板',
      englishLabel: 'Canvas',
      icon: 'Paintbrush',
    },
    {
      id: 'gallery',
      label: '图库',
      englishLabel: 'Gallery',
      icon: 'Image',
    },
  ]);
});
