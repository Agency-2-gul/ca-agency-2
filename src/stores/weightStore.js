import { create } from 'zustand';

const useWeightStore = create((set) => ({
  trigger: 0,
  refreshWeights: () => set((state) => ({ trigger: state.trigger + 1 })),
}));

export default useWeightStore;
