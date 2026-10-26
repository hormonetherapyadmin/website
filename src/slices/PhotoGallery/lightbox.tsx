"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AFFILIATE_REL, isAffiliateUrl } from "@/lib/affiliate-link";
import styles from "./photo-gallery.module.css";

export type GalleryShot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  line?: string;
  href?: string;
  linkLabel?: string;
  /** Opens the link in a new tab. Affiliate addresses do this either way. */
  blank?: boolean;
};

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

function ShotLink({ shot }: { shot: GalleryShot }) {
  if (!shot.href || !shot.linkLabel) return null;
  const affiliate = isAffiliateUrl(shot.href);
  const blank = shot.blank || affiliate;

  return (
    <a
      className={styles.source}
      href={shot.href}
      target={blank ? "_blank" : undefined}
      rel={
        affiliate ? AFFILIATE_REL : blank ? "noopener noreferrer" : undefined
      }
    >
      {shot.linkLabel}
      {blank ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

/** One photo. Clicking it opens the large frame. */
export function PhotoButton({ shot }: { shot: GalleryShot }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const label = shot.caption.trim() || "photo";

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  function onClose() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.shot}
        aria-haspopup="dialog"
        aria-label={`Enlarge ${label}`}
        onClick={() => setOpen(true)}
      >
        <span className={styles.frame}>
          <Image
            src={shot.src}
            alt=""
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 640px) 100vw, 20rem"
          />
        </span>
        {shot.caption ? (
          <span className={styles.caption}>{shot.caption}</span>
        ) : null}
        {shot.line ? <span className={styles.line}>{shot.line}</span> : null}
      </button>
      {open
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
                    <span>{shot.caption || "Photo"}</span>
                  </p>
                  <button
                    type="button"
                    className={styles.close}
                    onClick={() => dialogRef.current?.close()}
                  >
                    <CloseIcon />
                    <span className="sr-only">Close photo</span>
                  </button>
                </div>
                <div className={styles.well}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="90vw"
                    unoptimized
                    className={styles.full}
                  />
                </div>
                {shot.line ? (
                  <p className={styles.detail}>{shot.line}</p>
                ) : null}
                <ShotLink shot={shot} />
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
