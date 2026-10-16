import { describe, expect, it } from "vitest";
import { categoryFromWix } from "./post-category";

describe("categoryFromWix", () => {
  it("uses the tightened label for each Wix category", () => {
    expect(categoryFromWix("Telehealth BHRT Brand Reviews")).toBe(
      "Telehealth brand reviews",
    );
    expect(categoryFromWix("Formulations & Dosages")).toBe(
      "Formulations & dosages",
    );
    expect(categoryFromWix("My Experience & Results")).toBe(
      "My experience & results",
    );
    expect(categoryFromWix("Testing, Labs & Tracking")).toBe(
      "Testing, labs & tracking",
    );
    expect(categoryFromWix("Cost, Insurance & Access")).toBe(
      "Cost, insurance & access",
    );
  });

  it("leaves an unknown label unset", () => {
    expect(categoryFromWix("My Experience &  Results")).toBeUndefined();
    expect(categoryFromWix("Review")).toBeUndefined();
  });
});
