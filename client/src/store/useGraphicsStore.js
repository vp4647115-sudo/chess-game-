import { create } from 'zustand';

export const useGraphicsStore = create((set) => ({
  quality: 'high', // 'low', 'medium', 'high', 'ultra'
  hdr: true,
  bloom: true,
  ambientOcclusion: true,
  reflections: true,
  shadows: true,
  motionBlur: false,
  antiAliasing: true,
  fpsLimit: 60,

  setQuality: (quality) => {
    switch (quality) {
      case 'low':
        set({ quality: 'low', hdr: false, bloom: false, ambientOcclusion: false, reflections: false, shadows: false, fpsLimit: 30 });
        break;
      case 'medium':
        set({ quality: 'medium', hdr: true, bloom: false, ambientOcclusion: false, reflections: true, shadows: true, fpsLimit: 60 });
        break;
      case 'high':
        set({ quality: 'high', hdr: true, bloom: true, ambientOcclusion: true, reflections: true, shadows: true, fpsLimit: 60 });
        break;
      case 'ultra':
        set({ quality: 'ultra', hdr: true, bloom: true, ambientOcclusion: true, reflections: true, shadows: true, fpsLimit: 120 });
        break;
      default:
        break;
    }
  },

  toggleSetting: (key) => set((state) => ({ [key]: !state[key] })),
  setFpsLimit: (fps) => set({ fpsLimit: fps })
}));
