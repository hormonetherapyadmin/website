import type { RichTextField } from "@prismicio/client";
import { parseProviderToken } from "@/components/content-blocks";

type StoryBlock = RichTextField[number];
type StoryImage = Extract<StoryBlock, { type: "image" }>;

export type PhotoCell = {
  image: StoryImage;
  caption: RichTextField | null;
};

export type StorySegment =
  | { kind: "rich"; field: RichTextField }
  | { kind: "photos"; cells: [PhotoCell, PhotoCell] }
  | { kind: "table" }
  | { kind: "sources"; items: StoryBlock[] };

const PHOTO_ROW = /^\{\{photos\}\}$/;
const TABLE_TOKEN = /^\{\{table\}\}$/;

/** A paragraph that is only the side-by-side photo token. */
export function isPhotoRowToken(text: string) {
  return PHOTO_ROW.test(text.trim());
}

/** A paragraph that is only the table token. */
export function isTableToken(text: string) {
  return TABLE_TOKEN.test(text.trim());
}

function paragraphText(block: StoryBlock) {
  if (
    block.type !== "paragraph" ||
    !("text" in block) ||
    typeof block.text !== "string"
  ) {
    return null;
  }
  return block.text;
}

function isBlank(block: StoryBlock) {
  const text = paragraphText(block);
  return text !== null && text.trim() === "";
}

/** The line under a photo. A token stays a token, not a caption. */
function isCaption(block: StoryBlock) {
  const text = paragraphText(block);
  if (text === null || text.trim() === "") return false;
  if (isPhotoRowToken(text)) return false;
  if (isTableToken(text)) return false;
  if (parseProviderToken(text)) return false;
  return true;
}

function isImage(block: StoryBlock): block is StoryImage {
  return block.type === "image";
}

function isResourcesHeading(block: StoryBlock) {
  const text = paragraphText(block);
  return text !== null && /^(resources|sources):?$/i.test(text.trim());
}

function isListItem(block: StoryBlock) {
  return block.type === "list-item" || block.type === "o-list-item";
}

/**
 * The next two photos after a {{photos}} line. Each photo keeps the
 * paragraph directly under it. A heading, a token, or a single photo
 * ends the row.
 */
function collectPhotos(field: RichTextField, start: number) {
  const cells: PhotoCell[] = [];
  let index = start;

  while (cells.length < 2 && index < field.length) {
    while (index < field.length && isBlank(field[index])) index += 1;
    const block = field[index];
    if (!block || !isImage(block)) break;

    index += 1;
    while (index < field.length && isBlank(field[index])) index += 1;

    let caption: RichTextField | null = null;
    const next = field[index];
    if (next && isCaption(next)) {
      caption = [next] as RichTextField;
      index += 1;
    }

    cells.push({ image: block, caption });
  }

  return { cells, next: index };
}

/**
 * Splits a story into ordinary rich text, side-by-side photo rows, and
 * a trailing Resources list. The list becomes the numbered sources when
 * the Sources field is empty.
 */
export function storySegments(
  field: RichTextField | null | undefined,
  options?: { promoteResources?: boolean },
): StorySegment[] {
  if (!field?.length) return [];

  const segments: StorySegment[] = [];
  let rich: StoryBlock[] = [];

  function flush() {
    if (!rich.length) return;
    segments.push({ kind: "rich", field: rich as RichTextField });
    rich = [];
  }

  let index = 0;
  while (index < field.length) {
    const text = paragraphText(field[index]);
    if (text !== null && isTableToken(text)) {
      flush();
      segments.push({ kind: "table" });
      index += 1;
      continue;
    }

    if (text !== null && isPhotoRowToken(text)) {
      flush();
      index += 1;
      const collected = collectPhotos(field, index);
      index = collected.next;
      if (collected.cells.length === 2) {
        segments.push({
          kind: "photos",
          cells: [collected.cells[0], collected.cells[1]],
        });
      } else {
        for (const cell of collected.cells) {
          rich.push(cell.image);
          if (cell.caption?.[0]) rich.push(cell.caption[0]);
        }
      }
      continue;
    }

    if (options?.promoteResources && isResourcesHeading(field[index])) {
      let cursor = index + 1;
      const items: StoryBlock[] = [];
      while (cursor < field.length && isListItem(field[cursor])) {
        items.push(field[cursor]);
        cursor += 1;
      }
      if (items.length > 0) {
        flush();
        segments.push({ kind: "sources", items });
        index = cursor;
        continue;
      }
    }

    rich.push(field[index]);
    index += 1;
  }

  flush();
  return segments;
}
