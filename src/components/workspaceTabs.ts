export type WorkspaceTabId = 'canvas' | 'gallery';

export type WorkspaceTabIconName = 'Paintbrush' | 'Image';

export interface WorkspaceTabConfig {
  id: WorkspaceTabId;
  label: string;
  englishLabel: string;
  icon: WorkspaceTabIconName;
}

export const WORKSPACE_TABS: WorkspaceTabConfig[] = [
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
];
