// Recognizes affiliate links written in post text, so they get the
// affiliate rel. Designed CTAs read their destination from Provider and
// Offer documents and set the rel themselves.

export const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

/** Affiliate network and short-link hosts. Any link through them is paid. */
const NETWORK_HOSTS = [
  "pxf.io",
  "sjv.io",
  "amzn.to",
  "link.amazon",
  "glnk.io",
  "shrsl.com",
  "shareasale.com",
  "gopjn.com",
  "pjatr.com",
  "pjtra.com",
  "pntra.com",
  "pntrs.com",
  "refr.cc",
  "f0t4tijmrkdv.com",
];

/** Partner sites where only one path is the affiliate link. */
const PARTNER_PATHS: Record<string, string> = {
  "mymenopauserx.com": "/hormonetherapyhub",
};

/** Peggy's referral codes, as they appear in a path or query. */
const REFERRAL_CODE = /bronson|peggy/i;

const OWN_HOST = "hormonetherapyhub.com";

function matchesHost(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

export function isAffiliateUrl(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (matchesHost(host, OWN_HOST)) return false;
  if (NETWORK_HOSTS.some((domain) => matchesHost(host, domain))) return true;

  const partnerPath = PARTNER_PATHS[host];
  if (partnerPath && url.pathname.toLowerCase().startsWith(partnerPath)) {
    return true;
  }
  if (REFERRAL_CODE.test(`${url.pathname}${url.search}`)) return true;
  if (url.searchParams.has("affid")) return true;
  if (
    matchesHost(host, "amazon.com") &&
    (url.searchParams.has("tag") || url.searchParams.has("campaignId"))
  ) {
    return true;
  }
  return false;
}

/**
 * The `rel` for a Prismic link in post text. Same as Prismic's default
 * (`noreferrer` on external links) except affiliate links.
 */
export function storyLinkRel({
  href,
  isExternal,
}: {
  href?: string;
  isExternal?: boolean;
}): string | undefined {
  if (href && isAffiliateUrl(href)) return AFFILIATE_REL;
  return isExternal ? "noreferrer" : undefined;
}
