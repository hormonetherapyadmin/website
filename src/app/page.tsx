import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageSliceZone } from "@/components/page-slice-zone";
import { SiteShell } from "@/components/site-shell";
import { isIndexingAllowed } from "@/lib/env";
import { loadHomepage } from "@/lib/homepage";
import { loadPageSliceContext } from "@/lib/page-slice-context";
import { heroClinicId, heroTitle } from "@/lib/page-title";
import { SITE_NAME } from "@/lib/site";
import { graph, organization, website } from "@/lib/structured-data";
import { createClient } from "@/prismicio";
import type { HomepageDocument, ProviderDocument } from "../../prismicio-types";

/** The published clinic a provider Hero at the top names. */
async function heroClinicName(page: HomepageDocument) {
  const id = heroClinicId(page.data.slices);
  if (!id) return undefined;
  const [clinic] = await createClient().getAllByIDs<ProviderDocument>([id]);
  return clinic?.type === "provider" ? clinic.data.name : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadHomepage();
  if (!page) return {};

  const title =
    page.data.meta_title?.trim() ||
    heroTitle(page.data.slices, await heroClinicName(page)) ||
    undefined;
  const description = page.data.meta_description?.trim() || undefined;
  const index = isIndexingAllowed();

  return {
    title,
    description,
    alternates: { canonical: "/" },
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: SITE_NAME,
    },
  };
}

export default async function HomePage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const page = await loadHomepage();
  if (!page) notFound();

  const slices = page.data.slices;
  const title = page.data.meta_title?.trim() ?? "";
  const startsWithHero = slices[0]?.slice_type === "hero";

  return (
    <SiteShell>
      <JsonLd data={graph(website(), organization())} />
      {!startsWithHero && title ? (
        <h1 className="mx-auto w-full max-w-wrap px-gutter pt-slice font-heading text-4xl">
          {title}
        </h1>
      ) : null}
      <PageSliceZone
        slices={slices}
        context={await loadPageSliceContext(slices, searchParams)}
      />
    </SiteShell>
  );
}
