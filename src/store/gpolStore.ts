import { create } from "zustand";

interface GpolDataState {
  gpolData: any; // 你也可以具体定义类型
  setGpolData: (data: any) => void;
  clearGpolData: () => void;
}

export const useGpolStore = create<GpolDataState>((set) => ({
  gpolData: null,
  setGpolData: (data) => set({ gpolData: data }),
  clearGpolData: () => set({ gpolData: null }),
}));
