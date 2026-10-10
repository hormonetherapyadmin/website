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
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { visitLinkProps } from "@/lib/affiliate-link";
import styles from "./hero.module.css";

export type HeroClinic = {
  name?: KeyTextField;
  logo?: ImageField | null;
  formulation?: KeyTextField;
  visit?: LinkField | null;
  monthly_price?: number | null;
  price_note?: KeyTextField;
  top_choice_label?: KeyTextField;
  code?: KeyTextField;
  code_note?: KeyTextField;
};

export type HeroClinicLink = {
  data?: HeroClinic | null;
} | null;

type HomePrimary = Partial<SliceSectionFields> & {
  tagline: RichTextField;
  benefits?: readonly LinkField[] | null;
  button?: readonly LinkField[] | null;
  trust_lines?: readonly { text: KeyTextField }[] | null;
  image: ImageField;
  photo_greeting: KeyTextField;
  caption: RichTextField;
};

type SubpagePrimary = Partial<SliceSectionFields> & {
  image: ImageField;
};

type BrandsPrimary = Partial<SliceSectionFields> & {
  clinics?: readonly { clinic: HeroClinicLink; link: LinkField }[] | null;
};

type ProviderPrimary = Partial<SliceSectionFields> & {
  clinic: HeroClinicLink;
  voted: RichTextField;
  quote: RichTextField;
  links?: readonly LinkField[] | null;
  product: ImageField;
};

export type HeroSlice =
  | { variation: "home"; primary: HomePrimary }
  | { variation: "subpage"; primary: SubpagePrimary }
  | { variation: "brands"; primary: BrandsPrimary }
  | { variation: "provider"; primary: ProviderPrimary };

