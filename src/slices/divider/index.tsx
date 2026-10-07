import type { SelectField } from "@prismicio/client";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./divider.module.css";

const LINES = ["Squiggly", "Straight"] as const;
const COLORS = ["Accent", "Soft", "Border", "Text"] as const;

type Line = (typeof LINES)[number];
type LineColor = (typeof COLORS)[number];

type DividerPrimary = {
  section?: readonly SliceSectionFields[] | null;
  line: SelectField<Line>;
  color: SelectField<LineColor>;
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

/** A decorative line between slices. Spacing comes from the section group. */
export function Divider({ primary }: { primary: DividerPrimary }) {
  const line = choice(primary.line, LINES, "Squiggly");
  const color = choice(primary.color, COLORS, "Accent");

  return (
    <SliceSection section={primary.section} showHeader={false}>
      <div
        className={[styles.line, lineClass[line], colorClass[color]].join(" ")}
        aria-hidden="true"
      />
    </SliceSection>
  );
}

export default Divider;
