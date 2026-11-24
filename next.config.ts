import { createClient } from "@prismicio/client";
import type { NextConfig } from "next";
import prismicConfig from "./prismic.config.json";
import { isIndexingAllowed } from "./src/lib/env";
import { redirectRules } from "./src/lib/site-redirects";
import { QUIZ_PATH, QUIZ_PREVIOUS_PATH } from "./src/lib/site";

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
    const fromCms = document ? redirectRules(document.data.redirects) : [];
    // The quiz moved. This ships with the app, so the old address
    // redirects on the same deploy. A matching CMS row is dropped.
    const quizRedirect = {
      source: QUIZ_PREVIOUS_PATH,
      destination: QUIZ_PATH,
      permanent: true,
    };
    return [
      quizRedirect,
      ...fromCms.filter((rule) => rule.source !== quizRedirect.source),
    ];
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
