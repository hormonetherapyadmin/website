import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Divider } from "./index";
import styles from "./divider.module.css";

const emptyText = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields[] {
  return [
    {
      small_heading: emptyText,
      heading: emptyText,
      intro: emptyText,
      link: emptyLink,
      background: null,
      space_above: "None",
      space_below: "None",
      ...overrides,
    },
  ];
}

describe("Divider", () => {
  it("draws a squiggly accent line with no extra gap", () => {
    const html = renderToStaticMarkup(
      <Divider
        primary={{
          section: section(),
          line: "Squiggly",
          color: "Accent",
        }}
      />,
    );

    expect(html).toContain(styles.squiggly);
    expect(html).toContain(styles.accent);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("mt-0");
    expect(html).toContain("mb-0");
  });

  it("draws a straight border line and keeps the requested gap", () => {
    const html = renderToStaticMarkup(
      <Divider
        primary={{
          section: section({ space_above: "Large", space_below: "Small" }),
          line: "Straight",
          color: "Border",
        }}
      />,
    );

    expect(html).toContain(styles.straight);
    expect(html).toContain(styles.border);
    expect(html).toContain("mt-slice-lg");
    expect(html).toContain("mb-slice-sm");
  });
});
