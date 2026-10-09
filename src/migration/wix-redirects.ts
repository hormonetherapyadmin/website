// Redirects approved for the Wix migration. docs/MIGRATION_RUNBOOK.md has
// the same list with its reasons; change both together. The importer
// points links in posts straight at the destination, and each row
// becomes a Redirect document once that type is built.

export type WixRedirect = { from: string; to: string };

export const WIX_REDIRECTS: readonly WixRedirect[] = [
  { from: "/copy-of-hrt-doctors", to: "/hrt-doctors-review-costs-services" },
  {
    from: "/copy-of-joi-women-s-wellness",
    to: "/hrt-doctors-review-costs-services",
  },
  { from: "/copy-of-men-s-hrt", to: "/hair-loss" },
  { from: "/copy-of-midi-health", to: "/mymenopauserx" },
  { from: "/copy-of-pricing-insurance", to: "/ishrtforme" },
  { from: "/copy-of-providers", to: "/formuations" },
  { from: "/copy-of-trusted-providers", to: "/trusted-providers" },
  { from: "/copy-of-winona", to: "/musely" },
  { from: "/copy-of-winona-review-page", to: "/winona-review-page" },
  { from: "/costandformunlations", to: "/costandinsurance" },
  { from: "/trustedproviders", to: "/trusted-providers" },
  { from: "/general-8", to: "/tipstofindprovider" },
  {
    from: "/general-8/hrt-doctors-review-costs-services",
    to: "/hrt-doctors-review-costs-services",
  },
  {
    from: "/general-8/winona-plans-costs-insurance-accapted",
    to: "/winona-review-page",
  },
  {
    from: "/tipstofindprovider/hrt-doctors-review-costs-services",
    to: "/hrt-doctors-review-costs-services",
  },
  {
    from: "/tipstofindprovider/winona-plans-costs-insurance-accapted",
    to: "/winona-review-page",
  },
  { from: "/home", to: "/" },
  { from: "/hrt-semiglutide", to: "/" },
  { from: "/hrt-semaglutide", to: "/" },
  { from: "/semaglutide-comparison-chart", to: "/skincare" },
  { from: "/services-1", to: "/joiwommenswellness" },
  { from: "/winona-plans-costs-insurance-accapted", to: "/winona-review-page" },
  {
    from: "/post/signs-that-you-need-hormone-replacement-therapy",
    to: "/blog",
  },
  { from: "/post/heart-health-and-bioidentical-hormones", to: "/blog" },
  { from: "/post/hormone-replacement-benefits-your-brain", to: "/blog" },
  { from: "/post/what-are-bioidentical-hormones-made-of", to: "/blog" },
  { from: "/post/bioidentical-estrogen-and-progesterone", to: "/blog" },
  { from: "/post/estrogen", to: "/blog" },
  {
    from: "/post/the-benefits-of-hormone-replacement-therapy-for-bone-health-during-menopause",
    to: "/blog",
  },
  { from: "/post/can-hormone-replacement-help-with-hair-loss", to: "/blog" },
  { from: "/post/hormone-replacement-therapy-cost", to: "/blog" },
  {
    from: "/post/shopping-for-online-hormone-replacement-therapy-hrt",
    to: "/blog",
  },
];
