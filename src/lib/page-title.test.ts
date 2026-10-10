import { describe, expect, it } from "vitest";
import { heroClinicId, heroTitle } from "./page-title";

const rich = (text: string) => [{ type: "paragraph", text, spans: [] }];

const providerHero = (primary: Record<string, unknown>) => [
  { slice_type: "hero", variation: "provider", primary },
];

describe("heroClinicId", () => {
  it("reads the clinic a provider Hero at the top points at", () => {
    expect(
      heroClinicId(
        providerHero({ clinic: { link_type: "Document", id: "clinic-1" } }),
      ),
    ).toBe("clinic-1");
  });

  it("ignores other variations, a lower Hero, and an empty or broken clinic", () => {
    const clinic = { link_type: "Document", id: "clinic-1" };
    expect(
      heroClinicId([
        { slice_type: "hero", variation: "subpage", primary: { clinic } },
      ]),
    ).toBeUndefined();
    expect(
      heroClinicId([
        { slice_type: "divider", variation: "default", primary: {} },
        ...providerHero({ clinic }),
      ]),
    ).toBeUndefined();
    expect(
      heroClinicId(providerHero({ clinic: { link_type: "Any" } })),
    ).toBeUndefined();
    expect(
      heroClinicId(providerHero({ clinic: { ...clinic, isBroken: true } })),
    ).toBeUndefined();
  });
});

describe("heroTitle", () => {
  it("uses the clinic name on a provider Hero, then its Heading", () => {
    const slices = providerHero({
      small_heading: rich("Voted best for"),
      heading: rich("Fallback heading"),
    });
    expect(heroTitle(slices, "Inner Balance")).toBe("Inner Balance");
    expect(heroTitle(slices, "  ")).toBe("Fallback heading");
    expect(heroTitle(slices)).toBe("Fallback heading");
  });

  it("never uses the small heading", () => {
    expect(
      heroTitle(
        providerHero({ small_heading: rich("Voted best for"), heading: [] }),
      ),
    ).toBe("");
  });

  it("reads the Heading of other Hero variations, and nothing without a Hero", () => {
    expect(
      heroTitle([
        {
          slice_type: "hero",
          variation: "subpage",
          primary: { heading: rich("New to hormone therapy") },
        },
      ]),
    ).toBe("New to hormone therapy");
    expect(
      heroTitle([
        {
          slice_type: "quote",
          variation: "default",
          primary: { heading: rich("Kicker") },
        },
      ]),
    ).toBe("");
    expect(heroTitle(undefined)).toBe("");
  });
});
