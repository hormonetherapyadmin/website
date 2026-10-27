import type { RichTextField } from "@prismicio/client";
import { isTipToken } from "@/components/content-blocks";

type Block = RichTextField[number];

export type CatalogEntry = {
  heading: Block;
  body: RichTextField;
};

export type WritingRun =
  | { kind: "rich"; field: RichTextField }
  | { kind: "catalog"; entries: CatalogEntry[] };

function textOf(block: Block) {
  return "text" in block && typeof block.text === "string" ? block.text : "";
}

function isHeading3(block: Block) {
  return block.type === "heading3" && textOf(block).trim().length > 0;
}

/** A paragraph that should stay ordinary writing, not a catalog card. */
function isEntryParagraph(block: Block) {
  if (block.type !== "paragraph") return false;
  const text = textOf(block).trim();
  if (!text) return false;
  if (text.startsWith("{{provider:")) return false;
  if (isTipToken(text)) return false;
  return true;
}

/**
 * Pulls a catalog out of the writing. A catalog entry is a Heading 3
 * followed by one or more paragraphs. Two or more of those in a row
 * become cards. A Heading 3 with nothing under it stays a heading.
 * Everything else stays ordinary writing.
 */
export function writingRuns(
  field: RichTextField | null | undefined,
): WritingRun[] {
  if (!field?.length) return [];

  const runs: WritingRun[] = [];
  let rich: Block[] = [];

  function flush() {
    if (!rich.length) return;
    runs.push({ kind: "rich", field: rich as RichTextField });
    rich = [];
  }

  let index = 0;
  while (index < field.length) {
    const entries: CatalogEntry[] = [];
    let cursor = index;

    while (cursor < field.length && isHeading3(field[cursor])) {
      const body: Block[] = [];
      let next = cursor + 1;
      while (next < field.length && isEntryParagraph(field[next])) {
        body.push(field[next]);
        next += 1;
      }
      if (!body.length) break;
      entries.push({
        heading: field[cursor],
        body: body as RichTextField,
      });
      cursor = next;
    }

    if (entries.length >= 2) {
      flush();
      runs.push({ kind: "catalog", entries });
      index = cursor;
      continue;
    }

    rich.push(field[index]);
    index += 1;
  }

  flush();
  return runs;
}

/**
 * A slice with no heading and one plain paragraph can be the lead.
 * The slice centers it only when Layout is Centered. A clinic token
 * stays ordinary writing so the offer box can render. A tip token
 * stays ordinary writing so Peggy’s tip can render.
 */
export function isLead(runs: readonly WritingRun[]) {
  if (runs.length !== 1 || runs[0].kind !== "rich") return false;
  const [block] = runs[0].field;
  if (!block || runs[0].field.length !== 1) return false;
  if (!isEntryParagraph(block)) return false;
  const spans =
    "spans" in block && Array.isArray(block.spans) ? block.spans : [];
  const labeled = spans.some(
    (span) =>
      span.type === "label" &&
      (span.data?.label === "signoff" || span.data?.label === "note"),
  );
  return !labeled;
}
