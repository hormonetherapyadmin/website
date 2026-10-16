import {
  asText,
  isFilled,
  type EmbedField,
  type ImageField,
  type LinkField,
  type RichTextField,
  type SelectField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Content } from "@/components/content";
import type {
  BrandKind,
  PriceUnit,
  TokenClinic,
} from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "@/components/slice-section";
import { storyLinkRel, visitLinkProps } from "@/lib/affiliate-link";
import { ProductCard } from "@/slices/BrandPromo";
import styles from "./side-by-side.module.css";

export const SIDES = ["Media left", "Media right"] as const;
export const MEDIA_POSITIONS = ["Center", "Top", "Sticky"] as const;
export const SIDE_BY_SIDE_VARIATIONS = [
  "image",
  "video",
  "quote",
  "clinic",
] as const;

export type SideBySideVariation = (typeof SIDE_BY_SIDE_VARIATIONS)[number];
export type Side = (typeof SIDES)[number];

/** A photo the page already resolved, such as the story portrait. */
export type SideImage = {
  src: string;
  alt?: string;
};

/** A YouTube or Vimeo video the page already resolved. */
export type SideVideo = {
  html?: string;
  title?: string;
  url?: string;
};

/** The clinic on the media side. Logo, name, quote, and visit, or the product card. */
export type SideClinic = {
  name: string;
  logo?: { src: string };
  quote?: string;
  visitHref?: string;
  visitText?: string;
  kind?: BrandKind;
  monthlyPrice?: number | null;
  priceUnit?: PriceUnit;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
  gettingStarted?: string;
  offerCode?: string;
  offerCopy?: string;
  product?: ImageField | null;
};

