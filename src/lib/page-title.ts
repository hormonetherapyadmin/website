/**
 * The title a Page shows. A Hero at the top is the `h1`. A provider Hero's
 * title is its clinic's name, which lives on the Provider, so the caller
 * loads that clinic and passes the name in. See docs/SLICE_MODEL.md.
 */

type HeroLike = {
  variation: unknown;
  primary: Record<string, unknown>;
};

function firstHero(slices: unknown): HeroLike | undefined {
  if (!Array.isArray(slices)) return undefined;
  const first: unknown = slices[0];
  if (!first || typeof first !== "object") return undefined;
  const slice = first as Record<string, unknown>;
  if (slice.slice_type !== "hero") return undefined;
  if (!slice.primary || typeof slice.primary !== "object") return undefined;
  return {
    variation: slice.variation,
    primary: slice.primary as Record<string, unknown>,
  };
}

function plainText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((block: unknown) =>
      block && typeof block === "object" && "text" in block
        ? String(block.text)
        : "",
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The clinic a provider Hero at the top of the page points at. */
export function heroClinicId(slices: unknown): string | undefined {
  const hero = firstHero(slices);
  if (hero?.variation !== "provider") return undefined;
  const clinic = hero.primary.clinic;
  if (!clinic || typeof clinic !== "object") return undefined;
  const link = clinic as Record<string, unknown>;
  if (link.link_type !== "Document" || link.isBroken === true) return undefined;
  return typeof link.id === "string" ? link.id : undefined;
}

/**
 * The `h1` of a page that opens with a Hero. A provider Hero shows its
 * clinic's name, and its own Heading only when the clinic has no name.
 * Empty when the first slice is not a Hero.
 */
export function heroTitle(slices: unknown, clinicName?: string | null): string {
  const hero = firstHero(slices);
  if (!hero) return "";
  if (hero.variation === "provider") {
    const name = clinicName?.trim();
    if (name) return name;
  }
  return plainText(hero.primary.heading);
}
