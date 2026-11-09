// Canonical origin of the live site. Canonicals always use this, even on
// deploy previews.
export const SITE_URL = "https://www.hormonetherapyhub.com";

export const SITE_NAME = "Hormone Therapy Hub";

/** Designer lockups. Color on light pages, white on the dark footer. */
export const BRAND_LOGO = {
  color: "/logos/HTH_Logo_color.svg",
  black: "/logos/HTH_Logo_Black.svg",
  white: "/logos/HTH_Logo_white.svg",
} as const;

export const BRAND_LOGO_WIDTH = 720;
export const BRAND_LOGO_HEIGHT = 144;

export const DISCLOSURE_HREF = "/affiliate-disclosures";

/** Peggy's editorial standards page. A Page, not a separate singleton. */
export const HOW_I_REVIEW_HREF = "/how-i-review";

/**
 * Top-level paths the app owns. A Page with one of these UIDs never shows,
 * so search and the sitemap leave the path out. `/blog` is not here until
 * the blog index route exists; until then a Page can be `/blog`.
 * `slice-simulator` is the Page Builder thumbnail route.
 */
export const APP_ROUTE_UIDS: ReadonlySet<string> = new Set([
  "search",
  "sitemap",
  "blog-feed.xml",
  "post",
  "api",
  "mockup",
  "slice-simulator",
]);
