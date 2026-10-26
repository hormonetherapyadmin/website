import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./proposed.module.css";

export const PROPOSALS = [
  {
    href: "/mockup/photo-gallery",
    title: "Photo gallery",
    line: "Peggy’s photos. Click one and it opens large.",
  },
  {
    href: "/mockup/linked-image",
    title: "Side by side",
    line: "The photo can be a link. The vial opens the Joi page.",
  },
  {
    href: "/mockup/comparison-table",
    title: "Comparison table",
    line: "A variation of the clinic chart. Same table. The GLP cells stay empty.",
  },
  {
    href: "/mockup/picked-posts",
    title: "Hand-picked posts",
    line: "Row already shows three. Picked is the same row, and she chooses which three.",
  },
  {
    href: "/mockup/two-columns",
    title: "Two columns",
    line: "The same writing field as Text, including the clinic shortcodes.",
  },
  {
    href: "/mockup/hrt-doctors",
    title: "HRT Doctors",
    line: "Provider hero or Brand promo. The facts stay on Clinic facts.",
  },
] as const;

export function Reason({
  title,
  children,
  heading = "h1",
}: {
  title: string;
  children: ReactNode;
  heading?: "h1" | "h2";
}) {
  const Title = heading;

  return (
    <header className={styles.reason}>
      <p className={styles.kicker}>Proposed</p>
      <Title>{title}</Title>
      {children}
      <ul className={styles.links}>
        {PROPOSALS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.title === title ? "page" : undefined}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
