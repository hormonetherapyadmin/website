import {
  asText,
  isFilled,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { useId } from "react";
import { PeggyTip, PEGGY_TIP_TITLE } from "@/components/peggy-tip";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionBackground,
  sliceLayout,
  type SliceSectionFields,
} from "@/components/slice-section";
import { storyLinkRel } from "@/lib/affiliate-link";
import styles from "./ribbon.module.css";
import { ribbonBoxBackground, ribbonShowsWave, ribbonTone } from "./tone";

export { ribbonBoxBackground, ribbonShowsWave, ribbonTone };

type RibbonPrimary = Partial<SliceSectionFields> & {
  title?: RichTextField | null;
  content?: RichTextField | null;
  box_background?: string | null;
  button?: readonly LinkField[] | null;
  layout?: string | null;
};

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

function RibbonTip({ primary }: { primary: RibbonPrimary }) {
  const titleId = useId();
  const sectionHeading = asText(primary.heading ?? []).trim();
  const hasContent = isFilled.richText(primary.content);
  const box = ribbonBoxBackground(primary.box_background);
  const behind = sectionBackground(primary.background);

  return (
    <SliceSection
      section={primary}
      title={sectionHeading || (hasContent ? PEGGY_TIP_TITLE : undefined)}
      labelId={!sectionHeading && hasContent ? titleId : undefined}
    >
      {hasContent ? (
        <PeggyTip
          box={box}
          behind={behind}
          titleAs={sectionHeading ? "h3" : "h2"}
          titleId={titleId}
        >
          <RichText field={primary.content} />
        </PeggyTip>
      ) : null}
    </SliceSection>
  );
}

/**
 * A colored box on a section band. On the right, title and content sit
 * on the left and buttons sit on the right. Centered centers the words
 * and stacks the buttons under them. Solid is the filled button. Ghost
 * is the text button with an arrow. Tip is the same box with Peggy’s
 * portrait and the title “Peggy’s tip”. She types the tip.
 */
export function Ribbon({
  variation = "default",
  primary,
}: {
  variation?: string;
  primary: RibbonPrimary;
}) {
  const titleId = useId();
  if (variation === "tip") return <RibbonTip primary={primary} />;

  const centered = sliceLayout(primary.layout) === "centered";
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
      align={centered ? "center" : "start"}
    >
      {hasTitle || hasContent || buttons.length > 0 ? (
        <div
          className={styles.box}
          data-box={box}
          data-behind={behind}
          data-tone={ribbonTone(box, behind)}
          data-layout={centered ? "centered" : "right"}
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
