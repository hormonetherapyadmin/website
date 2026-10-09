import {
  asText,
  isFilled,
  NotFoundError,
  ParsingError,
} from "@prismicio/client";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageSliceZone } from "@/components/page-slice-zone";
import { isIndexingAllowed } from "@/lib/env";
import {
  gridPage,
  pageClinic,
  postCard,
  sliceClinicIds,
  slicesNeedPosts,
  sliceTokenUids,
  type PageClinic,
} from "@/lib/page-slices";
import { SITE_NAME } from "@/lib/site";
import { tokenClinic } from "@/lib/token-clinic";
import { createClient } from "@/prismicio";
import type {
  PageDocument,
  PostDocument,
  ProviderDocument,
} from "../../../prismicio-types";
import { MockupShell } from "../mockup/_shared/mockup-shell";

async function loadPage(uid: string) {
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

function heroHeading(page: PageDocument) {
  const first = page.data.slices[0];
  if (first?.slice_type !== "hero") return "";
  return asText(first.primary.heading).trim();
}

function metaTitle(page: PageDocument) {
  return page.data.meta_title?.trim() || heroHeading(page);
}

export async function generateMetadata(
  props: PageProps<"/[uid]">,
): Promise<Metadata> {
  const { uid } = await props.params;
  const page = await loadPage(uid);
  if (!page) return {};

  const title = metaTitle(page) || undefined;
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

  const client = createClient();
  const slices = page.data.slices;
  const clinicIds = sliceClinicIds(slices);
  const tokenUids = sliceTokenUids(slices);
  const [draft, byId, byUid, posts] = await Promise.all([
    draftMode(),
    clinicIds.length
      ? client.getAllByIDs<ProviderDocument>(clinicIds)
      : Promise.resolve([] as ProviderDocument[]),
    tokenUids.length
      ? client.getAllByUIDs("provider", tokenUids)
      : Promise.resolve([] as ProviderDocument[]),
    slicesNeedPosts(slices)
      ? client.getAllByType("post")
      : Promise.resolve([] as PostDocument[]),
  ]);

  const providers = new Map(
    byId
      .filter((document) => document.type === "provider")
      .map((document) => [document.id, document]),
  );
  const clinics = new Map<string, PageClinic>();
  for (const document of providers.values()) {
    const clinic = pageClinic(document);
    if (clinic) clinics.set(document.id, clinic);
  }
  const tokenClinics = byUid.flatMap((document) => {
    const clinic = tokenClinic(document);
    return clinic ? [clinic] : [];
  });
  const cards = posts.flatMap((document) => {
    const card = postCard(document);
    return card ? [card] : [];
  });
  const category =
    typeof searchParams.category === "string" ? searchParams.category : null;

  const title = page.data.meta_title?.trim() ?? "";
  const startsWithHero = slices[0]?.slice_type === "hero";

  return (
    <MockupShell searchParams={searchParams}>
      {!startsWithHero && title ? (
        <h1 className="mx-auto w-full max-w-wrap px-gutter pt-slice font-heading text-4xl">
          {title}
        </h1>
      ) : null}
      <PageSliceZone
        slices={slices}
        context={{
          providers,
          clinics,
          tokenClinics,
          posts: cards,
          page: gridPage(searchParams.page),
          category,
          tokens: draft.isEnabled ? "preview" : "public",
        }}
      />
    </MockupShell>
  );
}
