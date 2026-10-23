import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { asText, isFilled, type RichTextField } from "@prismicio/client";
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./faq.module.css";

type FaqItem = {
  question?: RichTextField | null;
  answer?: RichTextField | null;
  /** On starts this question opened. Off, or empty, starts it closed. */
  open?: boolean | null;
};

type FaqPrimary = Partial<SliceSectionFields> & {
  questions?: readonly FaqItem[] | null;
};

type Heading = "h2" | "h3";

/** Questions with words. An empty question is hidden, answer or not. */
export function faqItems(questions: readonly FaqItem[] | null | undefined) {
  return (questions ?? []).flatMap((item) => {
    if (!isFilled.richText(item.question)) return [];
    if (!asText(item.question).trim()) return [];
    return [item];
  });
}

/**
 * Questions that open and close. Any of them can start opened. The
 * rest start closed, and a reader can have more than one open.
 */
export function Faq({
  primary,
  clinics,
  tokens = "public",
}: {
  primary: FaqPrimary;
  /** Clinics a token in an answer can name. */
  clinics?: readonly TokenClinic[];
  tokens?: "preview" | "public";
}) {
  const titled = Boolean(primary.heading && asText(primary.heading).trim());
  const Question: Heading = titled ? "h3" : "h2";
  const items = faqItems(primary.questions);

  return (
    <SliceSection section={primary} width="story">
      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={index}>
              <details className={styles.item} open={item.open === true}>
                <summary className={styles.summary}>
                  <RichText
                    field={item.question}
                    as={Question}
                    unstyled
                    className={styles.question}
                  />
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={18}
                    strokeWidth={2.25}
                    className={styles.chevron}
                    aria-hidden="true"
                  />
                </summary>
                <div className={styles.answer}>
                  <Content
                    field={item.answer}
                    clinics={clinics}
                    tokens={tokens}
                  />
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : null}
    </SliceSection>
  );
}

export default Faq;
