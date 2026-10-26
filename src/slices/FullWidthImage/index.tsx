import { isFilled, type ImageField, type SelectField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";
import {
  SliceSection,
  type SectionBackground,
  type SectionSpacing,
} from "@/components/slice-section";
import styles from "./full-width-image.module.css";

type FullWidthImagePrimary = {
  image: ImageField;
  edge_to_edge?: boolean | null;
  background: SelectField<SectionBackground>;
  space_above: SelectField<SectionSpacing>;
  space_below: SelectField<SectionSpacing>;
};

const COLUMN_SIZES = "(min-width: 95rem) 88rem, 100vw";

/**
 * One image. Off, it is as wide as the writing column. Edge to edge
 * runs it to the edges of the window. An empty image renders nothing.
 * The description on the image is its alt text.
 */
export function FullWidthImage({
  primary,
}: {
  primary: FullWidthImagePrimary;
}) {
  if (!isFilled.image(primary.image)) return null;

  const edge = primary.edge_to_edge === true;

  return (
    <SliceSection
      section={primary}
      showHeader={false}
      width={edge ? "screen" : "wrap"}
    >
      <Photo field={primary.image} sizes={edge ? "100vw" : COLUMN_SIZES} />
    </SliceSection>
  );
}

function Photo({ field, sizes }: { field: ImageField; sizes: string }) {
  if (!isFilled.image(field)) return null;

  if (field.url.startsWith("/")) {
    return (
      <Image
        src={field.url}
        alt={field.alt ?? ""}
        width={field.dimensions.width}
        height={field.dimensions.height}
        sizes={sizes}
        className={styles.photo}
      />
    );
  }

  return (
    <PrismicNextImage
      field={field}
      fallbackAlt=""
      sizes={sizes}
      className={styles.photo}
    />
  );
}

export default FullWidthImage;
