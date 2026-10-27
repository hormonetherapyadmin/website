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
      { kind: "table", number: 1 },
      { kind: "rich", field: [paragraph("After the grid.")] },
    ]);
  });

  it("numbers table tokens from the Tables group", () => {
    const segments = storySegments([
      paragraph("{{table1}}"),
      paragraph("{{table2}}"),
      paragraph(" {{table12}} "),
      paragraph("{{table0}}"),
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "table", number: 1 },
      { kind: "table", number: 2 },
      { kind: "table", number: 12 },
      { kind: "rich", field: [paragraph("{{table0}}")] },
    ]);
  });

  it("gives a photo on its own the paragraph under it as its caption", () => {
    const shot = image("Musely app");
    const segments = storySegments([
      paragraph("Before."),
      shot,
      paragraph(""),
      paragraph("The Musely app on my phone."),
      paragraph("After."),
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "rich", field: [paragraph("Before.")] },
      {
        kind: "photo",
        image: shot,
        caption: [paragraph("The Musely app on my phone.")],
      },
      { kind: "rich", field: [paragraph("After.")] },
    ]);
  });

  it("does not take a token or a heading as a photo's caption", () => {
    const first = image("First");
    const second = image("Second");
    const third = image("Third");
    const segments = storySegments([
      first,
      paragraph("{{provider:musely:offer}} My favorite eye serum."),
      second,
      paragraph("{{tip}} Ask about the first month."),
      third,
      { type: "heading2", text: "Next section", spans: [] },
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "photo", image: first, caption: null },
      {
        kind: "rich",
        field: [paragraph("{{provider:musely:offer}} My favorite eye serum.")],
      },
      { kind: "photo", image: second, caption: null },
      {
        kind: "rich",
        field: [paragraph("{{tip}} Ask about the first month.")],
      },
      { kind: "photo", image: third, caption: null },
      {
        kind: "rich",
        field: [{ type: "heading2", text: "Next section", spans: [] }],
      },
    ]);
  });

  it("keeps a single photo on its own and hides the token", () => {
    const only = image("One portrait");
    const segments = storySegments([
      paragraph("  {{photos}}  "),
      only,
      paragraph("Just the one."),
    ] as RichTextField);

    expect(segments).toEqual([
      {
        kind: "photo",
        image: only,
        caption: [paragraph("Just the one.")],
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

    expect(segments).toEqual([
      { kind: "photo", image: first, caption: null },
      {
        kind: "rich",
        field: [
          { type: "heading2", text: "Next section", spans: [] },
          paragraph("{{provider:musely:offer}} My favorite eye serum."),
        ],
      },
      { kind: "photo", image: second, caption: null },
    ]);
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

    expect(segments).toEqual([
      { kind: "rich", field: [paragraph("See the {{photos}} above.")] },
      { kind: "photo", image: left, caption: null },
      { kind: "photo", image: right, caption: [paragraph("After")] },
    ]);
  });

  it("places the next photo beside the paragraph under it", () => {
    const portrait = image("Peggy at the clinic");
    const segments = storySegments([
      paragraph("Before."),
      paragraph(" {{photo-text}} "),
      portrait,
      paragraph("This is the week I started the patch."),
      paragraph("After."),
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "rich", field: [paragraph("Before.")] },
      {
        kind: "photoText",
        image: portrait,
        text: [paragraph("This is the week I started the patch.")],
      },
      { kind: "rich", field: [paragraph("After.")] },
    ]);
  });

  it("keeps a photo with no paragraph under it on its own", () => {
    const lonely = image("Lonely");
    const segments = storySegments([
      paragraph("{{photo-text}}"),
      lonely,
      { type: "heading2", text: "Next section", spans: [] },
      paragraph("{{photo-text}}"),
      paragraph("No photo here."),
    ] as RichTextField);

    expect(segments).toEqual([
      { kind: "photo", image: lonely, caption: null },
      {
        kind: "rich",
        field: [{ type: "heading2", text: "Next section", spans: [] }],
      },
      { kind: "rich", field: [paragraph("No photo here.")] },
    ]);
  });

  it("does not take a photo-text token as a photo row caption", () => {
    const left = image("Left");
    const segments = storySegments([
      paragraph("{{photos}}"),
      left,
      paragraph("{{photo-text}}"),
    ] as RichTextField);

    expect(segments).toEqual([{ kind: "photo", image: left, caption: null }]);
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
