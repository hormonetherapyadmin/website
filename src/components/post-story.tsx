import {
  isFilled,
  type EmbedField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type RichTextComponents } from "@prismicio/react";
import { isValidElement, type ReactNode } from "react";
import { parseProviderToken } from "@/components/content-blocks";
import { headingAnchors, type HeadingAnchor } from "@/lib/post-headings";
import { storySegments, type PhotoCell } from "@/lib/story-segments";
import styles from "@/app/mockup/blog/blog.module.css";

const VIDEO_PROVIDERS = new Set(["YouTube", "Vimeo"]);

function StoryEmbed({ oembed }: { oembed: EmbedField }) {
  if (!isFilled.embed(oembed)) return null;

  const provider =
    "provider_name" in oembed && typeof oembed.provider_name === "string"
      ? oembed.provider_name
      : undefined;

  if (oembed.html && provider && VIDEO_PROVIDERS.has(provider)) {
    return (
      <div
        className={styles.embed}
        dangerouslySetInnerHTML={{ __html: oembed.html }}
      />
    );
  }

  if (!oembed.embed_url) return null;

  return (
    <p>
      <PrismicNextLink href={oembed.embed_url}>Watch video</PrismicNextLink>
    </p>
  );
}

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeText(node.props.children);
  }
  return "";
}

function StoryLabel({
  label,
  children,
  sourceId,
}: {
  label: string;
  children: ReactNode;
  sourceId: (number: string) => string;
}) {
  if (label !== "superscript") return <>{children}</>;

  const number = nodeText(children).trim();
  if (!/^\d+$/.test(number)) return <sup>{children}</sup>;

  return (
    <sup className={styles.ref}>
      <a href={`#source-${number}`} id={sourceId(number)}>
        <span className={styles.srOnly}>Source </span>
        {number}
      </a>
    </sup>
  );
}

export function PostSources({ children }: { children: ReactNode }) {
  return (
    <section className={styles.sources} aria-labelledby="sources">
      <h2 id="sources">Sources</h2>
      <ol>{children}</ol>
    </section>
  );
}

export function SourceReference({
  number,
  children,
}: {
  number: number;
  children: ReactNode;
}) {
  return (
    <li id={`source-${number}`}>
      {children}{" "}
      <a href={`#ref-${number}`} className={styles.backRef}>
        <span aria-hidden="true">↑</span>
        <span className={styles.srOnly}>Back to text</span>
      </a>
    </li>
  );
}

function StoryImage({
  image,
  sizes,
}: {
  image: PhotoCell["image"];
  sizes: string;
}) {
  const picture = (
    <PrismicNextImage field={image} fallbackAlt="" sizes={sizes} />
  );

  if (image.linkTo && isFilled.link(image.linkTo)) {
    return <PrismicNextLink field={image.linkTo}>{picture}</PrismicNextLink>;
  }

  return picture;
}

function PhotoCaption({
  field,
  sourceId,
}: {
  field: RichTextField;
  sourceId: (number: string) => string;
}) {
  return (
    <PrismicRichText
      field={field}
      components={{
        paragraph: ({ children }) => <p>{children}</p>,
        hyperlink: ({ node, children }) => (
          <PrismicNextLink field={node.data}>{children}</PrismicNextLink>
        ),
        label: ({ node, children }) => (
          <StoryLabel label={node.data.label} sourceId={sourceId}>
            {children}
          </StoryLabel>
        ),
      }}
    />
  );
}

function PhotoRow({
  cells,
  sourceId,
}: {
  cells: [PhotoCell, PhotoCell];
  sourceId: (number: string) => string;
}) {
  return (
    <figure className={styles.beforeAfter}>
      {cells.map((cell, index) => (
        <div key={cell.image.url ?? index}>
          <StoryImage
            image={cell.image}
            sizes="(max-width: 640px) 50vw, 340px"
          />
          {cell.caption ? (
            <PhotoCaption field={cell.caption} sourceId={sourceId} />
          ) : null}
        </div>
      ))}
    </figure>
  );
}

function RichChunk({
  field,
  anchors,
  start,
  sourceId,
}: {
  field: RichTextField;
  anchors: HeadingAnchor[];
  start: number;
  sourceId: (number: string) => string;
}) {
  let headingIndex = start;

  const components: RichTextComponents = {
    heading2: ({ children }) => {
      const anchor = anchors[headingIndex];
      headingIndex += 1;
      return (
        <h2 id={anchor?.id} tabIndex={-1}>
          {children}
        </h2>
      );
    },
    paragraph: ({ node, children }) => {
      const token = parseProviderToken(node.text);
      if (token) return token.sentence ? <p>{token.sentence}</p> : null;
      return <p>{children}</p>;
    },
    hyperlink: ({ node, children }) => (
      <PrismicNextLink field={node.data}>{children}</PrismicNextLink>
    ),
    label: ({ node, children }) => (
      <StoryLabel label={node.data.label} sourceId={sourceId}>
        {children}
      </StoryLabel>
    ),
    image: ({ node }) => (
      <figure>
        <StoryImage image={node} sizes="(min-width: 60rem) 42rem, 100vw" />
      </figure>
    ),
    embed: ({ node }) => <StoryEmbed oembed={node.oembed} />,
  };

  if (!isFilled.richText(field)) return null;

  return <PrismicRichText field={field} components={components} />;
}

const inlineComponents = (
  sourceId: (number: string) => string,
): RichTextComponents => ({
  list: ({ children }) => <>{children}</>,
  oList: ({ children }) => <>{children}</>,
  listItem: ({ children }) => <>{children}</>,
  oListItem: ({ children }) => <>{children}</>,
  paragraph: ({ children }) => <>{children}</>,
  hyperlink: ({ node, children }) => (
    <PrismicNextLink field={node.data}>{children}</PrismicNextLink>
  ),
  label: ({ node, children }) => (
    <StoryLabel label={node.data.label} sourceId={sourceId}>
      {children}
    </StoryLabel>
  ),
});

/** The story, in the blog post type. Heading ids match the rail. */
export function PostStory({
  field,
  promoteResources = false,
}: {
  field: RichTextField;
  promoteResources?: boolean;
}) {
  const anchors = headingAnchors(field);
  const seenSources = new Map<string, number>();
  let headingStart = 0;

  function sourceId(number: string) {
    const count = (seenSources.get(number) ?? 0) + 1;
    seenSources.set(number, count);
    return count === 1 ? `ref-${number}` : `ref-${number}-${count}`;
  }

  return storySegments(field, { promoteResources }).map((segment, index) => {
    if (segment.kind === "photos") {
      return <PhotoRow key={index} cells={segment.cells} sourceId={sourceId} />;
    }

    if (segment.kind === "sources") {
      return (
        <PostSources key={index}>
          {segment.items.map((item, itemIndex) => (
            <SourceReference key={itemIndex} number={itemIndex + 1}>
              <PrismicRichText
                field={[item] as RichTextField}
                components={inlineComponents(sourceId)}
              />
            </SourceReference>
          ))}
        </PostSources>
      );
    }

    const start = headingStart;
    headingStart += segment.field.filter(
      (block) => block.type === "heading2",
    ).length;

    return (
      <RichChunk
        key={index}
        field={segment.field}
        anchors={anchors}
        start={start}
        sourceId={sourceId}
      />
    );
  });
}
