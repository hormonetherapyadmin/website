import { createClient } from "@/prismicio";
import { pageSearchHit, postSearchHit, type SearchHit } from "@/lib/search";

/** Published pages and posts that are still set to Index. */
export async function loadSearchCatalog(): Promise<SearchHit[]> {
  const client = createClient();
  const [pages, posts] = await Promise.all([
    client.getAllByType("page"),
    client.getAllByType("post"),
  ]);

  return [
    ...pages.flatMap((page) => {
      const hit = pageSearchHit(page);
      return hit ? [hit] : [];
    }),
    ...posts.flatMap((post) => {
      const hit = postSearchHit(post);
      return hit ? [hit] : [];
    }),
  ];
}
