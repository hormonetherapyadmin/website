// Canonical origin of the live site. Canonicals always use this, even on
// deploy previews.
export const SITE_URL = "https://www.hormonetherapyhub.com";

export const SITE_NAME = "Hormone Therapy Hub";

export const DISCLOSURE_HREF = "/affiliate-disclosures";

/** Peggy's editorial standards page. A Page, not a separate singleton. */
export const HOW_I_REVIEW_HREF = "/how-i-review";

/**
 * Top-level paths the app owns. A Page with one of these UIDs never shows,
 * so search and the sitemap leave the path out. `/blog` is not here until
 * the blog index route exists; until then a Page can be `/blog`.
 */
export const APP_ROUTE_UIDS: ReadonlySet<string> = new Set([
  "search",
  "sitemap",
  "post",
  "api",
  "mockup",
]);
