import type { ReactNode } from "react";
import { Figtree } from "next/font/google";
import Link from "next/link";
import styles from "@/app/mockup/_shared/mockup.module.css";
import {
  FALLBACK_FOOTER,
  FALLBACK_HEADER_BUTTON,
  FALLBACK_NAV,
} from "@/app/mockup/_shared/nav-fallback";
import { HeaderCta, SiteNav } from "@/app/mockup/_shared/site-nav";
import { loadSiteNavigation } from "@/lib/navigation";
import { DISCLOSURE_HREF, HOW_I_REVIEW_HREF, SITE_NAME } from "@/lib/site";

const figtree = Figtree({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-font-body",
});

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

/**
 * The header and footer around every page. `className` sets the palette
 * and the heading font.
 */
export async function SiteFrame({
  className,
  palette,
  children,
}: {
  className: string;
  palette: string;
  children: ReactNode;
}) {
  const published = await loadSiteNavigation();
  const main = published ? published.main : FALLBACK_NAV;
  const footer = published ? published.footer : FALLBACK_FOOTER;
  const headerButton = published ? published.button : FALLBACK_HEADER_BUTTON;

  return (
    <div
      className={`${styles.page} ${figtree.variable} ${className}`}
      data-palette={palette}
    >
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          {SITE_NAME}
        </Link>
        <SiteNav items={main} />
        <div className={styles.headerActions}>
          <Link
            href="/search"
            className={styles.searchLink}
            aria-label="Search"
          >
            <SearchIcon />
          </Link>
          {headerButton ? <HeaderCta link={headerButton} /> : null}
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <p className={styles.footerWordmark}>{SITE_NAME}</p>
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
            <nav aria-label="Site information" className={styles.footerMeta}>
              <Link href="/sitemap">Sitemap</Link>
              <Link href={HOW_I_REVIEW_HREF}>How I review</Link>
              <Link href={DISCLOSURE_HREF}>Affiliate disclosure</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
