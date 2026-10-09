import type { RichTextField } from "@prismicio/client";
import { sectionAnchor } from "@/components/slice-section";

export type HeadingAnchor = {
  id: string;
  label: string;
};

/** Heading 2 lines, in story order. The rail label is the heading text. */
export function headingAnchors(
  field: RichTextField | null | undefined,
): HeadingAnchor[] {
  const used = new Set<string>();
  const anchors: HeadingAnchor[] = [];
  if (!field) return anchors;

  for (const block of field) {
    if (
      block.type !== "heading2" ||
      !("text" in block) ||
      typeof block.text !== "string"
    ) {
      continue;
    }

    const label = block.text.trim();
    const base = sectionAnchor(label) ?? "section";
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    used.add(id);
    anchors.push({ id, label });
  }

  return anchors;
}
