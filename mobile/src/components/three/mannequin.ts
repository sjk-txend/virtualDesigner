import * as THREE from 'three';
import { AnchorName, Measurements, DEFAULT_MEASUREMENTS } from '../../types';

/**
 * Procedural placeholder mannequin (MVP stand-in for a sculpted body mesh).
 * Built from primitives sized off DEFAULT_MEASUREMENTS, then non-uniformly
 * scaled per body segment to approximate the target measurements. This is
 * the naive-scaling fallback the project brief allows for MVP; swapping in
 * a morph-target mesh later only requires replacing buildMannequin's guts —
 * the anchor map and applyMeasurements contract stay the same.
 */

const BASE_HEIGHT_CM = DEFAULT_MEASUREMENTS.height;
// cm -> scene units (1 unit = 1 meter, mannequin ~1.7 units tall)
const CM_TO_UNITS = 1 / 100;

export interface Mannequin {
  group: THREE.Group;
  anchors: Record<AnchorName, THREE.Object3D>;
  segments: {
    torso: THREE.Mesh;
    hips: THREE.Mesh;
    head: THREE.Mesh;
    legLeft: THREE.Mesh;
    legRight: THREE.Mesh;
    armLeft: THREE.Mesh;
    armRight: THREE.Mesh;
  };
  applyMeasurements: (m: Measurements) => void;
  setSkinColor: (hex: string) => void;
}

function makeAnchor(name: string): THREE.Object3D {
  const o = new THREE.Object3D();
  o.name = name;
  return o;
}

export function buildMannequin(): Mannequin {
  const group = new THREE.Group();
  group.name = 'mannequin_root';

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e8b892'),
    roughness: 0.7,
    metalness: 0.0,
  });

  // Base proportions (roughly anatomical, in scene units) for a 170cm figure.
  const legLength = 0.78;
  const hipHeight = 0.06;
  const torsoHeight = 0.5;
  const neckHeight = 0.05;
  const headRadius = 0.11;
  const armLength = 0.62;

  // --- Legs ---
  const legGeo = new THREE.CapsuleGeometry(0.08, legLength - 0.16, 4, 8);
  const legLeft = new THREE.Mesh(legGeo, skinMaterial);
  legLeft.position.set(-0.1, legLength / 2, 0);
  const legRight = new THREE.Mesh(legGeo.clone(), skinMaterial);
  legRight.position.set(0.1, legLength / 2, 0);

  // --- Hips / pelvis ---
  const hipsGeo = new THREE.CapsuleGeometry(0.16, hipHeight, 4, 8);
  const hips = new THREE.Mesh(hipsGeo, skinMaterial);
  hips.position.set(0, legLength + hipHeight / 2, 0);

  // --- Torso ---
  const torsoGeo = new THREE.CapsuleGeometry(0.15, torsoHeight - 0.15, 4, 8);
  const torso = new THREE.Mesh(torsoGeo, skinMaterial);
  torso.position.set(0, legLength + hipHeight + torsoHeight / 2, 0);

  // --- Neck + head ---
  const neckTopY = legLength + hipHeight + torsoHeight + neckHeight;
  const headGeo = new THREE.SphereGeometry(headRadius, 16, 16);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.set(0, neckTopY + headRadius, 0);

  // --- Arms ---
  const shoulderY = legLength + hipHeight + torsoHeight - 0.05;
  const armGeo = new THREE.CapsuleGeometry(0.055, armLength - 0.11, 4, 8);
  const armLeft = new THREE.Mesh(armGeo, skinMaterial);
  armLeft.position.set(-0.24, shoulderY - armLength / 2, 0);
  const armRight = new THREE.Mesh(armGeo.clone(), skinMaterial);
  armRight.position.set(0.24, shoulderY - armLength / 2, 0);

  group.add(legLeft, legRight, hips, torso, head, armLeft, armRight);

  // --- Anchors: positioned at anatomically meaningful points, parented to
  // the root so garment code can read world position without walking the
  // mesh hierarchy. ---
  const anchors: Record<AnchorName, THREE.Object3D> = {
    root: makeAnchor('root'),
    spine_02: makeAnchor('spine_02'),
    chest: makeAnchor('chest'),
    shoulder_left: makeAnchor('shoulder_left'),
    shoulder_right: makeAnchor('shoulder_right'),
    waist_pivot: makeAnchor('waist_pivot'),
    hip_pivot: makeAnchor('hip_pivot'),
    neck: makeAnchor('neck'),
  };

  anchors.root.position.set(0, 0, 0);
  anchors.hip_pivot.position.set(0, legLength + hipHeight / 2, 0);
  anchors.waist_pivot.position.set(0, legLength + hipHeight + 0.06, 0);
  anchors.spine_02.position.set(0, legLength + hipHeight + torsoHeight / 2, 0);
  anchors.chest.position.set(0, legLength + hipHeight + torsoHeight * 0.75, 0);
  anchors.shoulder_left.position.set(-0.22, shoulderY, 0);
  anchors.shoulder_right.position.set(0.22, shoulderY, 0);
  anchors.neck.position.set(0, neckTopY, 0);

  Object.values(anchors).forEach((a) => group.add(a));

  const segments = { torso, hips, head, legLeft, legRight, armLeft, armRight };

  function applyMeasurements(m: Measurements) {
    const heightScale = m.height / BASE_HEIGHT_CM;
    // Reference circumferences for the base 170/92/78/98 figure.
    const chestScale = m.chest / DEFAULT_MEASUREMENTS.chest;
    const waistScale = m.waist / DEFAULT_MEASUREMENTS.waist;
    const hipsScale = m.hips / DEFAULT_MEASUREMENTS.hips;

    // Uniform height scale on the whole root (naive fallback per project brief).
    group.scale.set(1, heightScale, 1);

    // Per-segment girth scaling (x/z only, so limbs don't get taller twice).
    torso.scale.set(chestScale, 1, chestScale * 0.9 + waistScale * 0.1);
    hips.scale.set(hipsScale, 1, hipsScale);
    legLeft.scale.set(hipsScale * 0.6 + 0.4, 1, hipsScale * 0.6 + 0.4);
    legRight.scale.set(hipsScale * 0.6 + 0.4, 1, hipsScale * 0.6 + 0.4);
  }

  function setSkinColor(hex: string) {
    skinMaterial.color = new THREE.Color(hex);
  }

  applyMeasurements(DEFAULT_MEASUREMENTS);

  return { group, anchors, segments, applyMeasurements, setSkinColor };
}
