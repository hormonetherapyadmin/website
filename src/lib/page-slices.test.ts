import type { ImageField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import {
  boxClinic,
  comparisonClinic,
  gridPage,
  pageClinic,
  postCard,
  sliceClinicIds,
  slicesNeedPosts,
  sliceTokenUids,
  type PageClinicSource,
} from "./page-slices";

const rich = (text: string) =>
  [{ type: "paragraph", text, spans: [] }] as unknown as RichTextField;

const doc = (id: string) => ({
  link_type: "Document",
  id,
  type: "provider",
  tags: [],
  lang: "en-us",
});

function slice(
  slice_type: string,
  primary: Record<string, unknown>,
  variation = "default",
) {
  return { slice_type, variation, primary };
}

function provider(
  data: Partial<PageClinicSource["data"]> = {},
): PageClinicSource {
  return {
    id: "P1",
    uid: "inner-balance",
    data: {
      name: "Inner Balance",
      logo: { url: "https://images.prismic.io/logo.png" } as ImageField,
      visit: {
        link_type: "Web",
        url: "https://example.com/inner-balance?ref=peggy",
        target: "_blank",
        text: "Visit Inner Balance",
      },
      code: "PEGGY10",
      code_note: "10% off your first order.",
      monthly_price: 199,
      price_note: "First six months, then $99.",
      insurance: false,
      formulation: "Oestra vaginal cream",
      note: "Free consults as needed.",
      short_description: "Bioidentical cream by mail.",
      top_choice_label: "My 2026 top choice",
      quote: rich("The one I stayed with."),
      ...data,
    },
  };
}

describe("sliceClinicIds", () => {
  it("lists each clinic a slice points at once, in page order", () => {
    const slices = [
      slice("hero", { clinics: [{ clinic: doc("A") }] }, "brands"),
      slice("hero", { clinic: doc("B") }, "provider"),
      slice("clinic_comparison", {
        clinics: [{ clinic: doc("C") }, { clinic: doc("A") }],
      }),
      slice("quote", { clinic: doc("D") }),
      slice("side_by_side", { clinic: doc("E") }, "clinic"),
      slice("quote", { clinic: { link_type: "Document" } }),
      slice("divider", {}),
      slice("boxes", {
        boxes: [{ clinic: doc("F") }, { clinic: { link_type: "Any" } }],
      }),
      slice("brand_promo", { clinic: doc("G") }),
    ];

    expect(sliceClinicIds(slices)).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
  });
});

describe("sliceTokenUids", () => {
  it("reads clinic tokens in Side by side writing", () => {
    const slices = [
      slice(
        "side_by_side",
        { text: rich("{{provider:musely:offer}} My favorite.") },
        "image",
      ),
      slice("quote", { text: rich("{{provider:alloy:offer}}") }),
    ];

    expect(sliceTokenUids(slices)).toEqual(["musely"]);
  });
});

describe("slicesNeedPosts", () => {
  it("is true only when a Posts slice is on the page", () => {
    expect(slicesNeedPosts([slice("posts", {}, "row")])).toBe(true);
    expect(slicesNeedPosts([slice("quote", {})])).toBe(false);
  });
});

describe("pageClinic and comparisonClinic", () => {
  it("keeps the visit address, tracking included, and the row review link", () => {
    const clinic = pageClinic(provider());
    expect(clinic).not.toBeNull();

    expect(
      comparisonClinic(clinic!, {
        link_type: "Web",
        url: "/oestra-review",
      }),
    ).toEqual({
      name: "Inner Balance",
      href: "https://example.com/inner-balance?ref=peggy",
      newTab: true,
      logo: { src: "https://images.prismic.io/logo.png" },
      topChoice: "My 2026 top choice",
      shortDescription: "Bioidentical cream by mail.",
      monthlyPrice: 199,
      priceNote: "First six months, then $99.",
      insurance: false,
      formulation: "Oestra vaginal cream",
      quote: "The one I stayed with.",
      note: "Free consults as needed.",
      offerCode: "PEGGY10",
      reviewHref: "/oestra-review",
    });
  });

  it("gives a box the logo, code, and short description", () => {
    expect(boxClinic(pageClinic(provider())!)).toEqual({
      name: "Inner Balance",
      logo: { src: "https://images.prismic.io/logo.png" },
      offerCode: "PEGGY10",
      shortDescription: "Bioidentical cream by mail.",
    });
  });

  it("leaves blank badge and review empty", () => {
    const clinic = pageClinic(provider({ top_choice_label: " " }))!;
    expect(clinic.topChoice).toBeUndefined();
    expect(
      comparisonClinic(clinic, { link_type: "Any" }).reviewHref,
    ).toBeUndefined();
  });
});

describe("postCard", () => {
  it("reads the card fields and the resolved address", () => {
    expect(
      postCard({
        id: "X",
        url: "/post/oestra-vs-winona",
        data: {
          title: rich("Oestra vs Winona"),
          sub_title: rich("Two creams, one year."),
          image: { url: "https://images.prismic.io/cover.jpg", alt: "Jars" },
          published_date: "2026-09-01",
          category: "Comparison",
          body: rich("word ".repeat(500)),
        },
      }),
    ).toEqual({
      title: "Oestra vs Winona",
      href: "/post/oestra-vs-winona",
      image: { src: "https://images.prismic.io/cover.jpg", alt: "Jars" },
      excerpt: "Two creams, one year.",
      published: "2026-09-01",
      readTime: 2,
      category: "Comparison",
    });
  });

  it("drops a post with no title or address", () => {
    const data = {
      title: [] as unknown as RichTextField,
      sub_title: [] as unknown as RichTextField,
      image: null,
      published_date: null,
      category: null,
      body: [] as unknown as RichTextField,
    };
    expect(postCard({ id: "X", url: "/post/x", data })).toBeNull();
    expect(
      postCard({ id: "X", url: null, data: { ...data, title: rich("T") } }),
    ).toBeNull();
  });
});

describe("gridPage", () => {
  it("reads a positive page number and falls back to 1", () => {
    expect(gridPage("3")).toBe(3);
    expect(gridPage(["2", "5"])).toBe(2);
    expect(gridPage("0")).toBe(1);
    expect(gridPage("abc")).toBe(1);
    expect(gridPage(undefined)).toBe(1);
  });
});
