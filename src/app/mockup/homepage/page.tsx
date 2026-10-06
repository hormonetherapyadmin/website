import type { Metadata } from "next";
import Image from "next/image";
import { Besley, Figtree, Newsreader, Young_Serif } from "next/font/google";
import styles from "./homepage.module.css";
import {
  BubbleChatQuestionIcon,
  ChartBarBigIcon,
  DropletIcon,
  HairDryerIcon,
  Idea01Icon,
  ManIcon,
  Medicine02Icon,
  Moon02Icon,
  ShieldCheckIcon,
  TestTube01Icon,
  UserQuestion01Icon,
  Wallet01Icon,
  WeightScaleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SiteNav, type NavItem } from "./site-nav";
import { Tip } from "./tip";

/*
  Homepage design mockup. Copy, prices, and links are taken from the live
  Wix site (October 2026). Hard-coded data here stands in for the Provider,
  Offer, and Article documents described in docs/CONTENT_MODEL.md. Palettes
  and heading fonts are exploratory options for the brand designer, chosen
  with ?palette= and ?serif= query parameters.
*/

const figtree = Figtree({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-font-body",
});

const besley = Besley({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-serif-besley",
});

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--mock-serif-young",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-serif-newsreader",
  preload: false,
});

const PALETTES = {
  raspberry: {
    label: "Navy & raspberry",
    className: styles.paletteNavyRaspberry,
  },
  navy: { label: "Navy & poppy", className: styles.paletteNavy },
  garden: { label: "Sage & raspberry", className: styles.paletteGarden },
  paper: { label: "Newsprint & marigold", className: styles.palettePaper },
};

const SERIFS = {
  besley: { label: "Besley", className: styles.serifBesley },
  young: { label: "Young Serif", className: styles.serifYoung },
  newsreader: { label: "Newsreader", className: styles.serifNewsreader },
};

type PaletteKey = keyof typeof PALETTES;
type SerifKey = keyof typeof SERIFS;

