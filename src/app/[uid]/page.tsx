import { isFilled, NotFoundError, ParsingError } from "@prismicio/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSliceZone } from "@/components/page-slice-zone";
import { SiteShell } from "@/components/site-shell";
import { isIndexingAllowed } from "@/lib/env";
import { loadPageSliceContext } from "@/lib/page-slice-context";
import { heroClinicId, heroTitle } from "@/lib/page-title";
import { APP_ROUTE_UIDS, SITE_NAME } from "@/lib/site";
import { createClient } from "@/prismicio";
import type { PageDocument, ProviderDocument } from "../../../prismicio-types";

async function loadPage(uid: string) {
  if (APP_ROUTE_UIDS.has(uid)) return null;
  try {
    return await createClient().getByUID("page", uid);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    // Prismic rejects a UID query on a type with no published documents.
    if (
      error instanceof ParsingError &&
      error.message.includes("my.page.uid")
    ) {
      return null;
    }
    throw error;
  }
}

/** The published clinic a provider Hero at the top names. */
async function heroClinicName(page: PageDocument) {
  const id = heroClinicId(page.data.slices);
  if (!id) return undefined;
  const [clinic] = await createClient().getAllByIDs<ProviderDocument>([id]);
  return clinic?.type === "provider" ? clinic.data.name : undefined;
}

export async function generateMetadata(
  props: PageProps<"/[uid]">,
): Promise<Metadata> {
  const { uid } = await props.params;
  const page = await loadPage(uid);
  if (!page) return {};

  const title =
    page.data.meta_title?.trim() ||
    heroTitle(page.data.slices, await heroClinicName(page)) ||
    undefined;
  const description = page.data.meta_description?.trim() || undefined;
  const image = isFilled.image(page.data.meta_image)
    ? page.data.meta_image
    : null;
  const index = isIndexingAllowed() && page.data.indexing !== false;

  return {
    title,
    description,
    alternates: { canonical: `/${page.uid}` },
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      url: `/${page.uid}`,
      siteName: SITE_NAME,
      images: image?.url
        ? [{ url: image.url, alt: image.alt ?? "" }]
        : undefined,
    },
  };
}

export default async function SitePage(props: PageProps<"/[uid]">) {
  const { uid } = await props.params;
  const searchParams = await props.searchParams;
  const page = await loadPage(uid);
  if (!page) notFound();

  const slices = page.data.slices;
  const title = page.data.meta_title?.trim() ?? "";
  const startsWithHero = slices[0]?.slice_type === "hero";

  return (
    <SiteShell>
      {!startsWithHero && title ? (
        <h1 className="mx-auto w-full max-w-wrap px-gutter pt-slice font-heading text-4xl">
          {title}
        </h1>
      ) : null}
      <PageSliceZone
        slices={slices}
        context={await loadPageSliceContext(slices, searchParams)}
      />
    </SiteShell>
  );
}
