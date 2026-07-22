import { create } from 'zustand';

export const useSoundStore = create((set) => ({
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.6,
  musicVolume: 0.3,

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
  setSoundVolume: (vol) => set({ soundVolume: vol }),
  setMusicVolume: (vol) => set({ musicVolume: vol }),
}));
