import { create } from "zustand";

interface VideoStore {
  results: any[];
  selectedVideo: any | null;
  setResults: (videos: any[]) => void;
  appendResults: (videos: any[]) => void;
  selectVideo: (video: any) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  results: [],
  selectedVideo: null,

  setResults: (videos) => set({ results: videos }),

  appendResults: (videos) =>
    set((state) => ({ results: [...state.results, ...videos] })),

  selectVideo: (video) => set({ selectedVideo: video }),
}));
