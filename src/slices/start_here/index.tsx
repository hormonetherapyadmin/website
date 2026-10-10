import {
  isFilled,
  type LinkField,
  type RichTextField,
  type SelectField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./start-here.module.css";

const ICONS = ["Question", "Lightbulb", "Medicine", "Wallet"] as const;

type IconName = (typeof ICONS)[number];

type StartCard = {
  small_heading: RichTextField;
  heading: RichTextField;
  text: RichTextField;
  link: LinkField;
  icon: SelectField<IconName>;
};

type StartHerePrimary = Partial<SliceSectionFields> & {
  cards?: readonly StartCard[] | null;
};

const toneClass = [styles.tone1, styles.tone2, styles.tone3, styles.tone4];
const cardsPerRow = 4;

function choice<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  for (const option of allowed) {
    if (option === value) return option;
  }
  return fallback;
}

/**
 * Rows of at most four. One card is half the row and centered. Two are
 * halves, three are thirds, and four are quarters. Further cards fill
 * another row and follow the same rule.
 */
export function cardRows<T>(items: readonly T[]): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += cardsPerRow) {
    rows.push(items.slice(index, index + cardsPerRow));
  }

  return rows;
}

function Icon({ name }: { name: string | null | undefined }) {
  const icon = choice(name, ICONS, "Question");

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon === "Question" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.2a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14" />
          <path d="M12 17.2h.01" />
        </>
      ) : null}
      {icon === "Lightbulb" ? (
        <>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M8.2 14.2A5.5 5.5 0 1 1 15.8 14c-.8.7-1.3 1.5-1.5 2.4h-4.6c-.2-.9-.7-1.7-1.5-2.2z" />
        </>
      ) : null}
      {icon === "Medicine" ? (
        <>
          <rect
            x="3.5"
            y="8"
            width="17"
            height="8"
            rx="4"
            transform="rotate(-35 12 12)"
          />
          <path d="M9.2 9.4 14.8 14.6" transform="rotate(-35 12 12)" />
        </>
      ) : null}
      {icon === "Wallet" ? (
        <>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </svg>
  );
}

function Card({ card, tone }: { card: StartCard; tone: number }) {
  return (
    <PrismicNextLink
      field={card.link}
      className={[styles.card, toneClass[tone % toneClass.length]].join(" ")}
    >
      <span className={styles.icon}>
        <Icon name={card.icon} />
      </span>
      <RichText field={card.small_heading} as="p" className={styles.kicker} />
      <RichText field={card.heading} as="h3" />
      <RichText field={card.text} as="p" className={styles.detail} />
      <span className={styles.cta} aria-hidden="true">
        Start here
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
      </span>
    </PrismicNextLink>
  );
}

/** "Where should I start?" Cards share the row by how many there are. */
export function StartHere({ primary }: { primary: StartHerePrimary }) {
  const cards = (primary.cards ?? []).filter((card) =>
    isFilled.link(card.link),
  );
  const rows = cardRows(cards);

  return (
    <SliceSection section={primary}>
      {rows.length > 0 ? (
        <div className={styles.rows}>
          {rows.map((row, rowIndex) => {
            const rowStart = rowIndex * cardsPerRow;

            return (
              <ul key={rowStart} className={styles.row} data-count={row.length}>
                {row.map((card, index) => (
                  <li key={rowStart + index}>
                    <Card card={card} tone={rowStart + index} />
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      ) : null}
    </SliceSection>
  );
}

export default StartHere;
