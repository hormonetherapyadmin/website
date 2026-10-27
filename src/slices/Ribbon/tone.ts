import {
  SECTION_BACKGROUNDS,
  type SectionBackground,
} from "@/components/slice-section";

/** An empty Box background is Pink, the ribbon in the template. */
export function ribbonBoxBackground(
  value: string | null | undefined,
): SectionBackground {
  if (value == null || value === "") return "Pink";
  for (const option of SECTION_BACKGROUNDS) {
    if (option === value) return option;
  }
  return "Transparent";
}

/**
 * Text follows the color the words sit on. A transparent box sits on
 * the section, so a Navy or Raspberry band behind it uses light text.
 */
export function ribbonTone(
  box: SectionBackground,
  behind: SectionBackground,
): "dark" | "light" {
  const surface = box === "Transparent" ? behind : box;
  return surface === "Navy" || surface === "Raspberry" ? "dark" : "light";
}

/** The corner wave is the color behind the box, and only when it would show. */
export function ribbonShowsWave(
  box: SectionBackground,
  behind: SectionBackground,
) {
  if (box === "Transparent") return false;
  const painted = box === "Cream" ? "page" : box;
  const ground =
    behind === "Transparent" || behind === "Cream" ? "page" : behind;
  return painted !== ground;
}
