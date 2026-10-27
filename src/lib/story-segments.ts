import type { RichTextField } from "@prismicio/client";
import { isTipToken, parseProviderToken } from "@/components/content-blocks";

type StoryBlock = RichTextField[number];
type StoryImage = Extract<StoryBlock, { type: "image" }>;

export type PhotoCell = {
  image: StoryImage;
  caption: RichTextField | null;
};

export type StorySegment =
  | { kind: "rich"; field: RichTextField }
  | ({ kind: "photo" } & PhotoCell)
  | { kind: "photos"; cells: [PhotoCell, PhotoCell] }
  | { kind: "photoText"; image: StoryImage; text: RichTextField }
  /** Position in the Tables group. {{table}} is 1, {{table2}} is 2. */
  | { kind: "table"; number: number }
  | { kind: "sources"; items: StoryBlock[] };

const PHOTO_ROW = /^\{\{photos\}\}$/;
const PHOTO_TEXT = /^\{\{photo-text\}\}$/;
const TABLE_TOKEN = /^\{\{table([1-9]\d*)?\}\}$/;

/** A paragraph that is only the side-by-side photo token. */
export function isPhotoRowToken(text: string) {
  return PHOTO_ROW.test(text.trim());
}

/** A paragraph that is only the photo-beside-text token. */
export function isPhotoTextToken(text: string) {
  return PHOTO_TEXT.test(text.trim());
}

/** The table a paragraph asks for, or null when it is not a table token. */
export function tableTokenNumber(text: string): number | null {
  const match = TABLE_TOKEN.exec(text.trim());
  if (!match) return null;
  return match[1] ? Number(match[1]) : 1;
}

/** A paragraph that is only a table token. */
export function isTableToken(text: string) {
  return tableTokenNumber(text) !== null;
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
  if (isPhotoTextToken(text)) return false;
  if (isTableToken(text)) return false;
  if (parseProviderToken(text)) return false;
  if (isTipToken(text)) return false;
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
 * The next photos after a {{photos}} or {{photo-text}} line. Each photo
 * keeps the paragraph directly under it. A heading, a token, or a
 * single photo ends the row.
 */
function collectPhotos(field: RichTextField, start: number, limit = 2) {
  const cells: PhotoCell[] = [];
  let index = start;

  while (cells.length < limit && index < field.length) {
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
 * Splits a story into ordinary rich text, single photos with their
 * caption, side-by-side photo rows, photos beside their paragraph, and
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
    const tableNumber = text === null ? null : tableTokenNumber(text);
    if (tableNumber !== null) {
      flush();
      segments.push({ kind: "table", number: tableNumber });
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
          segments.push({ kind: "photo", ...cell });
        }
      }
      continue;
    }

    if (text !== null && isPhotoTextToken(text)) {
      flush();
      index += 1;
      const collected = collectPhotos(field, index, 1);
      index = collected.next;
      const [cell] = collected.cells;
      if (cell?.caption) {
        segments.push({
          kind: "photoText",
          image: cell.image,
          text: cell.caption,
        });
      } else if (cell) {
        segments.push({ kind: "photo", ...cell });
      }
      continue;
    }

    if (isImage(field[index])) {
      flush();
      const collected = collectPhotos(field, index, 1);
      index = collected.next;
      segments.push({ kind: "photo", ...collected.cells[0] });
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
