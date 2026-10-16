// Sets Category on posts already in Prismic, from the live Wix categories.
// Leaves every other field as it is. Does not create posts and does not
// publish unless --publish is passed.
//
//   node scripts/set-post-categories.mts            dry run
//   node scripts/set-post-categories.mts --write    send the category updates
//   --only <slug>        limit the run to one post
//   --publish            publish the migration release after --write
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  asText,
  createClient,
  createMigration,
  createWriteClient,
  type ExistingPrismicDocument,
} from "@prismicio/client";
import type { PostDocument } from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import { categoryFromWix } from "../src/migration/post-category.ts";

const REPOSITORY = prismicConfig.repositoryName;
const { values: args } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    publish: { type: "boolean", default: false },
    only: { type: "string" },
  },
});

function loadEnv(text: string) {
  const env: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

const env = loadEnv(readFileSync(".env.local", "utf8"));
if (!env.WIX_API_KEY || !env.WIX_SITE_ID) {
  throw new Error("WIX_API_KEY and WIX_SITE_ID must be set in .env.local");
}
if (!env.PRISMIC_WRITE_TOKEN) {
  throw new Error("PRISMIC_WRITE_TOKEN must be set in .env.local");
}

const wixHeaders = {
  "Content-Type": "application/json",
  Authorization: env.WIX_API_KEY,
  "wix-site-id": env.WIX_SITE_ID,
};

type WixCategory = { id?: string; label?: string };

async function wixCategories() {
  const response = await fetch(
    "https://www.wixapis.com/blog/v3/categories?paging.limit=100",
    { headers: wixHeaders },
  );
  if (!response.ok) {
    throw new Error(`Wix categories failed with HTTP ${response.status}`);
  }
  const json = (await response.json()) as { categories?: WixCategory[] };
  const byId = new Map<string, string>();
  const unknown: string[] = [];
  for (const category of json.categories ?? []) {
    if (!category.id || !category.label) continue;
    const label = categoryFromWix(category.label);
    if (!label) unknown.push(category.label);
    else byId.set(category.id, label);
  }
  if (unknown.length) {
    throw new Error(`Unmapped Wix categories: ${unknown.join(", ")}`);
  }
  return byId;
}

async function wixPostCategories(labels: Map<string, string>) {
  const bySlug = new Map<string, string>();
  const problems: string[] = [];
  let cursor: string | undefined;
  do {
    const response = await fetch(
      "https://www.wixapis.com/blog/v3/posts/query",
      {
        method: "POST",
        headers: wixHeaders,
        body: JSON.stringify({
          fieldsets: ["URL"],
          query: { cursorPaging: { limit: 50, cursor } },
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Wix posts failed with HTTP ${response.status}`);
    }
    const json = (await response.json()) as {
      posts?: Array<{ slug?: string; categoryIds?: string[] }>;
      pagingMetadata?: { cursors?: { next?: string } };
    };
    for (const post of json.posts ?? []) {
      if (!post.slug) {
        problems.push("a Wix post has no slug");
        continue;
      }
      const ids = post.categoryIds ?? [];
      if (ids.length !== 1) {
        problems.push(`${post.slug} has ${ids.length} categories`);
        continue;
      }
      const label = labels.get(ids[0]);
      if (!label) problems.push(`${post.slug} has an unknown category`);
      else bySlug.set(post.slug, label);
    }
    cursor = json.pagingMetadata?.cursors?.next;
  } while (cursor);
  return { bySlug, problems };
}

const labels = await wixCategories();
const { bySlug, problems } = await wixPostCategories(labels);
if (problems.length) {
  for (const problem of problems) console.log(`problem: ${problem}`);
  throw new Error("Wix categories are not ready to copy");
}

const client = createClient(REPOSITORY, {
  ...(env.PRISMIC_ACCESS_TOKEN
    ? { accessToken: env.PRISMIC_ACCESS_TOKEN }
    : {}),
});
const only = args.only;
const documents = (await client.getAllByType("post")).filter(
  (document) => document.uid && (!only || document.uid === only),
);
if (only && documents.length !== 1) {
  throw new Error(`No published post with slug ${only}`);
}

const counts = new Map<string, number>();
const missing: string[] = [];
const ready: Array<{ document: PostDocument; category: string }> = [];
for (const document of documents) {
  const category = bySlug.get(document.uid!);
  if (!category) {
    missing.push(document.uid!);
    continue;
  }
  counts.set(category, (counts.get(category) ?? 0) + 1);
  if (document.data.category === category) continue;
  ready.push({ document, category });
}
const wixOnly = [...bySlug.keys()].filter(
  (slug) => !documents.some((document) => document.uid === slug) && !only,
);

console.log(`Wix posts ${bySlug.size}`);
console.log(`Prismic posts ${documents.length}`);
console.log(`to update ${ready.length}`);
console.log(`already set ${documents.length - missing.length - ready.length}`);
for (const [category, count] of [...counts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
)) {
  console.log(`  ${count}\t${category}`);
}
if (missing.length) {
  console.log("Prismic posts with no Wix category:");
  for (const slug of missing) console.log(`  ${slug}`);
}
if (wixOnly.length) {
  console.log("Wix posts that are not in Prismic:");
  for (const slug of wixOnly.sort()) console.log(`  ${slug}`);
}

if (!args.write) {
  console.log("Dry run. Nothing was sent.");
  process.exit(0);
}

const migration = createMigration();
for (const { document, category } of ready) {
  migration.updateDocument(
    {
      ...document,
      data: { ...document.data, category },
    } as ExistingPrismicDocument<PostDocument>,
    asText(document.data.title) || document.uid!,
  );
}
const writeClient = createWriteClient(REPOSITORY, {
  writeToken: env.PRISMIC_WRITE_TOKEN,
});
await writeClient.migrate(migration, {
  reporter(event) {
    if (event.type !== "documents:updating") return;
    const { current, total } = event.data;
    if (current === total || current % 10 === 0) {
      console.log(`updating ${current}/${total}`);
    }
  },
});
console.log(`Updated ${ready.length} posts in the migration release.`);

if (!args.publish) {
  console.log("The migration release is not published.");
  process.exit(0);
}
const published = await writeClient.publishMigrationRelease();
console.log(`Published ${published.totalItems} documents.`);
