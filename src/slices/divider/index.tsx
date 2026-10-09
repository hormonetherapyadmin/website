import type { SelectField } from "@prismicio/client";
import {
  SECTION_SPACING,
  sectionBackground,
  sectionBackgroundClass,
  type SectionBackground,
  type SectionSpacing,
} from "@/components/slice-section";
import styles from "./divider.module.css";

const LINES = ["Squiggly", "Straight"] as const;
const COLORS = ["Accent", "Soft", "Border", "Text"] as const;

type Line = (typeof LINES)[number];
type LineColor = (typeof COLORS)[number];

type DividerPrimary = {
  line: SelectField<Line>;
  color: SelectField<LineColor>;
  background: SelectField<SectionBackground>;
  space_above: SelectField<SectionSpacing>;
  space_below: SelectField<SectionSpacing>;
};

const lineClass: Record<Line, string> = {
  Squiggly: styles.squiggly,
  Straight: styles.straight,
};

const colorClass: Record<LineColor, string> = {
  Accent: styles.accent,
  Soft: styles.soft,
  Border: styles.border,
  Text: styles.text,
};

const spaceAboveClass: Record<SectionSpacing, string> = {
  None: "mt-0",
  Small: "mt-slice-sm",
  Medium: "mt-slice",
  Large: "mt-slice-lg",
};

const spaceBelowClass: Record<SectionSpacing, string> = {
  None: "mb-0",
  Small: "mb-slice-sm",
  Medium: "mb-slice",
  Large: "mb-slice-lg",
};

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

/** A decorative line. Spacing and background are fields on this slice. */
export function Divider({ primary }: { primary: DividerPrimary }) {
  const line = choice(primary.line, LINES, "Squiggly");
  const color = choice(primary.color, COLORS, "Accent");
  const background = sectionBackground(primary.background);
  const spaceAbove = choice(primary.space_above, SECTION_SPACING, "None");
  const spaceBelow = choice(primary.space_below, SECTION_SPACING, "None");
  const band = background !== "Cream";

  return (
    <div
      aria-hidden="true"
      className={[
        spaceAboveClass[spaceAbove],
        spaceBelowClass[spaceBelow],
        sectionBackgroundClass[background],
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "mx-auto w-full max-w-wrap px-gutter",
          band ? "py-slice" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[styles.line, lineClass[line], colorClass[color]].join(
            " ",
          )}
        />
      </div>
    </div>
  );
}

export default Divider;
