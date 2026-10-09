import type { MetadataRoute } from "next";
import { isIndexingAllowed } from "@/lib/env";
import { sitemapUrl } from "@/lib/sitemap";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: sitemapUrl("/sitemap.xml"),
  };
}
