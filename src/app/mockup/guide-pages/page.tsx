import type { Metadata } from "next";
import { SlicePreview } from "../_shared/slice-preview";
import { MockupShell } from "../_shared/mockup-shell";
import { SITE_PAGES } from "@/migration/site-pages";

/*
  The remaining Wix site pages, in the order they go to Prismic.
*/

const UIDS = [
  "formuations",
  "costandinsurance",
  "sleep",
  "hair-loss",
  "skincare",
  "copy-of-weight-gain",
  "hrt-price-comparison-chart",
  "tipstofindprovider",
  "hrt-doctors-review-costs-services",
  "men-s-hrt",
];

export const metadata: Metadata = {
  title: "Guide pages",
  robots: { index: false, follow: false },
};

export default async function GuidePagesMockup(
  props: PageProps<"/mockup/guide-pages">,
) {
  const searchParams = await props.searchParams;
  const pages = UIDS.map((uid) => {
    const page = SITE_PAGES.find((item) => item.uid === uid);
    if (!page) throw new Error(`Missing guide page ${uid}`);
    return page;
  });

  return (
    <MockupShell searchParams={searchParams}>
      {pages.map((page) => (
        <SlicePreview key={page.uid} slices={page.slices} />
      ))}
    </MockupShell>
  );
}
