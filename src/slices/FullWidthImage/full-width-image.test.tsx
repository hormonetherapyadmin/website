import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import { FullWidthImage } from "./index";
import styles from "./full-width-image.module.css";

vi.mock("next/image", () => ({
  default: (props: {
    alt?: string;
    src?: string;
    className?: string;
    sizes?: string;
  }) =>
    createElement("img", {
      alt: props.alt ?? "",
      src: props.src,
      className: props.className,
      sizes: props.sizes,
    }),
}));

const emptyImage = {} as ImageField;

function image(url: string, alt: string | null): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width: 1600, height: 900 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

describe("Full width image", () => {
  it("renders nothing when the image is empty", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: emptyImage,
          background: "Transparent",
          space_above: "Medium",
          space_below: "None",
        }}
      />,
    );

    expect(html).toBe("");
  });

  it("fills the content column and keeps the image description", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/posts/oestra-vs-winona.jpg",
            "Oestra and Winona",
          ),
          background: "Transparent",
          space_above: "None",
          space_below: "None",
        }}
      />,
    );

    expect(html).toContain("max-w-wrap");
    expect(html).toContain("px-gutter");
    expect(html).toContain(styles.photo);
    expect(html).toContain('alt="Oestra and Winona"');
    expect(html).toContain('src="/mockup/posts/oestra-vs-winona.jpg"');
    expect(html).not.toContain("<h2");
    expect(html).not.toContain("py-slice");
  });

  it("renders a Prismic image at the column width", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: image(
            "https://images.prismic.io/1shr96di/photo.jpg",
            "A photo",
          ),
          background: "Transparent",
          space_above: "None",
          space_below: "None",
        }}
      />,
    );

    expect(html).toContain(styles.photo);
    expect(html).toContain('alt="A photo"');
    expect(html).toContain("max-w-wrap");
  });

  it("uses a medium gap above when spacing is unset", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: image("/mockup/peggy-winston.jpg", "Peggy and Winston"),
          background: null,
          space_above: null,
          space_below: null,
        }}
      />,
    );

    expect(html).toContain("mt-slice");
    expect(html).toContain("mb-0");
    expect(html).not.toContain("mt-0");
  });

  it("paints a band behind the image", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: image("/mockup/peggy-winston.jpg", ""),
          background: "Pink",
          space_above: "Small",
          space_below: "Large",
        }}
      />,
    );

    expect(html).toContain("bg-card-1");
    expect(html).toContain("py-slice");
    expect(html).toContain("mt-slice-sm");
    expect(html).toContain("mb-slice-lg");
    expect(html).toContain('alt=""');
    expect(html).toContain("px-gutter");
  });

  it("runs to the edges of the window when edge to edge is on", () => {
    const html = renderToStaticMarkup(
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/posts/oestra-vs-winona.jpg",
            "Oestra and Winona",
          ),
          edge_to_edge: true,
          background: "Pink",
          space_above: "None",
          space_below: "None",
        }}
      />,
    );

    expect(html).toContain('sizes="100vw"');
    expect(html).toContain("bg-card-1");
    expect(html).toContain("py-slice");
    expect(html).not.toContain("max-w-wrap");
    expect(html).not.toContain("px-gutter");
  });
});
