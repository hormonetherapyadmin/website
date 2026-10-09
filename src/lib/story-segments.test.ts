import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { storySegments } from "./story-segments";

const paragraph = (text: string) => ({
  type: "paragraph" as const,
  text,
  spans: [],
});

const image = (alt: string) => ({
  type: "image" as const,
  id: alt,
  url: `https://images.prismic.io/example/${alt}.jpg`,
  alt,
  copyright: null,
  dimensions: { width: 800, height: 1000 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
});

const listItem = (text: string) => ({
  type: "o-list-item" as const,
  text,
  spans: [],
});

describe("storySegments", () => {
  it("places the next two photos and their captions in one row", () => {
    const before = image("Peggy in 2018");
    const after = image("Peggy in 2026");
    const segments = storySegments([
      paragraph("The story so far."),
      paragraph("{{photos}}"),
      before,
      paragraph("Before 2018 · Age 52"),
      after,
      paragraph("After 2026 · Age 59"),
      paragraph("Then the story continues."),
    ] as RichTextField);

    expect(segments.map((segment) => segment.kind)).toEqual([
      "rich",
      "photos",
      "rich",
    ]);
    expect(segments[1]).toMatchObject({
      kind: "photos",
      cells: [
        { image: before, caption: [paragraph("Before 2018 · Age 52")] },
        { image: after, caption: [paragraph("After 2026 · Age 59")] },
      ],
    });
    expect(segments[2]).toMatchObject({
      field: [paragraph("Then the story continues.")],
    });
  });

  it("places a table token between the paragraphs around it", () => {
    const segments = storySegments([
      paragraph("Before the grid."),
      paragraph("{{table}}"),
      paragraph("After the grid."),
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "rich", field: [paragraph("Before the grid.")] },
      { kind: "table" },
      { kind: "rich", field: [paragraph("After the grid.")] },
    ]);
  });

  it("keeps a single photo full width and hides the token", () => {
    const only = image("One portrait");
    const segments = storySegments([
      paragraph("  {{photos}}  "),
      only,
      paragraph("Just the one."),
    ] as RichTextField);

    expect(segments).toEqual([
      {
        kind: "rich",
        field: [only, paragraph("Just the one.")],
      },
    ]);
  });

  it("stops the row at a heading and leaves a clinic token alone", () => {
    const first = image("First");
    const second = image("Second");
    const segments = storySegments([
      paragraph("{{photos}}"),
      first,
      { type: "heading2", text: "Next section", spans: [] },
      paragraph("{{provider:musely:offer}} My favorite eye serum."),
      second,
    ] as RichTextField);

    expect(segments.map((segment) => segment.kind)).toEqual(["rich"]);
    expect(segments[0]).toMatchObject({
      field: [
        first,
        { type: "heading2", text: "Next section" },
        paragraph("{{provider:musely:offer}} My favorite eye serum."),
        second,
      ],
    });
  });

  it("does not treat the token as a caption or as part of a sentence", () => {
    const left = image("Left");
    const right = image("Right");
    const segments = storySegments([
      paragraph("See the {{photos}} above."),
      paragraph("{{photos}}"),
      left,
      paragraph("{{photos}}"),
      right,
      paragraph("After"),
    ] as RichTextField);

    expect(segments.map((segment) => segment.kind)).toEqual([
      "rich",
      "rich",
      "rich",
    ]);
    expect(
      segments.flatMap((segment) =>
        segment.kind === "rich" ? [segment.field] : [],
      ),
    ).toEqual([
      [paragraph("See the {{photos}} above.")],
      [left],
      [right, paragraph("After")],
    ]);
  });

  it("turns a Resources list into the numbered sources", () => {
    const first = listItem("Estrogens and aging skin");
    const second = listItem("Topical estrogen");
    const segments = storySegments(
      [
        paragraph("The story."),
        paragraph("Resources:"),
        first,
        second,
      ] as RichTextField,
      { promoteResources: true },
    );

    expect(segments.map((segment) => segment.kind)).toEqual([
      "rich",
      "sources",
    ]);
    expect(segments[1]).toMatchObject({ items: [first, second] });
  });
});
