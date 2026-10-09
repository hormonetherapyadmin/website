import type { Metadata } from "next";
import { MockupShell } from "@/app/mockup/_shared/mockup-shell";
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
  const palette =
    typeof searchParams.palette === "string" ? searchParams.palette : undefined;
  const serif =
    typeof searchParams.serif === "string" ? searchParams.serif : undefined;

  return (
    <MockupShell searchParams={searchParams}>
      <SearchExperience
        key={searchQuery(searchParams.q)}
        hits={hits}
        initialQuery={searchQuery(searchParams.q)}
        palette={palette}
        serif={serif}
      />
    </MockupShell>
  );
}
