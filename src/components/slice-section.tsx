import {
  asText,
  isFilled,
  type LinkField,
  type RichTextField,
  type SelectField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { ReactNode } from "react";
import { useId } from "react";
import { RichText } from "@/components/rich-text";

export const SECTION_BACKGROUNDS = [
  "Cream",
  "Pink",
  "Blue",
  "Yellow",
  "Lavender",
  "Raspberry",
  "Navy",
] as const;

export const SECTION_SPACING = ["None", "Small", "Medium", "Large"] as const;

export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number];
export type SectionSpacing = (typeof SECTION_SPACING)[number];

/** The Section fields copied onto every slice, beside its own fields. */
export type SliceSectionFields = {
  small_heading: RichTextField;
  heading: RichTextField;
  intro: RichTextField;
  link: LinkField;
  background: SelectField<SectionBackground>;
  space_above: SelectField<SectionSpacing>;
  space_below: SelectField<SectionSpacing>;
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

/** Cream is the page color, so it paints nothing. */
export const sectionBackgroundClass: Record<SectionBackground, string> = {
  Cream: "",
  Pink: "bg-card-1",
  Blue: "bg-card-2",
  Yellow: "bg-card-3",
  Lavender: "bg-card-4",
  Raspberry: "bg-accent text-panel-text",
  Navy: "bg-panel text-panel-text",
};

/**
 * Sets --section-kicker, the small heading color, for the shared header
 * and for slices that draw their own small heading.
 */
const kickerColorClass: Record<SectionBackground, string> = {
  Cream: "[--section-kicker:var(--color-accent)]",
  Pink: "[--section-kicker:var(--color-accent)]",
  Blue: "[--section-kicker:var(--color-accent)]",
  Yellow: "[--section-kicker:var(--color-accent)]",
  Lavender: "[--section-kicker:var(--color-accent)]",
  Raspberry: "[--section-kicker:var(--color-card-2)]",
  Navy: "[--section-kicker:var(--color-panel-accent)]",
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

/** The Background choice. An empty or retired choice is Cream. */
export function sectionBackground(value: string | null | undefined) {
  return choice(value, SECTION_BACKGROUNDS, "Cream");
}

/** A heading turned into an element id, such as "Feel like you again." */
export function sectionAnchor(value: string | null | undefined) {
  if (!value) return undefined;

  const id = value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!/^[a-z][a-z0-9-]*$/.test(id)) return undefined;
  return id;
}

function hasHeader(fields: Partial<SliceSectionFields>) {
  return (
    isFilled.richText(fields.small_heading) ||
    isFilled.richText(fields.heading) ||
    isFilled.richText(fields.intro) ||
    (isFilled.link(fields.link) && Boolean(fields.link.text))
  );
}

function SectionLink({ field }: { field: LinkField | null | undefined }) {
  if (!field || !isFilled.link(field) || !field.text) return null;

  return (
    <PrismicNextLink
      field={field}
      className="inline-flex shrink-0 items-baseline gap-1 font-semibold"
    >
      {field.text}
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
        className="relative top-0.5"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </PrismicNextLink>
  );
}

type SliceSectionProps = {
  /** The slice's fields. Only the Section fields are read. */
  section?: Partial<SliceSectionFields> | null;
  /** Hero passes `h1`. Every other slice uses `h2`. */
  headingLevel?: "h1" | "h2";
  /** Hero lays the heading out itself and hides this header. */
  showHeader?: boolean;
  /**
   * Title used for the section id. Defaults to the heading.
   * The homepage hero passes its tagline.
   */
  title?: string | null;
  /**
   * Labels the section when the slice draws its own heading.
   * Pass the id of that heading.
   */
  labelId?: string;
  children?: ReactNode;
};

/**
 * Spacing, background, and the shared heading block for every slice.
 * Space above and below are the gap outside the slice. A background
 * paints the slice and adds a fixed padding inside the color.
 */
export function SliceSection({
  section,
  headingLevel = "h2",
  showHeader = true,
  title,
  labelId,
  children,
}: SliceSectionProps) {
  const headingId = useId();
  const fields = section ?? undefined;
  const background = sectionBackground(fields?.background);
  const spaceAbove = choice(fields?.space_above, SECTION_SPACING, "Medium");
  const spaceBelow = choice(fields?.space_below, SECTION_SPACING, "None");
  const band = background !== "Cream";
  const header = showHeader && fields && hasHeader(fields) ? fields : null;
  const anchor = sectionAnchor(title ?? (fields ? asText(fields.heading) : ""));

  return (
    <section
      id={anchor}
      aria-labelledby={
        labelId ??
        (header && isFilled.richText(header.heading) ? headingId : undefined)
      }
      className={[
        spaceAboveClass[spaceAbove],
        spaceBelowClass[spaceBelow],
        sectionBackgroundClass[background],
        kickerColorClass[background],
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
        {header ? (
          <div className={children ? "mb-8" : undefined}>
            <RichText
              field={header.small_heading}
              as="p"
              className="mb-3 text-sm font-bold text-(color:--section-kicker)"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              {isFilled.richText(header.heading) ? (
                <div className="min-w-0 flex-1">
                  <RichText
                    field={header.heading}
                    as={headingLevel}
                    id={headingId}
                  />
                </div>
              ) : null}
              <SectionLink field={header.link} />
            </div>
            <RichText
              field={header.intro}
              as="p"
              className="mt-4 max-w-prose text-lg"
            />
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
