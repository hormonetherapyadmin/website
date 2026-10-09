// Decides what the Wix post importer does with each post.

/** Wix post id → the Prismic document an earlier run created for it. */
export type ImportState = Record<string, { uid: string; prismicId: string }>;

export type PostAction =
  | { action: "create" }
  | {
      action: "update";
      prismicId: string;
      reason: "earlier run" | "replace";
    }
  | { action: "skip"; reason: string };

export function planPost(
  post: { sourceId: string; uid: string; problems: readonly string[] },
  published: ReadonlyMap<string, string>,
  state: ImportState,
  replace: ReadonlySet<string>,
): PostAction {
  if (post.problems.length) {
    return { action: "skip", reason: post.problems.join("; ") };
  }

  const publishedId = published.get(post.uid);
  if (publishedId) {
    return replace.has(post.uid)
      ? { action: "update", prismicId: publishedId, reason: "replace" }
      : { action: "skip", reason: "already published in Prismic" };
  }

  // Created by a run that did not finish, or not yet published. The
  // migration release is not readable through the Content API, so the
  // state file is the only record of it.
  const earlier = state[post.sourceId];
  if (earlier) {
    return {
      action: "update",
      prismicId: earlier.prismicId,
      reason: "earlier run",
    };
  }

  return { action: "create" };
}
