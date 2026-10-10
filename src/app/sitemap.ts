import type { MetadataRoute } from "next";
import { loadSitemapLinks, xmlSitemap } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return xmlSitemap(await loadSitemapLinks());
}
