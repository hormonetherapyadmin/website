import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VideoLink } from "./video-link";

describe("VideoLink", () => {
  it("server-renders the plain YouTube link and no player", () => {
    const html = renderToStaticMarkup(
      <VideoLink href="https://youtu.be/_OlA4wXOHdQ" title="Watch my review">
        Watch my review
      </VideoLink>,
    );

    expect(html).toContain('href="https://youtu.be/_OlA4wXOHdQ"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<dialog");
  });

  it("leaves a link that is not a YouTube video as a plain link", () => {
    const html = renderToStaticMarkup(
      <VideoLink href="https://vimeo.com/123456" title="Watch">
        Watch
      </VideoLink>,
    );

    expect(html).toContain('href="https://vimeo.com/123456"');
    expect(html).not.toContain("aria-haspopup");
  });
});
