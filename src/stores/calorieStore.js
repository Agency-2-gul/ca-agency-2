import { create } from 'zustand';

const useCalorieStore = create((set) => ({
  consumedCalories: 0,
  setConsumedCalories: (value) => set({ consumedCalories: value }),

  // optional: trigger re-fetching manually
  triggerUpdate: 0,
  refreshCalories: () =>
    set((state) => ({ triggerUpdate: state.triggerUpdate + 1 })),
}));

export default useCalorieStore;
