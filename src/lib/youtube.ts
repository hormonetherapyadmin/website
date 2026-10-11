export type YouTubeVideo = {
  id: string;
  /** Seconds into the video, from a `t` or `start` in the link. */
  start?: number;
};

const VIDEO_ID = /^[\w-]{11}$/;
const PATH_KINDS = new Set(["embed", "shorts", "live", "v"]);
const TIME = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/;

function seconds(value: string | null) {
  const match = value ? TIME.exec(value) : null;
  if (!match) return undefined;
  const [, hours = "0", minutes = "0", secs = "0"] = match;
  const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(secs);
  return total > 0 ? total : undefined;
}

/** The video in a YouTube link, or null for any other link. */
export function youtubeVideo(
  href: string | null | undefined,
): YouTubeVideo | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");
  const [, first, second] = url.pathname.split("/");
  let id: string | null | undefined;
  if (host === "youtu.be") {
    id = first;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = first === "watch" ? url.searchParams.get("v") : undefined;
    if (PATH_KINDS.has(first)) id = second;
  }
  if (!id || !VIDEO_ID.test(id)) return null;

  const start = seconds(
    url.searchParams.get("t") ?? url.searchParams.get("start"),
  );
  return start ? { id, start } : { id };
}

/** The privacy-enhanced player. It plays as soon as it loads. */
export function youtubeEmbedUrl({ id, start }: YouTubeVideo) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    playsinline: "1",
  });
  if (start) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
