import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SITE_PAGES, pageImages } from "./site-pages";

const SITE = "https://www.hormonetherapyhub.com";

function page(uid: string) {
  const found = SITE_PAGES.find((item) => item.uid === uid);
  if (!found) throw new Error(`No page ${uid}`);
  return found;
}

function textOf(value: unknown): string {
  return JSON.stringify(value);
}

describe("site pages", () => {
  it("sends About, FAQ, and Is HRT for me, in that order", () => {
    expect(SITE_PAGES.map((item) => item.uid)).toEqual([
      "about",
      "faq",
      "ishrtforme",
    ]);
  });

  it("builds About from a subpage hero and a side-by-side story", () => {
    const about = page("about");
    expect(
      about.slices.map((slice) => [slice.slice_type, slice.variation]),
    ).toEqual([
      ["hero", "subpage"],
      ["side_by_side", "image"],
    ]);
    expect(textOf(about)).toContain("to for someone");
    expect(textOf(about)).toContain("bog pages");
    expect(textOf(about)).toContain("Clinics .");
    expect(textOf(about)).toContain('"label":"signoff"');
    expect(textOf(about)).toContain(`${SITE}/blog`);
    expect(textOf(about)).toContain(`${SITE}/trusted-providers`);
    expect(textOf(about)).toContain(`${SITE}/ishrtforme`);
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

  it("uses public addresses and the photos that are already in the repo", () => {
    const writing = textOf(SITE_PAGES);
    expect(writing).not.toContain("/mockup/blog");
    expect(writing).not.toContain("/mockup/trusted-providers");
    expect(writing).not.toContain("/mockup/is-hrt-for-me");
    expect(writing).not.toContain("#affiliate");
    for (const item of SITE_PAGES) {
      for (const image of pageImages(item)) {
        expect(image.path.startsWith("public/mockup/")).toBe(true);
        expect(existsSync(image.path)).toBe(true);
      }
    }
  });
});
