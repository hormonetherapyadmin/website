import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { PromoStrip } from "@/components/promo-strip";
import { AFFILIATE_REL } from "@/lib/affiliate-link";
import { promotionFrom, type PromotionContent } from "./promotion";

const empty = { link_type: "Any" } as LinkField;

function web(url: string, target?: string): LinkField {
  return { link_type: "Web", url, ...(target ? { target } : {}) } as LinkField;
}

function line(value: string, spans: RichTextField[number]["spans"] = []) {
  return [{ type: "paragraph", text: value, spans }] as RichTextField;
}

const offer = line("Save 20% this week", [
  { start: 5, end: 8, type: "strong" },
]);

describe("promotionFrom", () => {
  it("hides the strip unless it is active and has a line and a link", () => {
    const ready = {
      text_promo: offer,
      button_label: "Get the deal",
      link: web("/winona"),
      active: true,
    };

    expect(promotionFrom(ready)?.buttonLabel).toBe("Get the deal");
    expect(promotionFrom({ ...ready, active: false })).toBeNull();
    expect(promotionFrom({ ...ready, active: null })).toBeNull();
    expect(promotionFrom({ ...ready, text_promo: line("  ") })).toBeNull();
    expect(promotionFrom({ ...ready, link: empty })).toBeNull();
    expect(
      promotionFrom({ ...ready, button_label: "   " })?.buttonLabel,
    ).toBeUndefined();
  });

  it("marks an affiliate address and leaves a site page alone", () => {
    expect(
      promotionFrom({
        text_promo: offer,
        link: web("https://winona.com/peggy"),
        active: true,
      })?.affiliate,
    ).toBe(true);
    expect(
      promotionFrom({
        text_promo: offer,
        link: web("/trusted-providers"),
        active: true,
      })?.affiliate,
    ).toBe(false);
  });
});

function strip(promotion: PromotionContent) {
  return renderToStaticMarkup(<PromoStrip promotion={promotion} />);
}

describe("PromoStrip", () => {
  it("makes the whole bar one link and keeps the button as a label", () => {
    const markup = strip({
      text: offer,
      buttonLabel: "Get the deal",
      link: web("/winona", "_blank"),
      affiliate: false,
    });

    expect(markup.match(/<a\b/g)).toHaveLength(1);
    expect(markup).not.toContain("<button");
    expect(markup).toContain('href="/winona"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("<strong>20%</strong>");
    expect(markup).toContain("Get the deal");
    expect(markup).not.toContain("data-placement");
    expect(markup).not.toContain("sponsored");
  });

  it("opens an affiliate address in a new tab and drops a blank button", () => {
    const markup = strip({
      text: line("My Winona code"),
      link: web("https://winona.com/peggy"),
      affiliate: true,
    });

    expect(markup.match(/<a\b/g)).toHaveLength(1);
    expect(markup).toContain(`rel="${AFFILIATE_REL}"`);
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('data-placement="promotion"');
    expect(markup).toContain("(affiliate link, opens in a new tab)");
    expect(markup).not.toContain("Get the deal");
  });
});
