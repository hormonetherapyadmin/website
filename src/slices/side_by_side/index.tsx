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
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "@/components/slice-section";
import { visitLinkProps } from "@/lib/affiliate-link";
import styles from "./side-by-side.module.css";

export const SIDES = ["Media left", "Media right"] as const;
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

/** The clinic on the media side. Logo, name, quote, and visit. */
export type SideClinic = {
  name: string;
  logo?: { src: string };
  quote?: string;
  visitHref?: string;
  visitText?: string;
};

type SideBySidePrimary = Partial<SliceSectionFields> & {
  side?: SelectField<Side> | string | null;
  text?: RichTextField | null;
  button?: readonly LinkField[] | null;
  image?: ImageField | null;
  caption?: RichTextField | null;
  video?: EmbedField | null;
  quote?: RichTextField | null;
  attribution?: string | null;
  clinic?: LinkField | null;
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
          >
            {button.text}
            {ghost ? <Chevron /> : null}
          </PrismicNextLink>
        );
      })}
    </div>
  );
}

function Caption({ field }: { field: RichTextField | null | undefined }) {
  if (!isFilled.richText(field)) return null;
  return (
    <figcaption className={styles.caption}>
      <RichText field={field} as="p" unstyled />
    </figcaption>
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
  const heading = primary.heading;
  const slug = sectionAnchor(heading ? asText(heading) : "");
  const titleId = slug ? `${slug}-title` : undefined;
  const showImage =
    layout === "image" &&
    (Boolean(image?.src) || isFilled.image(primary.image));
  const showVideo = layout === "video" && Boolean(video?.html || video?.url);
  const showQuote = layout === "quote" && isFilled.richText(primary.quote);
  const showClinic = layout === "clinic" && Boolean(clinic?.name);

  return (
    <SliceSection section={primary} showHeader={false} labelId={titleId}>
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
      <div
        className={styles.grid}
        data-side={side === "Media right" ? "right" : "left"}
      >
        {showImage ? (
          <figure className={styles.figure}>
            <Photo image={image} field={primary.image} />
            <Caption field={primary.caption} />
          </figure>
        ) : null}
        {showVideo && video ? (
          <figure className={styles.figure}>
            <VideoFrame video={video} />
            <Caption field={primary.caption} />
          </figure>
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
        {showClinic && clinic ? <ClinicCard clinic={clinic} /> : null}
        <div className={styles.copy}>
          <Content field={primary.text} clinics={clinics} tokens={tokens} />
          <Buttons fields={primary.button} />
        </div>
      </div>
    </SliceSection>
  );
}

export default SideBySide;
