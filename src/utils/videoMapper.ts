import type { VideoSource } from "../types";

export const mapApiVideoToSource = (video: any): VideoSource => {
  if (video.provider.toLowerCase() === "youtube") {
    const videoId = new URL(video.url).searchParams.get("v");
    if (!videoId) throw new Error("Invalid YouTube URL");

    return {
      provider: "youtube",
      videoId,
    };
  }

  if (video.provider.toLowerCase() === "dailymotion") {
    const parts = video.url.split("/video/");
    const videoId = parts[1];

    return {
      provider: "dailymotion",
      videoId,
    };
  }

  throw new Error("Unsupported provider");
};
