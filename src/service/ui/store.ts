import { create } from "zustand";

interface UiState {
  progressKey: number;
  triggerProgress: () => void;
}

/**
 * Zustand store to control UI notifications, global animations,
 * and the 2-second debounced top loading bar.
 */
export const useUiStore = create<UiState>((set) => ({
  progressKey: 0,
  triggerProgress: () => {
    set((state) => ({ progressKey: state.progressKey + 1 }));
  },
}));

