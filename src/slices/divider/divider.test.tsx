import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Divider } from "./index";
import styles from "./divider.module.css";

describe("Divider", () => {
  it("draws a squiggly accent line with no extra gap", () => {
    const html = renderToStaticMarkup(
      <Divider
        primary={{
          line: "Squiggly",
          color: "Accent",
          background: "Cream",
          space_above: "None",
          space_below: "None",
        }}
      />,
    );

    expect(html).toContain(styles.squiggly);
    expect(html).toContain(styles.accent);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("mt-0");
    expect(html).toContain("mb-0");
    expect(html).not.toContain("<h2");
  });

  it("draws a straight line on a soft band with the requested gap", () => {
    const html = renderToStaticMarkup(
      <Divider
        primary={{
          line: "Straight",
          color: "Border",
          background: "Blue",
          space_above: "Large",
          space_below: "Small",
        }}
      />,
    );

    expect(html).toContain(styles.straight);
    expect(html).toContain(styles.border);
    expect(html).toContain("bg-card-2");
    expect(html).toContain("py-slice");
    expect(html).toContain("mt-slice-lg");
    expect(html).toContain("mb-slice-sm");
  });
});
