import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadTextureAsync } from 'expo-three';
import { GarmentAsset } from '../../types';
import { GarmentTemplate } from './garmentTemplates';

/**
 * Production path: fetches a curated garment's .glb (a template pre-warped
 * with the item's front/back photos at asset-prep time — see
 * FIREBASE_SCHEMA.md) and its textures from the signed URLs the backend
 * hands back. Not wired into any screen yet since there's no real curated
 * asset to point it at; TryOnScreen uses the procedural templates in
 * garmentTemplates.ts until the first real .glb lands in Storage.
 */
export async function loadGarmentModel(garment: GarmentAsset): Promise<GarmentTemplate> {
  const loader = new GLTFLoader();
  const gltf = await new Promise<any>((resolve, reject) => {
    loader.load(garment.modelUrl, resolve, undefined, reject);
  });

  const group: THREE.Group = gltf.scene;
  group.name = `garment_${garment.id}`;

  const frontTexture = await loadTextureAsync({ asset: garment.frontTextureUrl as any });
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.85 });
    }
  });

  return {
    group,
    category: garment.category,
    setColor: () => {
      // Textured garments don't respond to a flat color override.
    },
  };
}
