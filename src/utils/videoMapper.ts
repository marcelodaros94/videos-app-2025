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
    const url = new URL(video.url);
    const videoId = url.pathname.split("/video/")[1];
    const rawStartAt = url.searchParams.get("start") ?? url.searchParams.get("startTime");
    const startAt = rawStartAt === null ? undefined : Number(rawStartAt);

    if (!videoId || (startAt !== undefined && !Number.isFinite(startAt))) {
      throw new Error("Invalid Dailymotion URL");
    }

    const source: VideoSource = {
      provider: "dailymotion",
      videoId,
    };

    if (startAt !== undefined) source.startAt = Math.max(0, startAt);

    return source;
  }

  throw new Error("Unsupported provider");
};
