"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { youtubeEmbedUrl, youtubeVideo } from "@/lib/youtube";
import styles from "./video-link.module.css";

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#ff0000"
        d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81z"
      />
      <path fill="#ffffff" d="M9.55 15.57V8.43L15.82 12z" />
    </svg>
  );
}

/**
 * A link to a YouTube video that plays it in a modal. The page HTML
 * keeps the plain YouTube link, so a modified click, a middle click, or
 * a browser without JavaScript opens YouTube in a new tab. The player
 * loads only after the click.
 */
export function VideoLink({
  href,
  title,
  brand,
  className,
  children,
}: {
  href: string;
  /** The modal heading, such as "My review on". The brand follows it. */
  title: string;
  brand?: { name: string; logo?: string };
  className?: string;
  children: ReactNode;
}) {
  const video = youtubeVideo(href);
  const name = brand ? `${title} ${brand.name}` : title;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !video ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-haspopup={video ? "dialog" : undefined}
        onClick={onClick}
      >
        {children}
      </a>
      {open && video
        ? createPortal(
            <dialog
              ref={dialogRef}
              className={styles.dialog}
              aria-labelledby={titleId}
              onClose={onClose}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  event.currentTarget.close();
                }
              }}
            >
              <div className={styles.panel}>
                <div className={styles.bar}>
                  <p id={titleId} className={styles.title}>
                    {brand ? (
                      <>
                        <span className={styles.lead}>{title}</span>{" "}
                        {brand.logo ? (
                          <span className={styles.logo}>
                            <Image
                              src={brand.logo}
                              alt=""
                              width={32}
                              height={32}
                            />
                          </span>
                        ) : null}
                        <span>{brand.name}</span>
                      </>
                    ) : (
                      <span>{title}</span>
                    )}
                  </p>
                  <button
                    type="button"
                    className={styles.close}
                    onClick={() => dialogRef.current?.close()}
                  >
                    <CloseIcon />
                    <span className="sr-only">Close video</span>
                  </button>
                </div>
                <div className={styles.frame}>
                  <iframe
                    src={youtubeEmbedUrl(video)}
                    title={name}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <a
                  className={styles.source}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeLogo />
                  Watch on YouTube
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
