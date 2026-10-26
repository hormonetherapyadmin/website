import {
  Appointment01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Globe02Icon,
  Medicine02Icon,
  TestTube01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  asText,
  isFilled,
  type ImageField,
  type LinkField,
} from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";
import type { BrandKind } from "@/components/content-blocks";
import {
  sectionBackground,
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { visitLinkProps } from "@/lib/affiliate-link";
import styles from "./clinic-facts.module.css";

/** The Brand fields this slice shows. The page reads them off the Brand. */
export type FactsClinic = {
  name: string;
  kind?: BrandKind;
  availability?: string;
  formulation?: string;
  labs?: string;
  insurance?: boolean;
  hsaFsa?: boolean;
  gettingStarted?: string;
  steps?: { title?: string; text?: string }[];
  specialties?: string[];
  logo?: { src: string };
  visitHref?: string;
  visitText?: string;
  offerCode?: string;
  /** The code line. The offer box uses it as its sentence. */
  offerCopy?: string;
  /** One line about the clinic. The offer box uses it when the code line is blank. */
  shortDescription?: string;
  /** The jar or bottle. Shown when the slice has no image of its own. */
  product?: ImageField | null;
};

type ClinicFactsPrimary = Partial<SliceSectionFields> & {
  clinic?: LinkField | null;
  image?: ImageField | null;
};

type Fact = { label: string; value: string; icon: IconSvgElement };

/**
 * The fact cards, in a fixed order. An empty fact is left out. A product
 * has no insurance card. HSA / FSA shows only when it is on, because an
 * unset switch reads as off.
 */
export function clinicFacts(clinic: FactsClinic): Fact[] {
  const facts: (Fact | null)[] = [
    clinic.availability
      ? {
          label: "Availability",
          value: clinic.availability,
          icon: Globe02Icon,
        }
      : null,
    clinic.formulation
      ? {
          label: "Typically prescribed",
          value: clinic.formulation,
          icon: Medicine02Icon,
        }
      : null,
    clinic.labs
      ? { label: "Pre-testing", value: clinic.labs, icon: TestTube01Icon }
      : null,
    clinic.kind !== "Product" && typeof clinic.insurance === "boolean"
      ? {
          label: "Insurance",
          value: clinic.insurance ? "Accepted" : "Not accepted",
          icon: clinic.insurance ? CheckmarkCircle02Icon : Cancel01Icon,
        }
      : null,
    clinic.hsaFsa === true
      ? { label: "HSA / FSA", value: "Yes", icon: CreditCardIcon }
      : null,
    clinic.gettingStarted
      ? {
          label: "To get started",
          value: clinic.gettingStarted,
          icon: Appointment01Icon,
        }
      : null,
  ];
  return facts.filter((fact): fact is Fact => fact !== null);
}

function Icon({ icon, size }: { icon: IconSvgElement; size: number }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

const PHOTO_SIZES = "(min-width: 95rem) 88rem, 100vw";

function Photo({ field }: { field: ImageField }) {
  if (!isFilled.image(field)) return null;

  if (field.url.startsWith("/")) {
    return (
      <Image
        src={field.url}
        alt={field.alt ?? ""}
        width={field.dimensions.width}
        height={field.dimensions.height}
        sizes={PHOTO_SIZES}
        className={styles.photoImg}
      />
    );
  }

  return (
    <PrismicNextImage
      field={field}
      fallbackAlt=""
      sizes={PHOTO_SIZES}
      className={styles.photoImg}
    />
  );
}

/**
 * The three lines under the code line, the same ones as a story facts
 * token: what they prescribe, insurance, and getting started.
 */
function offerBullets(clinic: FactsClinic) {
  const bullets: { icon: IconSvgElement; text: string }[] = [];
  if (clinic.formulation) {
    bullets.push({ icon: Medicine02Icon, text: clinic.formulation });
  }
  if (clinic.kind !== "Product" && clinic.insurance === true) {
    bullets.push({ icon: Tick02Icon, text: "Takes insurance" });
  } else if (clinic.kind !== "Product" && clinic.insurance === false) {
    bullets.push({ icon: Cancel01Icon, text: "Doesn’t take insurance" });
  }
  if (clinic.gettingStarted) {
    bullets.push({ icon: Tick02Icon, text: clinic.gettingStarted });
  }
  return bullets;
}

/**
 * The post offer box. The line and the three fact bullets sit on the
 * left. The line is the code line, or the short description when that
 * is blank. Visit and the code sit on the right. Hidden when the
 * clinic has no code line, code, or visit link. A short description
 * alone does not open the box.
 */
function OfferCallout({
  clinic,
  background,
}: {
  clinic: FactsClinic;
  background: string;
}) {
  const codeLine = clinic.offerCopy?.trim() || "";
  const line = codeLine || clinic.shortDescription?.trim() || "";
  const code = clinic.offerCode?.trim() || "";
  const visitHref = clinic.visitHref?.trim() || "";
  if (!codeLine && !code && !visitHref) return null;

  const visit = clinic.visitText?.trim() || `Visit ${clinic.name}`;
  const bullets = offerBullets(clinic);

  return (
    <aside
      className={styles.callout}
      data-background={background}
      aria-label={`${clinic.name} offer`}
    >
      {clinic.logo?.src ? (
        <span className={styles.logo}>
          <Image src={clinic.logo.src} alt="" width={76} height={76} />
        </span>
      ) : null}
      <div className={styles.copy}>
        {line ? <p className={styles.calloutLine}>{line}</p> : null}
        {bullets.length ? (
          <ul className={styles.bullets}>
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
      </div>
      {visitHref || code ? (
        <div className={styles.actions}>
          {visitHref ? (
            <a
              href={visitHref}
              className={styles.button}
              {...visitLinkProps(clinic.name, "clinic_facts")}
            >
              {visit}
              <span className="sr-only">
                {" "}
                (affiliate link, opens in a new tab)
              </span>
            </a>
          ) : null}
          {code ? <span className={styles.code}>Code {code}</span> : null}
        </div>
      ) : null}
    </aside>
  );
}

/**
 * A clinic's fact sheet: the fact cards, a wide photo, How it works,
 * the offer box, and the specialties. The photo is the slice image, or
 * the brand's product photo when the slice image is empty.
 */
export function ClinicFacts({
  primary,
  clinic,
}: {
  primary: ClinicFactsPrimary;
  clinic?: FactsClinic | null;
}) {
  const facts = clinic ? clinicFacts(clinic) : [];
  const steps = (clinic?.steps ?? []).filter((step) => step.title || step.text);
  const specialties = clinic?.specialties ?? [];
  const Part = asText(primary.heading ?? []).trim() ? "h3" : "h2";
  const chosen =
    primary.image && isFilled.image(primary.image)
      ? primary.image
      : clinic?.product;
  const image = chosen && isFilled.image(chosen) ? chosen : null;
  const background = sectionBackground(primary.background);

  return (
    <SliceSection section={primary}>
      {facts.length ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>
                <span className={styles.icon}>
                  <Icon icon={fact.icon} size={20} />
                </span>
                {fact.label}
              </dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {image ? (
        <figure className={styles.photo}>
          <Photo field={image} />
        </figure>
      ) : null}

      {steps.length ? (
        <div className={styles.part}>
          <Part className={styles.partTitle}>How it works</Part>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={index}>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
                {step.title ? (
                  <p className={styles.stepTitle}>{step.title}</p>
                ) : null}
                {step.text ? <p>{step.text}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {clinic ? <OfferCallout clinic={clinic} background={background} /> : null}

      {specialties.length ? (
        <div className={styles.part}>
          <Part className={styles.partTitle}>Specialties they list</Part>
          <ul className={styles.pills}>
            {specialties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </SliceSection>
  );
}

export default ClinicFacts;
