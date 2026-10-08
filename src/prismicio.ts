import {
  createClient as baseCreateClient,
  type ClientConfig,
  type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import { getPrismicAccessToken } from "@/lib/env";
import prismicConfig from "../prismic.config.json";

export const repositoryName = prismicConfig.repositoryName;

const routes: Route[] = prismicConfig.routes;

// Cached until the Prismic webhook expires the "prismic" tag.
export function createClient(config: ClientConfig = {}) {
  const accessToken = getPrismicAccessToken();
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions: {
      next: { tags: ["prismic"] },
      cache: "force-cache",
    },
    ...(accessToken ? { accessToken } : {}),
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}
