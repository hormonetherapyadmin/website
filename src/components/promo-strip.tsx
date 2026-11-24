import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { AFFILIATE_REL, storyLinkRel } from "@/lib/affiliate-link";
import type { PromotionContent } from "@/lib/promotion";
import styles from "./promo-strip.module.css";

/**
 * The bar above the header. The button is only a label. The whole bar
 * is one link.
 */
export function PromoStrip({ promotion }: { promotion: PromotionContent }) {
  return (
    <PrismicNextLink
      field={promotion.link}
      className={styles.strip}
      rel={promotion.affiliate ? AFFILIATE_REL : storyLinkRel}
      {...(promotion.affiliate ? { target: "_blank" } : {})}
      {...(promotion.affiliate ? { "data-placement": "promotion" } : {})}
    >
      <PrismicRichText
        field={promotion.text}
        components={{
          paragraph: ({ children }) => (
            <span className={styles.text}>{children}</span>
          ),
          hyperlink: ({ children }) => <>{children}</>,
        }}
      />
      {promotion.buttonLabel ? (
        <span className={styles.button}>{promotion.buttonLabel}</span>
      ) : null}
      {promotion.affiliate ? (
        <span className={styles.srOnly}>
          {" "}
          (affiliate link, opens in a new tab)
        </span>
      ) : null}
    </PrismicNextLink>
  );
}
