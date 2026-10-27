import { create } from "zustand";

export type ProgressState = "idle" | "loading" | "completing";

interface UiState {
  progressState: ProgressState;
  startProgress: () => void;
  completeProgress: () => void;
  /**
   * Backward-compatibility alias for startProgress
   */
  triggerProgress: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  progressState: "idle",
  startProgress: () => {
    set({ progressState: "loading" });
  },
  completeProgress: () => {
    if (get().progressState !== "idle") {
      set({ progressState: "completing" });
    }
  },
  triggerProgress: () => {
    get().startProgress();
  },
}));
