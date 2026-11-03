import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { minutesToRead } from "@/lib/post-derived";
import { postCard, type PostCardSource } from "@/lib/page-slices";
import { createClient } from "@/prismicio";
import type { PostCardData } from "@/slices/posts";

/**
 * Fields a card or a related-post row shows. The story is not here.
 * Prismic's graph query needs a newline after the opening brace.
 */
export const POST_CARD_GRAPH_QUERY = `{
  post {
    title
    sub_title
    image
    published_date
    category
  }
}`;

/** The story alone, so minutes-to-read can be counted without the rest. */
export const POST_BODY_GRAPH_QUERY = `{
  post {
    body
  }
}`;

/** Enough to list post URLs at build time. The UID is on the document. */
export const POST_UID_GRAPH_QUERY = `{
  post {
    category
  }
}`;

export type ListedPost = PostCardData & {
  id: string;
  uid: string;
};

type ListedSource = PostCardSource & { uid?: string | null };

/**
 * Cards from a field-limited post query. Minutes come from a separate
 * story fetch, so this list does not have to carry every story.
 */
export function listedPosts(
  documents: readonly ListedSource[],
  minutes: Readonly<Record<string, number>>,
): ListedPost[] {
  return documents.flatMap((document) => {
    const card = postCard({
      ...document,
      data: { ...document.data, body: [] },
    });
    if (!card || !document.uid) return [];
    const read = minutes[document.id];
    return [
      {
        ...card,
        id: document.id,
        uid: document.uid,
        readTime: typeof read === "number" ? read : 0,
      },
    ];
  });
}

async function readMinutesById(preview: boolean) {
  const documents = await createClient({}, { preview }).getAllByType("post", {
    graphQuery: POST_BODY_GRAPH_QUERY,
  });
  return Object.fromEntries(
    documents.map((document) => [
      document.id,
      minutesToRead(document.data.body),
    ]),
  );
}

// Production keeps the counts until the publish webhook expires "prismic".
// Development refetches, matching the rest of the Prismic client.
const publishedReadMinutes = unstable_cache(
  () => readMinutesById(false),
  ["post-read-minutes"],
  { tags: ["prismic"] },
);

async function loadReadMinutes() {
  if (process.env.NODE_ENV === "development") return readMinutesById(true);
  if ((await draftMode()).isEnabled) return readMinutesById(true);
  return publishedReadMinutes();
}

/** Published posts, reduced to the card. Search still loads full stories. */
export async function loadPostCards(): Promise<ListedPost[]> {
  const client = createClient();
  const [documents, minutes] = await Promise.all([
    client.getAllByType("post", { graphQuery: POST_CARD_GRAPH_QUERY }),
    loadReadMinutes(),
  ]);
  return listedPosts(documents, minutes);
}
