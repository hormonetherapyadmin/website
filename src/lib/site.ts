// Canonical origin of the live site. Canonicals always use this, even on
// deploy previews.
export const SITE_URL = "https://www.hormonetherapyhub.com";

export const SITE_NAME = "Hormone Therapy Hub";

/**
 * Peggy's existing GA4 measurement ID. The other web stream,
 * G-BH971N6ZDY, is unused.
 */
export const GA_MEASUREMENT_ID = "G-VK8P9CJBX2";

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

/** Clinic match quiz. Questions stay in code. Results read Brand documents. */
export const QUIZ_PATH = "/provider-quiz";
export const QUIZ_TITLE = "Match me an online provider";

/**
 * The first public address of the quiz. `next.config.ts` redirects it
 * to `QUIZ_PATH`. It stays reserved so a Page cannot occupy it.
 */
export const QUIZ_PREVIOUS_PATH = "/find-your-clinic";

/**
 * Top-level paths the app owns. A Page with one of these UIDs never shows,
 * so search and the sitemap leave the path out. `/blog` is not here until
 * the blog index route exists; until then a Page can be `/blog`.
 * `slice-simulator` is the Page Builder thumbnail route.
 * `provider-quiz` is the clinic quiz. `find-your-clinic` is its old address.
 */
export const APP_ROUTE_UIDS: ReadonlySet<string> = new Set([
  "search",
  "sitemap",
  "blog-feed.xml",
  "post",
  "api",
  "mockup",
  "slice-simulator",
  "provider-quiz",
  "find-your-clinic",
]);
