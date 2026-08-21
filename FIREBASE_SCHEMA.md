# Firebase schema

## Firestore

### `users/{uid}`
```
email: string
createdAt: timestamp
```

### `users/{uid}/profile/measurements` (single doc)
```
height: number   // cm
chest: number    // cm
waist: number    // cm
hips: number      // cm
skinToneId: string  // matches SKIN_TONES id in mobile/src/types
updatedAt: timestamp
```

### `garmentTemplates/{templateId}`
Pre-built template meshes, one per garment category (t-shirt, dress, pants, ...).
Curated by the team, not user-generated.
```
category: 'top' | 'bottom' | 'dress'
modelPath: string        // Storage path to the base .glb
anchorName: string        // which mannequin anchor this template snaps to
                           // (e.g. 'chest' for tops, 'hip_pivot' for bottoms)
```

### `garments/{garmentId}`
One catalog entry per photographed/curated item. Textures are warped onto
the matching template at asset-prep time (offline pipeline), not at runtime.
```
name: string
category: 'top' | 'bottom' | 'dress'
templateId: string             // -> garmentTemplates/{templateId}
modelPath: string              // Storage path to the (possibly per-item) .glb
frontTexturePath: string       // Storage path to front photo
backTexturePath?: string       // Storage path to back photo
dimensions?: {
  chestWidth?: number
  length?: number
  waistWidth?: number
  hipWidth?: number
  inseam?: number
}
createdAt: timestamp
```

The backend (`server/`) resolves `*Path` fields to short-lived signed URLs
before sending `GarmentResponse` to the client — the client never talks to
Storage or Firestore directly for garment data.

## Firebase Storage layout

```
garmentTemplates/{templateId}/template.glb
garments/{garmentId}/model.glb
garments/{garmentId}/front.jpg
garments/{garmentId}/back.jpg
```

## Firebase Auth

Email/password to start (simplest for MVP); anonymous auth is acceptable as
a placeholder while there's no account-gated feature yet.

## Why the backend sits in front of Storage/Firestore for garments

Garment docs need `getSignedUrl`, which requires a service account — that
can only run server-side, not from the RN client. The mobile app talks to
`server/`'s `/api/garments` routes; it can still talk to Firestore/Storage
directly for anything user-owned (measurements, auth) since those are
covered by Firestore security rules instead.
