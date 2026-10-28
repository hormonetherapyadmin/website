import { getSlices, SliceSimulator } from "@prismicio/next";
import type { Metadata } from "next";
import { PageSliceZone } from "@/components/page-slice-zone";
import { loadPageSliceContext } from "@/lib/page-slice-context";
import type { PageDocumentDataSlicesSlice } from "../../../prismicio-types";

export const metadata: Metadata = {
  title: "Slice simulator",
  robots: { index: false, follow: false },
};

/**
 * Slice types PageSliceZone can render. The generated map in
 * src/slices/index.ts points at components that do not take a Prismic
 * slice, so the simulator uses the page adapters instead.
 */
const PAGE_SLICES = new Set<string>([
  "hero",
  "start_here",
  "posts",
  "clinic_comparison",
  "quote",
  "side_by_side",
  "divider",
  "faq",
  "full_width_image",
  "photo_gallery",
  "ribbon",
  "buttons",
  "boxes",
  "brand_promo",
  "clinic_facts",
  "pros_cons",
  "text",
]);

function pageSlices(value: unknown): PageDocumentDataSlicesSlice[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((slice) => {
    if (!slice || typeof slice !== "object") return [];
    const candidate = slice as { slice_type?: unknown; primary?: unknown };
    if (
      typeof candidate.slice_type !== "string" ||
      !PAGE_SLICES.has(candidate.slice_type) ||
      !candidate.primary ||
      typeof candidate.primary !== "object"
    ) {
      return [];
    }
    return [slice as PageDocumentDataSlicesSlice];
  });
}

function simulatorSlices(state: string | undefined) {
  try {
    return pageSlices(getSlices(state));
  } catch {
    return [];
  }
}

/**
 * Thumbnails in the Prismic Page Builder. The repository simulator URL
 * is this site's origin; Prismic loads this route in an iframe and
 * posts the slice being edited.
 */
export default async function SliceSimulatorPage(
  props: PageProps<"/slice-simulator">,
) {
  const { state } = await props.searchParams;
  const slices = simulatorSlices(typeof state === "string" ? state : undefined);

  return (
    <SliceSimulator>
      <PageSliceZone
        slices={slices}
        context={await loadPageSliceContext(slices, {})}
      />
    </SliceSimulator>
  );
}
