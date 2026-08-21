import * as THREE from 'three';
import { Mannequin } from './mannequin';
import { GarmentTemplate } from './garmentTemplates';
import { AnchorName, DEFAULT_MEASUREMENTS, GarmentCategory, Measurements } from '../../types';

/**
 * Different garment categories anchor to different points on the mannequin
 * skeleton — a top hangs from the shoulders/chest, a bottom sits at the
 * waist/hip, a dress hangs from the chest like a top but reads its girth
 * off the hips at the hem. One universal anchor does not work for all of
 * these (see project brief), so this is a lookup, not a constant.
 */
const ANCHOR_BY_CATEGORY: Record<GarmentCategory, AnchorName> = {
  top: 'chest',
  bottom: 'hip_pivot',
  dress: 'chest',
};

/** Which measurement drives how wide the garment is rendered, per category. */
function girthScaleFor(category: GarmentCategory, measurements: Measurements): number {
  switch (category) {
    case 'top':
      return measurements.chest / DEFAULT_MEASUREMENTS.chest;
    case 'bottom':
      return measurements.hips / DEFAULT_MEASUREMENTS.hips;
    case 'dress':
      // Dresses need to clear both chest and hips; use whichever is larger
      // relative to the default so the garment never clips into the body.
      return Math.max(
        measurements.chest / DEFAULT_MEASUREMENTS.chest,
        measurements.hips / DEFAULT_MEASUREMENTS.hips
      );
  }
}

/**
 * Parents the garment onto the mannequin's anchor for its category and
 * scales it to the current body measurements. Call again whenever
 * measurements change — it's idempotent (re-parenting a group that's
 * already parented to `mannequin.group` is a no-op beyond the transform
 * update).
 */
export function snapGarmentToMannequin(
  template: GarmentTemplate,
  mannequin: Mannequin,
  measurements: Measurements
): void {
  const anchorName = ANCHOR_BY_CATEGORY[template.category];
  const anchor = mannequin.anchors[anchorName];

  if (template.group.parent !== mannequin.group) {
    mannequin.group.add(template.group);
  }
  template.group.position.copy(anchor.position);

  const girth = girthScaleFor(template.category, measurements);
  template.group.scale.set(girth, 1, girth);
}

export function removeGarment(template: GarmentTemplate): void {
  template.group.parent?.remove(template.group);
}
