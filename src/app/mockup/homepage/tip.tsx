"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./homepage.module.css";

/*
  Icon with a tooltip. Shows on hover and keyboard focus, toggles on tap for
  touch screens, and Escape hides it (WCAG 1.4.13). The label stays in the
  HTML as the button's accessible name.
*/
export function Tip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  function reset() {
    setOpen(false);
    setDismissed(false);
  }

  return (
    <span
      className={styles.tip}
      data-open={open || undefined}
      data-dismissed={dismissed || undefined}
      onMouseLeave={() => setDismissed(false)}
    >
      <button
        type="button"
        className={styles.tipButton}
        aria-labelledby={id}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setDismissed(true);
          }
        }}
        onBlur={reset}
      >
        {children}
      </button>
      <span role="tooltip" id={id} className={styles.tipText}>
        {label}
      </span>
    </span>
  );
}
