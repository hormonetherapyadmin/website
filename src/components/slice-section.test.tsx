import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import {
  SliceSection,
  sectionAnchor,
  sliceLayout,
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

describe("sliceLayout", () => {
  it("treats only Centered as the stacked layout", () => {
    expect(sliceLayout("Centered")).toBe("centered");
    expect(sliceLayout("On the right")).toBe("right");
    expect(sliceLayout(null)).toBe("right");
    expect(sliceLayout("")).toBe("right");
    expect(sliceLayout("Stacked")).toBe("right");
  });
});

describe("SliceSection", () => {
  it("uses medium space above and no header when the fields are empty", () => {
    const html = renderToStaticMarkup(
      <SliceSection section={{}}>
        <p>Body</p>
      </SliceSection>,
    );

    expect(html).toContain("flow-root");
    expect(html).toContain("pt-slice");
    expect(html).toContain("pb-0");
    expect(html).not.toContain("mt-slice");
    expect(html).not.toContain("mb-slice");
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
    expect(html).toContain("pt-slice-lg");
    expect(html).toContain("pb-slice-sm");
    expect(html).not.toContain("mt-slice");
    expect(html).not.toContain("mb-slice");
    expect(html).toContain("[--section-space-above:var(--spacing-slice-lg)]");
    expect(html).toContain("[--section-space-below:var(--spacing-slice-sm)]");
    expect(html).toContain("bg-panel");
    expect(html).not.toContain("py-slice");
    expect(html).toContain("<h2");
    expect(html).toContain("Menopause isn’t a dirty word.");
    expect(html).toContain("All posts");
    expect(html).toContain('href="/blog"');
    expect(html).toContain("justify-between");
  });

  it("can center the header and place the link under the writing", () => {
    const below = renderToStaticMarkup(
      <SliceSection
        align="center"
        linkPlacement="below"
        section={fields({
          heading: text("Before you go"),
          link: { link_type: "Web", url: "/providers", text: "All clinics" },
        })}
      >
        <p>The box</p>
      </SliceSection>,
    );
    const end = renderToStaticMarkup(
      <SliceSection
        align="center"
        linkPlacement="end"
        section={fields({
          heading: text("Cost"),
          link: { link_type: "Web", url: "/chart", text: "See the chart" },
        })}
      >
        <p>Check your plan.</p>
      </SliceSection>,
    );

    expect(below).toContain("text-center");
    expect(below).not.toContain("justify-between");
    expect(below.indexOf("All clinics")).toBeGreaterThan(
      below.indexOf("Before you go"),
    );
    expect(below.indexOf("The box")).toBeGreaterThan(
      below.indexOf("All clinics"),
    );
    expect(end.indexOf("See the chart")).toBeGreaterThan(
      end.indexOf("Check your plan."),
    );
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
    expect(pink).not.toContain("py-slice");
    expect(raspberry).toContain("bg-accent text-panel-text");
    expect(pink).toContain("[--section-kicker:var(--color-accent)]");
    expect(raspberry).toContain("[--section-kicker:var(--color-card-2)]");
    expect(raspberry).toContain("[--section-marker:var(--color-card-2)]");
    expect(pink).not.toContain("--section-marker");
    expect(
      renderToStaticMarkup(
        <SliceSection section={fields({ background: "Navy" })} />,
      ),
    ).toContain("[--section-kicker:var(--color-panel-accent)]");
    expect(retired).not.toContain("py-slice");
    expect(retired).not.toContain("bg-");
  });

  it("adds the next slice's space above to the gap after this one", () => {
    const html = renderToStaticMarkup(
      <SliceSection
        followingSpaceAbove="Medium"
        section={fields({
          background: "Navy",
          space_above: "None",
          space_below: "Large",
        })}
      />,
    );

    expect(html).toContain("pt-0");
    expect(html).toContain("pb-slice-lg");
    expect(html).toContain("bg-panel");
    expect(html).toContain(
      "--section-gap-after:calc(var(--spacing-slice-lg) + var(--spacing-slice))",
    );
  });

  it("paints a cream band but leaves Transparent unpainted", () => {
    const cream = renderToStaticMarkup(
      <SliceSection section={fields({ background: "Cream" })} />,
    );
    const transparent = renderToStaticMarkup(
      <SliceSection section={fields({ background: "Transparent" })} />,
    );

    expect(cream).toContain("bg-background");
    expect(cream).not.toContain("py-slice");
    expect(transparent).not.toContain("bg-");
    expect(transparent).not.toContain("py-slice");
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
