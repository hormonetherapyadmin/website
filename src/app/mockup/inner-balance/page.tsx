import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Appointment01Icon,
  Cancel01Icon,
  CreditCardIcon,
  CustomerSupportIcon,
  Globe02Icon,
  Medicine02Icon,
  News01Icon,
  PackageReceive01Icon,
  Quiz01Icon,
  TestTube01Icon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { clinicNamed } from "../_shared/clinics";
import shared from "../_shared/mockup.module.css";
import { AFFILIATE_REL, MockupShell } from "../_shared/mockup-shell";
import styles from "./provider.module.css";

/*
  Provider-page mockup for the live URL /inner-balance.
  Facts, price, and steps are from that Wix page (October 2026).
  The quote is Peggy's existing Oestra copy from the homepage mockup.
  The visit button uses the shared #affiliate-link placeholder.
*/

export const metadata: Metadata = {
  title: "Inner Balance mockup",
  robots: { index: false, follow: false },
};

const YOUTUBE = "https://youtu.be/PuAekNT9ZvA";
const ONE_YEAR = "/post/oestra-by-inner-balance-my-honest-1-year-review";

const FACTS: {
  label: string;
  value: string;
  detail?: string;
  icon: IconSvgElement;
}[] = [
  { label: "Availability", value: "All 50 states", icon: Globe02Icon },
  {
    label: "Formulation",
    value: "Vaginal cream",
    icon: Medicine02Icon,
    detail: "Bioidentical estradiol and progesterone. The product is Oestra.",
  },
  {
    label: "Pre-testing",
    value: "None",
    icon: TestTube01Icon,
    detail:
      "No bloodwork and no startup fee. The only requirement is the intake form.",
  },
  { label: "Insurance", value: "Not accepted", icon: Cancel01Icon },
  { label: "HSA card", value: "Yes", icon: CreditCardIcon },
  {
    label: "To get started",
    value: "No visit",
    icon: Appointment01Icon,
    detail:
      "No initial consultation. A free checkup at 3 months to adjust the dose, if needed.",
  },
];

const STEPS: { title: string; text: string; icon: IconSvgElement }[] = [
  {
    title: "Health quiz",
    text: "Complete Inner Balance’s 5-minute health quiz.",
    icon: Quiz01Icon,
  },
  {
    title: "Your treatment",
    text: "Receive the prescribed treatment. No visit required.",
    icon: PackageReceive01Icon,
  },
  {
    title: "Ongoing support",
    text: "Start treatment, with ongoing support.",
    icon: CustomerSupportIcon,
  },
];

const SPECIALTIES = [
  "General HRT",
  "Perimenopause",
  "Menopause",
  "Endometriosis",
  "PCOS",
  "Postpartum",
];

function Chevron() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function VisitLink({
  placement,
  className,
  children,
}: {
  placement: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#affiliate-link"
      target="_blank"
      rel={AFFILIATE_REL}
      className={className}
      data-provider="Inner Balance"
      data-placement={placement}
    >
      {children}
      <Chevron />
      <span className={shared.srOnly}>
        {" "}
        (affiliate link, opens in a new tab)
      </span>
    </a>
  );
}