export const metadata: Metadata = {
  title: "Homepage mockup",
  robots: { index: false, follow: false },
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";
const DISCLOSURE_HREF = "/affiliate-disclosure";

type Clinic = {
  name: string;
  monthly: number;
  priceNote?: string;
  bestFor: string;
  quote: string;
  insurance: boolean;
  formulation: string;
  note?: string;
  reviewHref: string;
  logo?: string;
  monogram: string;
  isAffiliate: boolean;
  topPick?: boolean;
  offer?: string;
};

const CLINICS: Clinic[] = [
  {
    name: "Inner Balance",
    monthly: 150,
    priceNote: "Average over the first year",
    bestFor: "Better sleep",
    quote:
      "Finding a product that treats my symptoms of menopause and helps with sleep was a clear winner for me.",
    insurance: false,
    formulation: "Oestra vaginal cream",
    note: "Free consults as needed.",
    reviewHref: "/inner-balance",
    logo: "/mockup/logos/inner-balance.png",
    monogram: "IB",
    isAffiliate: true,
    topPick: true,
  },
  {
    name: "Winona",
    monthly: 89,
    bestFor: "Creams, no appointment",
    quote:
      "I received my first order within 5 days of placing order for the HRT products my clinician recommended.",
    insurance: false,
    formulation: "Topical cream",
    note: "No consult required.",
    reviewHref: "/winona-review-page",
    logo: "/mockup/logos/winona.png",
    monogram: "W",
    isAffiliate: true,
  },
  {
    name: "Musely",
    monthly: 46,
    bestFor: "First-timers",
    quote:
      "Bi-Est is considered a gentler form of HRT & a good product for newbies or those who have reservations about HRT.",
    insurance: false,
    formulation: "Topical Bi-Est cream",
    reviewHref: "/musely",
    logo: "/mockup/logos/musely.png",
    monogram: "M",
    isAffiliate: true,
  },
  {
    name: "Alloy",
    monthly: 75,
    bestFor: "A simple patch + pill start",
    quote:
      "I would describe my experience with Alloy as a pleasant straight-forward experience.",
    insurance: false,
    formulation: "Patch + pills",
    note: "No consult required.",
    reviewHref: "/alloy-review-page",
    logo: "/mockup/logos/alloy.png",
    monogram: "A",
    isAffiliate: true,
  },
  {
    name: "Joi Women’s Wellness",
    monthly: 233,
    bestFor: "Labs and real 1:1 time",
    quote:
      "My 1:1’s were very thorough and I learned something new each time I met with a Joi Clinician.",
    insurance: false,
    formulation: "Patch + pills",
    note: "$150 labs required up front, includes a 30-minute consult.",
    reviewHref: "/joiwommenswellness",
    monogram: "J+",
    isAffiliate: true,
    offer: "BRONSON: 50% off labs",
  },
  {
    name: "Effecty",
    monthly: 140,
    bestFor: "No hidden fees",
    quote:
      "I can share with you first hand, they are not kidding when they say no hidden fees.",
    insurance: false,
    formulation: "Patch + pills",
    note: "Consult optional, at no cost.",
    reviewHref: "/post/effecty-hormone-replacement-therapy-review",
    logo: "/mockup/logos/effecty.png",
    monogram: "E",
    isAffiliate: true,
  },
  {
    name: "MyMenopauseRx",
    monthly: 39,
    priceNote: "+ $99 one-time consult",
    bestFor: "Using your insurance",
    quote:
      "If you are one who knows you want to use your medical and prescription insurance to start or start-over on HRT, then I highly recommend [MyMenopauseRx].",
    insurance: true,
    formulation: "Patch + pills",
    note: "20-minute consultation included.",
    reviewHref: "/mymenopauserx",
    logo: "/mockup/logos/mymenopauserx.png",
    monogram: "MR",
    isAffiliate: true,
  },
  {
    name: "Midi Health",
    monthly: 39,
    priceNote: "+ $250 one-time consult",
    bestFor: "A next-day appointment",
    quote:
      "When I was a new client of Midi Health, I was able to get an appointment the very next business day.",
    insurance: true,
    formulation: "Patch + pills",
    note: "30-minute consultation included.",
    reviewHref: "/midi-health-review-page",
    logo: "/mockup/logos/midi.png",
    monogram: "M",
    isAffiliate: false,
  },
];

const BENEFITS = [
  { label: "Lose weight", href: "/copy-of-weight-gain" },
  { label: "Enhance mood and mental clarity", href: "/ishrtforme" },
  {
    label: "Diminish hot flashes/night sweats",
    href: "/post/why-do-i-wake-up-hot-and-sweaty",
  },
  // No energy-specific page exists on the live site yet.
  { label: "Boost energy", href: "/ishrtforme" },
  { label: "Improve sleep", href: "/sleep" },
];

const NAV: NavItem[] = [
  {
    label: "HRT 101",
    columns: [
      {
        links: [
          { label: "Is HRT for me?", href: "/ishrtforme", icon: UserQuestion01Icon },
          { label: "Formulations", href: "/formuations", icon: Medicine02Icon },
          {
            label: "Cost & insurance",
            href: "/costandinsurance",
            icon: Wallet01Icon,
          },
          {
            label: "Test kits",
            href: "/trackersandtesting",
            icon: TestTube01Icon,
          },
          { label: "Men’s HRT", href: "/men-s-hrt", icon: ManIcon },
          { label: "FAQ", href: "/faq", icon: BubbleChatQuestionIcon },
        ],
      },
    ],
  },
  {
    label: "Symptoms",
    columns: [
      {
        links: [
          {
            label: "Weight & HRT",
            href: "/copy-of-weight-gain",
            icon: WeightScaleIcon,
          },
          { label: "Sleep", href: "/sleep", icon: Moon02Icon },
          { label: "Hair loss", href: "/hair-loss", icon: HairDryerIcon },
          { label: "Rx face creams", href: "/skincare", icon: DropletIcon },
        ],
      },
    ],
  },
  {
    label: "Providers",
    columns: [
      {
        heading: "Compare & choose",
        links: [
          {
            label: "Price comparison chart",
            href: "/hrt-price-comparison-chart",
            icon: ChartBarBigIcon,
          },
          {
            label: "Tips to find a provider",
            href: "/tipstofindprovider",
            icon: Idea01Icon,
          },
          {
            label: "Trusted providers",
            href: "/copy-of-trusted-providers",
            icon: ShieldCheckIcon,
          },
        ],
      },
      {
        heading: "My reviews",
        links: CLINICS.map((clinic) => ({
          label: clinic.name,
          href: clinic.reviewHref,
          logo: clinic.logo,
          monogram: clinic.monogram,
        })),
      },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

function affiliateLinkProps(clinic: Clinic) {
  return {
    href: "#affiliate-link",
    target: "_blank",
    rel: AFFILIATE_REL,
    "data-provider": clinic.name,
    "data-placement": "homepage_comparison",
  };
}

function ClinicLogo({ clinic }: { clinic: Clinic }) {
  return clinic.logo ? (
    <Image src={clinic.logo} alt="" width={44} height={44} />
  ) : (
    <span className={styles.monogram} aria-hidden="true">
      {clinic.monogram}
    </span>
  );
}

const SMALL_ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function ChevronRightIcon() {
  return (
    <svg {...SMALL_ICON_PROPS} width={16} height={16} strokeWidth={2.5}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...SMALL_ICON_PROPS} width={18} height={18}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function TestedIcon() {
  return (
    <svg {...SMALL_ICON_PROPS} className={styles.testedIcon}>
      <path
        d="M12 2l2.17 1.89 2.83-.55.94 2.72 2.72.94-.55 2.83L22 12l-1.89 2.17.55 2.83-2.72.94-.94 2.72-2.83-.55L12 22l-2.17-1.89-2.83.55-.94-2.72-2.72-.94.55-2.83L2 12l1.89-2.17-.55-2.83 2.72-.94.94-2.72 2.83.55z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" stroke="#fff" />
    </svg>
  );
}

function InsuranceYesIcon() {
  return (
    <svg {...SMALL_ICON_PROPS} className={styles.insYes}>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <path d="M7.5 12.3l3 3 6-6.3" stroke="#fff" />
    </svg>
  );
}

function InsuranceNoIcon() {
  return (
    <svg {...SMALL_ICON_PROPS} className={styles.insNo}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </svg>
  );
}

const MAX_MONTHLY = Math.max(...CLINICS.map((clinic) => clinic.monthly));

type Post = {
  title: string;
  excerpt?: string;
  date: string;
  read: string;
  href: string;
  image: string;
  kind?: string;
};

const LATEST: Post[] = [
  {
    title: "HRT & Skin Before and After: My Experience",
    excerpt:
      "HRT wasn’t the only major change I made during this period, but it was definitely the catalyst.",
    date: "Sep 29, 2026",
    read: "5 min",
    href: "/post/hrt-skin-before-and-after-my-12-month-results-and-experience",
    image: "/mockup/posts/skin.jpg",
    kind: "My experience",
  },
  {
    title:
      "Alloy vs. Musely (2026): Estrogen Creams, Patches & Tablets Compared",
    excerpt:
      "Finding the right approach comes down to balancing your personal health history, baseline risk factors, and everyday lifestyle.",
    date: "Sep 22, 2026",
    read: "6 min",
    href: "/post/alloy-vs-musely-estrogen-creams-patches-tablets-compared",
    image: "/mockup/posts/alloy-vs-musely.jpg",
    kind: "Comparison",
  },
  {
    title: "Musely Sleep Well Cream Review & Ingredients",
    excerpt:
      "We all have different bodies, medical needs, and comfort levels when it comes to sleep aids.",
    date: "Sep 12, 2026",
    read: "8 min",
    href: "/post/musely-sleep-well-cream-review-ingredients-fix-menopause-sleep",
    image: "/mockup/posts/sleep-well.jpg",
    kind: "Review",
  },
  {
    title: "Oestra by Inner Balance: My 1-Year Results & What to Expect",
    excerpt:
      "On the 2nd night of using Oestra, I felt myself getting very sleepy 30 minutes after applying my dose.",
    date: "Sep 8, 2026",
    read: "6 min",
    href: "/post/oestra-by-inner-balance-my-honest-1-year-review",
    image: "/mockup/posts/oestra.jpg",
    kind: "Review",
  },
  {
    title: "Musely Estrogen Cream Review: A Gentle HRT Option",
    excerpt:
      "As I creep up on turning 60 in less than six months, I’ve found myself taking a closer look at my daily wellness routine.",
    date: "Sep 4, 2026",
    read: "6 min",
    href: "/post/musely-estrogen-cream-review-a-safer-gentler-hrt-alternative",
    image: "/mockup/posts/musely-cream.jpg",
    kind: "Review",
  },
];

const START_HERE = [
  {
    question: "Is HRT for me?",
    forWho: "Brand new to this",
    detail:
      "Perimenopause, menopause, and whether hormone therapy is worth asking about.",
    href: "/ishrtforme",
    icon: UserQuestion01Icon,
    tone: styles.pick1,
  },
  {
    question: "Providers",
    forWho: "Ready to pick a clinic",
    detail:
      "What are the important features when looking for an online provider?",
    href: "/tipstofindprovider",
    icon: Idea01Icon,
    tone: styles.pick2,
  },
  {
    question: "Formulations",
    forWho: "Weighing your options",
    detail:
      "What formulations are available, and how will my doctor personalize my meds for me?",
    href: "/formuations",
    icon: Medicine02Icon,
    tone: styles.pick3,
  },
  {
    question: "Cost & insurance",
    forWho: "Watching the budget",
    detail:
      "Will my therapy be covered by my insurance, and can I use my HSA card?",
    href: "/costandinsurance",
    icon: Wallet01Icon,
    tone: styles.pick4,
  },
];

// Existing topic pages on the live site.
const TOPICS = [
  { label: "Getting started", href: "/ishrtforme" },
  { label: "Providers", href: "/tipstofindprovider" },
  { label: "Formulations", href: "/formuations" },
  { label: "Cost & insurance", href: "/costandinsurance" },
  { label: "Weight & HRT", href: "/copy-of-weight-gain" },
  { label: "Sleep", href: "/sleep" },
  { label: "Hair loss", href: "/hair-loss" },
  { label: "Face creams", href: "/skincare" },
];

function PostCard({ post, lead }: { post: Post; lead: boolean }) {
  return (
    <article className={lead ? styles.leadPost : styles.post}>
      <div className={styles.postImage}>
        <Image
          src={post.image}
          alt=""
          fill
          sizes={
            lead
              ? "(max-width: 960px) 100vw, 560px"
              : "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px"
          }
        />
      </div>
      <p className={styles.postMeta}>
        {post.kind && <span className={styles.postKind}>{post.kind}</span>}{" "}
        <time>{post.date}</time> · {post.read} read
      </p>
      <h3>
        <a href={post.href}>{post.title}</a>
      </h3>
      {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
    </article>
  );
}

function pick<T extends string>(
  value: unknown,
  options: Record<T, unknown>,
  fallback: T,
): T {
  return typeof value === "string" && value in options
    ? (value as T)
    : fallback;
}

export default async function HomepageMockup(
  props: PageProps<"/mockup/homepage">,
) {
  const searchParams = await props.searchParams;
  const palette = pick<PaletteKey>(searchParams.palette, PALETTES, "raspberry");
  const serif = pick<SerifKey>(searchParams.serif, SERIFS, "besley");

  const pageClass = [
    styles.page,
    PALETTES[palette].className,
    SERIFS[serif].className,
    figtree.variable,
    besley.variable,
    youngSerif.variable,
    newsreader.variable,
  ].join(" ");

  return (
    <div className={pageClass}>
      <header className={styles.header}>
        <a href="#" className={styles.wordmark}>
          Hormone Therapy Hub
        </a>
        <SiteNav items={NAV} />
        <form role="search" action="/search" className={styles.search}>
          <label htmlFor="site-search" className={styles.srOnly}>
            Search the site
          </label>
          <SearchIcon />
          <input
            id="site-search"
            type="search"
            name="q"
            placeholder="Search"
          />
        </form>
      </header>

      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroText}>
          <h1 id="hero-title" className={styles.heroKicker}>
            Hormone Therapy Replacement
          </h1>
          <p className={styles.heroTitle}>Feel like you again.</p>
          <ul className={styles.benefits}>
            {BENEFITS.map((benefit) => (
              <li key={benefit.label}>
                <a href={benefit.href}>{benefit.label}</a>
              </li>
            ))}
          </ul>
          <p className={styles.heroDek}>
            My goal is to share honest platform reviews, pricing breakdowns, and
            practical patient insights so you can have more informed, confident
            conversations with your own prescribing doctor.
          </p>
          <div className={styles.heroActions}>
            <a href="#compare" className={styles.buttonPrimary}>
              See what each clinic cost me
            </a>
            <a href="/ishrtforme" className={styles.buttonText}>
              New to HRT? Start here
            </a>
          </div>
          <ul className={styles.facts} aria-label="About this site">
            {[
              "Patient since 2019",
              "9+ telehealth platforms tested",
              "Independent & self-funded",
            ].map((fact) => (
              <li key={fact}>
                <svg
                  className={styles.check}
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="10" />
                  <path d="M5.5 10.5l3 3 6-6.5" />
                </svg>
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.heroFigure}>
          <div className={styles.heroPhoto}>
            <Image
              src="/mockup/peggy-portrait.jpg"
              alt="Peggy, smiling, in a dark sweater"
              width={1389}
              height={1600}
              sizes="(min-width: 960px) 520px, 90vw"
              preload
            />
            <span className={styles.bubble} aria-hidden="true">
              Hi, I’m Peggy!
            </span>
          </div>
          <figcaption>
            An experienced HRT patient reviewer. Not a doctor.
          </figcaption>
        </figure>
      </section>

      <div className={styles.divider} aria-hidden="true" />

      {/* Where should I start? */}
      <section className={styles.start} aria-labelledby="start-title">
        <h2 id="start-title">Where should I start?</h2>
        <ul className={styles.questions}>
          {START_HERE.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={item.tone}>
                <span className={styles.questionIcon}>
                  <HugeiconsIcon
                    icon={item.icon}
                    size={28}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <span className={styles.forWho}>{item.forWho}</span>
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.questionDetail}>{item.detail}</span>
                <span className={styles.questionCta} aria-hidden="true">
                  Start here
                  <ChevronRightIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent writing */}
      <section className={styles.recent} aria-labelledby="recent-title">
        <div className={styles.sectionHead}>
          <h2 id="recent-title">Latest reviews and posts</h2>
          <a href="/blog" className={styles.headLink}>
            All posts
          </a>
        </div>
        <div className={styles.recentGrid}>
          {LATEST.map((post, index) => (
            <PostCard key={post.href} post={post} lead={index === 0} />
          ))}
        </div>
        <nav className={styles.topics} aria-label="Browse by topic">
          <span>Browse by topic:</span>
          {TOPICS.map((topic) => (
            <a key={topic.href} href={topic.href}>
              {topic.label}
            </a>
          ))}
        </nav>
      </section>

      {/* Comparison */}
      <section
        id="compare"
        className={styles.ledgerSection}
        aria-labelledby="compare-title"
      >
        <div className={styles.ledgerHead}>
          <h2 id="compare-title">What eight online clinics charged me</h2>
          <p>
            I paid out of pocket with my HSA card, or through my prescription
            insurance when I could. These are my real costs, not list prices.
            Yours may differ.
          </p>
          <a href={DISCLOSURE_HREF} className={styles.disclosureLink}>
            Affiliate disclosure
          </a>
        </div>

        <p className={styles.scrollHint} aria-hidden="true">
          Swipe to see more →
        </p>
        <div
          className={styles.ledgerWrap}
          role="region"
          aria-labelledby="compare-title"
          tabIndex={0}
        >
          <table className={styles.ledger}>
            <caption className={styles.srOnly}>
              What each clinic is best for, monthly cost, insurance, typical
              formulation, and Peggy’s notes for eight online HRT clinics
            </caption>
            <thead>
              <tr>
                <th scope="col">Clinic</th>
                <th scope="col">Best for</th>
                <th scope="col">
                  What I paid per month
                  <span className={styles.thNote}>Checked Sep 9, 2026</span>
                </th>
                <th scope="col" className={styles.center}>
                  Insurance
                </th>
                <th scope="col">Typically prescribed</th>
                <th scope="col">In my words</th>
              </tr>
            </thead>
            <tbody>
              {CLINICS.map((clinic) => (
                <tr
                  key={clinic.name}
                  className={clinic.topPick ? styles.topRow : undefined}
                >
                  <th scope="row">
                    <span className={styles.clinic}>
                      <span className={styles.logoWrap}>
                        {clinic.isAffiliate ? (
                          <a
                            {...affiliateLinkProps(clinic)}
                            className={styles.logoTile}
                            tabIndex={-1}
                            aria-hidden="true"
                          >
                            <ClinicLogo clinic={clinic} />
                          </a>
                        ) : (
                          <span className={styles.logoTile}>
                            <ClinicLogo clinic={clinic} />
                          </span>
                        )}
                        <span className={styles.testedSeal}>
                          <Tip label="Tested by Peggy. I was a patient here.">
                            <TestedIcon />
                          </Tip>
                        </span>
                      </span>
                      <span>
                        {clinic.isAffiliate ? (
                          <a
                            {...affiliateLinkProps(clinic)}
                            className={styles.clinicName}
                          >
                            {clinic.name}
                            <span className={styles.srOnly}>
                              {" "}
                              (affiliate link, opens in a new tab)
                            </span>
                          </a>
                        ) : (
                          <span className={styles.clinicName}>
                            {clinic.name}
                          </span>
                        )}
                        {clinic.topPick && (
                          <span className={styles.topBadge}>
                            ★ My 2026 top choice
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <td>
                    <span className={styles.bestFor}>{clinic.bestFor}</span>
                  </td>
                  <td className={styles.priceCell}>
                    <span className={styles.price}>${clinic.monthly}</span>
                    <span className={styles.perMonth}>/mo</span>
                    <span className={styles.bar} aria-hidden="true">
                      <span
                        className={styles.barFill}
                        style={{
                          width: `${(clinic.monthly / MAX_MONTHLY) * 100}%`,
                        }}
                      />
                    </span>
                    {clinic.priceNote && (
                      <span className={styles.priceNote}>
                        {clinic.priceNote}
                      </span>
                    )}
                  </td>
                  <td className={styles.center}>
                    <Tip
                      label={
                        clinic.insurance
                          ? "Takes insurance"
                          : "Doesn’t take insurance"
                      }
                    >
                      {clinic.insurance ? (
                        <InsuranceYesIcon />
                      ) : (
                        <InsuranceNoIcon />
                      )}
                    </Tip>
                  </td>
                  <td className={styles.formulation}>{clinic.formulation}</td>
                  <td className={styles.noteCell}>
                    <q className={styles.quote}>{clinic.quote}</q>
                    {clinic.note && (
                      <span className={styles.note}>{clinic.note}</span>
                    )}
                    {clinic.offer && (
                      <span className={styles.offer}>Code {clinic.offer}</span>
                    )}
                    <a href={clinic.reviewHref} className={styles.reviewLink}>
                      Read review
                      <span className={styles.srOnly}> of {clinic.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* Peggy's take on her current regimen */}
      <section className={styles.take} aria-labelledby="take-title">
        <div className={styles.takeInner}>
          <h2 id="take-title" className={styles.takeLabel}>
            Peggy’s take: what I’m using now
          </h2>
          <blockquote className={styles.takeQuote}>
            <p>
              No night sweats, hot flashes or brain fog, and the one big
              difference I notice with Oestra is my sleep. I go to sleep faster
              and stay asleep longer on this HRT, more so than any of the
              others.
            </p>
          </blockquote>
          <div className={styles.takeDetails}>
            <div className={styles.takeBrand}>
              <span className={styles.logoTile}>
                <Image
                  src="/mockup/logos/inner-balance.png"
                  alt=""
                  width={56}
                  height={56}
                />
              </span>
              Oestra by Inner Balance
            </div>
            <p>
              I only need the one product, where with other HRT regimens I was
              prescribed two or three. It’s $199 a month for the first six
              months, then $99 a month from month seven.
            </p>
            <p className={styles.takeCaveat}>
              This is my personal experience, not medical advice.
            </p>
            <div className={styles.takeActions}>
              <a
                href="/post/oestra-by-inner-balance-my-honest-1-year-review"
                className={styles.buttonPanel}
              >
                Read my 1-year Oestra review
              </a>
              <a
                href="#affiliate-link"
                target="_blank"
                rel={AFFILIATE_REL}
                className={styles.buttonTextPanel}
                data-provider="Inner Balance"
                data-placement="homepage_peggys_take"
              >
                Visit Inner Balance
                <span className={styles.srOnly}>
                  {" "}
                  (affiliate link, opens in a new tab)
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Peggy's story */}
      <section className={styles.story} aria-labelledby="story-title">
        <header className={styles.storyHead}>
          <p className={styles.storyLabel}>My hormone replacement story</p>
          <h2 id="story-title" className={styles.storyTitle}>
            Menopause isn’t a dirty word.
          </h2>
          <p className={styles.storyLead}>
            I’ll say that again: menopause isn’t something to be ashamed of, or
            a subject you should feel embarrassed to talk about.
          </p>
        </header>
        <div className={styles.storyGrid}>
          <figure className={styles.storyFigure}>
            <Image
              src="/mockup/peggy-winston.jpg"
              alt="Peggy on a wooded trail holding her Bernedoodle puppy, Winston"
              fill
              sizes="(max-width: 960px) 100vw, 560px"
            />
            <figcaption>Me and Winston, my Bernedoodle.</figcaption>
          </figure>
          <div className={styles.storyText}>
            <div className={styles.storyBody}>
              <p>
                I’m your typical late-50’s woman. I love Jesus! I’m married, I
                have three grown children, three grandchildren, and my full-time
                gig is in the banking industry.
              </p>
              <p>
                Since beginning my personal hormone replacement therapy journey
                under the care of a medical provider in 2019, I’ve experienced
                firsthand how overwhelming it can be to navigate menopause care,
                changing symptoms, and treatment options. To find what worked
                for my body, I’ve <strong>personally tested</strong> and
                evaluated more than 9 different HRT telehealth providers,
                including platforms like Winona, Midi Health, Alloy, Inner
                Balance, Musely, MyMenopauseRx, Effecty, a traditional OB/GYN
                and Joi Women’s Wellness.
              </p>
              <p>
                Over years of patient experience, I’ve tracked everything from
                virtual consultation quality and out-of-pocket pricing,
                insurance coverage and shipping reliability across patches,
                topical creams, troches, injections and oral options.{" "}
                <a href="/blog">See my HRT Reviews.</a>
              </p>
            </div>
            <p className={styles.signoff}>
              I created HormoneTherapyHub to offer transparent, real-world
              consumer telemetry from a fellow patient’s perspective.
            </p>
            <p className={styles.storyNote}>
              I am not a medical professional, and this site does not provide
              medical advice or treatment plans.
            </p>
            <a href="/about" className={styles.buttonPrimary}>
              Read my whole story
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <p className={styles.footerWordmark}>Hormone Therapy Hub</p>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#">How I review</a>
            </li>
            <li>
              <a href={DISCLOSURE_HREF}>Affiliate disclosure</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/about">About Peggy</a>
            </li>
            <li>
              <a href="mailto:hormonetherapyhub@gmail.com">
                hormonetherapyhub@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <p className={styles.footerFine}>
          I am not a medical professional, and this site does not provide
          medical advice or treatment plans. Talk with your own prescribing
          clinician before starting, stopping, or changing any treatment. Some
          links are affiliate links. Columbus, Ohio.
        </p>
        <nav aria-label="Mockup options" className={styles.explorer}>
          <span className={styles.explorerGroup}>
            <span>Palette:</span>
            {(Object.keys(PALETTES) as PaletteKey[]).map((key) => (
              <a
                key={key}
                href={`?palette=${key}&serif=${serif}`}
                aria-current={key === palette ? "true" : undefined}
              >
                {PALETTES[key].label}
              </a>
            ))}
          </span>
          <span className={styles.explorerGroup}>
            <span>Headings:</span>
            {(Object.keys(SERIFS) as SerifKey[]).map((key) => (
              <a
                key={key}
                href={`?palette=${palette}&serif=${key}`}
                aria-current={key === serif ? "true" : undefined}
              >
                {SERIFS[key].label}
              </a>
            ))}
          </span>
        </nav>
      </footer>
    </div>
  );
}
