import { asText, type RichTextField } from "@prismicio/client";
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import {
  sectionBackground,
  SliceSection,
  sliceLayout,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./text.module.css";
import { isLead, writingRuns, type CatalogEntry } from "./writing";

type TextPrimary = Partial<SliceSectionFields> & {
  text?: RichTextField | null;
  layout?: string | null;
};

/** A Heading 3 block, drawn as the card title. */
function titleField(block: RichTextField[number]): RichTextField {
  return [{ ...block, type: "paragraph" } as RichTextField[number]];
}

function Catalog({
  entries,
  onColor,
}: {
  entries: readonly CatalogEntry[];
  /** Paper cards when the section behind them is already tinted. */
  onColor: boolean;
}) {
  return (
    <ol className={styles.catalog} data-ground={onColor ? "color" : "page"}>
      {entries.map((entry, index) => (
        <li key={index}>
          <span className={styles.index} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <RichText
            field={titleField(entry.heading)}
            as="h3"
            unstyled
            className={styles.title}
          />
          <div className={styles.copy}>
            <RichText field={entry.body} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Writing on its own, in the post story column, centered on the page.
 * On the right keeps the writing on the left and the link beside the
 * heading. Centered centers the writing and puts the link under it.
 * A run of Heading 3 lines, each with a paragraph under it, is a
 * numbered card grid. One paragraph and no heading stays ordinary
 * writing when Layout is On the right. Centered makes that paragraph
 * the lead.
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
  const runs = writingRuns(primary.text);
  const titled = Boolean(asText(primary.heading ?? []).trim());
  const lead = centered && !titled && isLead(runs);
  const onColor = !["Transparent", "Cream"].includes(
    sectionBackground(primary.background),
  );

  return (
    <SliceSection
      section={primary}
      width="story"
      align={centered || lead ? "center" : "start"}
      linkPlacement={centered || lead ? "end" : "beside"}
    >
      {lead && runs[0]?.kind === "rich" ? (
        <div className={styles.lead} data-lead="">
          <RichText field={runs[0].field} />
        </div>
      ) : (
        runs.map((run, index) =>
          run.kind === "catalog" ? (
            <Catalog key={index} entries={run.entries} onColor={onColor} />
          ) : (
            <Content
              key={index}
              field={run.field}
              clinics={clinics}
              tokens={tokens}
              align={centered ? "center" : "start"}
            />
          ),
        )
      )}
    </SliceSection>
  );
}

export default Text;
