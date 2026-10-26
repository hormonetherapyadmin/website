import type { Metadata } from "next";
import Link from "next/link";
import { MockupShell } from "../_shared/mockup-shell";
import { PROPOSALS } from "./reason";
import styles from "./proposed.module.css";

export const metadata: Metadata = {
  title: "Proposed slices",
  robots: { index: false, follow: false },
};

export default async function ProposedSlices(
  props: PageProps<"/mockup/proposed">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <div className={styles.index}>
        <p className={styles.kicker}>Mockups</p>
        <h1>Slices to look at</h1>
        <p>
          Photo gallery, the side-by-side photo link, the comparison chart, and
          picked posts are slices. Two columns and the HRT doctors page stay
          mockups.
        </p>
        <ul className={styles.cards}>
          {PROPOSALS.map((item) => (
            <li key={item.href}>
              <Link className={styles.card} href={item.href}>
                <strong>{item.title}</strong>
                {item.line}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MockupShell>
  );
}
