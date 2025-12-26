import type { VideoSource } from "../types";
import DailymotionPlayer from "./Dailymotion";
import YouTubePlayer from "./Youtube";


interface VideoPlayerProps {
  source: VideoSource;
  onEnded?: () => void;
}

const VideoPlayer = ({ source, onEnded }: VideoPlayerProps) => {
  switch (source.provider) {
    case "youtube":
      return (
        <YouTubePlayer
          videoId={source.videoId}
          startAt={source.startAt}
          onEnded={onEnded}
        />
      );

    case "dailymotion":
      return (
        <DailymotionPlayer
          videoId={source.videoId}
          startAt={source.startAt}
          onEnded={onEnded}
        />
      );

    default:
      return null;
  }
};

export default VideoPlayer;
