import * as THREE from 'three';
import { GarmentCategory } from '../../types';

/**
 * Pre-built garment-type templates (t-shirt, pants, dress, ...) — the
 * template-warping approach from the project brief, stood up here as
 * primitive shells since we don't have curated .glb templates yet. Swapping
 * in a real sculpted+textured .glb later only means replacing what
 * buildTemplate returns; callers (snapGarmentToMannequin) don't change.
 *
 * Local origin (0,0,0) for every template is the point that gets snapped to
 * the mannequin anchor for its category — see ANCHOR_BY_CATEGORY in
 * snapGarment.ts. For tops/dresses that's the collar/shoulder line; for
 * bottoms it's the waistband.
 */

export interface GarmentTemplate {
  group: THREE.Group;
  category: GarmentCategory;
  setColor: (hex: string) => void;
}

function shirtLikeShell(torsoLength: number, hemFlare: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(0.17, 0.17 + hemFlare, torsoLength, 16, 4, true);
  geo.translate(0, -torsoLength / 2, 0);
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#3a6ea5', roughness: 0.8 }));
}

function buildTShirtTemplate(): GarmentTemplate {
  const group = new THREE.Group();
  group.name = 'template_tshirt';

  const body = shirtLikeShell(0.42, 0.02);
  group.add(body);

  const sleeveGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.18, 10);
  const sleeveMat = body.material as THREE.MeshStandardMaterial;

  const sleeveLeft = new THREE.Mesh(sleeveGeo, sleeveMat);
  sleeveLeft.rotation.z = Math.PI / 2.4;
  sleeveLeft.position.set(-0.22, -0.06, 0);

  const sleeveRight = new THREE.Mesh(sleeveGeo.clone(), sleeveMat);
  sleeveRight.rotation.z = -Math.PI / 2.4;
  sleeveRight.position.set(0.22, -0.06, 0);

  group.add(sleeveLeft, sleeveRight);

  const setColor = (hex: string) => sleeveMat.color.set(hex);

  return { group, category: 'top', setColor };
}

function buildPantsTemplate(): GarmentTemplate {
  const group = new THREE.Group();
  group.name = 'template_pants';

  const material = new THREE.MeshStandardMaterial({ color: '#2b2b33', roughness: 0.85 });
  const waistGeo = new THREE.CylinderGeometry(0.17, 0.15, 0.1, 16, 1, true);
  waistGeo.translate(0, -0.05, 0);
  const waist = new THREE.Mesh(waistGeo, material);

  const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.7, 12, 1, true);
  legGeo.translate(0, -0.35, 0);
  const legLeft = new THREE.Mesh(legGeo, material);
  legLeft.position.set(-0.09, -0.1, 0);
  const legRight = new THREE.Mesh(legGeo.clone(), material);
  legRight.position.set(0.09, -0.1, 0);

  group.add(waist, legLeft, legRight);

  return { group, category: 'bottom', setColor: (hex) => material.color.set(hex) };
}

function buildDressTemplate(): GarmentTemplate {
  const group = new THREE.Group();
  group.name = 'template_dress';

  const body = shirtLikeShell(0.85, 0.22);
  group.add(body);

  const sleeveGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.12, 10);
  const material = body.material as THREE.MeshStandardMaterial;
  const sleeveLeft = new THREE.Mesh(sleeveGeo, material);
  sleeveLeft.rotation.z = Math.PI / 2.2;
  sleeveLeft.position.set(-0.21, -0.05, 0);
  const sleeveRight = new THREE.Mesh(sleeveGeo.clone(), material);
  sleeveRight.rotation.z = -Math.PI / 2.2;
  sleeveRight.position.set(0.21, -0.05, 0);
  group.add(sleeveLeft, sleeveRight);

  return { group, category: 'dress', setColor: (hex) => material.color.set(hex) };
}

const BUILDERS: Record<string, () => GarmentTemplate> = {
  tshirt: buildTShirtTemplate,
  pants: buildPantsTemplate,
  dress: buildDressTemplate,
};

export function buildTemplate(templateId: string): GarmentTemplate {
  const builder = BUILDERS[templateId];
  if (!builder) throw new Error(`Unknown garment template "${templateId}"`);
  return builder();
}
