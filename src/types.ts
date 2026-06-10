export type DetailLevel = '1K' | '2K' | '4K';

export interface ModelPreset {
  id: string;
  name: string;
  category: 'Realistic' | 'Anime/Illustration' | 'Sci-Fi/Cyber' | 'Fantasy/Art' | 'Flux/SDXL Base';
  thumbnailUrl: string;
  description: string;
  promptTrigger?: string;
}

export interface StyleReference {
  id: string;
  name: string;
  category: 'LoRA' | 'Style' | 'Effect';
  thumbnailUrl: string;
  promptTrigger: string;
  weight: number; // 0 to 1
}

export interface CanvasLayer {
  id: string;
  type: 'image' | 'drawing' | 'text';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string; // base64 or URL
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotate: number; // in degrees
  drawingData?: string; // Base64 dataURL of drawing layer
  textValue?: string;
  textColor?: string;
  fontSize?: number;

  // Node relationships & specifications for node-based graph structure in infinite canvas
  parentId?: string;
  parentIds?: string[]; // Supports multiple connected parent nodes
  prompt?: string; // Local positive prompt for this generation node
  negativePrompt?: string; // Local negative prompt
  engine?: 'imagen-4' | 'gemini-2.5-image' | 'gemini-3.1-image' | 'rightcodes-image'; // Local generation model selected
  rightCodesModel?: 'gpt-image-2' | 'gpt-image-2-vip' | 'nano-banana' | 'nano-banana-2' | 'nano-banana-pro';
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | 'auto'; // Local size / aspect ratio
  detailLevel?: DetailLevel; // Frontend-only clarity selector
  isGenerating?: boolean; // Generating spinner status
  isReference?: boolean; // Reference node flag
}

export interface GenerationConfig {
  engine: 'imagen-4' | 'gemini-2.5-image' | 'gemini-3.1-image' | 'rightcodes-image';
  positivePrompt: string;
  negativePrompt: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | 'auto';
  imageSize: '512px' | '1K' | '2K';
  batchCount: number; // number of images (1, 2, 4)
  cfgScale: number; // 1 to 20
  steps: number; // 1 to 50
  seed: number;
  denoisingStrength: number; // For image-to-image (0 to 1)
  useImageToImage: boolean;
  selectedModelId: string;
  selectedStyles: Array<{ id: string; weight: number }>;
}

export interface GenerationHistoryItem {
  id: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  engine: string;
  modelName: string;
  seed: number;
  timestamp: string;
  images: string[]; // Base64 image data strings
}

export type CanvasTool = 'select' | 'pan' | 'brush' | 'eraser' | 'add-text' | 'crop';
