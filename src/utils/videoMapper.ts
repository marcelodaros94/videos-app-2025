import type { VideoSource } from "../types";

const parseStartAt = (rawValue: string | null): number | undefined => {
  if (!rawValue) return undefined;

  if (/^\d+$/.test(rawValue)) return Number(rawValue);

  const match = rawValue.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match || match.slice(1).every((value) => value === undefined)) return undefined;

  const [, hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export const mapApiVideoToSource = (video: any): VideoSource => {
  if (video.provider.toLowerCase() === "youtube") {
    const url = new URL(video.url);
    const videoId = url.searchParams.get("v");
    const startAt = parseStartAt(url.searchParams.get("start") ?? url.searchParams.get("t"));
    if (!videoId || (startAt !== undefined && !Number.isFinite(startAt))) {
      throw new Error("Invalid YouTube URL");
    }

    const source: VideoSource = {
      provider: "youtube",
      videoId,
    };

    if (startAt !== undefined) source.startAt = Math.max(0, startAt);

    return source;
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
