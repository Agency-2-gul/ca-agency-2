import { create } from 'zustand';

const useMacroStore = create((set) => ({
  carbs: 0,
  protein: 0,
  fat: 0,
  carbGoal: 0,
  proteinGoal: 0,
  fatGoal: 0,
  trigger: 0,

  setMacros: ({ carbs, protein, fat }) => set({ carbs, protein, fat }),
  setMacroGoals: ({ carbGoal, proteinGoal, fatGoal }) =>
    set({ carbGoal, proteinGoal, fatGoal }),
  resetMacros: () => set({ carbs: 0, protein: 0, fat: 0 }),

  triggerUpdate: () => set((state) => ({ trigger: state.trigger + 1 })),
  refreshMacros: () => set((state) => ({ trigger: state.trigger + 1 })),
}));

export default useMacroStore;
