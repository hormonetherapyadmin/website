import {
  asText,
  isFilled,
  type ImageField,
  type KeyTextField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import type { ReactNode } from "react";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./boxes.module.css";

export const BOXES_ACROSS = ["2", "3", "4", "5", "6", "7"] as const;

/** The clinic a box points at. The page reads it off the Provider. */
export type BoxClinic = {
  name: string;
  logo?: { src: string };
  offerCode?: string;
};

type BoxItem = {
  clinic?: LinkField | null;
  image?: ImageField | null;
  heading?: RichTextField | null;
  text?: RichTextField | null;
  bottom_line?: KeyTextField;
  link?: LinkField | null;
};

type BoxesPrimary = {
  section?: readonly SliceSectionFields[] | null;
  across?: string | null;
  boxes?: readonly BoxItem[] | null;
};

type ResolvedBox = {
  logo?: { src: string; alt: string };
  heading?: RichTextField;
  text?: RichTextField;
  name?: string;
  bottomLine?: string;
  link?: LinkField;
};

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** Boxes across, as a number. An empty or unknown choice is 5. */
export function boxesAcross(value: string | null | undefined) {
  return Number(BOXES_ACROSS.find((option) => option === value) ?? "5");
}

/**
 * What one box shows. A written field wins. An empty Image, Text, or
 * Bottom line uses the clinic's logo, name, or code. A box with nothing
 * to show is left out.
 */
export function resolveBox(
  box: BoxItem,
  clinic: BoxClinic | null | undefined,
): ResolvedBox | null {
  const heading = isFilled.richText(box.heading) ? box.heading : undefined;
  const written = isFilled.richText(box.text) ? box.text : undefined;
  const name = written ? undefined : text(clinic?.name);
  if (!heading && !written && !name) return null;

  const image =
    box.image && isFilled.image(box.image)
      ? { src: box.image.url, alt: box.image.alt ?? "" }
      : clinic?.logo
        ? { src: clinic.logo.src, alt: "" }
        : undefined;
  const link = box.link && isFilled.link(box.link) ? box.link : undefined;

  return {
    logo: image,
    heading,
    text: written,
    name,
    bottomLine: text(box.bottom_line) ?? clinic?.offerCode,
    link,
  };
}

function BoxBody({
  box,
  titled,
}: {
  box: ResolvedBox;
  /** A section heading is above, so each box heading is an `h3`. */
  titled: boolean;
}) {
  return (
    <>
      {box.logo ? (
        <span className={styles.logo}>
          <Image src={box.logo.src} alt={box.logo.alt} width={64} height={64} />
        </span>
      ) : null}
      <RichText
        field={box.heading}
        as={titled ? "h3" : "p"}
        unstyled
        className={styles.heading}
      />
      {box.text ? (
        <RichText field={box.text} as="p" unstyled className={styles.text} />
      ) : box.name ? (
        <p className={styles.text}>{box.name}</p>
      ) : null}
      {box.bottomLine ? (
        <p className={styles.bottomLine}>{box.bottomLine}</p>
      ) : null}
    </>
  );
}

function Box({ box, children }: { box: ResolvedBox; children: ReactNode }) {
  if (!box.link) return <div className={styles.box}>{children}</div>;

  return (
    <PrismicNextLink field={box.link} className={styles.box}>
      {children}
    </PrismicNextLink>
  );
}

/**
 * A row of small boxes, each a clinic or written by hand. Boxes across
 * is the most in one row. Narrower screens use fewer, by that count.
 */
export function Boxes({
  primary,
  clinics = [],
}: {
  primary: BoxesPrimary;
  /** The clinic for each box, in the same order as Boxes. */
  clinics?: readonly (BoxClinic | null | undefined)[];
}) {
  const boxes = (primary.boxes ?? []).flatMap((box, index) => {
    const resolved = resolveBox(box, clinics[index]);
    return resolved ? [resolved] : [];
  });
  const fields = primary.section?.[0];
  const titled = Boolean(fields && asText(fields.heading).trim());
  const columns = Math.min(boxesAcross(primary.across), boxes.length);

  return (
    <SliceSection section={primary.section}>
      {boxes.length > 0 ? (
        <ul className={styles.grid} data-cols={columns}>
          {boxes.map((box, index) => (
            <li key={index}>
              <Box box={box}>
                <BoxBody box={box} titled={titled} />
              </Box>
            </li>
          ))}
        </ul>
      ) : null}
    </SliceSection>
  );
}

export default Boxes;
