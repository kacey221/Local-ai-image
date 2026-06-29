import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  buildRightCodesImageRequest,
  buildRightCodesUpscaleRequest,
  bufferToDataUrl,
  postRightCodesGenerationRequest,
} from './server/rightcodes';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function getRightCodesApiKey(): string {
  const apiKey = process.env.RIGHTCODES_API_KEY;
  if (!apiKey) {
    throw new Error('RIGHTCODES_API_KEY environment variable is not defined.');
  }
  return apiKey;
}

async function fetchRemoteImageAsDataUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download generated image from Right Codes (${response.status}).`);
  }

  const contentType = response.headers.get('content-type') || 'image/png';
  const bytes = Buffer.from(await response.arrayBuffer());
  return bufferToDataUrl(contentType, bytes);
}

app.get('/api/config-status', (req, res) => {
  const hasRightCodesKey = !!process.env.RIGHTCODES_API_KEY;
  res.json({
    hasKey: hasRightCodesKey,
    hasRightCodesKey,
    appName: 'AI Image Generation Canvas',
    workspaceRoot: process.cwd(),
  });
});

async function handleRightCodesGenerateImage(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  try {
    const {
      prompt,
      negativePrompt,
      aspectRatio,
      detailLevel,
      batchCount,
      referenceImage,
      referenceBindingNote,
      model,
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const apiKey = getRightCodesApiKey();
    const count = Math.min(Math.max(batchCount || 1, 1), 4);
    const images: string[] = [];

    for (let i = 0; i < count; i += 1) {
      const requestBody = buildRightCodesImageRequest({
        model,
        prompt,
        negativePrompt,
        aspectRatio,
        detailLevel,
        referenceImage,
        referenceBindingNote,
      });

      const data = await postRightCodesGenerationRequest({
        apiKey,
        requestBody,
      });

      const imageUrl = data?.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error(data?.message || 'Right Codes did not return a generated image URL.');
      }

      images.push(await fetchRemoteImageAsDataUrl(imageUrl));
    }

    res.json({ success: true, images });
  } catch (error: any) {
    console.error('Right Codes generate image error:', error);
    res.status(500).json({ error: error.message || 'Error generating image with Right Codes.' });
  }
}

app.post('/api/rightcodes/generate-image', handleRightCodesGenerateImage);
app.post('/api/gemini/generate-image', handleRightCodesGenerateImage);

app.post('/api/rightcodes/upscale-image', async (req, res) => {
  try {
    const {
      image,
      originalPrompt,
      negativePrompt,
      aspectRatio,
      detailLevel,
      model,
    } = req.body;

    if (!image) {
      res.status(400).json({ error: 'Source image is required.' });
      return;
    }

    const apiKey = getRightCodesApiKey();
    const requestBody = buildRightCodesUpscaleRequest({
      image,
      originalPrompt,
      negativePrompt,
      aspectRatio,
      detailLevel,
      model,
    });

    const data = await postRightCodesGenerationRequest({
      apiKey,
      requestBody,
    });

    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error(data?.message || 'Right Codes did not return an upscaled image URL.');
    }

    res.json({
      success: true,
      image: await fetchRemoteImageAsDataUrl(imageUrl),
    });
  } catch (error: any) {
    console.error('Right Codes upscale image error:', error);
    res.status(500).json({ error: error.message || 'Error upscaling image with Right Codes.' });
  }
});

app.post('/api/gemini/enhance-prompt', (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
  res.json({
    original: prompt,
    enhanced: prompt,
    info: 'Prompt enhancement is disabled in the Right Codes-only build.',
  });
});

function respondRemovedImageEditFeature(
  res: express.Response,
  featureName: string,
): void {
  res.status(410).json({
    error: `${featureName} is not available in the Right Codes-only build.`,
  });
}

app.post('/api/gemini/edit-image', (req, res) => {
  respondRemovedImageEditFeature(res, 'Image editing');
});

app.post('/api/gemini/upscale-image', (req, res) => {
  respondRemovedImageEditFeature(res, 'Upscaling');
});

app.post('/api/gemini/outpaint-image', (req, res) => {
  respondRemovedImageEditFeature(res, 'Outpainting');
});

app.post('/api/gemini/cutout-image', (req, res) => {
  respondRemovedImageEditFeature(res, 'Background cutout');
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
