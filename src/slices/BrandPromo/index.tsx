import { Medicine02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  asText,
  isFilled,
  type ImageField,
  type KeyTextField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";
import { useId } from "react";
import type { BrandKind, PriceUnit } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { visitLinkProps } from "@/lib/affiliate-link";
import styles from "./brand-promo.module.css";

/** The clinic this card points at. The page reads it off the Provider. */
export type BrandPromoClinic = {
  uid: string;
  name: string;
  logo?: { src: string };
  visitHref?: string;
  visitText?: string;
  /** A Product has no insurance line. */
  kind?: BrandKind;
  monthlyPrice?: number | null;
  /** One time drops the /mo after the price. */
  priceUnit?: PriceUnit;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
  gettingStarted?: string;
  offerCode?: string;
  offerCopy?: string;
  topChoice?: string;
  /** The clinic's In my words, used when Quote on the slice is empty. */
  quote?: string;
  /** The site page about this brand. The card labels it Products & pricing. */
  pageHref?: string;
  /** The review video. The card labels it Watch my review. */
  reviewVideoHref?: string;
  /** The brand's product photo, used when this slice has none. */
  product?: ImageField | null;
};

type BrandPromoPrimary = Partial<SliceSectionFields> & {
  clinic?: LinkField | null;
  quote?: RichTextField | null;
  text?: RichTextField | null;
  /** On shows the 1st badge. Off hides it. */
  first?: boolean | null;
  /** Words beside the 1st badge, such as "My 2026 top choice". */
  place?: KeyTextField;
  product?: ImageField | null;
  /** Stacked puts the photo above the price, as one card. */
  layout?: string | null;
  links?: readonly LinkField[] | null;
};

const PRODUCTS_LABEL = "Products & pricing";
const WATCH_LABEL = "Watch my review";

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function isVideoUrl(href: string) {
  return /youtu\.?be|vimeo/i.test(href);
}

export type BrandPromoLink = {
  href: string;
  text: string;
  external: boolean;
};

/** Products & pricing is the brand's page. Watch my review is its video. */
export function brandPromoLinks(
  clinic?: Pick<BrandPromoClinic, "pageHref" | "reviewVideoHref"> | null,
): BrandPromoLink[] {
  const page = text(clinic?.pageHref);
  const video = text(clinic?.reviewVideoHref);

  return [
    page ? { href: page, text: PRODUCTS_LABEL, external: false } : undefined,
    video ? { href: video, text: WATCH_LABEL, external: true } : undefined,
  ].filter((link): link is BrandPromoLink => link !== undefined);
}

/** Links written on the slice. They sit on a second row under the brand buttons. */
export function brandPromoExtraLinks(
  sliceLinks: readonly LinkField[] | null | undefined,
): BrandPromoLink[] {
  return (sliceLinks ?? []).flatMap((link) => {
    if (!isFilled.link(link)) return [];
    const href = text(link.url);
    const label = text(link.text);
    if (!href || !label) return [];
    return [
      {
        href,
        text: label,
        external: link.target === "_blank" || isVideoUrl(href),
      },
    ];
  });
}

/** The slice photo wins. An empty one uses the brand's product image. */
export function brandPromoProduct(
  slice: ImageField | null | undefined,
  clinic?: ImageField | null,
) {
  if (slice && isFilled.image(slice)) return slice;
  if (clinic && isFilled.image(clinic)) return clinic;
  return null;
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
      <HugeiconsIcon
        icon={Medicine02Icon}
        size={16}
        strokeWidth={1.75}
        className={styles.factIcon}
        aria-hidden="true"
      />
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

function ResourceIcon({ url, label }: { url: string; label: string }) {
  if (isVideoUrl(url) || label === WATCH_LABEL) {
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

function Media({ field, sizes }: { field: ImageField; sizes: string }) {
  if (field.url?.startsWith("/")) {
    return <Image src={field.url} alt={field.alt ?? ""} fill sizes={sizes} />;
  }

  return <PrismicNextImage field={field} fallbackAlt="" fill sizes={sizes} />;
}

/**
 * One clinic card. Trusted providers stacks one of these per clinic.
 * Navy is the featured card. Is this 1st? shows the badge.
 * Place is the line beside that badge. A blank Small heading reads
 * "Voted best for".
 * The price, logo, visit link, and coupon come from the clinic.
 * Products & pricing is the brand's page. Watch my review is its
 * review video. Links written here sit under those buttons.
 * The product photo is the brand's, unless one is placed here.
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
  const kickerFilled =
    isFilled.richText(primary.small_heading) &&
    Boolean(asText(primary.small_heading).trim());
  const quote = brandPromoQuote(primary.quote, clinic?.quote);
  const links = brandPromoLinks(clinic);
  const extraLinks = brandPromoExtraLinks(primary.links);
  const product = brandPromoProduct(primary.product, clinic?.product);
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
    clinic?.kind !== "Product" && typeof clinic?.insurance === "boolean"
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
  const showProduct = Boolean(product);

  return (
    <SliceSection
      section={primary}
      showHeader={false}
      title={clinic?.uid || (headingFilled ? asText(primary.heading) : name)}
      labelId={headingFilled || name ? labelId : undefined}
    >
      <div
        className={styles.layout}
        data-tone={tone}
        data-layout={primary.layout === "Stacked" ? "stacked" : undefined}
      >
        <div className={styles.copy}>
          {primary.first ? (
            <p className={styles.placeLine}>
              <span className={styles.place}>
                <Medal />
                1st
                <span className="sr-only"> place</span>
              </span>
              {place}
            </p>
          ) : null}
          {kickerFilled ? (
            <RichText
              field={primary.small_heading}
              as="p"
              unstyled
              className={styles.kicker}
            />
          ) : (
            <p className={styles.kicker}>Voted best for</p>
          )}
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
                  {...visitLinkProps(name, "brand_promo")}
                >
                  <Logo clinic={clinic} />
                  <span>{name}</span>
                  <span className="sr-only">
                    {" "}
                    (affiliate link, opens in a new tab)
                  </span>
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
          {primary.text && isFilled.richText(primary.text) ? (
            <RichText field={primary.text} className={styles.text} />
          ) : null}
          {links.length > 0 ? (
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={`${link.text}-${link.href}`}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <ResourceIcon url={link.href} label={link.text} />
                    {link.text}
                    {name ? <span className="sr-only"> — {name}</span> : null}
                    {link.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {extraLinks.length > 0 ? (
            <ul className={styles.more}>
              {extraLinks.map((link) => (
                <li key={`${link.text}-${link.href}`}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.text}
                    <Chevron />
                    {name ? <span className="sr-only"> — {name}</span> : null}
                    {link.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {showProduct || showDeal ? (
          <div className={styles.offer}>
            {product ? (
              <figure className={styles.product}>
                <Media
                  field={product}
                  sizes={
                    primary.layout === "Stacked"
                      ? "(max-width: 440px) 100vw, 26rem"
                      : "216px"
                  }
                />
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
                    {clinic?.priceUnit === "One time" ? null : (
                      <span className={styles.per}>/mo</span>
                    )}
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
                      {...visitLinkProps(name ?? "", "brand_promo")}
                    >
                      {visitText}
                      <Chevron />
                      <span className="sr-only">
                        {" "}
                        (affiliate link, opens in a new tab)
                      </span>
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
  if (!clinic.logo?.src) return null;
  return (
    <span className={styles.logo}>
      <Image src={clinic.logo.src} alt="" width={64} height={64} />
    </span>
  );
}

export default BrandPromo;
