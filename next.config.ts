import { createClient } from "@prismicio/client";
import type { NextConfig } from "next";
import prismicConfig from "./prismic.config.json";
import { isIndexingAllowed } from "./src/lib/env";
import { redirectRules } from "./src/lib/site-redirects";

const nextConfig: NextConfig = {
  // Matches the live Wix URLs, which have no trailing slash.
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
  },

  async redirects() {
    const client = createClient(prismicConfig.repositoryName, {
      routes: prismicConfig.routes,
      ...(process.env.PRISMIC_ACCESS_TOKEN
        ? { accessToken: process.env.PRISMIC_ACCESS_TOKEN }
        : {}),
    });
    const document = await client.getSingle("redirect").catch(() => null);
    if (!document) return [];
    return redirectRules(document.data.redirects);
  },

  async headers() {
    if (isIndexingAllowed()) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
