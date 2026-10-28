import {
  asText,
  isFilled,
  type ImageField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { AFFILIATE_REL, isAffiliateUrl } from "@/lib/affiliate-link";
import { PhotoButton, type GalleryShot } from "./lightbox";
import styles from "./photo-gallery.module.css";

type GalleryPhoto = {
  image?: ImageField | null;
  caption?: RichTextField | null;
  line?: string | null;
  link?: LinkField | null;
};

type PairPrimary = {
  before?: ImageField | null;
  before_caption?: RichTextField | null;
  after?: ImageField | null;
  after_caption?: RichTextField | null;
  link?: LinkField | null;
};

export type GalleryPair = {
  before: GalleryShot;
  after: GalleryShot;
  href?: string;
  linkLabel?: string;
  blank?: boolean;
};

function shotFromImage(
  image: ImageField | null | undefined,
  caption: RichTextField | null | undefined,
  line?: string | null,
  link?: LinkField | null,
): GalleryShot | null {
  if (!isFilled.image(image) || !image.url) return null;
  const href = link && isFilled.link(link) ? link.url : undefined;
  const label = link && isFilled.link(link) ? link.text?.trim() : undefined;

  return {
    src: image.url,
    alt: image.alt ?? "",
    width: image.dimensions?.width ?? 1200,
    height: image.dimensions?.height ?? 1600,
    caption: caption ? asText(caption) : "",
    line: line?.trim() || undefined,
    href: href || undefined,
    linkLabel: href && label ? label : undefined,
    blank: Boolean(
      link &&
      isFilled.link(link) &&
      "target" in link &&
      link.target === "_blank",
    ),
  };
}

/** Photos on the Gallery variation, in the order Peggy added them. */
export function galleryShots(
  photos: readonly GalleryPhoto[] | null | undefined,
): GalleryShot[] {
  return (photos ?? []).flatMap((photo) => {
    const shot = shotFromImage(
      photo.image,
      photo.caption,
      photo.line,
      photo.link,
    );
    return shot ? [shot] : [];
  });
}

/** Before and after on the Pair variation. Either photo can be empty. */
export function pairShots(primary: PairPrimary): GalleryPair | null {
  const before = shotFromImage(primary.before, primary.before_caption);
  const after = shotFromImage(primary.after, primary.after_caption);
  if (!before && !after) return null;

  const link = primary.link;
  const href = link && isFilled.link(link) ? link.url : undefined;
  const label = link && isFilled.link(link) ? link.text?.trim() : undefined;
  const blank = Boolean(
    link && isFilled.link(link) && "target" in link && link.target === "_blank",
  );
  const empty = (caption: string): GalleryShot => ({
    src: "",
    alt: "",
    width: 1,
    height: 1,
    caption,
  });

  return {
    before: before ?? empty("Before"),
    after: after ?? empty("After"),
    href: href || undefined,
    linkLabel: href && label ? label : undefined,
    blank,
  };
}

function ReviewLink({
  href,
  label,
  blank,
}: {
  href: string;
  label: string;
  blank?: boolean;
}) {
  const affiliate = isAffiliateUrl(href);
  const open = blank || affiliate;

  return (
    <p className={styles.review}>
      <a
        href={href}
        target={open ? "_blank" : undefined}
        rel={
          affiliate ? AFFILIATE_REL : open ? "noopener noreferrer" : undefined
        }
      >
        {label}
        {open ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    </p>
  );
}

/**
 * Peggy's photos. Gallery is a row of photos. Pair is a before and an
 * after, with one link under them. A click opens the photo in the same
 * dark frame as a YouTube video.
 */
type GalleryPrimary = Partial<SliceSectionFields> & {
  /** Centered is the default. Left lines the photos up with the heading. */
  center?: boolean | null;
};

export function PhotoGallery({
  variation = "default",
  primary,
  photos,
  pair,
}: {
  variation?: "default" | "pair" | string;
  primary: GalleryPrimary;
  photos?: readonly GalleryShot[];
  pair?: GalleryPair | null;
}) {
  const shots = variation === "pair" ? [] : (photos ?? []);
  const sides =
    variation === "pair" && pair
      ? [pair.before, pair.after].filter((shot) => shot.src)
      : [];
  if (shots.length === 0 && sides.length === 0) return null;
  const centered = primary.center !== false;
  // The pair draws its link under the photos. Leaving it on the section
  // would also place that link beside the heading.
  const { link: _link, ...sectionFields } = primary;

  const shared =
    pair?.href && pair.linkLabel
      ? {
          href: pair.href,
          linkLabel: pair.linkLabel,
          blank: pair.blank,
        }
      : null;

  return (
    <SliceSection section={sectionFields}>
      {sides.length > 0 ? (
        <>
          <div className={styles.pairBlock}>
            <div className={styles.pair}>
              {sides.map((shot) => (
                <PhotoButton key={shot.src} shot={{ ...shot, ...shared }} />
              ))}
            </div>
            {shared ? (
              <ReviewLink
                href={shared.href}
                label={shared.linkLabel}
                blank={shared.blank}
              />
            ) : null}
          </div>
        </>
      ) : (
        <ul className={styles.grid} data-align={centered ? "center" : "start"}>
          {shots.map((shot) => (
            <li key={shot.src}>
              <PhotoButton shot={shot} />
            </li>
          ))}
        </ul>
      )}
    </SliceSection>
  );
}

export default PhotoGallery;
