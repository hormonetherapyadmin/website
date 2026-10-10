import { createClient } from "@/prismicio";
import { heroClinicId } from "@/lib/page-title";
import { pageSearchHit, postSearchHit, type SearchHit } from "@/lib/search";
import type { ProviderDocument } from "../../prismicio-types";

type Client = ReturnType<typeof createClient>;

/**
 * Names of the published clinics that provider Heroes open these pages
 * with, by clinic id. A provider Hero's title is that name.
 */
export async function loadHeroClinicNames(
  client: Client,
  pages: readonly { data: { slices?: unknown } }[],
): Promise<Map<string, string>> {
  const ids = [
    ...new Set(pages.flatMap((page) => heroClinicId(page.data.slices) ?? [])),
  ];
  if (!ids.length) return new Map();

  const clinics = await client.getAllByIDs<ProviderDocument>(ids);
  return new Map(
    clinics.flatMap((clinic) =>
      clinic.type === "provider" && clinic.data.name
        ? [[clinic.id, clinic.data.name] as const]
        : [],
    ),
  );
}

/** Published pages and posts that are still set to Index. */
export async function loadSearchCatalog(): Promise<SearchHit[]> {
  const client = createClient();
  const [pages, posts] = await Promise.all([
    client.getAllByType("page"),
    client.getAllByType("post"),
  ]);
  const clinicNames = await loadHeroClinicNames(client, pages);

  return [
    ...pages.flatMap((page) => {
      const id = heroClinicId(page.data.slices);
      const hit = pageSearchHit(page, id && clinicNames.get(id));
      return hit ? [hit] : [];
    }),
    ...posts.flatMap((post) => {
      const hit = postSearchHit(post);
      return hit ? [hit] : [];
    }),
  ];
}
