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

describe("site pages", () => {
  it("sends About, FAQ, Is HRT for me, and Inner Balance, in that order", () => {
    expect(SITE_PAGES.map((item) => item.uid)).toEqual([
      "about",
      "faq",
      "ishrtforme",
      "inner-balance",
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

  it("keeps the FAQ wording and pairs each answer with its question", () => {
    const faq = page("faq");
    expect(faq.slices.map((slice) => slice.slice_type)).toEqual([
      "hero",
      "divider",
      "faq",
      "buttons",
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
    expect(writing).not.toContain("pxf.io");
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
      ["clinic_facts", "default"],
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
    expect(pageImages(clinic)).toEqual([]);
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
