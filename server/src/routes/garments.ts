import { Router } from 'express';
import { db, storage } from '../config/firebase';
import { GarmentDoc, GarmentResponse } from '../types';

export const garmentsRouter = Router();

const SIGNED_URL_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

async function resolveUrl(path: string): Promise<string> {
  const [url] = await storage
    .bucket()
    .file(path)
    .getSignedUrl({ action: 'read', expires: Date.now() + SIGNED_URL_EXPIRY_MS });
  return url;
}

async function toResponse(id: string, doc: GarmentDoc): Promise<GarmentResponse> {
  const [modelUrl, frontTextureUrl, backTextureUrl] = await Promise.all([
    resolveUrl(doc.modelPath),
    resolveUrl(doc.frontTexturePath),
    doc.backTexturePath ? resolveUrl(doc.backTexturePath) : Promise.resolve(undefined),
  ]);

  return {
    id,
    name: doc.name,
    category: doc.category,
    templateId: doc.templateId,
    modelUrl,
    frontTextureUrl,
    backTextureUrl,
    dimensions: doc.dimensions,
  };
}

// GET /api/garments — list the curated catalog
garmentsRouter.get('/', async (_req, res) => {
  const snapshot = await db.collection('garments').orderBy('createdAt', 'desc').get();
  const garments = await Promise.all(
    snapshot.docs.map((d) => toResponse(d.id, d.data() as GarmentDoc))
  );
  res.json({ garments });
});

// GET /api/garments/:id — single garment, used when a QR/link resolves to an id
garmentsRouter.get('/:id', async (req, res) => {
  const doc = await db.collection('garments').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).json({ error: 'Garment not found' });
    return;
  }
  const garment = await toResponse(doc.id, doc.data() as GarmentDoc);
  res.json({ garment });
});
