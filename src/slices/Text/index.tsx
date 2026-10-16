import type { RichTextField } from "@prismicio/client";
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import {
  SliceSection,
  sliceLayout,
  type SliceSectionFields,
} from "@/components/slice-section";

type TextPrimary = Partial<SliceSectionFields> & {
  text?: RichTextField | null;
  layout?: string | null;
};

/**
 * Writing on its own, in the post story column, centered on the page.
 * On the right keeps the writing on the left and the link beside the
 * heading. Centered centers the writing and puts the link under it.
 * A Background color still fills the full width.
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
  const centered = sliceLayout(primary.layout) === "centered";

  return (
    <SliceSection
      section={primary}
      width="story"
      align={centered ? "center" : "start"}
      linkPlacement={centered ? "end" : "beside"}
    >
      <Content
        field={primary.text}
        clinics={clinics}
        tokens={tokens}
        align={centered ? "center" : "start"}
      />
    </SliceSection>
  );
}

export default Text;
