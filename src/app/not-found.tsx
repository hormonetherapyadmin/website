import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import styles from "./not-found.module.css";

function Paperclip() {
  return (
    <svg
      className={styles.clip}
      viewBox="0 0 56 96"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M34 14c0-6-12-6-12 6v58c0 10 18 10 18-6V26c0-6-10-6-10 6v40c0 6 6 6 6-2V32"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Arrow() {
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

export default function NotFound() {
  return (
    <SiteShell>
      <div className={styles.wrap}>
        <div className={styles.stack} aria-hidden="true">
          <div className={`${styles.sheet} ${styles.back}`} />
          <div className={`${styles.sheet} ${styles.mid}`} />
          <div className={`${styles.sheet} ${styles.front}`}>
            <span className={styles.sticker}>Misplaced</span>
            <span className={styles.num}>404</span>
            <span className={styles.fold} />
          </div>
          <Paperclip />
        </div>

        <div className={styles.copy}>
          <h1 className={styles.heading}>Page not found</h1>
          <p className={styles.lede}>
            I looked, and this page isn&apos;t here. The link may be old, or it
            may have moved. Let&apos;s get you back to something useful.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.button}>
              Back to the homepage
            </Link>
            <Link href="/search" className={styles.textLink}>
              Search the site
              <Arrow />
            </Link>
          </div>
          <p className={styles.quiet}>
            Or browse the <Link href="/sitemap">sitemap</Link>.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
