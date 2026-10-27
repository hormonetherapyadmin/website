import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOMEPAGE, SITE_PAGES, pageImages } from "./site-pages";

function page(uid: string) {
  const found = SITE_PAGES.find((item) => item.uid === uid);
  if (!found) throw new Error(`No page ${uid}`);
  return found;
}

function textOf(value: unknown): string {
  return JSON.stringify(value);
}

const LA_WIG_START = "shareasale.com/r.cfm?b=1744268";

describe("site pages", () => {
  it("sends the site pages with the clinic pages after Inner Balance", () => {
    expect(SITE_PAGES.map((item) => item.uid)).toEqual([
      "about",
      "how-i-review",
      "faq",
      "ishrtforme",
      "inner-balance",
      "winona-review-page",
      "musely",
      "alloy-review-page",
      "joiwommenswellness",
      "effecty",
      "mymenopauserx",
      "midi-health-review-page",
      "formuations",
      "costandinsurance",
      "sleep",
      "hair-loss",
      "skincare",
      "weight-gain",
      "hrt-price-comparison-chart",
      "tipstofindprovider",
      "hrt-doctors-review-costs-services",
      "men-s-hrt",
    ]);
  });

  it("fills the About story and keeps the divider and posts row", () => {
    const about = page("about");
    expect(
      about.slices.map((slice) => [slice.slice_type, slice.variation]),
    ).toEqual([
      ["hero", "subpage"],
      ["divider", "default"],
      ["side_by_side", "image"],
      ["posts", "row"],
    ]);
    expect(textOf(about)).toContain("About Peggy");
    expect(textOf(about)).toContain("to for someone");
    expect(textOf(about)).toContain("bog pages");
    expect(textOf(about)).toContain("Clinics .");
    expect(textOf(about)).toContain('"label":"signoff"');
    expect(textOf(about)).toContain('"/blog"');
    expect(textOf(about)).toContain('"/trusted-providers"');
    expect(textOf(about)).toContain('"/ishrtforme"');
    expect(textOf(about)).toContain("XYNQOFoQwb5OYLsz");
    expect(pageImages(about).map((image) => image.filename)).toEqual([
      "peggy-winston.jpg",
    ]);
    const story = about.slices.find(
      (slice) => slice.slice_type === "side_by_side",
    );
    expect(story?.primary.side).toBe("Media left");
    expect(story?.primary.media_position).toBe("Sticky");
    const posts = about.slices.find((slice) => slice.slice_type === "posts");
    expect(posts?.primary.category).toBe("All");
  });

  it("writes How I review in her voice and keeps the portrait", () => {
    const review = page("how-i-review");
    expect(review.slices[0]).toMatchObject({
      slice_type: "hero",
      variation: "subpage",
    });
    expect(textOf(review)).toContain("XYNQOFoQwb5OYLsz");
    expect(textOf(review)).toContain("I don't fill in a visit I didn't take");
    expect(textOf(review)).toContain('"/affiliate-disclosures"');
    expect(textOf(review)).toContain('"/hrt-price-comparison-chart"');
    expect(textOf(review)).toContain("December 2019");
  });

  it("closes guide pages with the same Trusted providers ribbon", () => {
    for (const uid of ["weight-gain", "faq", "skincare", "formuations"]) {
      const ribbon = page(uid).slices.at(-1);
      expect(ribbon?.slice_type).toBe("ribbon");
      const writing = textOf(ribbon);
      expect(writing).toContain("Start with the clinics I've used");
      expect(writing).toContain("with my words and the codes I use");
      expect(writing).toContain('"/trusted-providers"');
      expect(writing).toContain("I'm not a doctor.");
    }
  });

  it("keeps the FAQ wording and pairs each answer with its question", () => {
    const faq = page("faq");
    expect(faq.slices.map((slice) => slice.slice_type)).toEqual([
      "hero",
      "divider",
      "faq",
      "ribbon",
    ]);
    const writing = textOf(faq.slices[2]);
    const safety = writing.indexOf("Is BHRT safe?");
    const insurance = writing.indexOf("Is BHRT covered lby insurance?");
    expect(safety).toBeGreaterThan(-1);
    expect(writing.indexOf("professsionals")).toBeGreaterThan(safety);
    expect(writing.indexOf("professsionals")).toBeLessThan(insurance);
    expect(writing.indexOf("yur insurance")).toBeGreaterThan(insurance);
  });

  it("keeps the Is HRT for me wording, sources, and both comparison rows", () => {
    const guide = page("ishrtforme");
    expect(
      guide.slices.map((slice) => [slice.slice_type, slice.variation]),
    ).toEqual([
      ["hero", "subpage"],
      ["divider", "default"],
      ["text", "default"],
      ["text", "default"],
      ["side_by_side", "image"],
      ["pros_cons", "default"],
      ["ribbon", "default"],
    ]);
    const writing = textOf(guide);
    expect(writing).toContain("the important of");
    expect(writing).toContain("ACCOG");
    expect(writing).toContain("Regulatory Oversign");
    expect(writing).toContain("make any necessary.");
    expect(writing).toContain("https://www.endocrinepractice.org/");
    expect(writing).toContain("https://www.acog.org/");
    expect(writing).toContain("https://www.nhlbi.nih.gov/");
    expect(writing).toContain("https://www.nia.nih.gov/");
    expect(writing).toContain("One-Size-Fits All Approach");
    expect(pageImages(guide).map((image) => image.filename)).toEqual([
      "peggy-portrait.jpg",
      "peggy-winston.jpg",
    ]);
    expect(
      guide.slices.find((slice) => slice.slice_type === "side_by_side")?.primary
        .side,
    ).toBe("Media left");
  });

  it("uses relative paths on this site and the photos that are already in the repo", () => {
    const writing = textOf([...SITE_PAGES, HOMEPAGE]);
    expect(writing).not.toContain("hormonetherapyhub.com");
    expect(writing).not.toContain("/mockup/blog");
    expect(writing).not.toContain("/mockup/trusted-providers");
    expect(writing).not.toContain("/mockup/is-hrt-for-me");
    expect(writing).not.toContain("#affiliate");
    expect(writing.replaceAll("http://winona.pxf.io/XYkMZ3", "")).not.toContain(
      "pxf.io",
    );
    for (const item of [...SITE_PAGES, HOMEPAGE]) {
      for (const image of pageImages(item)) {
        expect(image.path.startsWith("public/mockup/")).toBe(true);
        expect(existsSync(image.path)).toBe(true);
      }
    }
  });

  it("builds the Inner Balance page from the brand, without a second price card", () => {
    const clinic = page("inner-balance");
    expect(
      clinic.slices.map((slice) => [slice.slice_type, slice.variation]),
    ).toEqual([
      ["hero", "provider"],
      ["divider", "default"],
      ["clinic_facts", "default"],
      ["divider", "default"],
      ["ribbon", "default"],
    ]);
    const writing = textOf(clinic);
    expect(writing).toContain("My 2026 top choice");
    expect(writing).toContain("Voted best for sleep");
    expect(writing).toContain("Comparing a few clinics?");
    expect(writing).not.toContain("What Oestra cost me");
    expect(writing).not.toContain("See the chart");
    expect(writing).toContain("asf4zhEAAC4AYFel");
    expect(writing).toContain("jGM0ZnhURMHOb_JN");
    expect(writing).toContain(
      '"/post/oestra-by-inner-balance-my-honest-1-year-review"',
    );
    expect(writing).toContain('"/post/inner-balance-hrt-review"');
    expect(writing).toContain("https://youtu.be/PuAekNT9ZvA");
    expect(pageImages(clinic).map((image) => image.filename)).toEqual([
      "inner-balance-morning.jpg",
    ]);
  });

  it("builds a clinic page for each of the other brands, at the Wix address", () => {
    const pages = [
      ["winona-review-page", "winona.jpg", "placing order"],
      ["musely", "musely.jpg", "gentler form of HRT"],
      ["alloy-review-page", "alloy.jpg", "straight-forward experience"],
      ["joiwommenswellness", "joi.jpg", "Joi Clinician"],
      ["effecty", "effecty.jpg", "no hidden fees"],
      ["mymenopauserx", "menorx.jpg", "start-over on HRT"],
      ["midi-health-review-page", "midi.jpg", "very next business day"],
    ] as const;
    for (const [uid, filename, quote] of pages) {
      const clinic = page(uid);
      expect(
        clinic.slices.map((slice) => [slice.slice_type, slice.variation]),
      ).toEqual([
        ["hero", "provider"],
        ["divider", "default"],
        ["clinic_facts", "default"],
        ["divider", "default"],
        ["ribbon", "default"],
      ]);
      const writing = textOf(clinic);
      expect(writing).toContain(quote);
      expect(writing).toContain("The facts");
      expect(writing).toContain("/trusted-providers");
      expect(writing).not.toContain("What Oestra cost me");
      expect(pageImages(clinic).map((image) => image.filename)).toEqual([
        filename,
      ]);
    }
    expect(textOf(page("musely"))).toContain("Winona vs Musely");
    expect(textOf(page("alloy-review-page"))).toContain("Alloy Vs. Wiona");
    expect(textOf(page("midi-health-review-page"))).toContain(
      "Midi Health vs. Allara Health",
    );
    expect(textOf(page("midi-health-review-page"))).not.toContain("pxf.io");
    expect(textOf(page("effecty"))).toContain("https://youtu.be/5671FQQHL8s");
  });

  it("keeps the October 2026 wording on the remaining site pages", () => {
    expect(textOf(page("formuations"))).toContain("Theu can contain");
    expect(textOf(page("formuations"))).toContain("thatr are");
    expect(textOf(page("formuations"))).toContain("mange any");
    expect(textOf(page("formuations"))).toContain("ad administration");
    expect(textOf(page("formuations"))).toContain("a extended period");
    expect(textOf(page("costandinsurance"))).toContain("informtion");
    expect(textOf(page("costandinsurance"))).toContain("therapy. it is");
    expect(page("costandinsurance").slices[0]).toMatchObject({
      slice_type: "hero",
      variation: "subpage",
    });
    expect(
      pageImages(page("costandinsurance")).map((image) => image.filename),
    ).toEqual(["peggy-standing.jpg"]);
    expect(textOf(page("hair-loss"))).toContain("before I starting");
    expect(textOf(page("hair-loss"))).toContain("experiementing");
    expect(textOf(page("hair-loss"))).toContain(LA_WIG_START);
    expect(textOf(page("skincare"))).toContain("estriol a form");
    expect(textOf(page("skincare"))).toContain("$ 149.97");
    expect(textOf(page("skincare"))).toContain("http://alloy.sjv.io/q4MxVj");
    expect(textOf(page("skincare"))).toContain("http://winona.pxf.io/XYkMZ3");
    expect(textOf(page("skincare"))).toContain('"/inner-balance"');
    const skin = textOf(page("skincare"));
    expect(skin.indexOf("Alloy M4 Estriol Face Cream")).toBeLessThan(
      skin.indexOf("http://alloy.sjv.io/q4MxVj"),
    );
    expect(skin.indexOf("http://alloy.sjv.io/q4MxVj")).toBeLessThan(
      skin.indexOf("Winona Estriol Skin Cream"),
    );
    expect(skin.indexOf("http://winona.pxf.io/XYkMZ3")).toBeLessThan(
      skin.indexOf("The cost per day"),
    );
    expect(skin.indexOf("The cost per day")).toBeLessThan(
      skin.indexOf("PEGGY10"),
    );
    expect(textOf(page("men-s-hrt"))).toContain("anthing");
    expect(textOf(page("men-s-hrt"))).toContain("https://shrsl.com/4pnzy");
    expect(textOf(page("hrt-doctors-review-costs-services"))).toContain(
      "Specialities",
    );
    expect(textOf(page("hrt-doctors-review-costs-services"))).toContain(
      "$229/Month",
    );
    expect(textOf(page("hrt-doctors-review-costs-services"))).toContain(
      "shareasale.com/r.cfm?b=2245796",
    );
    expect(textOf(page("weight-gain"))).not.toContain("joiblokes");
    expect(textOf(page("weight-gain"))).toContain("The Holy Grail");
    expect(textOf(page("weight-gain"))).toContain(
      "I'm happy to report. It did.",
    );
    expect(
      page("weight-gain").slices.find(
        (slice) => slice.slice_type === "side_by_side",
      ),
    ).toMatchObject({
      variation: "clinic",
      primary: {
        heading: [{ text: "The Holy Grail" }],
        style: "Quote",
        clinic: { id: "asvUERcAAC0AeNI_", uid: "joi" },
      },
    });
    expect(textOf(page("weight-gain"))).not.toContain("weight-chalkboard");
    expect(textOf(page("weight-gain"))).not.toContain("clinic_comparison");
    expect(textOf(page("weight-gain"))).toContain(
      "joi-weight-loss-review-my-experience-using-semaglutide-hrt",
    );
    expect(textOf(page("weight-gain"))).toContain(
      "ivim-review-hrt-glp-1-menopause-weight-gain",
    );
    expect(textOf(page("weight-gain"))).toContain("semaglutide-and-menopause");
    expect(textOf(page("tipstofindprovider"))).toContain('"/formuations"');
    expect(page("tipstofindprovider").slices[0]).toMatchObject({
      slice_type: "hero",
      variation: "subpage",
    });
    expect(
      pageImages(page("tipstofindprovider")).map((image) => image.filename),
    ).toEqual(["peggy-portrait.jpg"]);
    expect(textOf(page("tipstofindprovider"))).toContain(
      "This is what I look at before I pay a clinic.",
    );
    expect(textOf(page("tipstofindprovider"))).toContain(
      "Hormone Replacement Specialist near me",
    );
    expect(textOf(page("hair-loss"))).toContain("photo_gallery");
    expect(textOf(page("hair-loss"))).toContain("Simmer Elite");
    expect(textOf(page("hair-loss"))).toContain("Raquel Welch - Portrait Mode");
    expect(
      pageImages(page("hair-loss")).map((image) => image.filename),
    ).toEqual([
      "hair-thin.jpg",
      "hair-topper.jpg",
      "hair-shaved.jpg",
      "wig-portrait.jpg",
      "wig-directors.jpg",
      "wig-flirt.jpg",
      "wig-julianne.jpg",
    ]);
    expect(textOf(page("skincare"))).toContain("alloy-m4-face-cream-review");
    expect(textOf(page("skincare"))).toContain(
      "winona-estriol-cream-with-tretinoin-review",
    );
    expect(
      pageImages(page("men-s-hrt")).map((image) => image.filename),
    ).toEqual(["men-1.jpg", "men-2.jpg", "men-3.jpg"]);
    expect(page("weight-gain").slices[0]).toMatchObject({
      slice_type: "hero",
      variation: "subpage",
      primary: { heading: [{ text: "Stubborn weight loss" }] },
    });
    expect(textOf(page("weight-gain"))).toContain(
      "GLP-1 and GIP-1 meds can be very beneficial",
    );
    expect(
      pageImages(page("weight-gain")).map((image) => image.filename),
    ).toEqual(["weight-vial.jpg"]);
    expect(textOf(page("weight-gain"))).toContain('"picked"');
    const chart = page("hrt-price-comparison-chart");
    const homeChart = HOMEPAGE.slices.find(
      (slice) => slice.slice_type === "clinic_comparison",
    );
    const pageChart = chart.slices.find(
      (slice) => slice.slice_type === "clinic_comparison",
    );
    expect(pageChart?.variation).toBe("default");
    expect(textOf(pageChart)).toContain("2026-09-09");
    expect(textOf(pageChart)).toContain("These are my real costs");
    const clinicsOf = (slice: typeof homeChart) =>
      slice && "primary" in slice
        ? (slice.primary as { clinics?: unknown }).clinics
        : undefined;
    expect(clinicsOf(pageChart)).toEqual(clinicsOf(homeChart));
    expect(textOf(chart)).toContain("atGcfxIAAC4AAHHR");
    expect(textOf(page("hrt-price-comparison-chart"))).toContain(
      "atGcfRIAACkAAHHM",
    );
    expect(textOf(page("hrt-price-comparison-chart"))).toContain(
      "my-experience-with-joi-women-s-wellness-menopause-hormone-testing-what-s-included-is-it-worth-it",
    );
    expect(textOf(page("sleep")).match(/hero/g)?.length).toBeGreaterThan(0);
    expect(page("sleep").indexing).toBe(false);
    expect(page("hair-loss").indexing).toBe(false);
    expect(page("men-s-hrt").indexing).toBe(false);
    for (const uid of [
      "formuations",
      "costandinsurance",
      "sleep",
      "hair-loss",
      "skincare",
      "weight-gain",
      "hrt-price-comparison-chart",
      "tipstofindprovider",
      "hrt-doctors-review-costs-services",
      "men-s-hrt",
    ]) {
      expect(page(uid).slices[0]?.slice_type).toBe("hero");
      expect(page(uid).slices[1]?.slice_type).toBe("divider");
      expect(textOf(page(uid))).toContain("/trusted-providers");
    }
  });

  it("finishes the homepage and keeps the hero and divider", () => {
    expect(
      HOMEPAGE.slices.map((slice) => [slice.slice_type, slice.variation]),
    ).toEqual([
      ["hero", "home"],
      ["divider", "default"],
      ["start_here", "default"],
      ["posts", "home"],
      ["clinic_comparison", "default"],
      ["quote", "default"],
      ["side_by_side", "image"],
    ]);
    const writing = textOf(HOMEPAGE);
    expect(writing).toContain("Feel like you again.");
    expect(writing).toContain('"/weight-gain"');
    expect(writing).not.toContain("copy-of-");
    expect(writing).not.toContain('"/sleep"');
    expect(writing).toContain("XYNQOFoQwb5OYLsz");
    expect(writing).toContain('"/#eight-online-hrt-clinics-side-by-side"');
    expect(writing).toContain('"/formuations"');
    expect(writing).toContain("2026-09-09");
    expect(writing).toContain("asz9cxcAADEAer1m");
    expect(writing).toContain("will-midi-health-help-me-lose-weight");
    expect(writing).toContain("personally tested");
    expect(writing).toContain("Menopause isn\u2019t a dirty word.");
    expect(pageImages(HOMEPAGE).map((image) => image.filename)).toEqual([
      "peggy-winston.jpg",
    ]);
    const story = HOMEPAGE.slices.find(
      (slice) => slice.slice_type === "side_by_side",
    );
    expect(story?.primary.side).toBe("Media left");
    expect(story?.primary.media_position).toBe("Sticky");
  });
});
