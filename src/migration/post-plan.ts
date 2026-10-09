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
  /** Posts named on this run. Only these are re-imported over an earlier run. */
  named: ReadonlySet<string> = new Set(),
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

  // Created by an earlier run and not yet published. The migration
  // release is not readable through the Content API, so the state file
  // is the only record of it. Peggy may have edited it there, so it is
  // re-imported only when named.
  const earlier = state[post.sourceId];
  if (earlier) {
    return named.has(post.uid)
      ? {
          action: "update",
          prismicId: earlier.prismicId,
          reason: "earlier run",
        }
      : {
          action: "skip",
          reason:
            "already in the migration release. Name it with --only to re-import",
        };
  }

  return { action: "create" };
}
