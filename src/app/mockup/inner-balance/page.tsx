import type { Metadata } from "next";
import { SlicePreview } from "../_shared/slice-preview";
import { MockupShell } from "../_shared/mockup-shell";
import { SITE_PAGES } from "@/migration/site-pages";

/*
  Inner Balance mockup, built from the page slices. Price, steps,
  specialties, and the visit link come from the published brand.
  The visit button is that brand's affiliate link.
*/

export const metadata: Metadata = {
  title: "Inner Balance mockup",
  robots: { index: false, follow: false },
};

export default async function InnerBalanceMockupPage(
  props: PageProps<"/mockup/inner-balance">,
) {
  const searchParams = await props.searchParams;
  const page = SITE_PAGES.find((item) => item.uid === "inner-balance");
  if (!page) throw new Error("Inner Balance page is missing");

  return (
    <MockupShell searchParams={searchParams}>
      <SlicePreview slices={page.slices} />
    </MockupShell>
  );
}
