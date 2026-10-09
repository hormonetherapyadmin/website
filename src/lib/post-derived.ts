import type { RichTextField } from "@prismicio/client";

/** Average reading speed. Nearest-minute rounding matches most live Wix times. */
export const WORDS_PER_MINUTE = 250;

const STORY_TOKEN =
  /\{\{provider:[a-z0-9-]+:(?:offer|facts)\}\}|\{\{photos\}\}/g;

/** Words in the story. A clinic token is not a word the reader speaks. */
export function storyWordCount(
  field: RichTextField | null | undefined,
): number {
  if (!field?.length) return 0;
  const text = field
    .map((block) =>
      "text" in block && typeof block.text === "string" ? block.text : "",
    )
    .join(" ")
    .replace(STORY_TOKEN, " ")
    .trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

/**
 * Minutes to read, from the story. Rounded to the nearest minute.
 * A story with any words is at least one minute.
 */
export function minutesToRead(field: RichTextField | null | undefined): number {
  const words = storyWordCount(field);
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type RelatedCandidate = {
  id: string;
  category?: string | null;
  published: string;
};

/**
 * Keep reading. Same category, newest first, then the newest posts
 * in any category. The current post is left out.
 */
export function relatedPosts<T extends RelatedCandidate>(
  current: T,
  posts: readonly T[],
  limit = 3,
): T[] {
  const others = posts.filter((post) => post.id !== current.id);
  const byRecent = (a: T, b: T) =>
    b.published.localeCompare(a.published) || a.id.localeCompare(b.id);
  const sameCategory = current.category
    ? others.filter((post) => post.category === current.category).sort(byRecent)
    : [];
  const chosen = sameCategory.slice(0, limit);
  if (chosen.length >= limit) return chosen;

  const chosenIds = new Set(chosen.map((post) => post.id));
  const rest = others.filter((post) => !chosenIds.has(post.id)).sort(byRecent);
  return [...chosen, ...rest.slice(0, limit - chosen.length)];
}
