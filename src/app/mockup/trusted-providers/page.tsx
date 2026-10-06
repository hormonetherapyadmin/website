import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeftRightIcon,
  Cancel01Icon,
  Layout01Icon,
  MedalFirstPlaceIcon,
  Medicine02Icon,
  News01Icon,
  Tag01Icon,
  Tick02Icon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { clinicNamed, type Clinic } from "../_shared/clinics";
import shared from "../_shared/mockup.module.css";
import { AFFILIATE_REL, MockupShell } from "../_shared/mockup-shell";
import { PostCard, postAt } from "../_shared/posts";
import styles from "./providers.module.css";

/*
  Trusted-providers design mockup for the live URL /copy-of-trusted-providers.
  Specialties, codes, and review links are from that Wix page (October 2026).
  Prices and quotes come from the shared clinic list. Affiliate buttons use
  the same #affiliate-link placeholder as the homepage — live tracking URLs
  stay off this mockup.
*/

export const metadata: Metadata = {
  title: "Trusted providers mockup",
  robots: { index: false, follow: false },
};

type ResourceLink = {
  label: string;
  href: string;
  icon?: IconSvgElement;
};

type Specialty = {
  id: string;
  name: string;
  voted: string;
  detail?: string;
  code?: string;
  /** Short label for the jump ticket, when the offer is not a code. */
  ticket?: string;
  offer?: string;
  plainDeal?: string;
  priceDetail?: string;
  youtube?: string;
  links: ResourceLink[];
  product?: { src: string; alt: string; position?: string };
};

const SPECIALTIES: Specialty[] = [
  {
    id: "inner-balance",
    name: "Inner Balance",
    voted: "Improved sleep",
    product: {
      src: "/mockup/products/oestra_rnieuz.webp",
      alt: "Oestra cream jar",
    },
    code: "PEGGY10",
    offer: "10% off your first order",
    priceDetail: "$199 for the first six months, then $99.",
    youtube: "https://youtu.be/_OlA4wXOHdQ",
    links: [
      {
        label: "Products & pricing",
        href: "/mockup/inner-balance",
        icon: Tag01Icon,
      },
      {
        label: "HRT review",
        href: "/post/inner-balance-hrt-review",
        icon: News01Icon,
      },
    ],
  },
  {
    id: "winona",
    name: "Winona",
    voted: "No pre-testing",
    product: {
      src: "/mockup/products/image.png",
      alt: "Winona treatment jar",
    },
    offer: "15% off your first order",
    ticket: "15% off",
    youtube: "https://youtu.be/XZD4yvTKScA",
    links: [
      {
        label: "My review",
        href: "/post/winona-bioidentical-hormone-therapy-review",
        icon: News01Icon,
      },
      { label: "Overview", href: "/winona-review-page", icon: Layout01Icon },
    ],
  },
  {
    id: "joi",
    name: "Joi Women’s Wellness",
    voted: "Most comprehensive testing",
    product: {
      src: "/mockup/products/image%20copy.png",
      alt: "Joi HRT injectable vial",
    },
    code: "BRONSON",
    offer: "50% off labs and 15% off HRT treatments",
    youtube: "https://youtu.be/2sQ2-kh1F10",
    links: [
      {
        label: "Products & pricing",
        href: "/joiwommenswellness",
        icon: Tag01Icon,
      },
      {
        label: "My review",
        href: "/post/joi-womens-hormone-replacement-review",
        icon: News01Icon,
      },
    ],
  },
  {
    id: "musely",
    name: "Musely",
    voted: "Most gentle HRT",
    product: {
      src: "/mockup/products/image%20copy%202.png",
      alt: "Musely estrogen cream bottle",
    },
    code: "HTH20",
    offer: "20% off",
    links: [
      { label: "Products & pricing", href: "/musely", icon: Tag01Icon },
      {
        label: "My review",
        href: "/post/musely-estrogen-boost-review",
        icon: News01Icon,
      },
      {
        label: "Musely vs Winona cream",
        href: "/post/musely-estrogen-cream-vs-winona-which-hrt-cream-wins",
        icon: ArrowLeftRightIcon,
      },
    ],
  },
  {
    id: "alloy",
    name: "Alloy",
    voted: "No appointment required",
    product: {
      src: "/mockup/posts/alloy-vs-musely.jpg",
      alt: "Alloy estradiol tablets bottle",
    },
    code: "HORMONEHUB10",
    offer: "$10 off your first order",
    youtube: "https://youtu.be/KznU_Qx24XQ",
    links: [
      {
        label: "Products & pricing",
        href: "/post/my-alloy-an-overview-of-products-process-and-pricing",
        icon: Tag01Icon,
      },
      { label: "My review", href: "/alloy-review-page", icon: News01Icon },
    ],
  },
  {
    id: "effecty",
    name: "Effecty",
    voted: "You get a say",
    product: {
      src: "/mockup/products/image%20copy%203.png",
      alt: "Effecty GLP-1 vial",
    },
    detail: "Choose a consult or not, and choose patch or gel.",
    code: "PEGGY50",
    offer: "$50 off your first order",
    youtube: "https://youtu.be/5671FQQHL8s",
    links: [
      {
        label: "My review",
        href: "/post/effecty-hormone-replacement-therapy-review",
        icon: News01Icon,
      },
    ],
  },
  {
    id: "mymenopauserx",
    name: "MyMenopauseRx",
    voted: "Most insurance-friendly",
    product: {
      src: "/mockup/products/image%20copy%204.png",
      alt: "MyMenopauseRx magnesium complex bottle",
    },
    plainDeal: "No public coupon. I link straight to the clinic.",
    youtube: "https://youtu.be/4BBgI4gmvZE",
    links: [
      { label: "My review", href: "/mymenopauserx", icon: News01Icon },
      {
        label: "MyMenopauseRx vs Midi",
        href: "/post/midi-health-vs-mymenopauserx",
        icon: ArrowLeftRightIcon,
      },
    ],
  },
];

