import type { RichTextField, TableField } from "@prismicio/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { TokenClinic } from "./content-blocks";
import { PostStory } from "./post-story";

const clinic: TokenClinic = {
  uid: "inner-balance",
  name: "Inner Balance",
  logo: { src: "/logos/inner-balance.png" },
  visitHref: "https://example.com/inner-balance",
  offerCode: "PEGGY10",
  offerCopy: "10% off your first order.",
  monthlyPrice: 199,
  priceNote: "First six months, then $99.",
  insurance: false,
  formulation: "Oestra vaginal cream",
  gettingStarted: "Free consults as needed.",
};

function story(text: string): RichTextField {
  return [{ type: "paragraph", text, spans: [] }];
}

describe("PostStory clinic tokens", () => {
  it("replaces an offer token with the clinic box", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story(
          "{{provider:inner-balance:offer}} This cream helped my sleep.",
        )}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("This cream helped my sleep.");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).toContain('data-placement="story_offer"');
    expect(markup).toContain('href="https://example.com/inner-balance"');
    expect(markup).not.toContain("{{provider:");
  });

  it("uses the code line when the offer paragraph is only the token", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:inner-balance:offer}}")}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("10% off your first order.");
  });

  it("replaces a facts token with that clinic's price", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:inner-balance:facts}}")}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("Inner Balance");
    expect(markup).toContain("$199");
    expect(markup).toContain("/mo");
    expect(markup).toContain("First six months, then $99.");
    expect(markup).toContain("Doesn’t take insurance");
    expect(markup).toContain("Oestra vaginal cream");
    expect(markup).toContain("Free consults as needed.");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).toContain('data-placement="story_facts"');
    expect(markup).not.toContain("{{provider:");
  });

  it("keeps the sentence when the public page has no matching clinic", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story(
          "{{provider:inner-balance:offer}} This cream helped my sleep.",
        )}
      />,
    );

    expect(markup).toContain("This cream helped my sleep.");
    expect(markup).not.toContain("No clinic");
    expect(markup).not.toContain("Visit Inner Balance");
  });

  it("gives each heading the rail id, in order", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={[
          { type: "heading2", text: "First section", spans: [] },
          { type: "paragraph", text: "Between the headings.", spans: [] },
          { type: "heading2", text: "Second section", spans: [] },
        ]}
      />,
    );

    expect(markup).toContain('<h2 id="first-section" tabindex="-1">');
    expect(markup).toContain('<h2 id="second-section" tabindex="-1">');
  });

  it("renders a table token as a table and keeps a link in a cell", () => {
    const table = {
      head: {
        rows: [
          {
            key: "head",
            cells: [
              {
                key: "provider",
                type: "header" as const,
                content: [
                  { type: "paragraph" as const, text: "Provider", spans: [] },
                ],
              },
            ],
          },
        ],
      },
      body: {
        rows: [
          {
            key: "alloy",
            cells: [
              {
                key: "name",
                type: "data" as const,
                content: [
                  {
                    type: "paragraph" as const,
                    text: "Alloy",
                    spans: [
                      {
                        start: 0,
                        end: 5,
                        type: "hyperlink" as const,
                        data: {
                          link_type: "Web" as const,
                          url: "https://example.com/alloy",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    } as TableField;

    const markup = renderToStaticMarkup(
      <PostStory field={story("{{table}}")} tables={[{ table }]} />,
    );

    expect(markup).toContain("<table>");
    expect(markup).toContain("<th");
    expect(markup).toContain("Provider");
    expect(markup).toContain('href="https://example.com/alloy"');
    expect(markup).toContain("Alloy");
    expect(markup).not.toContain("{{table}}");
  });

  it("hides an empty table on the public page and names it in preview", () => {
    const hidden = renderToStaticMarkup(
      <PostStory field={story("{{table}}")} />,
    );
    const preview = renderToStaticMarkup(
      <PostStory field={story("{{table}}")} tokens="preview" />,
    );

    expect(hidden).not.toContain("{{table}}");
    expect(hidden).not.toContain("<table>");
    expect(preview).toContain("Add one in Tables.");
  });

  it("places each numbered table where its line is", () => {
    const grid = (word: string) =>
      ({
        body: {
          rows: [
            {
              key: word,
              cells: [
                {
                  key: word,
                  type: "data" as const,
                  content: [
                    { type: "paragraph" as const, text: word, spans: [] },
                  ],
                },
              ],
            },
          ],
        },
      }) as TableField;
    const field = [
      ...story("{{table2}}"),
      ...story("Between."),
      ...story("{{table}}"),
      ...story("{{table3}}"),
    ] as RichTextField;

    const markup = renderToStaticMarkup(
      <PostStory
        field={field}
        tables={[{ table: grid("First") }, { table: grid("Second") }]}
      />,
    );
    const preview = renderToStaticMarkup(
      <PostStory
        field={field}
        tables={[{ table: grid("First") }, { table: grid("Second") }]}
        tokens="preview"
      />,
    );

    expect(markup.indexOf("Second")).toBeLessThan(markup.indexOf("Between."));
    expect(markup.indexOf("Between.")).toBeLessThan(markup.indexOf("First"));
    expect(markup).toContain('aria-label="Table 2"');
    expect(markup).not.toContain("{{table");
    expect(preview).toContain("Add it as item 3 in Tables.");
  });

  it("breaks the line where a cell has two lines", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{table}}")}
        tables={[
          {
            table: {
              body: {
                rows: [
                  {
                    key: "row",
                    cells: [
                      {
                        key: "cell",
                        type: "data",
                        content: [
                          {
                            type: "paragraph",
                            text: "Estradiol (E2)\n(Stronger)",
                            spans: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            } as TableField,
          },
        ]}
      />,
    );

    expect(markup).toContain("<td>Estradiol (E2)<br/>(Stronger)</td>");
  });

  it("names a missing clinic in preview", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:missing:facts}}")}
        clinics={[clinic]}
        tokens="preview"
      />,
    );

    expect(markup).toContain("No clinic with id missing.");
  });
});

describe("PostStory links", () => {
  const anchor = (markup: string, href: string) =>
    markup.match(new RegExp(`<a [^>]*href="${href}"[^>]*>`))?.[0] ?? "";
  const link = (url: string) => ({
    start: 0,
    end: 4,
    type: "hyperlink" as const,
    data: { link_type: "Web" as const, url, target: "_blank" },
  });

  it("marks an affiliate link as sponsored and leaves a source link alone", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={[
          {
            type: "paragraph",
            text: "Winona",
            spans: [link("https://winona.pxf.io/XYkMZ3")],
          },
          {
            type: "paragraph",
            text: "FDA says",
            spans: [link("https://www.fda.gov/drugs")],
          },
        ]}
      />,
    );

    expect(anchor(markup, "https://winona.pxf.io/XYkMZ3")).toContain(
      'rel="sponsored nofollow noopener noreferrer"',
    );
    expect(anchor(markup, "https://www.fda.gov/drugs")).toContain(
      'rel="noreferrer"',
    );
  });

  it("marks a photo that links to an affiliate", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={[
          {
            type: "image",
            id: "photo",
            url: "https://images.prismic.io/1shr96di/photo.jpg?auto=format",
            alt: "Musely cream",
            copyright: null,
            dimensions: { width: 800, height: 600 },
            edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
            linkTo: {
              link_type: "Web",
              url: "https://musely.pxf.io/xJvrWA",
              target: "_blank",
            },
          },
        ]}
      />,
    );

    expect(anchor(markup, "https://musely.pxf.io/xJvrWA")).toContain(
      'rel="sponsored nofollow noopener noreferrer"',
    );
  });
});
