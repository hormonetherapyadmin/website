import { headers } from "next/headers";
import { PageSliceZone } from "@/components/page-slice-zone";
import { loadPageSliceContext } from "@/lib/page-slice-context";
import {
  replaceImages,
  type LocalImage,
  type SitePage,
} from "@/migration/site-pages";
import type { PageDocumentDataSlicesSlice } from "../../../../prismicio-types";

function previewImage(image: LocalImage, origin: string) {
  return {
    id: image.filename,
    url: `${origin}/${image.path.replace(/^public\//, "")}`,
    alt: image.alt,
    copyright: null,
    dimensions:
      image.filename === "peggy-winston.jpg"
        ? { width: 1200, height: 1600 }
        : { width: 1200, height: 1500 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

/** Renders the migration slices with the published brands and posts. */
export async function SlicePreview({ slices }: { slices: SitePage["slices"] }) {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const origin = `${headerList.get("x-forwarded-proto") ?? "http"}://${host}`;
  const preview = replaceImages(slices, (image) =>
    previewImage(image, origin),
  ).map((slice, index) => ({
    ...slice,
    id: `${slice.slice_type}-${index}`,
  })) as unknown as PageDocumentDataSlicesSlice[];
  const context = await loadPageSliceContext(preview, {});
  return <PageSliceZone slices={preview} context={context} />;
}
