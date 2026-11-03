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

// Production caches every Prismic response until the publish webhook
// expires the "prismic" tag. Local development does not: the webhook
// never reaches localhost, and a cached miss hides a document that
// was just published.
const fetchOptions: NonNullable<ClientConfig["fetchOptions"]> =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : {
        next: { tags: ["prismic"] },
        cache: "force-cache",
      };

export function createClient(
  config: ClientConfig = {},
  options: { preview?: boolean } = {},
) {
  const accessToken = getPrismicAccessToken();
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions,
    ...(accessToken ? { accessToken } : {}),
    ...config,
  });

  // The published read-time cache must not read the preview cookie.
  if (options.preview !== false) enableAutoPreviews({ client });

  return client;
}
