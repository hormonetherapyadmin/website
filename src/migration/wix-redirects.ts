// Redirects approved for the Wix migration. docs/MIGRATION_RUNBOOK.md has
// the same list with its reasons; change both together. The importer
// points links in posts straight at the destination. The same rows are
// the repeatable group on the one Redirect document.

export type WixRedirect = { from: string; to: string; reason: string };

const deadPost = "A 404 on the live site with no Wix redirect. Goes to /blog.";

export const WIX_REDIRECTS: readonly WixRedirect[] = [
  {
    from: "/copy-of-hrt-doctors",
    to: "/hrt-doctors-review-costs-services",
    reason: "Old copy of the HRT Doctors page. /hrt-doctors does not exist.",
  },
  {
    from: "/copy-of-joi-women-s-wellness",
    to: "/hrt-doctors-review-costs-services",
    reason:
      "Wix chained this through /general-8/… and /tipstofindprovider/…. Goes straight to the page it names.",
  },
  {
    from: "/copy-of-men-s-hrt",
    to: "/hair-loss",
    reason: "Wix redirect.",
  },
  {
    from: "/copy-of-midi-health",
    to: "/mymenopauserx",
    reason: "Wix redirect.",
  },
  {
    from: "/copy-of-pricing-insurance",
    to: "/ishrtforme",
    reason: "Wix redirect.",
  },
  {
    from: "/copy-of-providers",
    to: "/formuations",
    reason: "Wix redirect.",
  },
  {
    from: "/copy-of-trusted-providers",
    to: "/trusted-providers",
    reason:
      "Not in Wix. The live trusted providers page moves to a new address (owner decision, 2026-10-09).",
  },
  {
    from: "/copy-of-inner-balance",
    to: "/inner-balance",
    reason: "The same page as /inner-balance.",
  },
  {
    from: "/copy-of-winona",
    to: "/musely",
    reason: "Wix redirect.",
  },
  {
    from: "/copy-of-winona-review-page",
    to: "/winona-review-page",
    reason:
      "Old copy of the Winona review. Wix pointed at /evernow-review-page, a 404.",
  },
  {
    from: "/copy-of-weight-gain",
    to: "/weight-gain",
    reason:
      "The page lives at /weight-gain. The Wix copy address redirects there.",
  },
  {
    from: "/costandformunlations",
    to: "/costandinsurance",
    reason: "Wix redirect.",
  },
  {
    from: "/trustedproviders",
    to: "/trusted-providers",
    reason:
      "Not in Wix. A 404 on Wix that 23 blog links point to, the page's intended address.",
  },
  {
    from: "/general-8",
    to: "/tipstofindprovider",
    reason: "Wix redirect.",
  },
  {
    from: "/general-8/hrt-doctors-review-costs-services",
    to: "/hrt-doctors-review-costs-services",
    reason: "Old folder path of the HRT Doctors page.",
  },
  {
    from: "/general-8/winona-plans-costs-insurance-accapted",
    to: "/winona-review-page",
    reason: "Old folder path of the Winona page.",
  },
  {
    from: "/tipstofindprovider/hrt-doctors-review-costs-services",
    to: "/hrt-doctors-review-costs-services",
    reason:
      "Wix redirect target. Wix shows the tips page at any path under it.",
  },
  {
    from: "/tipstofindprovider/winona-plans-costs-insurance-accapted",
    to: "/winona-review-page",
    reason:
      "Wix redirect target. Wix shows the tips page at any path under it.",
  },
  { from: "/home", to: "/", reason: "Wix redirect." },
  {
    from: "/hrt-semiglutide",
    to: "/",
    reason: "Misspelling. Wix pointed at /hrt-semaglutide, a 404.",
  },
  {
    from: "/hrt-semaglutide",
    to: "/",
    reason: "Not in Wix. A 404 on Wix that blog posts link to.",
  },
  {
    from: "/semaglutide-comparison-chart",
    to: "/skincare",
    reason: "Wix redirect.",
  },
  {
    from: "/services-1",
    to: "/joiwommenswellness",
    reason: "Wix redirect.",
  },
  {
    from: "/winona-plans-costs-insurance-accapted",
    to: "/winona-review-page",
    reason: "Wix redirect.",
  },
  {
    from: "/post/signs-that-you-need-hormone-replacement-therapy",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/heart-health-and-bioidentical-hormones",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/hormone-replacement-benefits-your-brain",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/what-are-bioidentical-hormones-made-of",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/bioidentical-estrogen-and-progesterone",
    to: "/blog",
    reason: deadPost,
  },
  { from: "/post/estrogen", to: "/blog", reason: deadPost },
  {
    from: "/post/the-benefits-of-hormone-replacement-therapy-for-bone-health-during-menopause",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/can-hormone-replacement-help-with-hair-loss",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/hormone-replacement-therapy-cost",
    to: "/blog",
    reason: deadPost,
  },
  {
    from: "/post/shopping-for-online-hormone-replacement-therapy-hrt",
    to: "/blog",
    reason: deadPost,
  },
];
