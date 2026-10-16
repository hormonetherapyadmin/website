import { draftMode } from "next/headers";
import {
  gridPage,
  pageClinic,
  postCard,
  sliceClinicIds,
  slicesNeedPosts,
  sliceTokenUids,
  type PageClinic,
} from "@/lib/page-slices";
import { tokenClinic } from "@/lib/token-clinic";
import { createClient } from "@/prismicio";
import type { PostDocument, ProviderDocument } from "../../prismicio-types";

type Slices = Parameters<typeof sliceClinicIds>[0];

/**
 * Clinics and posts the slices on a page read. The page passes this to
 * the slice zone. Slices do not fetch.
 */
export async function loadPageSliceContext(
  slices: Slices,
  searchParams: {
    page?: string | string[];
    category?: string | string[];
  },
) {
  const client = createClient();
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

  return {
    providers,
    clinics,
    tokenClinics,
    posts: cards,
    page: gridPage(searchParams.page),
    category:
      typeof searchParams.category === "string" ? searchParams.category : null,
    tokens: draft.isEnabled ? ("preview" as const) : ("public" as const),
  };
}
