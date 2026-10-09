"use client";

import {
  Facebook02Icon,
  Link02Icon,
  Linkedin02Icon,
  NewTwitterIcon,
  PrinterIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import styles from "./blog.module.css";

/*
  Same share actions as the live Wix post: Facebook, X, LinkedIn, copy
  link, and print. Destinations use the article's public URL.
*/

const ARTICLE_URL =
  "https://www.hormonetherapyhub.com/post/hrt-skin-before-and-after-my-12-month-results-and-experience";
const ARTICLE_TITLE = "HRT & Skin Before and After: My Experience";

function networks(articleUrl: string, articleTitle: string) {
  const url = encodeURIComponent(articleUrl);
  const title = encodeURIComponent(articleTitle);
  return [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      icon: Facebook02Icon,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      icon: NewTwitterIcon,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      icon: Linkedin02Icon,
    },
  ];
}

function ShareIcon({ icon }: { icon: IconSvgElement }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={18}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

export function Share({
  url = ARTICLE_URL,
  title = ARTICLE_TITLE,
}: {
  url?: string;
  title?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-labelledby="share-title" className={styles.shareRow}>
      <h2 id="share-title" className={styles.railHeading}>
        Share
      </h2>
      <ul className={styles.shareList}>
        {networks(url, title).map((network) => (
          <li key={network.label}>
            <a
              href={network.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${network.label} (opens in a new tab)`}
            >
              <ShareIcon icon={network.icon} />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copyLink}
            className={copied ? styles.shareCopied : undefined}
            aria-label={copied ? "Link copied" : "Copy link"}
          >
            <ShareIcon icon={copied ? Tick02Icon : Link02Icon} />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print"
          >
            <ShareIcon icon={PrinterIcon} />
          </button>
        </li>
      </ul>
      <p className={styles.srOnly} aria-live="polite">
        {copied ? "Link copied" : ""}
      </p>
    </section>
  );
}