export default async function InnerBalanceMockup(
  props: PageProps<"/mockup/inner-balance">,
) {
  const searchParams = await props.searchParams;
  const clinic = clinicNamed("Inner Balance");

  return (
    <MockupShell searchParams={searchParams}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="/mockup/homepage">Home</a>
          </li>
          <li>
            <a href="/mockup/trusted-providers">Trusted providers</a>
          </li>
          <li aria-current="page">Inner Balance</li>
        </ol>
      </nav>

      <header className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.kicker}>My 2026 top choice</p>
          <h1>{clinic.name}</h1>
          <p className={styles.voted}>Voted best for sleep</p>
          <blockquote className={styles.quote}>
            <p>
              No night sweats, hot flashes or brain fog, and the one big
              difference I notice with Oestra is my sleep. I go to sleep faster
              and stay asleep longer on this HRT, more so than any of the
              others.
            </p>
          </blockquote>
          <ul className={styles.resourceLinks}>
            <li>
              <Link href={ONE_YEAR}>
                <HugeiconsIcon
                  icon={News01Icon}
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                My 1-year review
              </Link>
            </li>
            <li>
              <Link href="/post/inner-balance-hrt-review">
                <HugeiconsIcon
                  icon={News01Icon}
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                HRT review
              </Link>
            </li>
            <li>
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer">
                <HugeiconsIcon
                  icon={YoutubeIcon}
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                Watch my review
                <span className={shared.srOnly}> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.offer}>
          <figure className={styles.productShot}>
            <Image
              src="/mockup/products/oestra_rnieuz.webp"
              alt="Oestra cream jar"
              fill
              sizes="296px"
            />
          </figure>
          <aside className={styles.deal} aria-label="Oestra price">
            <p className={styles.brand}>
              <span className={styles.logo}>
                {clinic.logo ? (
                  <Image src={clinic.logo} alt="" width={56} height={56} />
                ) : null}
              </span>
              <span>{clinic.formulation}</span>
            </p>
            <p className={styles.price}>
              <span className={styles.amount}>$199</span>
              <span className={styles.per}>/mo</span>
              <span className={styles.priceNote}>
                First six months, then $99.
              </span>
            </p>
            <div className={styles.actions}>
              <VisitLink
                placement="provider_hero"
                className={shared.buttonPrimary}
              >
                Visit Inner Balance
              </VisitLink>
            </div>
            <p className={styles.dealCode}>
              <span>Code PEGGY10</span>
              10% off your first order
            </p>
          </aside>
        </div>
      </header>

      <section className={styles.sheet} aria-labelledby="facts-title">
        <div className={styles.sectionIntro}>
          <h2 id="facts-title">The facts</h2>
          <p>
            What I confirmed on their page. This is my experience as a patient,
            not a medical review.
          </p>
        </div>
        <dl className={styles.facts}>
          {FACTS.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>
                <span className={styles.factIcon}>
                  <HugeiconsIcon
                    icon={fact.icon}
                    size={20}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                {fact.label}
              </dt>
              <dd>{fact.value}</dd>
              {fact.detail ? <p>{fact.detail}</p> : null}
            </div>
          ))}
        </dl>
      </section>

      <section
        id="pricing"
        className={styles.pricing}
        aria-labelledby="pricing-title"
      >
        <div className={styles.pricingInner}>
          <div>
            <h2 id="pricing-title">What Oestra cost me</h2>
            <p className={styles.pricingLead}>
              $199 a month for the first six months, then $99 from month seven,
              fixed. No initial consultation.
            </p>
            <div className={styles.bandPrices}>
              <p>
                <span className={styles.bandAmount}>$199</span>
                <span className={styles.per}>/mo</span>
                <span className={styles.bandWhen}>Months 1–6</span>
              </p>
              <p>
                <span className={styles.bandAmount}>$99</span>
                <span className={styles.per}>/mo</span>
                <span className={styles.bandWhen}>Month 7 onward</span>
              </p>
            </div>
            <p className={styles.average}>
              On my comparison chart I list this as $150 a month, the average
              over the first year.{" "}
              <a href="/mockup/homepage#compare">See the chart</a>
            </p>
          </div>
          <div className={styles.bandDeal}>
            <p className={styles.bandBrand}>
              <span className={styles.logo}>
                {clinic.logo ? (
                  <Image src={clinic.logo} alt="" width={56} height={56} />
                ) : null}
              </span>
              <span>
                {clinic.name}
                <small>{clinic.formulation}</small>
              </span>
            </p>
            <div className={styles.actions}>
              <VisitLink
                placement="provider_pricing"
                className={shared.buttonPanel}
              >
                Visit Inner Balance
              </VisitLink>
            </div>
            <p className={styles.dealCode}>
              <span>Code PEGGY10</span>
              10% off your first order
            </p>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection} aria-labelledby="steps-title">
        <div className={styles.sectionIntro}>
          <h2 id="steps-title">How it works</h2>
          <p>Their process, as they describe it.</p>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.title}>
              <span className={styles.stepIcon}>
                <HugeiconsIcon
                  icon={step.icon}
                  size={22}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <p className={styles.stepTitle}>{step.title}</p>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.specialties}
        aria-labelledby="specialties-title"
      >
        <h2 id="specialties-title">Specialties they list</h2>
        <ul className={styles.pills}>
          {SPECIALTIES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.close} aria-labelledby="close-title">
        <div className={styles.closePanel}>
          <div>
            <h2 id="close-title">Comparing a few clinics?</h2>
            <p>
              Inner Balance is one of seven I’ve been a patient at. The short
              list has the code I use at each.
            </p>
          </div>
          <a href="/mockup/trusted-providers" className={shared.buttonPrimary}>
            Trusted providers
          </a>
        </div>
      </section>
    </MockupShell>
  );
}
