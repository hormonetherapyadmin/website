import { describe, expect, it } from "vitest";
import { AFFILIATE_REL, isAffiliateUrl, storyLinkRel } from "./affiliate-link";

describe("isAffiliateUrl", () => {
  it.each([
    "https://winona.pxf.io/XYkMZ3",
    "https://innerbalance.pxf.io/c/5199943/2012250/24885",
    "https://alloy.sjv.io/q4MxVj",
    "https://amzn.to/4dkASyR",
    "https://link.amazon/B0hVEBIfZ",
    "https://shrsl.com/4po5g",
    "https://www.gopjn.com/t/2-630900-389945-248471",
    "https://mymenopauserx.com/hormonetherapyhub",
    "https://choosejoi.co/bronson",
    "https://choosejoi.co/?oid=19&affid=124",
    "https://effecty.com/Peggy50",
    "https://app.bywinona.com/eligibility?promocode=BRONSON",
    "https://www.joinmidi.com/?utm_source=affiliate&utm_campaign=peggy",
    "https://perfectlysnug.refr.cc/default/u/peggyb?s=sp&t=cp",
    "https://www.amazon.com/dp/B0GDXLFQP2?campaignId=amzn1.campaign",
  ])("marks %s", (href) => {
    expect(isAffiliateUrl(href)).toBe(true);
  });

  it.each([
    "https://www.fda.gov/drugs/human-drug-compounding",
    "https://www.mayoclinic.org/diseases-conditions/menopause",
    "https://pubmed.ncbi.nlm.nih.gov/15955089/",
    "https://www.hormonetherapyhub.com/post/oestra-vs-winona",
    "https://mymenopauserx.com/about",
    "https://www.innerbalance.com/p/faq",
    "https://www.amazon.com/dp/B0GDXLFQP2",
    "mailto:PeggyB@hormonetherapyhub.com",
    "/copy-of-trusted-providers",
  ])("leaves %s alone", (href) => {
    expect(isAffiliateUrl(href)).toBe(false);
  });
});

describe("storyLinkRel", () => {
  it("gives an affiliate link the affiliate rel", () => {
    expect(
      storyLinkRel({ href: "https://winona.pxf.io/XYkMZ3", isExternal: true }),
    ).toBe(AFFILIATE_REL);
  });

  it("keeps Prismic's default for other links", () => {
    expect(
      storyLinkRel({ href: "https://www.fda.gov/", isExternal: true }),
    ).toBe("noreferrer");
    expect(storyLinkRel({ href: "/about", isExternal: false })).toBeUndefined();
  });
});
