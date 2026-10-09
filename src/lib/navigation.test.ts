import type { ImageField, LinkField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { siteNavigationFrom, type NavigationMenuLink } from "./navigation";

const empty = { link_type: "Any" } as LinkField;

function web(url: string, target?: string): LinkField {
  return { link_type: "Web", url, target };
}

function icon(url: string): ImageField {
  return {
    id: url,
    url,
    alt: null,
    copyright: null,
    dimensions: { width: 20, height: 20 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
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
              icon: icon("https://images.prismic.io/chart.png"),
            }),
            link("Trusted providers", "/mockup/trusted-providers", {
              icon: icon("https://images.prismic.io/shield.png"),
            }),
            link("Winona", "/winona-review-page", {
              column_heading: "My reviews",
              icon: icon("https://images.prismic.io/winona-icon.png"),
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
                icon: "https://images.prismic.io/chart.png",
              },
              {
                label: "Trusted providers",
                href: "/mockup/trusted-providers",
                icon: "https://images.prismic.io/shield.png",
              },
            ],
          },
          {
            heading: "My reviews",
            links: [
              {
                label: "Winona",
                href: "/winona-review-page",
                icon: "https://images.prismic.io/winona-icon.png",
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
              icon: icon("https://images.prismic.io/shield.png"),
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

  it("builds the header button from its label, icon, and link", () => {
    const navigation = siteNavigationFrom({
      header_button_label: "Trusted providers",
      header_button_icon: icon("https://images.prismic.io/shield.png"),
      header_button_link: web("/trusted-providers", "_blank"),
    });

    expect(navigation.button).toEqual({
      label: "Trusted providers",
      href: "/trusted-providers",
      icon: "https://images.prismic.io/shield.png",
      newTab: true,
    });
  });

  it("hides the header button when the label or link is blank", () => {
    expect(
      siteNavigationFrom({
        header_button_label: "Trusted providers",
        header_button_link: empty,
      }).button,
    ).toBeUndefined();

    expect(
      siteNavigationFrom({
        header_button_label: "  ",
        header_button_link: web("/trusted-providers"),
        header_button_icon: icon("https://images.prismic.io/shield.png"),
      }).button,
    ).toBeUndefined();
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
