import type { Metadata } from "next";
import { HOMEPAGE } from "@/migration/site-pages";
import { SlicePreview } from "../_shared/slice-preview";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Homepage mockup, built from the homepage slices. The hero and the
  divider stay. The chart reads the published brands.
*/

export const metadata: Metadata = {
  title: "Homepage mockup",
  robots: { index: false, follow: false },
};

export default async function HomepageMockupPage(
  props: PageProps<"/mockup/homepage">,
) {
  const searchParams = await props.searchParams;
  return (
    <MockupShell searchParams={searchParams}>
      <SlicePreview slices={HOMEPAGE.slices} />
    </MockupShell>
  );
}
