import {
  isFilled,
  type EmbedField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type RichTextComponents } from "@prismicio/react";
import type { ReactNode } from "react";
import { storyLinkRel } from "@/lib/affiliate-link";

const VIDEO_PROVIDERS = new Set(["YouTube", "Vimeo"]);

export type RichTextTag = "h1" | "h2" | "h3" | "p";

type RichTextProps = {
  field: RichTextField | null | undefined;
  /**
   * Heading fields are one paragraph. The slice chooses the tag, so a
   * section title cannot become a second page title.
   */
  as?: RichTextTag;
  /** Use `className` alone. The hero display type does this. */
  unstyled?: boolean;
  className?: string;
  id?: string;
};

const headingClass: Record<RichTextTag, string> = {
  h1: "font-heading text-4xl leading-tight sm:text-5xl",
  h2: "font-heading text-3xl leading-tight sm:text-4xl",
  h3: "font-heading text-2xl leading-tight",
  p: "",
};

function RichTextLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  if (label === "highlight") {
    return <mark className="bg-tint px-1 text-text">{children}</mark>;
  }

  if (label === "superscript") {
    return <sup>{children}</sup>;
  }

  if (label === "signoff") {
    return <span className="font-heading">{children}</span>;
  }

  if (label === "note") {
    return <span className="rounded-control bg-tint px-1">{children}</span>;
  }

  return <span>{children}</span>;
}

function RichTextEmbed({ oembed }: { oembed: EmbedField }) {
  if (!isFilled.embed(oembed)) return null;

  const provider =
    "provider_name" in oembed && typeof oembed.provider_name === "string"
      ? oembed.provider_name
      : undefined;

  if (oembed.html && provider && VIDEO_PROVIDERS.has(provider)) {
    return (
      <div
        className="my-6 aspect-video [&_iframe]:h-full [&_iframe]:w-full"
        dangerouslySetInnerHTML={{ __html: oembed.html }}
      />
    );
  }

  return (
    <p className="my-6">
      <PrismicNextLink href={oembed.embed_url} className="underline">
        Watch video
      </PrismicNextLink>
    </p>
  );
}

const linkClass = "underline underline-offset-2";

const contentComponents: RichTextComponents = {
  heading2: ({ children }) => (
    <h2 className={`${headingClass.h2} mt-10 mb-4 first:mt-0`}>{children}</h2>
  ),
  heading3: ({ children }) => (
    <h3 className={`${headingClass.h3} mt-8 mb-3 first:mt-0`}>{children}</h3>
  ),
  heading4: ({ children }) => (
    <h4 className="mt-6 mb-2 font-heading text-xl leading-tight first:mt-0">
      {children}
    </h4>
  ),
  paragraph: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  list: ({ children }) => (
    <ul className="mb-4 list-disc ps-6 last:mb-0">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="mb-4 list-decimal ps-6 last:mb-0">{children}</ol>
  ),
  hyperlink: ({ node, children }) => (
    <PrismicNextLink field={node.data} className={linkClass} rel={storyLinkRel}>
      {children}
    </PrismicNextLink>
  ),
  label: ({ node, children }) => (
    <RichTextLabel label={node.data.label}>{children}</RichTextLabel>
  ),
  image: ({ node }) => {
    const image = (
      <PrismicNextImage
        field={node}
        fallbackAlt=""
        sizes="(min-width: 72rem) 42rem, 100vw"
        className="h-auto max-w-full rounded-card"
      />
    );

    return (
      <figure className="my-6">
        {node.linkTo && isFilled.link(node.linkTo) ? (
          <PrismicNextLink field={node.linkTo} rel={storyLinkRel}>
            {image}
          </PrismicNextLink>
        ) : (
          image
        )}
      </figure>
    );
  },
  embed: ({ node }) => <RichTextEmbed oembed={node.oembed} />,
};

/**
 * Renders every writing field. Heading fields pass `as`. Article body
 * leaves it unset and gets headings, lists, images, videos, and labels.
 */
export function RichText({
  field,
  as,
  unstyled = false,
  className,
  id,
}: RichTextProps) {
  if (!isFilled.richText(field)) return null;

  if (as) {
    const Tag = as;
    return (
      <PrismicRichText
        field={field}
        components={{
          paragraph: ({ children }) => (
            <Tag
              id={id}
              className={[unstyled ? undefined : headingClass[as], className]
                .filter(Boolean)
                .join(" ")}
            >
              {children}
            </Tag>
          ),
          hyperlink: contentComponents.hyperlink,
          label: contentComponents.label,
        }}
      />
    );
  }

  return (
    <div className={className}>
      <PrismicRichText field={field} components={contentComponents} />
    </div>
  );
}
