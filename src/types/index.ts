export type VideoProvider = "youtube" | "dailymotion" | "vimeo";

export interface VideoSource {
  provider: VideoProvider;
  videoId: string;
  startAt?: number;
}

export interface VideoPlayerProps {
  source: VideoSource;
  onEnded?: () => void;
}
