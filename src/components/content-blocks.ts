import type { RichTextField } from "@prismicio/client";

export type TokenPart = "offer" | "facts";

/** A clinic a story token can read. The page loads it by UID. */
export type TokenClinic = {
  uid: string;
  name: string;
  logo?: { src: string };
  visitHref?: string;
  visitText?: string;
  newTab?: boolean;
  offerCode?: string;
  offerCopy?: string;
  monthlyPrice?: number | null;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
};

export type ProviderToken = {
  uid: string;
  part: TokenPart;
  sentence: string;
};

type Span = {
  start: number;
  end: number;
  type: string;
  data?: { label?: string };
};

const BLOCK_LABELS = ["signoff", "note"] as const;

export type BlockLabel = (typeof BLOCK_LABELS)[number];

export type ContentPiece =
  | { kind: "rich"; field: RichTextField }
  | { kind: "signoff"; field: RichTextField }
  | { kind: "note"; field: RichTextField }
  | ({ kind: "token" } & ProviderToken);

const TOKEN = /^\{\{provider:([a-z0-9-]+):(offer|facts)\}\}([\s\S]*)$/;

function isBlockLabel(value: string | undefined): value is BlockLabel {
  return BLOCK_LABELS.some((label) => label === value);
}

function paragraphOf(block: RichTextField[number]) {
  if (
    block.type !== "paragraph" ||
    !("text" in block) ||
    typeof block.text !== "string" ||
    !("spans" in block) ||
    !Array.isArray(block.spans)
  ) {
    return null;
  }

  return { text: block.text, spans: block.spans as Span[] };
}

/** A clinic token at the start of a paragraph. Any other wording stays text. */
export function parseProviderToken(text: string): ProviderToken | null {
  const match = text.trimStart().match(TOKEN);
  if (!match) return null;
  const part = match[2];
  if (part !== "offer" && part !== "facts") return null;

  return {
    uid: match[1],
    part,
    sentence: match[3].trim(),
  };
}

function blockLabel(text: string, spans: Span[]): BlockLabel | null {
  const span = spans.find(
    (item) =>
      item.type === "label" &&
      item.start === 0 &&
      item.end === text.length &&
      isBlockLabel(item.data?.label),
  );
  const label = span?.data?.label;
  return isBlockLabel(label) ? label : null;
}

function withoutBlockLabel(
  block: RichTextField[number],
  text: string,
  spans: Span[],
): RichTextField[number] {
  return {
    ...block,
    spans: spans.filter(
      (item) =>
        !(
          item.type === "label" &&
          item.start === 0 &&
          item.end === text.length &&
          isBlockLabel(item.data?.label)
        ),
    ),
  } as RichTextField[number];
}

/**
 * Splits a content field into ordinary rich text, a closing line, a note
 * box, and clinic tokens. A Signoff or Note label has to cover the whole
 * paragraph. A token is the first thing in the paragraph.
 */
export function contentPieces(
  field: RichTextField | null | undefined,
): ContentPiece[] {
  if (!field?.length) return [];

  const pieces: ContentPiece[] = [];
  let rich: RichTextField[number][] = [];

  function flush() {
    if (!rich.length) return;
    pieces.push({ kind: "rich", field: rich as RichTextField });
    rich = [];
  }

  for (const block of field) {
    const paragraph = paragraphOf(block);
    if (paragraph) {
      const label = blockLabel(paragraph.text, paragraph.spans);
      if (label) {
        flush();
        pieces.push({
          kind: label,
          field: [
            withoutBlockLabel(block, paragraph.text, paragraph.spans),
          ] as RichTextField,
        });
        continue;
      }

      const token = parseProviderToken(paragraph.text);
      if (token) {
        flush();
        pieces.push({ kind: "token", ...token });
        continue;
      }
    }

    rich.push(block);
  }

  flush();
  return pieces;
}

/**
 * Clinic UIDs for the post sidebar, in the order each clinic's first
 * token appears. A repeated token stays once. A token in the middle of
 * a sentence does not count.
 */
export function storyClinicUids(
  field: RichTextField | null | undefined,
): string[] {
  const uids: string[] = [];
  for (const piece of contentPieces(field)) {
    if (piece.kind !== "token" || uids.includes(piece.uid)) continue;
    uids.push(piece.uid);
  }
  return uids;
}
