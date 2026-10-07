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
  "Same as the page",
  "Soft",
  "Highlight",
  "Dark",
] as const;

export const SECTION_SPACING = ["None", "Small", "Medium", "Large"] as const;

export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number];
export type SectionSpacing = (typeof SECTION_SPACING)[number];

/** The non-repeatable `section` group copied onto every slice. */
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

const backgroundClass: Record<SectionBackground, string> = {
  "Same as the page": "",
  Soft: "bg-surface",
  Highlight: "bg-tint",
  Dark: "bg-panel text-panel-text",
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

function hasHeader(fields: SliceSectionFields) {
  return (
    isFilled.richText(fields.small_heading) ||
    isFilled.richText(fields.heading) ||
    isFilled.richText(fields.intro) ||
    (isFilled.link(fields.link) && Boolean(fields.link.text))
  );
}

function SectionLink({ field }: { field: LinkField }) {
  if (!isFilled.link(field) || !field.text) return null;

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
  /** The slice's `section` group. The first item is the only one used. */
  section?: readonly SliceSectionFields[] | null;
  /** Hero passes `h1`. Every other slice uses `h2`. */
  headingLevel?: "h1" | "h2";
  /** Hero lays the heading out itself and hides this header. */
  showHeader?: boolean;
  /**
   * Title used for the section id. Defaults to the heading.
   * The homepage hero passes its tagline.
   */
  title?: string | null;
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
  children,
}: SliceSectionProps) {
  const headingId = useId();
  const fields = section?.[0];
  const background = choice(
    fields?.background,
    SECTION_BACKGROUNDS,
    "Same as the page",
  );
  const spaceAbove = choice(fields?.space_above, SECTION_SPACING, "Medium");
  const spaceBelow = choice(fields?.space_below, SECTION_SPACING, "None");
  const band = background !== "Same as the page";
  const header = showHeader && fields && hasHeader(fields) ? fields : null;
  const anchor = sectionAnchor(title ?? (fields ? asText(fields.heading) : ""));

  return (
    <section
      id={anchor}
      aria-labelledby={
        header && isFilled.richText(header.heading) ? headingId : undefined
      }
      className={[
        spaceAboveClass[spaceAbove],
        spaceBelowClass[spaceBelow],
        backgroundClass[background],
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
              className={[
                "mb-3 text-sm font-bold",
                background === "Dark" ? "text-panel-text" : "text-accent",
              ].join(" ")}
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
