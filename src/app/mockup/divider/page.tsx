import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Divider } from "@/slices/divider";

export const metadata: Metadata = {
  title: "Divider slice",
  robots: { index: false, follow: false },
};

const emptyText = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields[] {
  return [
    {
      small_heading: emptyText,
      heading: emptyText,
      intro: emptyText,
      link: emptyLink,
      background: null,
      space_above: "None",
      space_below: "None",
      ...overrides,
    },
  ];
}

const samples = [
  { line: "Squiggly", color: "Accent" },
  { line: "Straight", color: "Accent" },
  { line: "Squiggly", color: "Soft" },
  { line: "Straight", color: "Border" },
  { line: "Squiggly", color: "Text" },
] as const;

export default function DividerPreview() {
  return (
    <main>
      {samples.map((sample) => (
        <div key={`${sample.line}-${sample.color}`}>
          <p className="mx-auto mt-10 w-full max-w-wrap px-gutter text-sm text-text-muted">
            {sample.line}, {sample.color}
          </p>
          <Divider
            primary={{
              section: section(),
              line: sample.line,
              color: sample.color,
            }}
          />
        </div>
      ))}
    </main>
  );
}
