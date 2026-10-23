import { isFilled, type LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { storyLinkRel } from "@/lib/affiliate-link";
import styles from "./buttons.module.css";

type ButtonsPrimary = Partial<SliceSectionFields> & {
  button?: readonly LinkField[] | null;
  layout?: string | null;
};

/** Links that have both a destination and words. */
export function buttonLinks(buttons: readonly LinkField[] | null | undefined) {
  return (buttons ?? []).filter(
    (button) => isFilled.link(button) && Boolean(button.text?.trim()),
  );
}

/**
 * A row of buttons, with no box. On the left lines them up with the
 * writing. Centered centers them. Solid is the filled button. Ghost
 * is the text button with an arrow.
 */
export function Buttons({ primary }: { primary: ButtonsPrimary }) {
  const buttons = buttonLinks(primary.button);
  const centered = primary.layout === "Centered";
  const hasHeading =
    isFilled.richText(primary.heading) ||
    isFilled.richText(primary.small_heading);

  if (buttons.length === 0 && !hasHeading) return null;

  return (
    <SliceSection
      section={primary}
      width="story"
      align={centered ? "center" : "start"}
    >
      {buttons.length > 0 ? (
        <div
          className={styles.actions}
          data-layout={centered ? "centered" : "left"}
        >
          {buttons.map((button, index) => {
            const ghost = button.variant === "Ghost";

            return (
              <PrismicNextLink
                key={`${index}-${button.variant ?? "Solid"}-${button.text}`}
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
    </SliceSection>
  );
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

export default Buttons;
