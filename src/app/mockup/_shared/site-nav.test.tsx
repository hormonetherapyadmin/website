import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteNav } from "./site-nav";

describe("SiteNav", () => {
  it("renders a hamburger button and keeps the header action in the menu dialog", () => {
    const html = renderToStaticMarkup(
      <SiteNav
        items={[
          { label: "Blog", href: "/blog" },
          {
            label: "HRT 101",
            columns: [{ links: [{ label: "FAQ", href: "/faq" }] }],
          },
        ]}
        cta={{
          label: "Trusted providers",
          href: "/trusted-providers",
          icon: "Shield",
        }}
      />,
    );

    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("<dialog");
    expect(html).toContain("Trusted providers");
    expect(html).toContain('href="/trusted-providers"');
    expect(html).toContain(">Menu<");
    expect(html).not.toContain(">Menu<svg");
  });
});
