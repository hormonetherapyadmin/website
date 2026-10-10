import { isFilled, type LinkField } from "@prismicio/client";
import { SliceZone, type SliceComponentProps } from "@prismicio/react";
import type { TokenClinic } from "@/components/content-blocks";
import type { PageClinic } from "@/lib/page-slices";
import {
  brandPromoClinic,
  boxClinic,
  comparisonClinic,
  quoteClinic,
  sideClinic,
} from "@/lib/page-slices";
import { BrandPromo } from "@/slices/BrandPromo";
import { Boxes } from "@/slices/boxes";
import { ClinicComparison } from "@/slices/clinic_comparison";
import { Divider } from "@/slices/divider";
import { Hero, type HeroSlice as HeroProps } from "@/slices/hero";
import { Posts, type PostCardData } from "@/slices/posts";
import { Quote } from "@/slices/quote";
import { Ribbon } from "@/slices/Ribbon";
import { SideBySide } from "@/slices/side_by_side";
import { StartHere } from "@/slices/start_here";
import type {
  BrandPromoSlice,
  BoxesSlice,
  ClinicComparisonSlice,
  DividerSlice,
  HeroSlice,
  PageDocumentDataSlicesSlice,
  PostsSlice,
  ProviderDocument,
  QuoteSlice,
  RibbonSlice,
  SideBySideSlice,
  StartHereSlice,
} from "../../prismicio-types";

/** What the page loaded for its slices. Slices do not fetch. */
export type PageSliceContext = {
  /** Published clinics the slices point at, by document id. */
  providers: ReadonlyMap<string, ProviderDocument>;
  clinics: ReadonlyMap<string, PageClinic>;
  /** Clinics a story token in Side by side writing can name. */
  tokenClinics: readonly TokenClinic[];
  posts: readonly PostCardData[];
  /** Grid page and category tab, from the address. */
  page: number;
  category: string | null;
  tokens: "preview" | "public";
};

type Props<TSlice extends PageDocumentDataSlicesSlice> = SliceComponentProps<
  TSlice,
  PageSliceContext
>;

function linkedId(field: LinkField | null | undefined) {
  if (!field || !isFilled.link(field) || field.link_type !== "Document") {
    return undefined;
  }
  return field.id;
}

function withClinicData(
  field: LinkField | null | undefined,
  providers: PageSliceContext["providers"],
) {
  const id = linkedId(field);
  const provider = id ? providers.get(id) : undefined;
  return provider ? { ...field, data: provider.data } : null;
}

function HeroAdapter({ slice, context }: Props<HeroSlice>) {
  if (slice.variation === "brands") {
    const clinics = slice.primary.clinics.map((row) => ({
      ...row,
      clinic: withClinicData(row.clinic, context.providers),
    }));
    return (
      <Hero
        {...({
          variation: "brands",
          primary: { ...slice.primary, clinics },
        } as HeroProps)}
      />
    );
  }

  if (slice.variation === "provider") {
    const clinic = withClinicData(slice.primary.clinic, context.providers);
    return (
      <Hero
        {...({
          variation: "provider",
          primary: { ...slice.primary, clinic },
        } as HeroProps)}
      />
    );
  }

  return <Hero {...(slice as unknown as HeroProps)} />;
}

function StartHereAdapter({ slice }: Props<StartHereSlice>) {
  return <StartHere primary={slice.primary} />;
}

function PostsAdapter({ slice, context }: Props<PostsSlice>) {
  const picked =
    slice.variation === "featured" && isFilled.link(slice.primary.post)
      ? slice.primary.post
      : null;
  const pickedUrl = picked && linkedId(picked) ? picked.url : undefined;
  const featured = pickedUrl
    ? (context.posts.find((post) => post.href === pickedUrl) ?? null)
    : null;

  return (
    <Posts
      variation={slice.variation}
      primary={slice.primary}
      posts={context.posts}
      featured={featured}
      page={context.page}
      activeCategory={context.category}
    />
  );
}

function ClinicComparisonAdapter({
  slice,
  context,
}: Props<ClinicComparisonSlice>) {
  const clinics = slice.primary.clinics.flatMap((row) => {
    const id = linkedId(row.clinic);
    const clinic = id ? context.clinics.get(id) : undefined;
    return clinic ? [comparisonClinic(clinic, row.review)] : [];
  });

  return <ClinicComparison primary={slice.primary} clinics={clinics} />;
}

function QuoteAdapter({ slice, context }: Props<QuoteSlice>) {
  const id = linkedId(slice.primary.clinic);
  const clinic = id ? context.clinics.get(id) : undefined;

  return (
    <Quote
      primary={slice.primary}
      clinic={clinic ? quoteClinic(clinic) : null}
    />
  );
}

function SideBySideAdapter({ slice, context }: Props<SideBySideSlice>) {
  const primary = slice.primary;
  const video =
    "video" in primary && isFilled.embed(primary.video)
      ? {
          html: primary.video.html ?? undefined,
          title: primary.video.title ?? undefined,
          url: primary.video.embed_url,
        }
      : null;
  const id = "clinic" in primary ? linkedId(primary.clinic) : undefined;
  const clinic = id ? context.clinics.get(id) : undefined;

  return (
    <SideBySide
      variation={slice.variation}
      primary={primary}
      video={video}
      clinic={clinic ? sideClinic(clinic) : null}
      clinics={context.tokenClinics}
      tokens={context.tokens}
    />
  );
}

function DividerAdapter({ slice }: Props<DividerSlice>) {
  return <Divider primary={slice.primary} />;
}

function RibbonAdapter({ slice }: Props<RibbonSlice>) {
  return <Ribbon primary={slice.primary} />;
}

function BrandPromoAdapter({ slice, context }: Props<BrandPromoSlice>) {
  const id = linkedId(slice.primary.clinic);
  const clinic = id ? context.clinics.get(id) : undefined;

  return (
    <BrandPromo
      primary={slice.primary}
      clinic={clinic ? brandPromoClinic(clinic) : null}
    />
  );
}

function BoxesAdapter({ slice, context }: Props<BoxesSlice>) {
  const clinics = slice.primary.boxes.map((row) => {
    const id = linkedId(row.clinic);
    const clinic = id ? context.clinics.get(id) : undefined;
    return clinic ? boxClinic(clinic) : null;
  });

  return <Boxes primary={slice.primary} clinics={clinics} />;
}

const components = {
  hero: HeroAdapter,
  start_here: StartHereAdapter,
  posts: PostsAdapter,
  clinic_comparison: ClinicComparisonAdapter,
  quote: QuoteAdapter,
  side_by_side: SideBySideAdapter,
  divider: DividerAdapter,
  ribbon: RibbonAdapter,
  boxes: BoxesAdapter,
  brand_promo: BrandPromoAdapter,
};

/** Every slice a Page accepts, with the clinics and posts it reads. */
export function PageSliceZone({
  slices,
  context,
}: {
  slices: readonly PageDocumentDataSlicesSlice[];
  context: PageSliceContext;
}) {
  return (
    <SliceZone slices={slices} components={components} context={context} />
  );
}
