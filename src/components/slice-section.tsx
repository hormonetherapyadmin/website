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
  "Transparent",
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

/**
 * The heading, writing, color, and spacing copied onto a slice.
 * Link is only on Latest posts, Text, and Hero Subpage, Centered,
 * and Brands. Other slices add their own buttons or card links.
 */
export type SliceSectionFields = {
  small_heading: RichTextField;
  heading: RichTextField;
  intro: RichTextField;
  link?: LinkField;
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

/**
 * The same gap, as a length, so a slice can center something in it.
 * The gap between two slices is the lower slice's Space above.
 */
const spaceAboveVar: Record<SectionSpacing, string> = {
  None: "[--section-space-above:0px]",
  Small: "[--section-space-above:var(--spacing-slice-sm)]",
  Medium: "[--section-space-above:var(--spacing-slice)]",
  Large: "[--section-space-above:var(--spacing-slice-lg)]",
};

const spaceBelowVar: Record<SectionSpacing, string> = {
  None: "[--section-space-below:0px]",
  Small: "[--section-space-below:var(--spacing-slice-sm)]",
  Medium: "[--section-space-below:var(--spacing-slice)]",
  Large: "[--section-space-below:var(--spacing-slice-lg)]",
};

/** The gap after this slice, as a length. Margins collapse to the larger one. */
const gapAfterVar: Record<SectionSpacing, string> = {
  None: "[--section-gap-after:0px]",
  Small: "[--section-gap-after:var(--spacing-slice-sm)]",
  Medium: "[--section-gap-after:var(--spacing-slice)]",
  Large: "[--section-gap-after:var(--spacing-slice-lg)]",
};

const spaceRank: Record<SectionSpacing, number> = {
  None: 0,
  Small: 1,
  Medium: 2,
  Large: 3,
};

/** Transparent paints nothing, so the page shows through. */
export const sectionBackgroundClass: Record<SectionBackground, string> = {
  Transparent: "",
  Cream: "bg-background",
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
  Transparent: "[--section-kicker:var(--color-accent)]",
  Cream: "[--section-kicker:var(--color-accent)]",
  Pink: "[--section-kicker:var(--color-accent)]",
  Blue: "[--section-kicker:var(--color-accent)]",
  Yellow: "[--section-kicker:var(--color-accent)]",
  Lavender: "[--section-kicker:var(--color-accent)]",
  Raspberry: "[--section-kicker:var(--color-card-2)]",
  Navy: "[--section-kicker:var(--color-panel-accent)]",
};

/** Sets --section-marker, the list bullet color, where navy would vanish. */
const markerColorClass: Partial<Record<SectionBackground, string>> = {
  Raspberry: "[--section-marker:var(--color-card-2)]",
  Navy: "[--section-marker:var(--color-card-2)]",
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

/** The Background choice. An empty or retired choice is Transparent. */
export function sectionBackground(value: string | null | undefined) {
  return choice(value, SECTION_BACKGROUNDS, "Transparent");
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

/**
 * Centered stacks the call to action under the writing. Any other
 * value, including an empty one, keeps it on the right.
 */
export function sliceLayout(
  value: string | null | undefined,
): "right" | "centered" {
  return value === "Centered" ? "centered" : "right";
}

function filledSectionLink(
  field: LinkField | null | undefined,
): field is LinkField & { text: string } {
  return Boolean(field && isFilled.link(field) && field.text);
}

function SectionLink({ field }: { field: LinkField | null | undefined }) {
  if (!filledSectionLink(field)) return null;

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
  /**
   * Space above on the next slice. False means nothing follows.
   * Omit it outside a slice list. An empty field uses the Medium default.
   */
  followingSpaceAbove?: string | null | false;
  /** Story keeps the header and children to the post story column, centered. */
  width?: "wrap" | "story";
  /** Centers the header. The default keeps it on the left. */
  align?: "start" | "center";
  /**
   * Where the section link sits. Beside is the heading row.
   * Below is under the header, before the children.
   * End is after the children.
   */
  linkPlacement?: "beside" | "below" | "end";
  children?: ReactNode;
};

/**
 * Spacing, background, and the shared heading block for every slice.
 * Space above and below are the gap outside the slice. Cream is the
 * page color, so it paints without padding. Any other background
 * paints the slice and adds a fixed padding inside the color.
 */
export function SliceSection({
  section,
  headingLevel = "h2",
  showHeader = true,
  title,
  labelId,
  followingSpaceAbove,
  width = "wrap",
  align = "start",
  linkPlacement = "beside",
  children,
}: SliceSectionProps) {
  const headingId = useId();
  const fields = section ?? undefined;
  const background = sectionBackground(fields?.background);
  const spaceAbove = choice(fields?.space_above, SECTION_SPACING, "Medium");
  const spaceBelow = choice(fields?.space_below, SECTION_SPACING, "None");
  const nextAbove =
    followingSpaceAbove === undefined || followingSpaceAbove === false
      ? spaceBelow
      : choice(followingSpaceAbove, SECTION_SPACING, "Medium");
  const gapAfter =
    spaceRank[nextAbove] > spaceRank[spaceBelow] ? nextAbove : spaceBelow;
  const band = background !== "Transparent" && background !== "Cream";
  const header = showHeader && fields && hasHeader(fields) ? fields : null;
  const centered = align === "center";
  const sectionLink =
    header && filledSectionLink(header.link) ? header.link : null;
  const headerCopy = Boolean(
    header &&
    (isFilled.richText(header.small_heading) ||
      isFilled.richText(header.heading) ||
      isFilled.richText(header.intro)),
  );
  const linkBeside = linkPlacement === "beside" && sectionLink;
  const linkBelow = linkPlacement === "below" && sectionLink;
  const linkEnd = linkPlacement === "end" && sectionLink;
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
        spaceAboveVar[spaceAbove],
        spaceBelowVar[spaceBelow],
        gapAfterVar[gapAfter],
        sectionBackgroundClass[background],
        kickerColorClass[background],
        markerColorClass[background],
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "mx-auto w-full px-gutter",
          width === "story" ? "max-w-story-wrap" : "max-w-wrap",
          band ? "py-slice" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {header && (headerCopy || linkBeside || linkBelow) ? (
          <div
            className={
              [
                children || linkEnd ? "mb-8" : undefined,
                centered ? "text-center" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
          >
            <RichText
              field={header.small_heading}
              as="p"
              className="mb-3 text-sm font-bold text-(color:--section-kicker)"
            />
            {linkBeside ? (
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
                <SectionLink field={sectionLink} />
              </div>
            ) : isFilled.richText(header.heading) ? (
              <div className={centered ? "text-balance" : undefined}>
                <RichText
                  field={header.heading}
                  as={headingLevel}
                  id={headingId}
                />
              </div>
            ) : null}
            <RichText
              field={header.intro}
              as="p"
              className={[
                "mt-4 max-w-prose text-lg",
                centered ? "mx-auto" : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            />
            {linkBelow ? (
              <div className={headerCopy ? "mt-6" : undefined}>
                <SectionLink field={sectionLink} />
              </div>
            ) : null}
          </div>
        ) : null}
        {children}
        {linkEnd ? (
          <div
            className={
              [
                children || headerCopy ? "mt-8" : undefined,
                centered ? "text-center" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
          >
            <SectionLink field={sectionLink} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
