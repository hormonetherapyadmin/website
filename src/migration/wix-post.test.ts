import { describe, expect, it } from "vitest";
import { mapWixPost, type WixPostInput } from "./wix-post";

const text = (value: string, decorations: object[] = []) => ({
  type: "TEXT",
  textData: { text: value, decorations },
});

function body(post: WixPostInput) {
  return mapWixPost(post).data.body;
}

describe("mapWixPost", () => {
  it("keeps bold and the full link, and drops color and underline", () => {
    const [paragraph] = body({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("Inner Balance", [
                { type: "BOLD" },
                { type: "COLOR", colorData: { foreground: "#6D23E5" } },
                { type: "UNDERLINE" },
                {
                  type: "LINK",
                  linkData: {
                    link: {
                      url: "https://innerbalance.pxf.io/JKPa5q",
                      target: "BLANK",
                    },
                  },
                },
              ]),
            ],
          },
        ],
      },
    });

    expect(paragraph).toMatchObject({
      type: "paragraph",
      text: "Inner Balance",
      spans: [
        { start: 0, end: 13, type: "strong" },
        {
          start: 0,
          end: 13,
          type: "hyperlink",
          data: {
            link_type: "Web",
            url: "https://innerbalance.pxf.io/JKPa5q",
            target: "_blank",
          },
        },
      ],
    });
  });

  it("marks a 10px citation number as superscript", () => {
    const lead = "Archives of Dermatology";
    const [paragraph] = body({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text(lead),
              text(" 2", [
                { type: "BOLD" },
                { type: "ITALIC" },
                { type: "FONT_SIZE", fontSizeData: { unit: "PX", value: 10 } },
              ]),
            ],
          },
        ],
      },
    });

    expect(paragraph).toMatchObject({
      type: "paragraph",
      text: `${lead} 2`,
      spans: [
        {
          start: lead.length + 1,
          end: lead.length + 2,
          type: "label",
          data: { label: "superscript" },
        },
      ],
    });
  });

  it("leaves a smaller parenthetical as ordinary text", () => {
    const [paragraph] = body({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("(100% Estradiol)", [
                {
                  type: "FONT_SIZE",
                  fontSizeData: { unit: "PX", value: 12 },
                },
              ]),
            ],
          },
        ],
      },
    });

    expect(paragraph).toMatchObject({
      text: "(100% Estradiol)",
      spans: [],
    });
  });

  it("turns heading 6 into heading 2 and leaves heading 3", () => {
    const blocks = body({
      richContent: {
        nodes: [
          { type: "HEADING", headingData: { level: 6 }, nodes: [text("Labs")] },
          { type: "HEADING", headingData: { level: 3 }, nodes: [text("Cost")] },
        ],
      },
    });

    expect(blocks.map((block) => block.type)).toEqual(["heading2", "heading3"]);
  });

  it("drops dividers and empty paragraphs", () => {
    expect(
      body({
        richContent: {
          nodes: [
            { type: "DIVIDER" },
            { type: "PARAGRAPH", nodes: [text("  ")] },
            { type: "PARAGRAPH", nodes: [text("Kept")] },
          ],
        },
      }),
    ).toEqual([{ type: "paragraph", text: "Kept", spans: [] }]);
  });

  it("turns a button into a paragraph that is only the link", () => {
    expect(
      body({
        richContent: {
          nodes: [
            {
              type: "BUTTON",
              buttonData: {
                text: "See the chart",
                link: { url: "/hrt-price-comparison-chart", target: "BLANK" },
              },
            },
          ],
        },
      }),
    ).toEqual([
      {
        type: "paragraph",
        text: "See the chart",
        spans: [
          {
            start: 0,
            end: 13,
            type: "hyperlink",
            data: {
              link_type: "Web",
              url: "https://www.hormonetherapyhub.com/hrt-price-comparison-chart",
              target: "_blank",
            },
          },
        ],
      },
    ]);
  });

  it("writes a table out and flags it", () => {
    const mapped = mapWixPost({
      richContent: {
        nodes: [
          {
            type: "TABLE",
            nodes: [
              {
                type: "TABLE_ROW",
                nodes: [
                  {
                    type: "TABLE_CELL",
                    nodes: [{ type: "PARAGRAPH", nodes: [text("Alloy")] }],
                  },
                  {
                    type: "TABLE_CELL",
                    nodes: [{ type: "PARAGRAPH", nodes: [text("$99")] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    expect(mapped.data.body).toEqual([
      { type: "paragraph", text: "Alloy · $99", spans: [] },
    ]);
    expect(mapped.review).toContain("table");
  });

  it("moves the cover caption onto Caption and does not repeat the photo", () => {
    const mapped = mapWixPost({
      media: {
        wixMedia: {
          image: {
            id: "cover.jpg",
            url: "https://static.wixstatic.com/media/cover.jpg",
          },
        },
      },
      richContent: {
        nodes: [
          {
            type: "IMAGE",
            imageData: {
              altText: "Cover",
              image: { src: { id: "cover.jpg" } },
            },
            nodes: [{ type: "CAPTION", nodes: [text("Under the photo")] }],
          },
          {
            type: "IMAGE",
            imageData: {
              altText: "Later",
              image: { src: { id: "later.jpg" } },
            },
          },
        ],
      },
    });

    expect(mapped.data.caption).toEqual([
      { type: "paragraph", text: "Under the photo", spans: [] },
    ]);
    expect(mapped.data.body).toEqual([
      {
        type: "image",
        image: {
          url: "https://static.wixstatic.com/media/later.jpg",
          alt: "Later",
          filename: "later.jpg",
        },
      },
    ]);
  });

  it("puts the excerpt in subtitle and the Wix date on Published", () => {
    const mapped = mapWixPost({
      title: "A title",
      excerpt: "The card line",
      slug: "a-title",
      firstPublishedDate: "2026-09-29T20:22:52Z",
      seoData: {
        tags: [
          { type: "title", children: "A title" },
          {
            type: "meta",
            props: { name: "description", content: "Search sentence" },
          },
        ],
      },
    });

    expect(mapped.uid).toBe("a-title");
    expect(mapped.data.sub_title[0]?.text).toBe("The card line");
    expect(mapped.data.published_date).toBe("2026-09-29");
    expect(mapped.data.meta_title).toBeNull();
    expect(mapped.data.meta_description).toBe("Search sentence");
    expect(mapped.data.indexing).toBe(true);
  });
});
