import { create } from "zustand";

export interface GpolPointChannel {
  x: number;
  y: number;
  values: number[];
}

export interface GpolSliceResult {
  width: number;
  height: number;
  m: number;
  points: GpolPointChannel[];
  point:number[];
}

export interface GpolResult {
  path: string;
  vs: number[][];
}

interface GpolStore {
  gpolData: GpolResult | null;
  gpolPoints: GpolSliceResult | null;
  setGpolData: (data: GpolResult) => void;
  setGpolPoints: (data: GpolSliceResult) => void;
  clearGpolData: () => void;
}

export const useGpolStore = create<GpolStore>((set) => ({
  gpolData: null,
  gpolPoints: null,
  setGpolData: (data) => set({ gpolData: data }),
  setGpolPoints: (data) => set({ gpolPoints: data }),
  clearGpolData: () => set({ gpolData: null, gpolPoints: null }),
}));
