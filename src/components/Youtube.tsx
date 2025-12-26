/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useId } from "react";

interface YouTubePlayerProps {
  videoId: string;
  startAt?: number;
  endAt?: number;
  onEnded?: () => void;
}

const YouTubePlayer = ({
  videoId,
  startAt,
  endAt,
  onEnded,
}: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const reactId = useId(); // ← React-safe ID
  const containerId = `yt-player-${reactId}`;

  useEffect(() => {
    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          start: startAt,
          end: endAt,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnded?.();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      playerRef.current?.destroy?.();
    };
  }, [videoId, startAt, endAt, onEnded, containerId]);

  return <div id={containerId} />;
};

export default YouTubePlayer;
