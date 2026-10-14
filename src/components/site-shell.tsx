import type { ReactNode } from "react";
import styles from "@/app/mockup/_shared/mockup.module.css";
import { SiteFrame } from "./site-frame";

/**
 * The header and footer on public pages, in the working palette (Navy &
 * raspberry, Besley headings). It does not read the address, so a page
 * that uses it can be cached whole.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame
      className={`${styles.paletteNavyRaspberry} ${styles.serifSite}`}
      palette="raspberry"
    >
      {children}
    </SiteFrame>
  );
}
