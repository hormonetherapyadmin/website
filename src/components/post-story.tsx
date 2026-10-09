import {
  Cancel01Icon,
  Medicine02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  isFilled,
  type EmbedField,
  type RichTextField,
  type TableField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import {
  PrismicRichText,
  PrismicTable,
  type RichTextComponents,
} from "@prismicio/react";
import Image from "next/image";
import { isValidElement, type ReactNode } from "react";
import {
  parseProviderToken,
  type ProviderToken,
  type TokenClinic,
} from "@/components/content-blocks";
import { storyLinkRel, visitLinkProps } from "@/lib/affiliate-link";
import { headingAnchors, type HeadingAnchor } from "@/lib/post-headings";
import { storySegments, type PhotoCell } from "@/lib/story-segments";
import shared from "@/app/mockup/_shared/mockup.module.css";
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

function StoryTable({
  field,
  number,
  preview,
}: {
  field: TableField | null | undefined;
  number: number;
  preview: boolean;
}) {
  if (!isFilled.table(field)) {
    if (!preview) return null;
    return (
      <p className={styles.tableMissing}>
        {number === 1
          ? "This story asks for a table. Add one in Tables."
          : `This story asks for table ${number}. Add it as item ${number} in Tables.`}
      </p>
    );
  }

  return (
    <PrismicTable
      field={field}
      components={{
        table: ({ children }) => (
          <div className={styles.tableBlock}>
            <p className={styles.tableHint} aria-hidden="true">
              Swipe to see more →
            </p>
            <div
              className={styles.tableScroll}
              role="region"
              aria-label={number === 1 ? "Table" : `Table ${number}`}
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          </div>
        ),
        paragraph: ({ children }) => <>{children}</>,
        hyperlink: ({ node, children }) => (
          <PrismicNextLink field={node.data} rel={storyLinkRel}>
            {children}
          </PrismicNextLink>
        ),
      }}
    />
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
    return (
      <PrismicNextLink field={image.linkTo} rel={storyLinkRel}>
        {picture}
      </PrismicNextLink>
    );
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
          <PrismicNextLink field={node.data} rel={storyLinkRel}>
            {children}
          </PrismicNextLink>
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

function money(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function findClinic(clinics: readonly TokenClinic[] | undefined, uid: string) {
  return clinics?.find((clinic) => clinic.uid === uid);
}

function ClinicMark({ src }: { src: string }) {
  return (
    <span className={styles.offerLogo}>
      <Image src={src} alt="" width={76} height={76} />
    </span>
  );
}

function ClinicActions({
  clinic,
  placement,
}: {
  clinic: TokenClinic;
  placement: string;
}) {
  if (!clinic.visitHref && !clinic.offerCode) return null;
  const visit = clinic.visitText?.trim() || `Visit ${clinic.name}`;

  return (
    <div className={styles.offerActions}>
      {clinic.visitHref ? (
        <a
          href={clinic.visitHref}
          className={shared.buttonPrimary}
          {...visitLinkProps(clinic.name, placement)}
        >
          {visit}
          <span className={shared.srOnly}>
            {" "}
            (affiliate link, opens in a new tab)
          </span>
        </a>
      ) : (
        <span>{clinic.name}</span>
      )}
      {clinic.offerCode ? (
        <span className={shared.offer}>Code {clinic.offerCode}</span>
      ) : null}
    </div>
  );
}

function OfferCallout({
  clinic,
  sentence,
}: {
  clinic: TokenClinic;
  sentence: string;
}) {
  const line = sentence || clinic.offerCopy || "";

  return (
    <aside className={styles.offerCallout} aria-label={`${clinic.name} offer`}>
      {clinic.logo?.src ? <ClinicMark src={clinic.logo.src} /> : null}
      <div>
        {line ? <p className={styles.offerText}>{line}</p> : null}
        <ClinicActions clinic={clinic} placement="story_offer" />
      </div>
    </aside>
  );
}

function factBullets(clinic: TokenClinic) {
  const bullets: { icon: IconSvgElement; text: string }[] = [];
  if (clinic.formulation) {
    bullets.push({ icon: Medicine02Icon, text: clinic.formulation });
  }
  if (clinic.insurance === true) {
    bullets.push({ icon: Tick02Icon, text: "Takes insurance" });
  } else if (clinic.insurance === false) {
    bullets.push({ icon: Cancel01Icon, text: "Doesn’t take insurance" });
  }
  if (clinic.gettingStarted) {
    bullets.push({ icon: Tick02Icon, text: clinic.gettingStarted });
  }
  return bullets;
}

function FactsCallout({ clinic }: { clinic: TokenClinic }) {
  const bullets = factBullets(clinic);

  return (
    <aside className={styles.facts} aria-label={clinic.name}>
      {clinic.logo?.src ? <ClinicMark src={clinic.logo.src} /> : null}
      <div>
        {typeof clinic.monthlyPrice === "number" ? (
          <p className={styles.factsPrice}>
            <span className={shared.srOnly}>What I paid per month </span>
            <span>{money(clinic.monthlyPrice)}</span>
            <span className={styles.factsPer}>/mo</span>
          </p>
        ) : null}
        {clinic.priceNote ? (
          <p className={styles.factsNote}>{clinic.priceNote}</p>
        ) : null}
        {bullets.length > 0 ? (
          <ul className={styles.factsMeta}>
            {bullets.map((bullet) => (
              <li key={bullet.text}>
                <HugeiconsIcon
                  icon={bullet.icon}
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {bullet.text}
              </li>
            ))}
          </ul>
        ) : null}
        <ClinicActions clinic={clinic} placement="story_facts" />
      </div>
    </aside>
  );
}

function StoryToken({
  token,
  clinic,
  preview,
}: {
  token: ProviderToken;
  clinic: TokenClinic | undefined;
  preview: boolean;
}) {
  const missing = !clinic && preview ? `No clinic with id ${token.uid}.` : null;

  return (
    <>
      {missing ? <p className={styles.missing}>{missing}</p> : null}
      {clinic && token.part === "offer" ? (
        <OfferCallout clinic={clinic} sentence={token.sentence} />
      ) : null}
      {clinic && token.part === "facts" ? (
        <FactsCallout clinic={clinic} />
      ) : null}
      {clinic && token.part === "facts" && token.sentence ? (
        <p>{token.sentence}</p>
      ) : null}
      {!clinic && token.sentence ? <p>{token.sentence}</p> : null}
    </>
  );
}

/** Ids for this chunk's heading 2 blocks, in story order. */
function headingIds(
  field: RichTextField,
  anchors: HeadingAnchor[],
  start: number,
) {
  const ids = new Map<RichTextField[number], string>();
  let index = start;
  for (const block of field) {
    if (block.type !== "heading2") continue;
    const anchor = anchors[index];
    if (anchor) ids.set(block, anchor.id);
    index += 1;
  }
  return ids;
}

function RichChunk({
  field,
  anchors,
  start,
  sourceId,
  clinics,
  preview,
}: {
  field: RichTextField;
  anchors: HeadingAnchor[];
  start: number;
  sourceId: (number: string) => string;
  clinics?: readonly TokenClinic[];
  preview: boolean;
}) {
  const ids = headingIds(field, anchors, start);

  const components: RichTextComponents = {
    heading2: ({ node, children }) => {
      return (
        <h2 id={ids.get(node)} tabIndex={-1}>
          {children}
        </h2>
      );
    },
    paragraph: ({ node, children }) => {
      const token = parseProviderToken(node.text);
      if (token) {
        return (
          <StoryToken
            token={token}
            clinic={findClinic(clinics, token.uid)}
            preview={preview}
          />
        );
      }
      return <p>{children}</p>;
    },
    hyperlink: ({ node, children }) => (
      <PrismicNextLink field={node.data} rel={storyLinkRel}>
        {children}
      </PrismicNextLink>
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
    <PrismicNextLink field={node.data} rel={storyLinkRel}>
      {children}
    </PrismicNextLink>
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
  tables = [],
  promoteResources = false,
  clinics,
  tokens = "public",
}: {
  field: RichTextField;
  /** The Tables group, in order. */
  tables?: readonly { table?: TableField | null }[];
  promoteResources?: boolean;
  clinics?: readonly TokenClinic[];
  /** Preview names a missing clinic or an empty table. The public page drops the token. */
  tokens?: "preview" | "public";
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
    if (segment.kind === "table") {
      return (
        <StoryTable
          key={index}
          field={tables[segment.number - 1]?.table}
          number={segment.number}
          preview={tokens === "preview"}
        />
      );
    }

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
        clinics={clinics}
        preview={tokens === "preview"}
      />
    );
  });
}
