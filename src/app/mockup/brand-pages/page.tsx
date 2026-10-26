import type { Metadata } from "next";
import { SlicePreview } from "../_shared/slice-preview";
import { MockupShell } from "../_shared/mockup-shell";
import { SITE_PAGES } from "@/migration/site-pages";

/*
  The clinic pages, in the order they go to Prismic. Price, steps, and
  the visit link come from each published brand.
*/

const UIDS = [
  "inner-balance",
  "winona-review-page",
  "musely",
  "alloy-review-page",
  "joiwommenswellness",
  "effecty",
  "mymenopauserx",
  "midi-health-review-page",
];

export const metadata: Metadata = {
  title: "Clinic pages",
  robots: { index: false, follow: false },
};

export default async function BrandPagesMockup(
  props: PageProps<"/mockup/brand-pages">,
) {
  const searchParams = await props.searchParams;
  const pages = UIDS.map((uid) => {
    const page = SITE_PAGES.find((item) => item.uid === uid);
    if (!page) throw new Error(`Missing clinic page ${uid}`);
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
