export type GarmentCategory = 'top' | 'bottom' | 'dress';

export interface GarmentDoc {
  name: string;
  category: GarmentCategory;
  templateId: string;
  /** Firebase Storage paths, resolved to download URLs before leaving the API */
  modelPath: string;
  frontTexturePath: string;
  backTexturePath?: string;
  dimensions?: {
    chestWidth?: number;
    length?: number;
    waistWidth?: number;
    hipWidth?: number;
    inseam?: number;
  };
  createdAt: FirebaseFirestore.Timestamp;
}

export interface GarmentResponse {
  id: string;
  name: string;
  category: GarmentCategory;
  templateId: string;
  modelUrl: string;
  frontTextureUrl: string;
  backTextureUrl?: string;
  dimensions?: GarmentDoc['dimensions'];
}
