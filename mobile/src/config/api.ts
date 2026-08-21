import Constants from 'expo-constants';
import { GarmentAsset } from '../types';

const API_BASE_URL: string = Constants.expoConfig?.extra?.apiBaseUrl ?? 'http://localhost:4000';

export async function fetchGarment(id: string): Promise<GarmentAsset> {
  const res = await fetch(`${API_BASE_URL}/api/garments/${id}`);
  if (!res.ok) throw new Error(`Garment ${id} not found (${res.status})`);
  const { garment } = await res.json();
  return garment;
}

export async function fetchGarmentCatalog(): Promise<GarmentAsset[]> {
  const res = await fetch(`${API_BASE_URL}/api/garments`);
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
  const { garments } = await res.json();
  return garments;
}
