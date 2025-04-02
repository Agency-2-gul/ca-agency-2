import { create } from 'zustand';

const useWaterStore = create((set) => ({
  water: 0,
  setWater: (amount) => set({ water: amount }),
  refreshWater: () => set((state) => ({ ...state })),
}));

export default useWaterStore;
