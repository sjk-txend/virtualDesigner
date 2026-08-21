import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_MEASUREMENTS,
  GarmentAsset,
  Measurements,
  SKIN_TONES,
  SkinTone,
} from '../types';

interface AppStateValue {
  measurements: Measurements;
  setMeasurements: (m: Measurements) => void;
  skinTone: SkinTone;
  setSkinTone: (t: SkinTone) => void;
  activeGarment: GarmentAsset | null;
  setActiveGarment: (g: GarmentAsset | null) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [skinTone, setSkinTone] = useState<SkinTone>(SKIN_TONES[1]);
  const [activeGarment, setActiveGarment] = useState<GarmentAsset | null>(null);

  const value = useMemo(
    () => ({
      measurements,
      setMeasurements,
      skinTone,
      setSkinTone,
      activeGarment,
      setActiveGarment,
    }),
    [measurements, skinTone, activeGarment]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
