import {
  asText,
  isFilled,
  type ImageField,
  type KeyTextField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import { useId } from "react";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./brand-promo.module.css";

/** The clinic this card points at. The page reads it off the Provider. */
export type BrandPromoClinic = {
  uid: string;
  name: string;
  logo?: { src: string };
  visitHref?: string;
  visitText?: string;
  newTab?: boolean;
  monthlyPrice?: number | null;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
  gettingStarted?: string;
  offerCode?: string;
  offerCopy?: string;
  topChoice?: string;
  /** The clinic's In my words, used when Quote on the slice is empty. */
  quote?: string;
};

type BrandPromoPrimary = Partial<SliceSectionFields> & {
  clinic?: LinkField | null;
  quote?: RichTextField | null;
  place?: KeyTextField;
  product?: ImageField | null;
  links?: readonly LinkField[] | null;
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function priceLabel(value: number) {
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `$${amount}`;
}

/** Navy and Raspberry are light-on-dark bands. Every other background is light. */
export function brandPromoTone(background: string | null | undefined) {
  return background === "Navy" || background === "Raspberry" ? "dark" : "light";
}

/**
 * The sentence under the clinic name. A written Quote wins. An empty
 * Quote uses the clinic's In my words.
 */
export function brandPromoQuote(
  field: RichTextField | null | undefined,
  clinicQuote: string | undefined,
) {
  if (field && isFilled.richText(field) && asText(field).trim()) {
    return { field };
  }
  const fallback = text(clinicQuote);
  return fallback ? { text: fallback } : {};
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

function Medal() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13.2-1.2 7 4.2-2.2 4.2 2.2L15 13.2" />
    </svg>
  );
}

function FactIcon({ kind }: { kind: "formulation" | "yes" | "no" }) {
  if (kind === "formulation") {
    return (
      <svg viewBox="0 0 24 24" className={styles.factIcon} aria-hidden="true">
        <path
          d="M8 3.5h8v3.2a6 6 0 0 1-1.2 3.6L12 14.5l-2.8-4.2A6 6 0 0 1 8 6.7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 8.5h5.6M10 20.5h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "yes") {
    return (
      <svg viewBox="0 0 24 24" className={styles.factIcon} aria-hidden="true">
        <path
          d="m5 12.5 4.2 4.2L19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.factIcon} aria-hidden="true">
      <path
        d="m7 7 10 10M17 7 7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResourceIcon({ url }: { url: string }) {
  if (/youtu\.?be|vimeo/i.test(url)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M4 8.5h16v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M8 8.5 9.2 5h5.6L16 8.5" />
    </svg>
  );
}

function Media({ field }: { field: ImageField }) {
  if (field.url?.startsWith("/")) {
    return <Image src={field.url} alt={field.alt ?? ""} fill sizes="216px" />;
  }

  return <PrismicNextImage field={field} fallbackAlt="" fill sizes="216px" />;
}

/**
 * One clinic card. Trusted providers stacks one of these per clinic.
 * Navy is the featured card. A Place such as "1st" shows the badge.
 * The price, logo, visit link, and coupon come from the clinic.
 */
export function BrandPromo({
  primary,
  clinic,
}: {
  primary: BrandPromoPrimary;
  clinic?: BrandPromoClinic | null;
}) {
  const labelId = useId();
  const name = text(clinic?.name);
  const place = text(primary.place);
  const tone = brandPromoTone(primary.background);
  const headingFilled = isFilled.richText(primary.heading);
  const quote = brandPromoQuote(primary.quote, clinic?.quote);
  const links = (primary.links ?? []).filter(
    (link) => isFilled.link(link) && link.text,
  );
  const price =
    typeof clinic?.monthlyPrice === "number" ? clinic.monthlyPrice : undefined;
  const priceNote = text(clinic?.priceNote);
  const formulation = text(clinic?.formulation);
  const gettingStarted = text(clinic?.gettingStarted);
  const code = text(clinic?.offerCode);
  const codeNote = text(clinic?.offerCopy);
  const visitText = text(clinic?.visitText) || (name ? `Visit ${name}` : "");
  const facts = [
    formulation
      ? { kind: "formulation" as const, text: formulation }
      : undefined,
    typeof clinic?.insurance === "boolean"
      ? {
          kind: clinic.insurance ? ("yes" as const) : ("no" as const),
          text: clinic.insurance ? "Takes insurance" : "Doesn't take insurance",
        }
      : undefined,
    gettingStarted ? { kind: "yes" as const, text: gettingStarted } : undefined,
  ].filter((fact) => fact !== undefined);
  const showDeal = Boolean(
    price !== undefined ||
    facts.length ||
    (clinic?.visitHref && visitText) ||
    code ||
    codeNote,
  );
  const showProduct = isFilled.image(primary.product);

  return (
    <SliceSection
      section={primary}
      showHeader={false}
      title={clinic?.uid || (headingFilled ? asText(primary.heading) : name)}
      labelId={headingFilled || name ? labelId : undefined}
    >
      <div className={styles.layout} data-tone={tone}>
        <div className={styles.copy}>
          {place ? (
            <p className={styles.placeLine}>
              <span className={styles.place}>
                <Medal />
                {place}
                <span className="sr-only"> place</span>
              </span>
              {clinic?.topChoice}
            </p>
          ) : null}
          <RichText
            field={primary.small_heading}
            as="p"
            unstyled
            className={styles.kicker}
          />
          {headingFilled ? (
            <RichText
              field={primary.heading}
              as="h2"
              unstyled
              id={labelId}
              className={styles.title}
            />
          ) : null}
          {clinic && name ? (
            <p
              className={styles.brandName}
              id={headingFilled ? undefined : labelId}
            >
              {clinic.visitHref ? (
                <a
                  href={clinic.visitHref}
                  className={styles.brand}
                  target={clinic.newTab ? "_blank" : undefined}
                  rel={clinic.newTab ? AFFILIATE_REL : undefined}
                  data-provider={name}
                  data-placement="brand_promo"
                >
                  <Logo clinic={clinic} />
                  <span>{name}</span>
                  {clinic.newTab ? (
                    <span className="sr-only">
                      {" "}
                      (affiliate link, opens in a new tab)
                    </span>
                  ) : null}
                </a>
              ) : (
                <span className={styles.brand}>
                  <Logo clinic={clinic} />
                  <span>{name}</span>
                </span>
              )}
            </p>
          ) : null}
          <RichText
            field={primary.intro}
            as="p"
            unstyled
            className={styles.detail}
          />
          {quote.field ? (
            <RichText
              field={quote.field}
              as="p"
              unstyled
              className={styles.quote}
            />
          ) : quote.text ? (
            <p className={styles.quote}>{quote.text}</p>
          ) : null}
          {links.length > 0 ? (
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={`${link.text}-${"url" in link ? link.url : ""}`}>
                  <PrismicNextLink field={link}>
                    {isFilled.link(link) ? (
                      <ResourceIcon url={link.url ?? ""} />
                    ) : null}
                    {link.text}
                    {name ? <span className="sr-only"> — {name}</span> : null}
                    {"target" in link && link.target === "_blank" ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {showProduct || showDeal ? (
          <div className={styles.offer}>
            {showProduct ? (
              <figure className={styles.product}>
                <Media field={primary.product as ImageField} />
              </figure>
            ) : null}
            {showDeal ? (
              <aside
                className={styles.deal}
                aria-label={name ? `${name} price` : "Price"}
              >
                {price !== undefined ? (
                  <p className={styles.price}>
                    <span className={styles.amount}>{priceLabel(price)}</span>
                    <span className={styles.per}>/mo</span>
                    {priceNote ? (
                      <span className={styles.priceNote}>{priceNote}</span>
                    ) : null}
                  </p>
                ) : null}
                {facts.length > 0 ? (
                  <ul className={styles.facts}>
                    {facts.map((fact) => (
                      <li key={fact.text}>
                        <FactIcon kind={fact.kind} />
                        {fact.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {clinic?.visitHref && visitText ? (
                  <div className={styles.actions}>
                    <a
                      href={clinic.visitHref}
                      className={styles.visit}
                      target={clinic.newTab ? "_blank" : undefined}
                      rel={clinic.newTab ? AFFILIATE_REL : undefined}
                      data-provider={name}
                      data-placement="brand_promo"
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
                  </div>
                ) : null}
                {code || codeNote ? (
                  <p className={styles.code}>
                    {code ? <b>Code {code}</b> : <b>{codeNote}</b>}
                    {code && codeNote ? <span>{codeNote}</span> : null}
                  </p>
                ) : null}
              </aside>
            ) : null}
          </div>
        ) : null}
      </div>
    </SliceSection>
  );
}

function Logo({ clinic }: { clinic: BrandPromoClinic }) {
  return (
    <span className={styles.logo}>
      {clinic.logo?.src ? (
        <Image src={clinic.logo.src} alt="" width={44} height={44} />
      ) : null}
    </span>
  );
}

export default BrandPromo;