function text(value: KeyTextField | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function priceLabel(value: number) {
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `$${amount}`;
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

function ResourceIcon({ url }: { url: string }) {
  const video = /youtu\.?be|vimeo/i.test(url);

  if (video) {
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
      <path d="M6 3.5h8.5L19 8v12.5H6z" />
      <path d="M14 3.5V8h5" />
      <path d="M8.5 12.5h7M8.5 16h5" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className={styles.check} aria-hidden="true">
      <circle cx="10" cy="10" r="10" className="fill-cta" />
      <path
        d="M5.5 10.5l3 3 6-6.5"
        fill="none"
        className="stroke-cta-text"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Media({
  field,
  className,
  sizes,
  fill = false,
}: {
  field: ImageField | null | undefined;
  className?: string;
  sizes: string;
  fill?: boolean;
}) {
  if (!isFilled.image(field)) return null;

  if (field.url.startsWith("/")) {
    return fill ? (
      <Image
        src={field.url}
        alt={field.alt ?? ""}
        fill
        sizes={sizes}
        className={className}
      />
    ) : (
      <Image
        src={field.url}
        alt={field.alt ?? ""}
        width={field.dimensions.width}
        height={field.dimensions.height}
        sizes={sizes}
        className={className}
      />
    );
  }

  return fill ? (
    <PrismicNextImage
      field={field}
      fallbackAlt=""
      fill
      sizes={sizes}
      className={className}
    />
  ) : (
    <PrismicNextImage
      field={field}
      fallbackAlt=""
      sizes={sizes}
      className={className}
    />
  );
}

function HeroButton({ field }: { field: LinkField }) {
  const ghost = field.variant === "Ghost";

  return (
    <PrismicNextLink
      field={field}
      className={ghost ? styles.ghost : styles.button}
    >
      {field.text}
      {ghost ? <Chevron /> : null}
    </PrismicNextLink>
  );
}

function TextLink({ field }: { field: LinkField }) {
  if (!isFilled.link(field) || !field.text) return null;

  return (
    <PrismicNextLink field={field} className={styles.textLink}>
      {field.text}
      <Chevron />
    </PrismicNextLink>
  );
}

/** Two logos, then three, then the rest. Same cluster as the mockup. */
function logoRows<T>(items: readonly T[]) {
  if (items.length <= 3) return [items];

  return [items.slice(0, 2), items.slice(2, 5), items.slice(5)].filter(
    (row) => row.length > 0,
  );
}

function HomeHero({ primary }: { primary: HomePrimary }) {
  const benefits = (primary.benefits ?? []).filter(
    (benefit) => isFilled.link(benefit) && benefit.text,
  );
  const buttons = (primary.button ?? []).filter(
    (button) => isFilled.link(button) && button.text,
  );
  const facts = (primary.trust_lines ?? []).filter((line) => text(line.text));
  const greeting = text(primary.photo_greeting);

  return (
    <SliceSection
      section={primary}
      showHeader={false}
      title={asText(primary.tagline)}
    >
      <div className={styles.home}>
        <div>
          <RichText
            field={primary.heading}
            as="h1"
            unstyled
            className={`${styles.kicker} ${styles.homeKicker}`}
          />
          <RichText
            field={primary.tagline}
            as="p"
            unstyled
            className={`${styles.display} ${styles.homeTitle}`}
          />
          {benefits.length > 0 ? (
            <ul className={styles.benefits}>
              {benefits.map((benefit) => (
                <li key={benefit.text}>
                  <PrismicNextLink field={benefit}>
                    {benefit.text}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          ) : null}
          <RichText
            field={primary.intro}
            as="p"
            unstyled
            className={styles.dek}
          />
          {buttons.length > 0 ? (
            <div className={styles.actions}>
              {buttons.map((button) => (
                <HeroButton
                  key={`${button.variant}-${button.text}`}
                  field={button}
                />
              ))}
            </div>
          ) : null}
          {facts.length > 0 ? (
            <ul className={styles.facts} aria-label="About this site">
              {facts.map((fact) => (
                <li key={fact.text}>
                  <Check />
                  {fact.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {isFilled.image(primary.image) ? (
          <figure className={styles.figure}>
            <div className={styles.photo}>
              <Media
                field={primary.image}
                sizes="(min-width: 960px) 520px, 90vw"
              />
              {greeting ? (
                <span className={styles.bubble} aria-hidden="true">
                  {greeting}
                </span>
              ) : null}
            </div>
            <RichText
              field={primary.caption}
              as="p"
              unstyled
              className={styles.caption}
            />
          </figure>
        ) : null}
      </div>
    </SliceSection>
  );
}

function ClinicLogo({
  clinic,
  link,
}: {
  clinic: HeroClinic | null | undefined;
  link: LinkField;
}) {
  const name = text(clinic?.name) ?? "Clinic";
  const logo = (
    <>
      {clinic?.logo && isFilled.image(clinic.logo) ? (
        <span className={styles.floatLogoImage}>
          <Media field={clinic.logo} fill sizes="76px" />
        </span>
      ) : (
        <span className={styles.monogram} aria-hidden="true">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </>
  );

  if (!isFilled.link(link)) {
    return (
      <span className={styles.floatLogo} aria-label={name}>
        {logo}
      </span>
    );
  }

  return (
    <PrismicNextLink
      field={link}
      className={styles.floatLogo}
      aria-label={name}
    >
      {logo}
    </PrismicNextLink>
  );
}

function TitleCopy({ section }: { section: Partial<SliceSectionFields> }) {
  return (
    <div>
      <RichText
        field={section.small_heading}
        as="p"
        unstyled
        className={styles.kicker}
      />
      <RichText
        field={section.heading}
        as="h1"
        unstyled
        className={`${styles.display} ${styles.subpageTitle}`}
      />
      <RichText field={section.intro} as="p" unstyled className={styles.dek} />
      {section.link && isFilled.link(section.link) && section.link.text ? (
        <div className={styles.subpageLinks}>
          <TextLink field={section.link} />
        </div>
      ) : null}
    </div>
  );
}

function SubpageHero({ primary }: { primary: SubpagePrimary }) {
  return (
    <SliceSection section={primary} showHeader={false}>
      <div className={styles.subpage}>
        <TitleCopy section={primary} />
        {isFilled.image(primary.image) ? (
          <figure className={styles.figure}>
            <div className={styles.photo}>
              <Media
                field={primary.image}
                sizes="(min-width: 960px) 520px, 90vw"
              />
            </div>
          </figure>
        ) : null}
      </div>
    </SliceSection>
  );
}

function BrandsHero({ primary }: { primary: BrandsPrimary }) {
  const clinics = primary.clinics ?? [];

  return (
    <SliceSection section={primary} showHeader={false}>
      <div className={styles.brands}>
        <TitleCopy section={primary} />
        {clinics.length > 0 ? (
          <nav className={styles.floatCluster} aria-label="Clinics">
            {logoRows(clinics).map((row, rowIndex) => (
              <div className={styles.floatRow} key={rowIndex}>
                {row.map((item, index) => (
                  <ClinicLogo
                    key={item.clinic?.data?.name ?? index}
                    clinic={item.clinic?.data}
                    link={item.link}
                  />
                ))}
              </div>
            ))}
          </nav>
        ) : null}
      </div>
    </SliceSection>
  );
}

function ProviderHero({ primary }: { primary: ProviderPrimary }) {
  const clinic = primary.clinic?.data;
  const name = text(clinic?.name);
  const brand = text(clinic?.formulation) ?? name;
  const kicker = text(clinic?.top_choice_label);
  const price =
    typeof clinic?.monthly_price === "number"
      ? clinic.monthly_price
      : undefined;
  const priceNote = text(clinic?.price_note);
  const code = text(clinic?.code);
  const codeNote = text(clinic?.code_note);
  const visitHref =
    clinic?.visit &&
    isFilled.link(clinic.visit) &&
    clinic.visit.link_type === "Web"
      ? clinic.visit.url
      : undefined;
  const links = (primary.links ?? []).filter(
    (link) => isFilled.link(link) && link.text,
  );

  return (
    <SliceSection
      section={primary}
      showHeader={false}
      title={name ?? asText(primary.heading)}
    >
      <div className={styles.provider}>
        <div>
          {isFilled.richText(primary.small_heading) ? (
            <RichText
              field={primary.small_heading}
              as="p"
              unstyled
              className={styles.kicker}
            />
          ) : kicker ? (
            <p className={styles.kicker}>{kicker}</p>
          ) : null}
          {name ? (
            <h1 className={`${styles.display} ${styles.providerTitle}`}>
              {name}
            </h1>
          ) : (
            <RichText
              field={primary.heading}
              as="h1"
              unstyled
              className={`${styles.display} ${styles.providerTitle}`}
            />
          )}
          <RichText
            field={primary.voted}
            as="p"
            unstyled
            className={styles.voted}
          />
          <RichText
            field={primary.quote}
            as="p"
            unstyled
            className={styles.quote}
          />
          {links.length > 0 ? (
            <ul className={styles.resourceLinks}>
              {links.map((link) => (
                <li key={link.text}>
                  <PrismicNextLink field={link}>
                    {isFilled.link(link) ? (
                      <ResourceIcon url={link.url ?? ""} />
                    ) : null}
                    {link.text}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {isFilled.image(primary.product) || price || code || codeNote ? (
          <div className={styles.offer}>
            {isFilled.image(primary.product) ? (
              <figure className={styles.productShot}>
                <Media field={primary.product} fill sizes="296px" />
              </figure>
            ) : null}
            <aside
              className={styles.deal}
              aria-label={name ? `${name} price` : "Price"}
            >
              <p className={styles.brand}>
                {clinic?.logo && isFilled.image(clinic.logo) ? (
                  <span className={styles.brandLogo}>
                    <Media field={clinic.logo} fill sizes="56px" />
                  </span>
                ) : null}
                {brand}
              </p>
              {price ? (
                <p className={styles.price}>
                  <span className={styles.amount}>{priceLabel(price)}</span>
                  <span className={styles.per}>/mo</span>
                  {priceNote ? (
                    <span className={styles.priceNote}>{priceNote}</span>
                  ) : null}
                </p>
              ) : null}
              {visitHref ? (
                <div className={styles.dealActions}>
                  <a
                    href={visitHref}
                    className={styles.button}
                    {...visitLinkProps(name ?? "", "provider_hero")}
                  >
                    {text(clinic?.visit?.text) ??
                      (name ? `Visit ${name}` : "Visit")}
                    <span className="sr-only">
                      {" "}
                      (affiliate link, opens in a new tab)
                    </span>
                  </a>
                </div>
              ) : null}
              {code || codeNote ? (
                <div className={styles.dealCode}>
                  {code ? (
                    <span className={styles.code}>Code {code}</span>
                  ) : null}
                  {codeNote ? (
                    <p className={styles.dealCopy}>{codeNote}</p>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        ) : null}
      </div>
    </SliceSection>
  );
}

/** Homepage, subpage, brand-logo, and clinic-page heroes. */
export function Hero({ variation, primary }: HeroSlice) {
  switch (variation) {
    case "home":
      return <HomeHero primary={primary} />;
    case "subpage":
      return <SubpageHero primary={primary} />;
    case "brands":
      return <BrandsHero primary={primary} />;
    case "provider":
      return <ProviderHero primary={primary} />;
  }
}

export default Hero;
