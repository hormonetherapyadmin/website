import type { RichTextField } from "@prismicio/client";
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";

type TextPrimary = Partial<SliceSectionFields> & {
  text?: RichTextField | null;
};

/**
 * Writing on its own, left aligned in the post story column, centered
 * on the page. A Background color still fills the full width.
 */
export function Text({
  primary,
  clinics,
  tokens = "public",
}: {
  primary: TextPrimary;
  /** Clinics a token in the writing can name. */
  clinics?: readonly TokenClinic[];
  tokens?: "preview" | "public";
}) {
  return (
    <SliceSection section={primary} width="story">
      <Content field={primary.text} clinics={clinics} tokens={tokens} />
    </SliceSection>
  );
}

export default Text;
