import { isFilled, type ContentRelationshipField } from "@prismicio/client";

/** Peggy B. An empty Author field on a post resolves to this document. */
export const DEFAULT_AUTHOR_ID = "asfNZxEAACkAYArT";

export function resolveAuthorId(
  author: ContentRelationshipField | null | undefined,
): string {
  if (author && isFilled.contentRelationship(author)) return author.id;
  return DEFAULT_AUTHOR_ID;
}
