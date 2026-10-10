import type { ImageField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { tokenClinic, type TokenClinicSource } from "./token-clinic";

function clinic(
  data: Partial<TokenClinicSource["data"]> = {},
): TokenClinicSource {
  return {
    uid: "inner-balance",
    data: {
      name: "Inner Balance",
      logo: {
        url: "https://images.prismic.io/logo.png",
      } as ImageField,
      visit: {
        link_type: "Web",
        url: "https://example.com/inner-balance",
        target: "_blank",
      },
      code: "PEGGY10",
      code_note: "10% off your first order.",
      monthly_price: 199,
      price_note: "First six months, then $99.",
      insurance: false,
      formulation: "Oestra vaginal cream",
      note: "Free consults as needed.",
      ...data,
    },
  };
}

describe("tokenClinic", () => {
  it("reads the profile and price a story token shows", () => {
    expect(tokenClinic(clinic())).toEqual({
      uid: "inner-balance",
      name: "Inner Balance",
      logo: { src: "https://images.prismic.io/logo.png" },
      visitHref: "https://example.com/inner-balance",
      visitText: undefined,
      offerCode: "PEGGY10",
      offerCopy: "10% off your first order.",
      monthlyPrice: 199,
      priceNote: "First six months, then $99.",
      insurance: false,
      formulation: "Oestra vaginal cream",
      gettingStarted: "Free consults as needed.",
      pageHref: undefined,
    });
  });

  it("reads the site page and ignores a blank Page link", () => {
    expect(
      tokenClinic(
        clinic({
          page: {
            link_type: "Document",
            id: "page-id",
            type: "page",
            tags: [],
            lang: "en-us",
            uid: "inner-balance",
            url: "/inner-balance",
          },
        }),
      )?.pageHref,
    ).toBe("/inner-balance");

    expect(
      tokenClinic(
        clinic({
          page: { link_type: "Any" },
        }),
      )?.pageHref,
    ).toBeUndefined();
  });

  it("drops a leading Code label so the chip does not repeat it", () => {
    expect(tokenClinic(clinic({ code: "Code PEGGY10" }))?.offerCode).toBe(
      "PEGGY10",
    );
    expect(tokenClinic(clinic({ code: "  " }))?.offerCode).toBeUndefined();
  });

  it("keeps the visit display text and drops a clinic with no name", () => {
    expect(
      tokenClinic(
        clinic({
          visit: {
            link_type: "Web",
            url: "https://example.com/inner-balance",
            text: "Visit Inner Balance",
          },
        }),
      )?.visitText,
    ).toBe("Visit Inner Balance");

    expect(tokenClinic(clinic({ name: "  " }))).toBeNull();
  });
});
