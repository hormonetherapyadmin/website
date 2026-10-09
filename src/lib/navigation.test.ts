import type { LinkField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { siteNavigationFrom, type NavigationMenuLink } from "./navigation";

const empty = { link_type: "Any" } as LinkField;

function web(url: string, target?: string): LinkField {
  return { link_type: "Web", url, target };
}

function link(
  label: string | null,
  href: string | null,
  extra: Partial<NavigationMenuLink> = {},
): NavigationMenuLink {
  return {
    label,
    link: href ? web(href) : empty,
    ...extra,
  };
}

describe("siteNavigationFrom", () => {
  it("keeps a direct menu item and drops one with nowhere to go", () => {
    const navigation = siteNavigationFrom({
      main_items: [
        { label: "Blog", link: web("/blog"), links: [] },
        { label: "Missing", link: empty, links: [] },
        { label: "  ", link: web("/about"), links: [] },
      ],
      footer_columns: [],
    });

    expect(navigation.main).toEqual([{ label: "Blog", href: "/blog" }]);
  });

  it("opens a new tab only when the link asks for one", () => {
    const navigation = siteNavigationFrom({
      main_items: [
        {
          label: "Press",
          link: web("https://example.com", "_blank"),
          links: [],
        },
      ],
    });

    expect(navigation.main).toEqual([
      { label: "Press", href: "https://example.com", newTab: true },
    ]);
  });

  it("groups menu links into columns when the heading changes", () => {
    const navigation = siteNavigationFrom({
      main_items: [
        {
          label: "Providers",
          link: empty,
          links: [
            link("Price comparison chart", "/hrt-price-comparison-chart", {
              icon: "Chart",
            }),
            link("Trusted providers", "/mockup/trusted-providers", {
              icon: "Shield",
            }),
            link("Winona", "/winona-review-page", {
              column_heading: "My reviews",
              icon: "Chart",
            }),
            link("Alloy", "/alloy-review-page", {
              column_heading: "My reviews",
            }),
          ],
        },
      ],
    });

    expect(navigation.main).toEqual([
      {
        label: "Providers",
        columns: [
          {
            links: [
              {
                label: "Price comparison chart",
                href: "/hrt-price-comparison-chart",
                icon: "Chart",
              },
              {
                label: "Trusted providers",
                href: "/mockup/trusted-providers",
                icon: "Shield",
              },
            ],
          },
          {
            heading: "My reviews",
            links: [
              {
                label: "Winona",
                href: "/winona-review-page",
                icon: "Chart",
              },
              { label: "Alloy", href: "/alloy-review-page" },
            ],
          },
        ],
      },
    ]);
  });

  it("uses the clinic name and logo, and the typed label when she wrote one", () => {
    const clinic = {
      link_type: "Document" as const,
      id: "clinic",
      type: "provider",
      tags: [],
      lang: "en-us",
      data: {
        name: "Inner Balance",
        logo: {
          url: "https://images.prismic.io/logo.png",
          dimensions: { width: 24, height: 24 },
        },
      },
    };

    const navigation = siteNavigationFrom({
      main_items: [
        {
          label: "Providers",
          link: empty,
          links: [
            link(null, "/inner-balance", { clinic }),
            link("My Inner Balance notes", "/inner-balance", {
              clinic,
              icon: "Shield",
            }),
            link(null, "/winona", {
              clinic: {
                ...clinic,
                id: "winona",
                data: { name: "Winona" },
              },
            }),
          ],
        },
      ],
    });

    expect(navigation.main).toEqual([
      {
        label: "Providers",
        columns: [
          {
            links: [
              {
                label: "Inner Balance",
                href: "/inner-balance",
                logo: "https://images.prismic.io/logo.png",
              },
              {
                label: "My Inner Balance notes",
                href: "/inner-balance",
                logo: "https://images.prismic.io/logo.png",
              },
              {
                label: "Winona",
                href: "/winona",
                monogram: "W",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("builds footer columns and skips a column with no working links", () => {
    const navigation = siteNavigationFrom({
      footer_columns: [
        {
          heading: "About",
          links: [link("About Peggy", "/about"), link("Nowhere", null)],
        },
        {
          heading: "Empty",
          links: [link("Missing", null)],
        },
        { heading: " ", links: [link("Blog", "/blog")] },
      ],
    });

    expect(navigation.footer).toEqual([
      {
        heading: "About",
        links: [{ label: "About Peggy", href: "/about" }],
      },
    ]);
  });
});
