import type { ReactNode } from "react";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Besley, Figtree, Newsreader, Young_Serif } from "next/font/google";
import { loadSiteNavigation } from "@/lib/navigation";
import styles from "./mockup.module.css";
import { FALLBACK_FOOTER, FALLBACK_NAV } from "./nav-fallback";
import { SiteNav } from "./site-nav";

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

export async function MockupShell({
  searchParams,
  children,
}: {
  searchParams: SearchParams;
  children: ReactNode;
}) {
  const published = await loadSiteNavigation();
  const main = published ? published.main : FALLBACK_NAV;
  const footer = published ? published.footer : FALLBACK_FOOTER;
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
        <SiteNav items={main} />
        <div className={styles.headerActions}>
          <a href="/search" className={styles.searchLink} aria-label="Search">
            <SearchIcon />
          </a>
          <a href="/mockup/trusted-providers" className={styles.headerCta}>
            <HugeiconsIcon
              icon={ShieldCheckIcon}
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Trusted providers
          </a>
        </div>
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
              {footer.map((column) => (
                <div key={column.heading}>
                  <h2 className={styles.footerHeading}>{column.heading}</h2>
                  <ul>
                    {column.links.map((link) => (
                      <li key={`${link.href}:${link.label}`}>
                        <a
                          href={link.href}
                          target={link.newTab ? "_blank" : undefined}
                          rel={link.newTab ? "noopener noreferrer" : undefined}
                        >
                          {link.label}
                        </a>
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
