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

  describe("tables", () => {
    const bold = [{ type: "BOLD" }];
    const cell = (...lines: object[][]) => ({
      type: "TABLE_CELL",
      id: `cell-${JSON.stringify(lines).length}`,
      nodes: lines.map((nodes) => ({ type: "PARAGRAPH", nodes })),
    });
    const row = (id: string, ...cells: object[]) => ({
      type: "TABLE_ROW",
      id,
      nodes: cells,
    });
    const table = (...rows: object[]) => ({ type: "TABLE", nodes: rows });
    const cellText = (cells: { content: { text: string }[] }[]) =>
      cells.map(({ content }) => content[0].text);

    it("moves each table into Tables and leaves a numbered line", () => {
      const mapped = mapWixPost({
        id: "post-1",
        richContent: {
          nodes: [
            table(
              row(
                "r1",
                cell([text("Clinic", bold)]),
                cell([text("Monthly ", bold), text("price", bold)]),
              ),
              row(
                "r2",
                cell([
                  text("Alloy", [
                    {
                      type: "LINK",
                      linkData: { link: { url: "https://myalloy.com" } },
                    },
                  ]),
                ]),
                cell([text("$99")], [], [text("a month")]),
              ),
            ),
            { type: "PARAGRAPH", nodes: [text("Between.")] },
            table(row("r3", cell([text("Only")]), cell([text("row")]))),
          ],
        },
      });

      expect(
        mapped.data.body.map((block) => "text" in block && block.text),
      ).toEqual(["{{table}}", "Between.", "{{table2}}"]);
      const [first, second] = mapped.data.tables.map(({ table }) => table);
      expect(cellText(first.head!.rows[0].cells)).toEqual([
        "Clinic",
        "Monthly price",
      ]);
      expect(first.head!.rows[0].cells[0].type).toBe("header");
      expect(cellText(first.body.rows[0].cells)).toEqual([
        "Alloy",
        "$99\na month",
      ]);
      expect(first.body.rows[0].cells[0]).toMatchObject({
        type: "data",
        content: [
          {
            spans: [
              {
                start: 0,
                end: 5,
                type: "hyperlink",
                data: { url: "https://myalloy.com" },
              },
            ],
          },
        ],
      });
      expect(second.head).toBeUndefined();
      expect(cellText(second.body.rows[0].cells)).toEqual(["Only", "row"]);
      expect(mapped.review).toEqual([]);
    });

    it("gives every row and cell a key that stays the same on rerun", () => {
      const post = {
        id: "post-1",
        richContent: {
          nodes: [table(row("r1", cell([text("a")]), cell([text("b")])))],
        },
      };
      const keys = (mapped: ReturnType<typeof mapWixPost>) =>
        mapped.data.tables[0].table.body.rows.flatMap((r) => [
          r.key,
          ...r.cells.map((c) => c.key),
        ]);

      const first = keys(mapWixPost(post));
      expect(new Set(first).size).toBe(3);
      expect(first[0]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(keys(mapWixPost(post))).toEqual(first);
    });
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

  it("keeps the link on a photo", () => {
    expect(
      body({
        richContent: {
          nodes: [
            {
              type: "IMAGE",
              imageData: {
                altText: "Musely cream",
                image: { src: { id: "cream.jpg" } },
                link: { url: "https://musely.pxf.io/xJvrWA", target: "BLANK" },
              },
            },
            {
              type: "IMAGE",
              imageData: {
                image: { src: { id: "chart.jpg" } },
                link: { url: "/copy-of-trusted-providers", target: "TOP" },
              },
            },
          ],
        },
      }),
    ).toEqual([
      {
        type: "image",
        image: {
          url: "https://static.wixstatic.com/media/cream.jpg",
          alt: "Musely cream",
          filename: "cream.jpg",
        },
        link: {
          link_type: "Web",
          url: "https://musely.pxf.io/xJvrWA",
          target: "_blank",
        },
      },
      {
        type: "image",
        image: {
          url: "https://static.wixstatic.com/media/chart.jpg",
          alt: "",
          filename: "chart.jpg",
        },
        link: {
          link_type: "Web",
          url: "https://www.hormonetherapyhub.com/copy-of-trusted-providers",
        },
      },
    ]);
  });

  it("drops a link on the cover photo", () => {
    const mapped = mapWixPost({
      media: { wixMedia: { image: { id: "cover.jpg" } } },
      richContent: {
        nodes: [
          {
            type: "IMAGE",
            imageData: {
              image: { src: { id: "cover.jpg" } },
              link: { url: "https://musely.pxf.io/xJvrWA" },
            },
          },
        ],
      },
    });

    expect(mapped.data.body).toEqual([]);
    expect(mapped.review).toEqual([]);
    expect(mapped.problems).toEqual([]);
  });

  it("adds https to a link Wix saved without it, and trims spaces", () => {
    const [bare, spaced, mail] = body({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("Winona", [
                {
                  type: "LINK",
                  linkData: { link: { url: "winona.pxf.io/daBV57" } },
                },
              ]),
            ],
          },
          {
            type: "BUTTON",
            buttonData: {
              text: "MyMenoRx",
              link: { url: " https://mymenopauserx.com/hormonetherapyhub" },
            },
          },
          {
            type: "PARAGRAPH",
            nodes: [
              text("Email me", [
                {
                  type: "LINK",
                  linkData: {
                    link: { url: "mailto:PeggyB@hormonetherapyhub.com" },
                  },
                },
              ]),
            ],
          },
        ],
      },
    });

    const urlOf = (block: typeof bare) =>
      block && "spans" in block ? block.spans[0]?.data : undefined;
    expect(urlOf(bare)).toMatchObject({ url: "https://winona.pxf.io/daBV57" });
    expect(urlOf(spaced)).toMatchObject({
      url: "https://mymenopauserx.com/hormonetherapyhub",
    });
    expect(urlOf(mail)).toMatchObject({
      url: "mailto:PeggyB@hormonetherapyhub.com",
    });
  });

  it("stops on a link that is still not a web address", () => {
    const mapped = mapWixPost({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("here", [
                { type: "LINK", linkData: { link: { url: "see notes" } } },
              ]),
            ],
          },
        ],
      },
    });

    expect(mapped.problems).toEqual([
      "link that is not a web address: see notes",
    ]);
  });

  it("removes a link Wix made out of a sentence and keeps the words", () => {
    const mapped = mapWixPost({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("I", [
                {
                  type: "LINK",
                  linkData: { link: { url: "http://product.It" } },
                },
              ]),
              text(" wrote about menopause.org", [
                {
                  type: "LINK",
                  linkData: { link: { url: "http://menopause.org" } },
                },
              ]),
            ],
          },
        ],
      },
    });

    expect(mapped.data.body).toEqual([
      {
        type: "paragraph",
        text: "I wrote about menopause.org",
        spans: [
          {
            start: 1,
            end: 27,
            type: "hyperlink",
            data: { link_type: "Web", url: "http://menopause.org" },
          },
        ],
      },
    ]);
    expect(mapped.review).toEqual([]);
    expect(mapped.changes).toEqual([
      "removed a link Wix made from ordinary words: http://product.It",
    ]);
  });

  it("points site links at the live page, the redirect, or the blog", () => {
    const linkTo = (url: string) => ({
      type: "PARAGRAPH",
      nodes: [text("go", [{ type: "LINK", linkData: { link: { url } } }])],
    });
    const mapped = mapWixPost(
      {
        richContent: {
          nodes: [
            linkTo("/FAQ"),
            linkTo("https://hormonetherapyhub.com/Home"),
            linkTo("https://www.hormonetherapyhub.com/post/estrogen"),
            linkTo("/post/oestra-vs-winona?ref=x#cost"),
            linkTo("https://www.fda.gov/Drugs"),
          ],
        },
      },
      {
        redirects: new Map([["/home", "/"]]),
        postSlugs: new Set(["oestra-vs-winona"]),
      },
    );

    expect(
      mapped.data.body.map((block) =>
        "spans" in block ? block.spans[0]?.data : undefined,
      ),
    ).toMatchObject([
      { url: "https://www.hormonetherapyhub.com/faq" },
      { url: "https://www.hormonetherapyhub.com/" },
      { url: "https://www.hormonetherapyhub.com/blog" },
      {
        url: "https://www.hormonetherapyhub.com/post/oestra-vs-winona?ref=x#cost",
      },
      { url: "https://www.fda.gov/Drugs" },
    ]);
    expect(mapped.changes).toEqual([
      "link to /home now goes to /",
      "link to /post/estrogen now goes to /blog",
    ]);
  });

  it("names a linked photo with its caption when Wix has no description", () => {
    const mapped = mapWixPost({
      richContent: {
        nodes: [
          {
            type: "IMAGE",
            imageData: {
              image: { src: { id: "kit.jpg" } },
              link: { url: "https://amzn.to/4dkASyR" },
            },
            nodes: [
              {
                type: "CAPTION",
                nodes: [text("Buy your Proov Perimenopause Kit on Amazon")],
              },
            ],
          },
          {
            type: "IMAGE",
            imageData: {
              image: { src: { id: "plain.jpg" } },
              link: { url: "https://amzn.to/4tU1NYS" },
            },
          },
          {
            type: "IMAGE",
            imageData: { image: { src: { id: "decor.jpg" } } },
            nodes: [{ type: "CAPTION", nodes: [text("Day 1")] }],
          },
        ],
      },
    });

    const alts = mapped.data.body.flatMap((block) =>
      block.type === "image" ? [block.image.alt] : [],
    );
    expect(alts).toEqual([
      "Buy your Proov Perimenopause Kit on Amazon",
      "",
      "",
    ]);
    expect(mapped.review).toEqual(["linked photo with no description"]);
  });

  it("keeps one of each tag, whatever its capitals", () => {
    const mapped = mapWixPost(
      { tagIds: ["a", "b", "c", "d"] },
      {
        tagLabels: new Map([
          ["a", "Inner Balance"],
          ["b", "Mira"],
          ["c", "inner balance"],
        ]),
      },
    );

    expect(mapped.tags).toEqual(["Inner Balance", "Mira"]);
    expect(mapped.review).toEqual(["tag without a label"]);
  });

  it("keeps the words of a jump link and flags it", () => {
    const mapped = mapWixPost({
      richContent: {
        nodes: [
          {
            type: "PARAGRAPH",
            nodes: [
              text("Skip to ingredients", [
                { type: "ANCHOR", anchorData: { anchor: "sq4ah13931" } },
              ]),
            ],
          },
        ],
      },
    });

    expect(mapped.data.body).toEqual([
      { type: "paragraph", text: "Skip to ingredients", spans: [] },
    ]);
    expect(mapped.review).toContain("jump link");
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