type SideBySidePrimary = Partial<SliceSectionFields> & {
  side?: SelectField<Side> | string | null;
  media_position?: string | null;
  text?: RichTextField | null;
  button?: readonly LinkField[] | null;
  image?: ImageField | null;
  caption?: RichTextField | null;
  /** On the photo is the default. Off centers the caption under the photo. */
  caption_on_photo?: boolean | null;
  video?: EmbedField | null;
  quote?: RichTextField | null;
  attribution?: string | null;
  clinic?: LinkField | null;
  /** Quote is the logo and her words. Card is the product photo and price. */
  style?: string | null;
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

/** Card is the product photo and price. A blank Style stays the quote panel. */
export function sideBySideStyle(value: string | null | undefined) {
  return value === "Card" ? "card" : "quote";
}

function Chevron() {
  return (
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
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function Buttons({
  fields,
}: {
  fields: readonly LinkField[] | null | undefined;
}) {
  const buttons = (fields ?? []).filter(
    (button) => isFilled.link(button) && button.text,
  );
  if (!buttons.length) return null;

  return (
    <div className={styles.actions}>
      {buttons.map((button) => {
        const ghost = button.variant === "Ghost";

        return (
          <PrismicNextLink
            key={`${button.variant ?? "Solid"}-${button.text}`}
            field={button}
            className={ghost ? styles.ghost : styles.button}
            rel={storyLinkRel}
          >
            {button.text}
            {ghost ? <Chevron /> : null}
          </PrismicNextLink>
        );
      })}
    </div>
  );
}

function MediaFigure({
  children,
  caption,
  onPhoto,
}: {
  children: ReactNode;
  caption?: RichTextField | null;
  onPhoto: boolean;
}) {
  if (!isFilled.richText(caption)) {
    return (
      <figure className={styles.figure}>
        <div className={styles.frame}>{children}</div>
      </figure>
    );
  }

  return (
    <figure className={styles.figure} data-caption={onPhoto ? "on" : "under"}>
      <div className={styles.frame}>{children}</div>
      <figcaption className={onPhoto ? styles.caption : styles.captionUnder}>
        <RichText field={caption} as="p" unstyled />
      </figcaption>
    </figure>
  );
}

function Photo({
  image,
  field,
}: {
  image?: SideImage | null;
  field?: ImageField | null;
}) {
  if (image?.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt ?? ""}
        fill
        sizes="(max-width: 960px) 100vw, 560px"
        className={styles.photo}
        preload
      />
    );
  }

  if (isFilled.image(field)) {
    return (
      <PrismicNextImage
        field={field}
        fill
        sizes="(max-width: 960px) 100vw, 560px"
        className={styles.photo}
        fallbackAlt=""
      />
    );
  }

  return null;
}

function VideoFrame({ video }: { video: SideVideo }) {
  if (video.html?.includes("<iframe")) {
    return (
      <div
        className={styles.video}
        dangerouslySetInnerHTML={{ __html: video.html }}
      />
    );
  }

  if (!video.url) return null;

  return (
    <a className={styles.videoLink} href={video.url}>
      {video.title || "Watch video"}
    </a>
  );
}

function ClinicCard({ clinic }: { clinic: SideClinic }) {
  const visit = clinic.visitText?.trim() || `Visit ${clinic.name}`;

  return (
    <div className={styles.clinic}>
      <div className={styles.clinicBrand}>
        {clinic.logo?.src ? (
          <span className={styles.logo}>
            <Image src={clinic.logo.src} alt="" width={56} height={56} />
          </span>
        ) : null}
        <span>{clinic.name}</span>
      </div>
      {clinic.quote ? (
        <q className={styles.clinicQuote}>{clinic.quote}</q>
      ) : null}
      {clinic.visitHref ? (
        <a
          href={clinic.visitHref}
          className={styles.visit}
          {...visitLinkProps(clinic.name, "side_by_side")}
        >
          {visit}
          <Chevron />
          <span className="sr-only"> (affiliate link, opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

/**
 * Writing on one side and media on the other. Image, video, quote, and
 * clinic are the media. Side puts the media on the left or the right.
 */
export function SideBySide({
  variation,
  primary,
  image,
  video,
  clinic,
  clinics,
  tokens = "public",
}: {
  variation: SideBySideVariation | string;
  primary: SideBySidePrimary;
  image?: SideImage | null;
  video?: SideVideo | null;
  clinic?: SideClinic | null;
  /** Clinics a token in the writing can name. */
  clinics?: readonly TokenClinic[];
  tokens?: "preview" | "public";
}) {
  const layout = choice(variation, SIDE_BY_SIDE_VARIATIONS, "image");
  const side = choice(primary.side, SIDES, "Media left");
  const position = choice(primary.media_position, MEDIA_POSITIONS, "Center");
  const heading = primary.heading;
  const slug = sectionAnchor(heading ? asText(heading) : "");
  const titleId = slug ? `${slug}-title` : undefined;
  const showImage =
    layout === "image" &&
    (Boolean(image?.src) || isFilled.image(primary.image));
  const showVideo = layout === "video" && Boolean(video?.html || video?.url);
  const showQuote = layout === "quote" && isFilled.richText(primary.quote);
  const showStatement = layout === "image" && isFilled.richText(primary.quote);
  const showClinic = layout === "clinic" && Boolean(clinic?.name);
  const clinicStyle = showClinic ? sideBySideStyle(primary.style) : undefined;
  const hasMedia = showImage || showVideo || showQuote || showClinic;
  const showHead =
    isFilled.richText(primary.small_heading) ||
    isFilled.richText(heading) ||
    isFilled.richText(primary.intro);

  return (
    <SliceSection section={primary} showHeader={false} labelId={titleId}>
      <div
        className={styles.grid}
        data-side={side === "Media right" ? "right" : "left"}
        data-position={position.toLowerCase()}
        data-media={hasMedia ? "true" : "false"}
        data-style={clinicStyle}
      >
        <div className={styles.copy}>
          {showHead ? (
            <header className={styles.head}>
              <RichText
                field={primary.small_heading}
                as="p"
                unstyled
                className={styles.kicker}
              />
              <RichText
                field={heading}
                as="h2"
                id={titleId}
                unstyled
                className={styles.heading}
              />
              <RichText
                field={primary.intro}
                as="p"
                unstyled
                className={styles.lead}
              />
            </header>
          ) : null}
          {showStatement ? (
            <RichText
              field={primary.quote}
              as="p"
              unstyled
              className={styles.statement}
            />
          ) : null}
          <Content field={primary.text} clinics={clinics} tokens={tokens} />
          <Buttons fields={primary.button} />
        </div>
        {showImage ? (
          <MediaFigure
            caption={primary.caption}
            onPhoto={primary.caption_on_photo !== false}
          >
            <Photo image={image} field={primary.image} />
          </MediaFigure>
        ) : null}
        {showVideo && video ? (
          <MediaFigure caption={primary.caption} onPhoto>
            <VideoFrame video={video} />
          </MediaFigure>
        ) : null}
        {showQuote ? (
          <blockquote className={styles.pull}>
            <RichText
              field={primary.quote}
              as="p"
              unstyled
              className={styles.pullText}
            />
            {primary.attribution?.trim() ? (
              <footer className={styles.attribution}>
                {primary.attribution.trim()}
              </footer>
            ) : null}
          </blockquote>
        ) : null}
        {showClinic && clinic && clinicStyle === "card" ? (
          <div className={styles.productSlot}>
            <ProductCard clinic={clinic} placement="side_by_side" />
          </div>
        ) : null}
        {showClinic && clinic && clinicStyle !== "card" ? (
          <ClinicCard clinic={clinic} />
        ) : null}
      </div>
    </SliceSection>
  );
}

export default SideBySide;
