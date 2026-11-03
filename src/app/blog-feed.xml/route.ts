import { blogFeedXml, loadBlogFeedEntries } from "@/lib/blog-feed";

/** The latest indexable posts. A Prismic publish refreshes the list. */
export async function GET() {
  const xml = blogFeedXml(await loadBlogFeedEntries());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
