import type { ImageField, LinkField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { quizBrandCard } from "./quiz-brands";

const image = {
  url: "https://images.prismic.io/logo.png",
  alt: "Musely logo",
  dimensions: { width: 80, height: 80 },
} as ImageField;

describe("quizBrandCard", () => {
  it("reads the card from the brand document", () => {
    expect(
      quizBrandCard({
        uid: "musely",
        data: {
          name: "Musely",
          short_description: "A cream, shipped to you.",
          logo: image,
          monthly_price: 35,
          price_unit: "Per month",
          price_note: "What I paid.",
          formulation: "Estrogen cream",
          code: "Code PEGGY",
          visit: {
            link_type: "Web",
            url: "https://musely.pxf.io/peggy",
            text: "Visit Musely",
          },
          page: { link_type: "Document", url: "/musely" } as LinkField,
          review: {
            link_type: "Document",
            url: "/post/musely-estrogen-cream-review",
          } as LinkField,
        },
      }),
    ).toEqual({
      uid: "musely",
      name: "Musely",
      description: "A cream, shipped to you.",
      logo: {
        src: "https://images.prismic.io/logo.png",
        alt: "Musely logo",
        width: 80,
        height: 80,
      },
      price: "$35/mo",
      priceNote: "What I paid.",
      formulation: "Estrogen cream",
      pageHref: "/musely",
      reviewHref: "/post/musely-estrogen-cream-review",
      visitHref: "https://musely.pxf.io/peggy",
      visitText: "Visit Musely",
      offerCode: "PEGGY",
    });
  });

  it("drops a document that is not one of the quiz brands", () => {
    expect(
      quizBrandCard({
        uid: "oestra",
        data: {
          name: "Oestra",
          short_description: null,
          logo: {},
          monthly_price: null,
          price_note: null,
          formulation: null,
          code: null,
          visit: { link_type: "Any" },
        },
      }),
    ).toBeNull();
  });
});
