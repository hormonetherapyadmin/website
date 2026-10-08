"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./clinic-comparison.module.css";

/**
 * Icon or label with a tooltip. Hover and keyboard focus show it, a tap
 * toggles it, and Escape hides it. The label stays in the HTML.
 */
export function Tip({
  label,
  children,
  describe = false,
}: {
  label: string;
  children: ReactNode;
  /** The button keeps its own name, and the label describes it. */
  describe?: boolean;
}) {
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
        aria-labelledby={describe ? undefined : id}
        aria-describedby={describe ? id : undefined}
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
