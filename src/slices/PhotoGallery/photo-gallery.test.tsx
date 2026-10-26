import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { PhotoGallery, galleryShots, pairShots } from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const empty = [] as RichTextField;

function section(heading: string): SliceSectionFields {
  return {
    small_heading: empty,
    heading: rich(heading),
    intro: empty,
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  };
}

const image = (url: string, alt: string) =>
  ({
    url,
    alt,
    dimensions: { width: 800, height: 1200 },
  }) as ImageField;

describe("galleryShots", () => {
  it("keeps the caption, the color line, and the link", () => {
    const shots = galleryShots([
      {
        image: image("/hair.jpg", "Peggy"),
        caption: rich("With a topper"),
        line: "Dark brown",
        link: {
          link_type: "Web",
          url: "/inner-balance",
          text: "Inner Balance page",
        } as LinkField,
      },
      { image: {} as ImageField, caption: rich("Skipped") },
    ]);

    expect(shots).toEqual([
      {
        src: "/hair.jpg",
        alt: "Peggy",
        width: 800,
        height: 1200,
        caption: "With a topper",
        line: "Dark brown",
        href: "/inner-balance",
        linkLabel: "Inner Balance page",
        blank: false,
      },
    ]);
  });
});

describe("pairShots", () => {
  it("reads before, after, and the link under them", () => {
    const pair = pairShots({
      before: image("/before.jpg", "Before Peggy"),
      before_caption: rich("Before"),
      after: image("/after.jpg", "After Peggy"),
      after_caption: rich("After"),
      link: {
        link_type: "Web",
        url: "/post/alloy-m4-face-cream-review",
        text: "Read the review",
      } as LinkField,
    });

    expect(pair?.before.caption).toBe("Before");
    expect(pair?.after.src).toBe("/after.jpg");
    expect(pair?.href).toBe("/post/alloy-m4-face-cream-review");
    expect(pair?.linkLabel).toBe("Read the review");
  });
});

describe("PhotoGallery", () => {
  it("lists the photos and the pair link", () => {
    const gallery = renderToStaticMarkup(
      <PhotoGallery
        primary={section("Some of my favorite Wigs!")}
        photos={[
          {
            src: "/wig.jpg",
            alt: "Peggy in a wig",
            width: 800,
            height: 1200,
            caption: "Portrait Mode",
            line: "Shaded Biscuit",
          },
        ]}
      />,
    );
    const pair = renderToStaticMarkup(
      <PhotoGallery
        variation="pair"
        primary={section("Alloy M4")}
        pair={{
          before: {
            src: "/before.jpg",
            alt: "Before",
            width: 800,
            height: 1200,
            caption: "Before",
          },
          after: {
            src: "/after.jpg",
            alt: "After",
            width: 800,
            height: 1200,
            caption: "After",
          },
          href: "/post/alloy-m4-face-cream-review",
          linkLabel: "Read the review",
        }}
      />,
    );

    expect(gallery).toContain("Enlarge Portrait Mode");
    expect(gallery).toContain("Shaded Biscuit");
    expect(gallery).not.toContain("<dialog");
    expect(pair).toContain('href="/post/alloy-m4-face-cream-review"');
    expect(pair).toContain("Read the review");
    expect(pair).toContain("Enlarge Before");
  });
});
