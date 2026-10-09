import {
  asText,
  isFilled,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { useId } from "react";
import { RichText } from "@/components/rich-text";
import {
  SECTION_BACKGROUNDS,
  SliceSection,
  sectionBackground,
  type SectionBackground,
  type SliceSectionFields,
} from "@/components/slice-section";
import { storyLinkRel } from "@/lib/affiliate-link";
import styles from "./ribbon.module.css";

type RibbonPrimary = Partial<SliceSectionFields> & {
  title?: RichTextField | null;
  content?: RichTextField | null;
  box_background?: string | null;
  button?: readonly LinkField[] | null;
};

/** An empty Box background is Pink, the ribbon in the template. */
export function ribbonBoxBackground(
  value: string | null | undefined,
): SectionBackground {
  if (value == null || value === "") return "Pink";
  for (const option of SECTION_BACKGROUNDS) {
    if (option === value) return option;
  }
  return "Transparent";
}

/**
 * Text follows the color the words sit on. A transparent box sits on
 * the section, so a Navy or Raspberry band behind it uses light text.
 */
export function ribbonTone(
  box: SectionBackground,
  behind: SectionBackground,
): "dark" | "light" {
  const surface = box === "Transparent" ? behind : box;
  return surface === "Navy" || surface === "Raspberry" ? "dark" : "light";
}

/** The corner wave is the color behind the box, and only when it would show. */
export function ribbonShowsWave(
  box: SectionBackground,
  behind: SectionBackground,
) {
  if (box === "Transparent") return false;
  const painted = box === "Cream" ? "page" : box;
  const ground =
    behind === "Transparent" || behind === "Cream" ? "page" : behind;
  return painted !== ground;
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/**
 * A colored box on a section band. Title and content sit on the left.
 * Buttons sit on the right, in the order they are added. Solid is the
 * filled button. Ghost is the text button with an arrow.
 */
export function Ribbon({ primary }: { primary: RibbonPrimary }) {
  const titleId = useId();
  const box = ribbonBoxBackground(primary.box_background);
  const behind = sectionBackground(primary.background);
  const buttons = (primary.button ?? []).filter(
    (button) => isFilled.link(button) && button.text,
  );
  const hasTitle = isFilled.richText(primary.title);
  const hasContent = isFilled.richText(primary.content);
  const sectionHeading = asText(primary.heading ?? []).trim();
  const boxTitle = asText(primary.title ?? []).trim();
  const labelsSection = !sectionHeading && Boolean(boxTitle);

  return (
    <SliceSection
      section={primary}
      title={sectionHeading || boxTitle}
      labelId={labelsSection ? titleId : undefined}
    >
      {hasTitle || hasContent || buttons.length > 0 ? (
        <div
          className={styles.box}
          data-box={box}
          data-behind={behind}
          data-tone={ribbonTone(box, behind)}
          data-wave={ribbonShowsWave(box, behind) ? "true" : undefined}
        >
          <div className={styles.copy}>
            <RichText
              field={primary.title}
              as={sectionHeading ? "h3" : "h2"}
              id={hasTitle ? titleId : undefined}
              unstyled
              className={styles.title}
            />
            <RichText field={primary.content} className={styles.content} />
          </div>
          {buttons.length > 0 ? (
            <div className={styles.actions}>
              {buttons.map((button) => {
                const ghost = button.variant === "Ghost";

                return (
                  <PrismicNextLink
                    key={`${button.variant ?? "Solid"}-${button.text}`}
                    field={button}
                    className={ghost ? styles.ghost : styles.button}
                    rel={storyLinkRel}
                  >
                    {button.text}
                    {ghost ? <Chevron /> : null}
                  </PrismicNextLink>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </SliceSection>
  );
}

export default Ribbon;
