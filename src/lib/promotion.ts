import {
  asLink,
  asText,
  isFilled,
  NotFoundError,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { isAffiliateUrl } from "@/lib/affiliate-link";
import { createClient } from "@/prismicio";

export type PromotionContent = {
  text: RichTextField;
  /** Absent when the label is blank. The strip is still the link. */
  buttonLabel?: string;
  link: LinkField;
  /**
   * An affiliate address opens in a new tab with the sponsored rel,
   * whatever the link field's new-tab checkbox says.
   */
  affiliate: boolean;
};

/**
 * The strip above the header. Hidden unless Active is on and both the
 * line and the link are filled. The button label is optional.
 */
export function promotionFrom(data: {
  text_promo?: RichTextField | null;
  button_label?: string | null;
  link?: LinkField | null;
  active?: boolean | null;
}): PromotionContent | null {
  if (data.active !== true) return null;
  const text = data.text_promo;
  const link = data.link;
  if (!text || !asText(text).trim()) return null;
  if (!link || !isFilled.link(link)) return null;

  const href = asLink(link);
  const buttonLabel = data.button_label?.trim() || undefined;
  return {
    text,
    buttonLabel,
    link,
    affiliate: typeof href === "string" && isAffiliateUrl(href),
  };
}

/** The published Promotion document, or null when it is missing or off. */
export async function loadPromotion(): Promise<PromotionContent | null> {
  try {
    const document = await createClient().getSingle("promotion");
    return promotionFrom(document.data);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}