const RELATED = [
  "/post/hrt-skin-before-and-after-my-12-month-results-and-experience",
  "/post/alloy-vs-musely-estrogen-creams-patches-tablets-compared",
  "/post/musely-sleep-well-cream-review-ingredients-fix-menopause-sleep",
].map((href) => postAt(href));

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

function Check() {
  return (
    <svg className={shared.check} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" />
      <path d="M5.5 10.5l3 3 6-6.5" />
    </svg>
  );
}

function Logo({
  clinic,
  large = false,
  compact = false,
}: {
  clinic: Clinic;
  large?: boolean;
  compact?: boolean;
}) {
  const className = [
    styles.logo,
    large ? styles.logoLarge : "",
    compact ? styles.passLogo : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      {clinic.logo ? (
        <Image src={clinic.logo} alt="" width={56} height={56} />
      ) : (
        <span className={styles.monogram} aria-hidden="true">
          {clinic.monogram}
        </span>
      )}
    </span>
  );
}

function AffiliateButton({
  clinic,
  placement,
  className,
  children,
}: {
  clinic: Clinic;
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
      data-provider={clinic.name}
      data-placement={placement}
    >
      {children}
      <span className={shared.srOnly}>
        {" "}
        (affiliate link, opens in a new tab)
      </span>
    </a>
  );
}

