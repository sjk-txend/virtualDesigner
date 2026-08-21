export type AnchorName =
  | 'root'
  | 'spine_02'
  | 'chest'
  | 'shoulder_left'
  | 'shoulder_right'
  | 'waist_pivot'
  | 'hip_pivot'
  | 'neck';

export interface Measurements {
  /** cm */
  height: number;
  /** cm */
  chest: number;
  /** cm */
  waist: number;
  /** cm */
  hips: number;
}

export const DEFAULT_MEASUREMENTS: Measurements = {
  height: 170,
  chest: 92,
  waist: 78,
  hips: 98,
};

export const MEASUREMENT_RANGES: Record<keyof Measurements, { min: number; max: number }> = {
  height: { min: 140, max: 210 },
  chest: { min: 70, max: 140 },
  waist: { min: 55, max: 130 },
  hips: { min: 70, max: 140 },
};

export type SkinTone = { id: string; label: string; hex: string };

export const SKIN_TONES: SkinTone[] = [
  { id: 'tone-1', label: 'Porcelain', hex: '#f4d4c0' },
  { id: 'tone-2', label: 'Fair', hex: '#e8b892' },
  { id: 'tone-3', label: 'Medium', hex: '#c68a5f' },
  { id: 'tone-4', label: 'Tan', hex: '#a3673f' },
  { id: 'tone-5', label: 'Deep', hex: '#6b4128' },
  { id: 'tone-6', label: 'Rich', hex: '#3f2417' },
];

export type GarmentCategory = 'top' | 'bottom' | 'dress';

export interface GarmentAsset {
  id: string;
  name: string;
  category: GarmentCategory;
  templateId: string;
  /** Firebase Storage download URL for the .glb template mesh */
  modelUrl: string;
  /** Firebase Storage download URL for the front texture photo */
  frontTextureUrl: string;
  /** Firebase Storage download URL for the back texture photo */
  backTextureUrl?: string;
  /** Real-world garment dimensions used to scale the template, cm */
  dimensions?: {
    chestWidth?: number;
    length?: number;
    waistWidth?: number;
    hipWidth?: number;
    inseam?: number;
  };
}
