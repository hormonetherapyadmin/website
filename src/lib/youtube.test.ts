import { describe, expect, it } from "vitest";
import { youtubeEmbedUrl, youtubeVideo } from "./youtube";

describe("youtubeVideo", () => {
  it.each([
    "https://youtu.be/_OlA4wXOHdQ",
    "https://www.youtube.com/watch?v=_OlA4wXOHdQ",
    "https://m.youtube.com/watch?v=_OlA4wXOHdQ&feature=share",
    "https://youtube.com/shorts/_OlA4wXOHdQ",
    "https://www.youtube.com/embed/_OlA4wXOHdQ",
    "https://www.youtube.com/live/_OlA4wXOHdQ",
    "https://www.youtube-nocookie.com/embed/_OlA4wXOHdQ",
  ])("reads the video id from %s", (href) => {
    expect(youtubeVideo(href)).toEqual({ id: "_OlA4wXOHdQ" });
  });

  it("keeps a start time", () => {
    expect(youtubeVideo("https://youtu.be/_OlA4wXOHdQ?t=90")).toEqual({
      id: "_OlA4wXOHdQ",
      start: 90,
    });
    expect(
      youtubeVideo("https://www.youtube.com/watch?v=_OlA4wXOHdQ&t=1m30s"),
    ).toEqual({ id: "_OlA4wXOHdQ", start: 90 });
  });

  it.each([
    undefined,
    "",
    "/post/alloy-review",
    "https://vimeo.com/123456",
    "https://youtu.be/abc",
    "https://www.youtube.com/@peggy",
    "https://www.youtube.com/watch",
    "https://notyoutube.com/watch?v=_OlA4wXOHdQ",
    "javascript:alert(1)",
  ])("ignores %s", (href) => {
    expect(youtubeVideo(href)).toBeNull();
  });
});

describe("youtubeEmbedUrl", () => {
  it("uses the privacy-enhanced player and autoplays", () => {
    expect(youtubeEmbedUrl({ id: "_OlA4wXOHdQ", start: 90 })).toBe(
      "https://www.youtube-nocookie.com/embed/_OlA4wXOHdQ?autoplay=1&rel=0&playsinline=1&start=90",
    );
  });
});
