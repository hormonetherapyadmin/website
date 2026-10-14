import { isFilled, type LinkField } from "@prismicio/client";
import { SliceZone, type SliceComponentProps } from "@prismicio/react";
import type { TokenClinic } from "@/components/content-blocks";
import type { PageClinic } from "@/lib/page-slices";
import {
  brandPromoClinic,
  boxClinic,
  comparisonClinic,
  factsClinic,
  quoteClinic,
  sideClinic,
} from "@/lib/page-slices";
import { BrandPromo } from "@/slices/BrandPromo";
import { Boxes } from "@/slices/boxes";
import { ClinicComparison } from "@/slices/clinic_comparison";
import { ClinicFacts } from "@/slices/ClinicFacts";
import { Divider } from "@/slices/divider";
import { Hero, type HeroSlice as HeroProps } from "@/slices/hero";
import { Posts, type PostCardData } from "@/slices/posts";
import { ProsAndCons } from "@/slices/ProsAndCons";
import { Quote } from "@/slices/quote";
import { Ribbon } from "@/slices/Ribbon";
import { SideBySide } from "@/slices/side_by_side";
import { StartHere } from "@/slices/start_here";
import { Text } from "@/slices/Text";
import type {
  BrandPromoSlice,
  BoxesSlice,
  ClinicComparisonSlice,
  ClinicFactsSlice,
  DividerSlice,
  HeroSlice,
  PageDocumentDataSlicesSlice,
  PostsSlice,
  ProsConsSlice,
  ProviderDocument,
  QuoteSlice,
  RibbonSlice,
  SideBySideSlice,
  StartHereSlice,
  TextSlice,
} from "../../prismicio-types";

/** What the page loaded for its slices. Slices do not fetch. */
export type PageSliceContext = {
  /** Published clinics the slices point at, by document id. */
  providers: ReadonlyMap<string, ProviderDocument>;
  clinics: ReadonlyMap<string, PageClinic>;
  /** Clinics a story token in Side by side or Text writing can name. */
  tokenClinics: readonly TokenClinic[];
  posts: readonly PostCardData[];
  /** Grid page and category tab, from the address. */
  page: number;
  category: string | null;
  tokens: "preview" | "public";
  /**
   * Space above on the slice after each slice id.
   * False means that slice is last.
   */
  followingSpaceAbove?: ReadonlyMap<string, string | null | false>;
  /**
   * Slice type of the slice after each slice id.
   * False means that slice is last.
   */
  followingSliceType?: ReadonlyMap<string, string | false>;
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

function ClinicFactsAdapter({ slice, context }: Props<ClinicFactsSlice>) {
  const id = linkedId(slice.primary.clinic);
  const clinic = id ? context.clinics.get(id) : undefined;

  return (
    <ClinicFacts
      primary={slice.primary}
      clinic={clinic ? factsClinic(clinic) : null}
    />
  );
}

function ProsConsAdapter({ slice }: Props<ProsConsSlice>) {
  return <ProsAndCons primary={slice.primary} />;
}

function TextAdapter({ slice, context }: Props<TextSlice>) {
  return (
    <Text
      primary={slice.primary}
      clinics={context.tokenClinics}
      tokens={context.tokens}
    />
  );
}

function BrandPromoAdapter({ slice, context }: Props<BrandPromoSlice>) {
  const id = linkedId(slice.primary.clinic);
  const clinic = id ? context.clinics.get(id) : undefined;

  return (
    <BrandPromo
      primary={slice.primary}
      clinic={clinic ? brandPromoClinic(clinic) : null}
      followingSpaceAbove={context.followingSpaceAbove?.get(slice.id)}
      last={context.followingSliceType?.get(slice.id) !== "brand_promo"}
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
  clinic_facts: ClinicFactsAdapter,
  pros_cons: ProsConsAdapter,
  text: TextAdapter,
};

function followingSpaceAbove(slice: PageDocumentDataSlicesSlice | undefined) {
  if (!slice) return false;
  const primary = slice.primary as { space_above?: string | null };
  return primary.space_above ?? null;
}

/** Every slice a Page accepts, with the clinics and posts it reads. */
export function PageSliceZone({
  slices,
  context,
}: {
  slices: readonly PageDocumentDataSlicesSlice[];
  context: PageSliceContext;
}) {
  const following = new Map(
    slices.map((slice, index) => [
      slice.id,
      followingSpaceAbove(slices[index + 1]),
    ]),
  );
  const followingType = new Map(
    slices.map((slice, index) => [
      slice.id,
      slices[index + 1]?.slice_type ?? false,
    ]),
  );

  return (
    <SliceZone
      slices={slices}
      components={components}
      context={{
        ...context,
        followingSpaceAbove: following,
        followingSliceType: followingType,
      }}
    />
  );
}
