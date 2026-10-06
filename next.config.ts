import type { NextConfig } from "next";
import { isIndexingAllowed } from "./src/lib/env";

const nextConfig: NextConfig = {
  // Matches the live Wix URLs, which have no trailing slash.
  trailingSlash: false,

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
