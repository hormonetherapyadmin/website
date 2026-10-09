import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "./slice-section";

const text = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyText = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function fields(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyText,
    heading: emptyText,
    intro: emptyText,
    link: emptyLink,
    background: null,
    space_above: null,
    space_below: null,
    ...overrides,
  };
}

describe("sectionAnchor", () => {
  it("turns a heading into an element id", () => {
    expect(sectionAnchor("Feel like you again.")).toBe("feel-like-you-again");
    expect(sectionAnchor("My Section")).toBe("my-section");
    expect(sectionAnchor("Menopause isn’t a dirty word.")).toBe(
      "menopause-isnt-a-dirty-word",
    );
  });

  it("drops a value that cannot be an id", () => {
    expect(sectionAnchor("")).toBeUndefined();
    expect(sectionAnchor("9lives")).toBeUndefined();
    expect(sectionAnchor(null)).toBeUndefined();
  });
});

describe("SliceSection", () => {
  it("uses medium space above and no header when the fields are empty", () => {
    const html = renderToStaticMarkup(
      <SliceSection section={{}}>
        <p>Body</p>
      </SliceSection>,
    );

    expect(html).toContain("mt-slice");
    expect(html).toContain("mb-0");
    expect(html).not.toContain("<h2");
    expect(html).toContain("Body");
  });

  it("renders the shared header and a dark band", () => {
    const html = renderToStaticMarkup(
      <SliceSection
        section={fields({
          small_heading: text("My hormone replacement story"),
          heading: text("Menopause isn’t a dirty word."),
          intro: text("I’ll say that again."),
          link: {
            link_type: "Web",
            url: "/blog",
            text: "All posts",
          },
          background: "Navy",
          space_above: "Large",
          space_below: "Small",
        })}
      />,
    );

    expect(html).toContain('id="menopause-isnt-a-dirty-word"');
    expect(html).toContain("mt-slice-lg");
    expect(html).toContain("mb-slice-sm");
    expect(html).toContain("bg-panel");
    expect(html).toContain("py-slice");
    expect(html).toContain("<h2");
    expect(html).toContain("Menopause isn’t a dirty word.");
    expect(html).toContain("All posts");
    expect(html).toContain('href="/blog"');
  });

  it("paints the color choices and sets the small heading color", () => {
    const pink = renderToStaticMarkup(
      <SliceSection section={fields({ background: "Pink" })} />,
    );
    const raspberry = renderToStaticMarkup(
      <SliceSection
        section={fields({
          small_heading: text("Providers"),
          heading: text("Trusted providers"),
          background: "Raspberry",
        })}
      />,
    );
    const retired = renderToStaticMarkup(
      <SliceSection
        section={fields({
          background: "Soft" as SliceSectionFields["background"],
        })}
      />,
    );

    expect(pink).toContain("bg-card-1");
    expect(pink).toContain("py-slice");
    expect(raspberry).toContain("bg-accent text-panel-text");
    expect(pink).toContain("[--section-kicker:var(--color-accent)]");
    expect(raspberry).toContain("[--section-kicker:var(--color-card-2)]");
    expect(
      renderToStaticMarkup(
        <SliceSection section={fields({ background: "Navy" })} />,
      ),
    ).toContain("[--section-kicker:var(--color-panel-accent)]");
    expect(retired).not.toContain("py-slice");
  });

  it("lets the hero render its own heading", () => {
    const html = renderToStaticMarkup(
      <SliceSection
        headingLevel="h1"
        showHeader={false}
        section={fields({ heading: text("Hormone Therapy Replacement") })}
      >
        <h1>Hormone Therapy Replacement</h1>
      </SliceSection>,
    );

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).not.toContain("<h2");
  });
});
