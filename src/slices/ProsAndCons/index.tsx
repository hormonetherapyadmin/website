import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { asText, type RichTextField } from "@prismicio/client";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./pros-and-cons.module.css";

type ProsConsRow = {
  title?: string | null;
  pros?: RichTextField | null;
  cons?: RichTextField | null;
};

type ProsConsPrimary = Partial<SliceSectionFields> & {
  pros_label?: string | null;
  cons_label?: string | null;
  rows?: readonly ProsConsRow[] | null;
};

type Heading = "h2" | "h3" | "h4";

/** Each line or bullet as its own one-paragraph field. Blank lines drop. */
export function listItems(field: RichTextField | null | undefined) {
  return (field ?? []).flatMap((block) => {
    if (!("text" in block) || !block.text.trim()) return [];
    return [[{ ...block, type: "paragraph" }] as RichTextField];
  });
}

function Side({
  label,
  items,
  icon,
  tone,
  as: Tag,
}: {
  label: string;
  items: RichTextField[];
  icon: IconSvgElement;
  tone: "pros" | "cons";
  as: Heading;
}) {
  if (!items.length) return null;

  return (
    <div className={styles.card} data-tone={tone}>
      <div className={styles.banner}>
        <span className={styles.mark}>
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </span>
        <Tag className={styles.label}>{label}</Tag>
      </div>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>
            <RichText field={item} as="p" unstyled />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Pros beside cons. Each row is two cards, with an optional title, such
 * as HRT and BHRT. A row with no pros and no cons is hidden.
 */
export function ProsAndCons({ primary }: { primary: ProsConsPrimary }) {
  const prosLabel = primary.pros_label?.trim() || "Pros";
  const consLabel = primary.cons_label?.trim() || "Cons";
  const rowLevel: Heading = asText(primary.heading ?? []).trim() ? "h3" : "h2";
  const rows = (primary.rows ?? []).flatMap((row) => {
    const pros = listItems(row.pros);
    const cons = listItems(row.cons);
    if (!pros.length && !cons.length) return [];
    return [{ title: row.title?.trim() || "", pros, cons }];
  });

  return (
    <SliceSection section={primary}>
      {rows.map((row, index) => {
        const Title = rowLevel;
        const sideLevel: Heading = row.title
          ? rowLevel === "h2"
            ? "h3"
            : "h4"
          : rowLevel;

        return (
          <div key={index} className={styles.row}>
            {row.title ? (
              <Title className={styles.rowTitle}>{row.title}</Title>
            ) : null}
            <div
              className={styles.pair}
              data-sides={row.pros.length && row.cons.length ? "2" : "1"}
            >
              <Side
                label={prosLabel}
                items={row.pros}
                icon={Tick02Icon}
                tone="pros"
                as={sideLevel}
              />
              <Side
                label={consLabel}
                items={row.cons}
                icon={MinusSignIcon}
                tone="cons"
                as={sideLevel}
              />
            </div>
          </div>
        );
      })}
    </SliceSection>
  );
}

export default ProsAndCons;
