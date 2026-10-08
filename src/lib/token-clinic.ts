import { isFilled, type ImageField, type LinkField } from "@prismicio/client";
import type { TokenClinic } from "@/components/content-blocks";

/** The clinic fields a story token reads. */
export type TokenClinicSource = {
  uid: string | null;
  data: {
    name: string | null;
    logo: ImageField;
    visit: LinkField;
    code: string | null;
    code_note: string | null;
    monthly_price: number | null;
    price_note: string | null;
    insurance: boolean | null;
    formulation: string | null;
    note: string | null;
    page?: LinkField | null;
  };
};

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** The code itself. A leading "Code " typed into the field is the label, not the code. */
function couponCode(value: string | null | undefined) {
  const trimmed = text(value);
  if (!trimmed) return undefined;
  return trimmed.replace(/^code\s+/i, "") || undefined;
}

/** The site page about this clinic. A blank Page leaves the sidebar name as text. */
function sitePage(link: LinkField | null | undefined) {
  if (!link || !isFilled.link(link)) return undefined;
  if (link.link_type !== "Document" && link.link_type !== "Web")
    return undefined;
  return link.url || undefined;
}

/** A published clinic, reduced to what an offer or facts token shows. */
export function tokenClinic(document: TokenClinicSource): TokenClinic | null {
  const uid = document.uid?.trim();
  const name = text(document.data.name);
  if (!uid || !name) return null;

  const visit = document.data.visit;
  const linked =
    isFilled.link(visit) && visit.link_type === "Web" && visit.url
      ? visit
      : null;
  const logo = document.data.logo;

  return {
    uid,
    name,
    logo: isFilled.image(logo) && logo.url ? { src: logo.url } : undefined,
    visitHref: linked?.url,
    visitText: linked ? text(linked.text) : undefined,
    newTab: linked?.target === "_blank",
    offerCode: couponCode(document.data.code),
    offerCopy: text(document.data.code_note),
    monthlyPrice: document.data.monthly_price,
    priceNote: text(document.data.price_note),
    insurance:
      typeof document.data.insurance === "boolean"
        ? document.data.insurance
        : undefined,
    formulation: text(document.data.formulation),
    gettingStarted: text(document.data.note),
    pageHref: sitePage(document.data.page),
  };
}
