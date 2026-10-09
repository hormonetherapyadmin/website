import {
  asText,
  isFilled,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./quote.module.css";

/** The clinic this band points at. The page reads it off the Provider. */
export type QuoteClinic = {
  name: string;
  logo?: { src: string };
  visitHref?: string;
  /** Display text on the visit link, such as "Visit Inner Balance". */
  visitText?: string;
  newTab?: boolean;
};

type QuotePrimary = Partial<SliceSectionFields> & {
  quote?: RichTextField | null;
  /** Line beside the logo. Empty uses the clinic name. */
  name?: string | null;
  clinic?: LinkField | null;
  text?: RichTextField | null;
  reminder?: RichTextField | null;
  review_button?: LinkField | null;
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

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

/** The line beside the logo. A filled Name wins. Otherwise the clinic name. */
export function quoteName(
  name: string | null | undefined,
  clinic: QuoteClinic | null | undefined,
) {
  const written = name?.trim();
  if (written) return written;
  return clinic?.name?.trim() || "";
}

/**
 * A quote beside a clinic. The quote, the note, and the review button
 * are written here. The logo and the visit link come from the clinic.
 */
export function Quote({
  primary,
  clinic,
}: {
  primary: QuotePrimary;
  clinic?: QuoteClinic | null;
}) {
  const heading = primary.heading;
  const slug = sectionAnchor(heading ? asText(heading) : "");
  const titleId = slug ? `${slug}-title` : undefined;
  const name = quoteName(primary.name, clinic);
  const visitText = clinic?.visitText?.trim() || (name ? `Visit ${name}` : "");

  return (
    <SliceSection section={primary} showHeader={false} labelId={titleId}>
      <div className={styles.layout}>
        <RichText
          field={heading}
          as="h2"
          id={titleId}
          unstyled
          className={styles.kicker}
        />
        <blockquote className={styles.quote}>
          <RichText
            field={primary.quote}
            as="p"
            unstyled
            className={styles.quoteText}
          />
        </blockquote>
        <div className={styles.details}>
          {name ? (
            <div className={styles.brand}>
              {clinic?.logo?.src ? (
                <span className={styles.logo}>
                  <Image src={clinic.logo.src} alt="" width={56} height={56} />
                </span>
              ) : null}
              <span>{name}</span>
            </div>
          ) : null}
          <RichText
            field={primary.text}
            as="p"
            unstyled
            className={styles.text}
          />
          <RichText
            field={primary.reminder}
            as="p"
            unstyled
            className={styles.reminder}
          />
          {isFilled.link(primary.review_button) || clinic?.visitHref ? (
            <div className={styles.actions}>
              {primary.review_button &&
              isFilled.link(primary.review_button) &&
              primary.review_button.text ? (
                <PrismicNextLink
                  field={primary.review_button}
                  className={styles.review}
                >
                  {primary.review_button.text}
                </PrismicNextLink>
              ) : null}
              {clinic?.visitHref && visitText ? (
                <a
                  href={clinic.visitHref}
                  className={styles.visit}
                  target={clinic.newTab ? "_blank" : undefined}
                  rel={clinic.newTab ? AFFILIATE_REL : undefined}
                  data-provider={clinic.name}
                  data-placement="quote"
                >
                  {visitText}
                  <Chevron />
                  {clinic.newTab ? (
                    <span className="sr-only">
                      {" "}
                      (affiliate link, opens in a new tab)
                    </span>
                  ) : null}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </SliceSection>
  );
}

export default Quote;
