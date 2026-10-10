import {
  asLink,
  asText,
  isFilled,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { storyClinicUids, type TokenClinic } from "@/components/content-blocks";
import { minutesToRead } from "@/lib/post-derived";
import { tokenClinic, type TokenClinicSource } from "@/lib/token-clinic";
import type { BrandPromoClinic } from "@/slices/BrandPromo";
import type { BoxClinic } from "@/slices/boxes";
import type { ComparisonClinic } from "@/slices/clinic_comparison";
import type { PostCardData } from "@/slices/posts";
import type { QuoteClinic } from "@/slices/quote";
import type { SideClinic } from "@/slices/side_by_side";

/** The clinic fields a page slice reads, beyond what a story token reads. */
export type PageClinicSource = TokenClinicSource & {
  id: string;
  data: TokenClinicSource["data"] & {
    short_description?: string | null;
    top_choice_label?: string | null;
    quote?: RichTextField | null;
  };
};

/** A published clinic, reduced to what any page slice shows. */
export type PageClinic = TokenClinic & {
  id: string;
  topChoice?: string;
  shortDescription?: string;
  quote?: string;
};

/** The post fields a card reads. */
export type PostCardSource = {
  id: string;
  url: string | null;
  data: {
    title: RichTextField;
    sub_title: RichTextField;
    image: { url?: string | null; alt?: string | null } | null;
    published_date: string | null;
    category: string | null;
    body: RichTextField;
  };
};

type SliceLike = {
  slice_type: string;
  variation: string;
  primary: Record<string, unknown>;
};

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function linkedId(field: unknown) {
  if (!field || typeof field !== "object") return undefined;
  const link = field as LinkField;
  if (!isFilled.link(link) || link.link_type !== "Document") return undefined;
  return "id" in link && typeof link.id === "string" ? link.id : undefined;
}

function rows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

/** Every clinic a slice on the page points at, by document id, in page order. */
export function sliceClinicIds(slices: readonly SliceLike[]): string[] {
  const ids: string[] = [];
  const add = (field: unknown) => {
    const id = linkedId(field);
    if (id && !ids.includes(id)) ids.push(id);
  };

  for (const slice of slices) {
    const { primary } = slice;
    switch (slice.slice_type) {
      case "hero":
        if (slice.variation === "brands") {
          for (const row of rows(primary.clinics)) add(row.clinic);
        }
        if (slice.variation === "provider") add(primary.clinic);
        break;
      case "clinic_comparison":
        for (const row of rows(primary.clinics)) add(row.clinic);
        break;
      case "quote":
        add(primary.clinic);
        break;
      case "side_by_side":
        if (slice.variation === "clinic") add(primary.clinic);
        break;
      case "boxes":
        for (const row of rows(primary.boxes)) add(row.clinic);
        break;
      case "brand_promo":
        add(primary.clinic);
        break;
    }
  }

  return ids;
}

/** Clinic UIDs named by a story token in Side by side writing. */
export function sliceTokenUids(slices: readonly SliceLike[]): string[] {
  const uids: string[] = [];
  for (const slice of slices) {
    if (slice.slice_type !== "side_by_side") continue;
    for (const uid of storyClinicUids(slice.primary.text as RichTextField)) {
      if (!uids.includes(uid)) uids.push(uid);
    }
  }
  return uids;
}

/** True when a Posts slice is on the page, so the page loads the posts. */
export function slicesNeedPosts(slices: readonly SliceLike[]) {
  return slices.some((slice) => slice.slice_type === "posts");
}

export function pageClinic(document: PageClinicSource): PageClinic | null {
  const base = tokenClinic(document);
  if (!base) return null;
  const quote = document.data.quote ? asText(document.data.quote) : "";

  return {
    ...base,
    id: document.id,
    topChoice: text(document.data.top_choice_label),
    shortDescription: text(document.data.short_description),
    quote: text(quote),
  };
}

/** One chart row. The review link is written on the slice row. */
export function comparisonClinic(
  clinic: PageClinic,
  review: LinkField | null | undefined,
): ComparisonClinic {
  return {
    name: clinic.name,
    href: clinic.visitHref,
    logo: clinic.logo,
    topChoice: clinic.topChoice,
    shortDescription: clinic.shortDescription,
    monthlyPrice: clinic.monthlyPrice,
    priceNote: clinic.priceNote,
    insurance: clinic.insurance,
    formulation: clinic.formulation,
    quote: clinic.quote,
    note: clinic.gettingStarted,
    offerCode: clinic.offerCode,
    reviewHref: (review && asLink(review)) || undefined,
  };
}

export function quoteClinic(clinic: PageClinic): QuoteClinic {
  return {
    name: clinic.name,
    logo: clinic.logo,
    visitHref: clinic.visitHref,
    visitText: clinic.visitText,
  };
}

export function sideClinic(clinic: PageClinic): SideClinic {
  return { ...quoteClinic(clinic), quote: clinic.quote };
}

export function brandPromoClinic(clinic: PageClinic): BrandPromoClinic {
  return {
    uid: clinic.uid,
    name: clinic.name,
    logo: clinic.logo,
    visitHref: clinic.visitHref,
    visitText: clinic.visitText,
    monthlyPrice: clinic.monthlyPrice,
    priceNote: clinic.priceNote,
    insurance: clinic.insurance,
    formulation: clinic.formulation,
    gettingStarted: clinic.gettingStarted,
    offerCode: clinic.offerCode,
    offerCopy: clinic.offerCopy,
    topChoice: clinic.topChoice,
    quote: clinic.quote,
  };
}

export function boxClinic(clinic: PageClinic): BoxClinic {
  return {
    name: clinic.name,
    logo: clinic.logo,
    offerCode: clinic.offerCode,
    shortDescription: clinic.shortDescription,
  };
}

export function postCard(document: PostCardSource): PostCardData | null {
  const title = asText(document.data.title).trim();
  if (!title || !document.url) return null;
  const image = document.data.image;

  return {
    title,
    href: document.url,
    image: image?.url
      ? { src: image.url, alt: image.alt ?? undefined }
      : undefined,
    excerpt: text(asText(document.data.sub_title)),
    published: document.data.published_date ?? undefined,
    readTime: minutesToRead(document.data.body),
    category: document.data.category ?? undefined,
  };
}

/** `?page=2` on a Posts grid. Anything else is page 1. */
export function gridPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}
