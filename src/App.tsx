import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import CanvasWorkspace from './components/CanvasWorkspace';
import type { CanvasLayer, GenerationHistoryItem } from './types';
import {
  SOFT_PINK_LILAC_GRADIENT_CLASSES,
} from './uiTheme';

export default function App() {
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [history, setHistory] = useState<GenerationHistoryItem[]>([
    {
      id: 'historic-1',
      prompt: '3d clay figurine sculpture cute character doctor honeybee standing carrying medicine gear holding magnifier, shiny soft light, full body, orange and black accent, key visual, 3d render oc renderer, pristine background',
      negativePrompt: 'low quality, blurry, photo, human, text',
      aspectRatio: '1:1',
      engine: 'rightcodes-image',
      modelName: 'gpt-image-2',
      seed: 102462,
      timestamp: '16:34:21',
      images: ['https://picsum.photos/seed/doctorbee/1024/1024'],
    },
    {
      id: 'historic-2',
      prompt: 'A highly detailed cinematic portrait of a beautiful mystical fox in an enchanted winter forest, soft magical particle flares, deep volumetric lighting, dramatic background, artstation style, masterpiece',
      negativePrompt: 'low quality, blurry, deformed body, extra limbs, bad structure',
      aspectRatio: '1:1',
      engine: 'rightcodes-image',
      modelName: 'nano-banana-pro',
      seed: 98725,
      timestamp: '15:20:05',
      images: ['https://picsum.photos/seed/magicalfox/1024/1024'],
    },
    {
      id: 'historic-3',
      prompt: 'Cozy cyberpunk room, warm computer terminal light, cozy sleeping kitten on keyboard, rainy window looking onto neon synthwave street, highly detailed 3d digital painting',
      negativePrompt: 'low quality, painting, text overlay, ugly, distorted faces',
      aspectRatio: '1:1',
      engine: 'rightcodes-image',
      modelName: 'gpt-image-2-vip',
      seed: 420061,
      timestamp: '14:12:59',
      images: ['https://picsum.photos/seed/scificabin/1024/1024'],
    },
  ]);

  useEffect(() => {
    const initialLayer: CanvasLayer = {
      id: 'layer-init-1',
      type: 'image',
      name: 'Sample: Cozy Cyberpunk Room',
      x: 120,
      y: 80,
      width: 320,
      height: 320,
      src: 'https://picsum.photos/seed/cyberpunk/1024/1024',
      visible: true,
      locked: false,
      opacity: 1,
      rotate: 0,
      engine: 'rightcodes-image',
      rightCodesModel: 'gpt-image-2',
      aspectRatio: '1:1',
    };

    setLayers([initialLayer]);
    setSelectedLayerId(initialLayer.id);
  }, []);

  const handleSelectLayer = (id: string) => {
    setSelectedLayerId(id);
  };

  const handleUpdateLayer = (updated: CanvasLayer) => {
    setLayers((prev) => prev.map((layer) => (layer.id === updated.id ? updated : layer)));
  };

  const handleAddLayer = (newLayer: CanvasLayer) => {
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId('');
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-800 overflow-hidden font-sans antialiased select-none relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pink-200/40 blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-sky-200/35 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-fuchsia-200/30 blur-[120px] animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-rose-100/35 blur-[100px] animate-pulse" style={{ animationDuration: '15s' }} />
      </div>

      <header className="h-14 border-b border-slate-200/70 flex items-center justify-between px-4 shrink-0 bg-white/75 backdrop-blur-xl z-30 shadow-xs relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-black bg-gradient-to-r ${SOFT_PINK_LILAC_GRADIENT_CLASSES} bg-clip-text text-transparent select-none font-sans pl-1 tracking-wide`}>
              Kacey
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4 py-1">
            <span className="text-xs font-bold text-slate-700">未命名</span>
            <div className="w-4 h-4 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-400 text-[10px]" title="云端自动同步中">
              ☁️
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('【通知中心】没有未读新通知。')}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 relative transition-all active:scale-97"
            title="通知"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          </button>

          <div
            onClick={() => alert('已登录用户： kuanglijun9@163.com')}
            className="relative group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                alt="User Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10 bg-transparent">
        <CanvasWorkspace
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={handleSelectLayer}
          onUpdateLayer={handleUpdateLayer}
          onAddLayer={handleAddLayer}
          onDeleteLayer={handleDeleteLayer}
          history={history}
          onDeleteHistory={handleDeleteHistory}
        />
      </div>
    </div>
  );
}
