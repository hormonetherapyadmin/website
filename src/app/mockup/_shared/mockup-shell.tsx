import type { ReactNode } from "react";
import { Besley, Figtree, Newsreader, Young_Serif } from "next/font/google";
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
import styles from "./mockup.module.css";
import { CLINICS } from "./clinics";
import { SiteNav, type NavItem, type NavLink } from "./site-nav";

/*
  Header, footer, and option switcher shared by the design mockups.
  Palettes and heading fonts are exploratory options for the brand
  designer, chosen with ?palette= and ?serif= query parameters.
*/

export const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";
export const DISCLOSURE_HREF = "/affiliate-disclosures";

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
type SearchParams = Record<string, string | string[] | undefined>;

function pick<T extends string>(
  value: unknown,
  options: Record<T, unknown>,
  fallback: T,
): T {
  return typeof value === "string" && value in options
    ? (value as T)
    : fallback;
}

const HRT_101_LINKS: NavLink[] = [
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
];

const SYMPTOM_LINKS: NavLink[] = [
  {
    label: "Weight & HRT",
    href: "/copy-of-weight-gain",
    icon: WeightScaleIcon,
  },
  { label: "Sleep", href: "/sleep", icon: Moon02Icon },
  { label: "Hair loss", href: "/hair-loss", icon: HairDryerIcon },
  { label: "Rx face creams", href: "/skincare", icon: DropletIcon },
];

const COMPARE_LINKS: NavLink[] = [
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
    href: "/mockup/trusted-providers",
    icon: ShieldCheckIcon,
  },
];

const FOOTER_COLUMNS = [
  { heading: "HRT 101", links: HRT_101_LINKS },
  { heading: "Symptoms", links: SYMPTOM_LINKS },
  { heading: "Providers", links: COMPARE_LINKS },
  {
    heading: "About",
    links: [
      { label: "About Peggy", href: "/about" },
      { label: "How I review", href: "#" },
      { label: "Affiliate disclosure", href: DISCLOSURE_HREF },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const NAV: NavItem[] = [
  {
    label: "HRT 101",
    columns: [
      {
        links: HRT_101_LINKS,
      },
    ],
  },
  {
    label: "Symptoms",
    columns: [
      {
        links: SYMPTOM_LINKS,
      },
    ],
  },
  {
    label: "Providers",
    columns: [
      {
        heading: "Compare & choose",
        links: COMPARE_LINKS,
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

function SearchIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function MockupShell({
  searchParams,
  children,
}: {
  searchParams: SearchParams;
  children: ReactNode;
}) {
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
    <div className={pageClass} data-palette={palette}>
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
          <input id="site-search" type="search" name="q" placeholder="Search" />
        </form>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <p className={styles.footerWordmark}>Hormone Therapy Hub</p>
              <p className={styles.footerTagline}>
                An experienced HRT patient reviewer. Not a doctor.
              </p>
              <a
                href="mailto:hormonetherapyhub@gmail.com"
                className={styles.footerEmail}
              >
                hormonetherapyhub@gmail.com
              </a>
            </div>
            <nav aria-label="Footer" className={styles.footerNav}>
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.heading}>
                  <h2 className={styles.footerHeading}>{column.heading}</h2>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <p className={styles.footerFine}>
            I am not a medical professional, and this site does not provide
            medical advice or treatment plans. Talk with your own prescribing
            clinician before starting, stopping, or changing any treatment. Some
            links are affiliate links.
          </p>
          <div className={styles.footerBottom}>
            <p>© 2026 Hormone Therapy Hub · Columbus, Ohio</p>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
