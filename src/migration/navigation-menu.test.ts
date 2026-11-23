import { describe, expect, it } from "vitest";
import { NAVIGATION_MENU, navigationData } from "./navigation-menu";

const pages = new Map(
  [
    "ishrtforme",
    "formuations",
    "costandinsurance",
    "trackers-and-testing",
    "faq",
    "copy-of-weight-gain",
    "skincare",
    "hrt-price-comparison-chart",
    "tipstofindprovider",
    "trusted-providers",
    "about",
    "how-i-review",
    "blog",
    "inner-balance",
    "winona-review-page",
    "musely",
    "alloy-review-page",
    "joiwommenswellness",
    "effecty",
    "mymenopauserx",
    "midi-health-review-page",
  ].map((uid) => [uid, { id: uid, uid }] as const),
);

describe("navigation menu", () => {
  it("keeps archived pages and mockup paths off the menu", () => {
    const text = JSON.stringify(NAVIGATION_MENU);
    expect(text).not.toContain("sleep");
    expect(text).not.toContain("hair-loss");
    expect(text).not.toContain("men-s-hrt");
    expect(text).not.toContain("mockup");
    expect(text).not.toContain("affiliate-disclosures");
  });

  it("links the header button to the clinic quiz", () => {
    const data = navigationData(pages);
    expect(data.header_button_label).toBe("Find your clinic");
    expect(data.header_button_link).toEqual({
      link_type: "Web",
      url: "/provider-quiz",
    });
    const hrt101 = data.main_items.find((item) => item.label === "HRT 101");
    expect(hrt101?.links?.[0]).toMatchObject({
      label: "Provider quiz",
      link: { link_type: "Web", url: "/provider-quiz" },
    });
    expect(hrt101?.links?.[1]?.link).toMatchObject({ uid: "ishrtforme" });
    expect(data.footer_columns[0]?.links[0]?.label).toBe("Is HRT for me?");
    const symptoms = data.main_items.find((item) => item.label === "Symptoms");
    expect(symptoms?.links?.[0]?.link).toMatchObject({
      uid: "copy-of-weight-gain",
      url: "/copy-of-weight-gain",
    });
    const providers = data.main_items.find(
      (item) => item.label === "Providers",
    );
    expect(providers?.links?.[0]?.column_heading).toBe("Compare & choose");
    expect(providers?.links?.[3]?.column_heading).toBe("My reviews");
    expect(providers?.links?.[3]?.label).toBeUndefined();
    expect(providers?.links?.[3]?.clinic).toMatchObject({
      type: "provider",
      uid: "inner-balance",
    });
    expect(data.footer_columns.map((column) => column.heading)).toEqual([
      "HRT 101",
      "Symptoms",
      "Providers",
      "About",
    ]);
    expect(
      data.footer_columns.at(-1)?.links.map((link) => link.link.uid),
    ).toEqual(["about", "how-i-review", "blog"]);
  });
});
