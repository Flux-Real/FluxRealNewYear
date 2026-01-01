import { create } from 'zustand';

export type Stage = 0 | 1 | 2 | 3 | 4 | 5;

interface PeakStore {
  currentStage: Stage;
  soundEnabled: boolean;
  recipientName: string | null;
  isLoaded: boolean;
  loadingProgress: number;
  
  // Actions
  advance: () => void;
  setRecipientName: (name: string | null) => void;
  toggleSound: () => void;
  setLoaded: (loaded: boolean) => void;
  setLoadingProgress: (progress: number) => void;
}

export const usePeakStore = create<PeakStore>((set, get) => ({
  currentStage: 0,
  soundEnabled: true,
  recipientName: null,
  isLoaded: false,
  loadingProgress: 0,

  advance: () => {
    const { currentStage } = get();
    if (currentStage < 5) {
      set({ currentStage: (currentStage + 1) as Stage });
      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  },

  setRecipientName: (name) => set({ recipientName: name }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}));
