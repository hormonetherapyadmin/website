import Image from "next/image";
import { useId, type ReactNode } from "react";
import { ribbonShowsWave, ribbonTone } from "@/slices/Ribbon/tone";
import type { SectionBackground } from "@/components/slice-section";
import styles from "@/slices/Ribbon/ribbon.module.css";

/** The portrait already published on /about. */
export const PEGGY_TIP_PORTRAIT =
  "https://images.prismic.io/1shr96di/XYNQOFoQwb5OYLsz_eb9223_eb8a2908d66c45d8b805ae5191010342~mv2.jpg?auto=format%2Ccompress&fit=max&w=1200";

export const PEGGY_TIP_TITLE = "Peggy’s tip";

/**
 * The ribbon box with Peggy’s portrait and a fixed title. The slice
 * and the {{tip}} token both use it. She types only the words under
 * the title.
 */
export function PeggyTip({
  children,
  box = "Pink",
  behind = "Transparent",
  titleAs = "p",
  titleId,
  place = "slice",
}: {
  children: ReactNode;
  box?: SectionBackground;
  behind?: SectionBackground;
  titleAs?: "h2" | "h3" | "p";
  titleId?: string;
  /** Story adds the gap a callout needs inside writing. */
  place?: "slice" | "story";
}) {
  const generatedId = useId();
  const id = titleId ?? generatedId;
  const Title = titleAs;

  return (
    <aside
      className={styles.box}
      data-box={box}
      data-behind={behind}
      data-tone={ribbonTone(box, behind)}
      data-layout="tip"
      data-place={place === "story" ? "story" : undefined}
      data-wave={ribbonShowsWave(box, behind) ? "true" : undefined}
      aria-labelledby={id}
    >
      <span className={styles.portrait}>
        <Image
          src={PEGGY_TIP_PORTRAIT}
          alt=""
          width={240}
          height={276}
          sizes="76px"
        />
      </span>
      <div className={styles.copy}>
        <Title id={id} className={styles.title}>
          {PEGGY_TIP_TITLE}
        </Title>
        <div className={styles.content}>{children}</div>
      </div>
    </aside>
  );
}
