import type { DetailLevel } from '../types';

export interface SizeDetailOption {
  id: DetailLevel;
  label: string;
}

export interface SizeRatioOption {
  id: 'auto' | '1:1' | '9:16' | '16:9' | '3:4' | '4:3';
  label: string;
  shape: 'auto' | 'square' | 'portrait' | 'landscape';
}

export const SIZE_DETAIL_OPTIONS: SizeDetailOption[] = [
  { id: '1K', label: '1K' },
  { id: '2K', label: '2K' },
  { id: '4K', label: '4K' },
];

export const SIZE_RATIO_OPTIONS: SizeRatioOption[] = [
  { id: 'auto', label: '自适应', shape: 'auto' },
  { id: '1:1', label: '1:1', shape: 'square' },
  { id: '9:16', label: '9:16', shape: 'portrait' },
  { id: '16:9', label: '16:9', shape: 'landscape' },
  { id: '3:4', label: '3:4', shape: 'portrait' },
  { id: '4:3', label: '4:3', shape: 'landscape' },
];
