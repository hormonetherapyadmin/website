import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { isIndexingAllowed } from "@/lib/env";
import { loadSearchCatalog } from "@/lib/search-catalog";
import { searchQuery } from "@/lib/search";
import { SearchExperience } from "./search-experience";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Search",
    description: "Search pages and blog posts on Hormone Therapy Hub.",
    alternates: { canonical: "/search" },
    robots: { index: false, follow: isIndexingAllowed() },
  };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const hits = await loadSearchCatalog();

  return (
    <SiteShell>
      <SearchExperience
        key={searchQuery(searchParams.q)}
        hits={hits}
        initialQuery={searchQuery(searchParams.q)}
      />
    </SiteShell>
  );
}