function ResourceLinks({
  clinicName,
  links,
  youtube,
}: {
  clinicName: string;
  links: ResourceLink[];
  youtube?: string;
}) {
  return (
    <ul className={styles.resourceLinks}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>
            {link.icon ? (
              <HugeiconsIcon
                icon={link.icon}
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ) : null}
            {link.label}
            <span className={shared.srOnly}> — {clinicName}</span>
          </a>
        </li>
      ))}
      {youtube ? (
        <li>
          <a href={youtube} target="_blank" rel="noopener noreferrer">
            <HugeiconsIcon
              icon={YoutubeIcon}
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Watch my review
            <span className={shared.srOnly}>
              {" "}
              of {clinicName} (opens in a new tab)
            </span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}

function ticketOffer(item: Specialty) {
  return item.ticket ?? item.code ?? "No code";
}

export default async function TrustedProvidersMockup(
  props: PageProps<"/mockup/trusted-providers">,
) {
  const searchParams = await props.searchParams;
  const [featured, ...rest] = SPECIALTIES;
  const featuredClinic = clinicNamed(featured.name);

  return (
    <MockupShell searchParams={searchParams}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="/mockup/homepage">Home</a>
          </li>
          <li aria-current="page">Trusted providers</li>
        </ol>
      </nav>

      <header className={styles.hero}>
        <p className={styles.kicker}>Providers</p>
        <h1>Trusted providers</h1>
        <p className={styles.dek}>
          Seven telehealth clinics I’ve been a patient at, and the specialty
          each one was best at for me. The codes are the ones I use. I’m not a
          doctor, and these visit links pay me a commission.
        </p>
        <div className={styles.heroLinks}>
          <a href="/hrt-price-comparison-chart" className={shared.buttonText}>
            Full price chart
            <Chevron />
          </a>
        </div>
        <ul className={styles.facts} aria-label="About this page">
          {[
            "Patient at all seven",
            "Offers from my own orders",
            "Independent & self-funded",
          ].map((fact) => (
            <li key={fact}>
              <Check />
              {fact}
            </li>
          ))}
        </ul>
      </header>

      <nav className={styles.passBand} aria-label="Jump to a clinic">
        <div className={styles.passInner}>
          <p className={styles.passLabel}>Jump to a specialty</p>
          <ul className={styles.passes}>
            {SPECIALTIES.map((item) => {
              const clinic = clinicNamed(item.name);
              return (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <Logo clinic={clinic} compact />
                    <span className={styles.passVoted}>{item.voted}</span>
                    <span className={styles.passName}>{clinic.name}</span>
                    <span className={styles.passOffer}>
                      {ticketOffer(item)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section
        id={featured.id}
        className={styles.lead}
        aria-labelledby="featured-title"
      >
        <div className={styles.leadInner}>
          <div className={styles.leadCopy}>
            <p className={styles.leadIndex}>
              <span className={styles.leadPlace}>
                <HugeiconsIcon
                  icon={MedalFirstPlaceIcon}
                  size={15}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                1st
                <span className={shared.srOnly}> place</span>
              </span>
              My 2026 top choice
            </p>
            <p className={styles.leadKicker}>Voted best for</p>
            <h2 id="featured-title">{featured.voted}</h2>
            <blockquote className={styles.leadQuote}>
              <p>{featuredClinic.quote}</p>
            </blockquote>
            <ResourceLinks
              clinicName={featuredClinic.name}
              links={featured.links}
              youtube={featured.youtube}
            />
          </div>

          <div className={styles.leadOffer}>
            {featured.product ? (
              <figure className={styles.leadProduct}>
                <Image
                  src={featured.product.src}
                  alt={featured.product.alt}
                  fill
                  sizes="216px"
                />
              </figure>
            ) : null}
            <div className={styles.deal}>
              <p className={styles.brand}>
                <Logo clinic={featuredClinic} large />
                <span>{featuredClinic.name}</span>
              </p>
              <p>
                <span className={styles.rowAmount}>
                  ${featuredClinic.monthly}
                </span>
                <span className={styles.per}>/mo</span>
              </p>
              <ul className={styles.rowMeta}>
                <li>
                  <HugeiconsIcon
                    icon={Medicine02Icon}
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {featuredClinic.formulation}
                </li>
                {featured.priceDetail ? (
                  <li>
                    <HugeiconsIcon
                      icon={Tag01Icon}
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {featured.priceDetail}
                  </li>
                ) : null}
                {featuredClinic.priceNote ? (
                  <li>
                    <HugeiconsIcon
                      icon={Tag01Icon}
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {featuredClinic.priceNote}
                  </li>
                ) : null}
                <li>
                  <HugeiconsIcon
                    icon={featuredClinic.insurance ? Tick02Icon : Cancel01Icon}
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {featuredClinic.insurance
                    ? "Takes insurance"
                    : "Doesn’t take insurance"}
                </li>
                {featuredClinic.note ? (
                  <li>
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {featuredClinic.note}
                  </li>
                ) : null}
              </ul>
              <div className={styles.actions}>
                <AffiliateButton
                  clinic={featuredClinic}
                  placement="trusted_providers_lead"
                  className={shared.buttonPanel}
                >
                  Visit {featuredClinic.name}
                </AffiliateButton>
              </div>
              <p className={styles.leadCode}>
                <span>Code {featured.code}</span>
                {featured.offer}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.directory} aria-labelledby="directory-title">
        <header className={styles.directoryHead}>
          <h2 id="directory-title">Six more I’ve tried</h2>
          <p>
            “Voted best for” is what worked best for me. I’m a patient, not a
            doctor. The prices are what I paid on my orders, and yours can come
            out different.
          </p>
        </header>
        <ul className={styles.rows}>
          {rest.map((item) => {
            const clinic = clinicNamed(item.name);
            return (
              <li key={item.id} id={item.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowKicker}>Voted best for</p>
                  <h3>{item.voted}</h3>
                  <p className={styles.rowName}>
                    <Logo clinic={clinic} />
                    {clinic.name}
                  </p>
                  {item.detail ? (
                    <p className={styles.detail}>{item.detail}</p>
                  ) : null}
                  <blockquote className={styles.quote}>
                    <p>{clinic.quote}</p>
                  </blockquote>
                  <ResourceLinks
                    clinicName={clinic.name}
                    links={item.links}
                    youtube={item.youtube}
                  />
                </div>
                <div className={styles.rowOffer}>
                  {item.product ? (
                    <figure className={styles.rowProduct}>
                      <Image
                        src={item.product.src}
                        alt={item.product.alt}
                        fill
                        sizes="116px"
                        style={
                          item.product.position
                            ? { objectPosition: item.product.position }
                            : undefined
                        }
                      />
                    </figure>
                  ) : null}
                  <div className={styles.rowDeal}>
                    <p>
                      <span className={styles.rowAmount}>
                        ${clinic.monthly}
                      </span>
                      <span className={styles.per}>/mo</span>
                      {clinic.priceNote ? (
                        <span className={styles.priceNote}>
                          {clinic.priceNote}
                        </span>
                      ) : null}
                    </p>
                    <ul className={styles.rowMeta}>
                      <li>
                        <HugeiconsIcon
                          icon={Medicine02Icon}
                          size={16}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {clinic.formulation}
                      </li>
                      <li>
                        <HugeiconsIcon
                          icon={clinic.insurance ? Tick02Icon : Cancel01Icon}
                          size={16}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {clinic.insurance
                          ? "Takes insurance"
                          : "Doesn’t take insurance"}
                      </li>
                      {clinic.note ? (
                        <li>
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={16}
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          {clinic.note}
                        </li>
                      ) : null}
                    </ul>
                    <div className={styles.actions}>
                      <AffiliateButton
                        clinic={clinic}
                        placement="trusted_providers_directory"
                        className={shared.buttonPrimary}
                      >
                        Visit {clinic.name}
                      </AffiliateButton>
                    </div>
                    {item.code ? (
                      <p className={styles.code}>
                        <b>Code {item.code}</b>
                        {item.offer ? <span>{item.offer}</span> : null}
                      </p>
                    ) : item.offer ? (
                      <p className={styles.code}>
                        <b>{item.offer}</b>
                      </p>
                    ) : (
                      <p className={styles.plainDeal}>{item.plainDeal}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className={shared.divider} aria-hidden="true" />

      <section className={styles.related} aria-labelledby="related-title">
        <div className={shared.sectionHead}>
          <h2 id="related-title">Keep reading</h2>
        </div>
        <div className={styles.relatedGrid}>
          {RELATED.map((post) => (
            <PostCard
              key={post.href}
              post={post}
              className={shared.post}
              sizes="(max-width: 960px) 100vw, 400px"
            />
          ))}
        </div>
      </section>

      <section className={styles.close} aria-labelledby="close-title">
        <div className={styles.closePanel}>
          <div>
            <h2 id="close-title">Still lining the prices up?</h2>
            <p>
              The comparison chart includes Midi Health too. Midi doesn’t pay me
              a commission, and I was a patient there as well.
            </p>
          </div>
          <div className={styles.closeActions}>
            <a
              href="/hrt-price-comparison-chart"
              className={shared.buttonPrimary}
            >
              Open the price chart
            </a>
            <a href="/tipstofindprovider" className={shared.buttonText}>
              Tips for choosing
              <Chevron />
            </a>
          </div>
        </div>
      </section>
    </MockupShell>
  );
}
