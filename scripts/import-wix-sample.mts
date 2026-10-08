// Creates three Post documents in a Prismic migration release.
// Does not publish that release.
import { readdirSync, readFileSync } from "node:fs";
import { createMigration, createWriteClient } from "@prismicio/client";
import {
  mapWixPost,
  type MappedBlock,
  type WixPostInput,
} from "../src/migration/wix-post.ts";

const SAMPLE = [
  "hrt-skin-before-and-after-my-12-month-results-and-experience",
  "alloy-vs-musely-estrogen-creams-patches-tablets-compared",
  "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative",
];

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

function loadPosts(): WixPostInput[] {
  const posts: WixPostInput[] = [];
  for (const file of readdirSync("migration/raw/2026-10-08/blog")) {
    if (!file.endsWith(".json")) continue;
    const page = JSON.parse(
      readFileSync(`migration/raw/2026-10-08/blog/${file}`, "utf8"),
    ) as { posts?: WixPostInput[] };
    posts.push(...(page.posts ?? []));
  }
  return SAMPLE.map((slug) => {
    const post = posts.find((item) => item.slug === slug);
    if (!post) throw new Error(`Missing saved post ${slug}`);
    return post;
  });
}

async function tagLabels(env: Record<string, string>) {
  const labels = new Map<string, string>();
  let offset = 0;
  for (;;) {
    const response = await fetch(
      `https://www.wixapis.com/blog/v3/tags?paging.limit=100&paging.offset=${offset}`,
      {
        headers: {
          Authorization: env.WIX_API_KEY,
          "wix-site-id": env.WIX_SITE_ID,
        },
      },
    );
    if (!response.ok)
      throw new Error(`Wix tags failed with HTTP ${response.status}`);
    const json = (await response.json()) as {
      tags?: Array<{ id?: string; label?: string }>;
    };
    const tags = json.tags ?? [];
    for (const tag of tags) {
      if (tag.id && tag.label) labels.set(tag.id, tag.label);
    }
    if (tags.length < 100) break;
    offset += tags.length;
  }
  return labels;
}

function storyBlock(
  migration: ReturnType<typeof createMigration>,
  block: MappedBlock,
) {
  if (block.type !== "image") return block;
  return {
    type: "image" as const,
    id: migration.createAsset(block.image.url, block.image.filename, {
      alt: block.image.alt,
    }),
    alt: block.image.alt,
  };
}

const env = loadEnv(readFileSync(".env.local", "utf8"));
const writeToken = env.PRISMIC_WRITE_TOKEN;
if (!writeToken) {
  throw new Error(
    "Set PRISMIC_WRITE_TOKEN in .env.local. Prismic → Settings → API & Security → Write APIs.",
  );
}

const repository = await fetch("https://1shr96di.cdn.prismic.io/api/v2").then(
  (response) =>
    response.json() as Promise<{
      languages?: Array<{ id: string; is_master: boolean }>;
    }>,
);
const lang =
  repository.languages?.find((language) => language.is_master)?.id ?? "en-us";
const labels = await tagLabels(env);
const posts = loadPosts().map((post) => mapWixPost(post, labels));

for (const post of posts) {
  const counts = new Map<string, number>();
  for (const block of post.data.body) {
    counts.set(block.type, (counts.get(block.type) ?? 0) + 1);
  }
  console.log(
    `${post.uid}  blocks=${post.data.body.length}  ${[...counts].map(([type, count]) => `${type}:${count}`).join(" ")}  review=${post.review.join(", ") || "none"}`,
  );
}

const migration = createMigration();
for (const post of posts) {
  const image = post.data.image
    ? migration.createAsset(post.data.image.url, post.data.image.filename, {
        alt: post.data.image.alt,
      })
    : undefined;
  migration.createDocument(
    {
      type: "post",
      uid: post.uid,
      lang,
      tags: post.tags,
      data: {
        title: post.data.title,
        sub_title: post.data.sub_title,
        body: post.data.body.map((block) => storyBlock(migration, block)),
        ...(image ? { image } : {}),
        ...(post.data.caption.length ? { caption: post.data.caption } : {}),
        ...(post.data.published_date
          ? { published_date: post.data.published_date }
          : {}),
        ...(post.data.meta_title ? { meta_title: post.data.meta_title } : {}),
        ...(post.data.meta_description
          ? { meta_description: post.data.meta_description }
          : {}),
        indexing: true,
      },
    },
    post.title,
  );
}

const writeClient = createWriteClient("1shr96di", { writeToken });
await writeClient.migrate(migration, {
  reporter(event) {
    if (event.type === "documents:created") {
      console.log(
        `created ${event.data.created} documents in the migration release`,
      );
    }
    if (event.type === "assets:created") {
      console.log(`created ${event.data.created} images`);
    }
  },
});
console.log("The release is not published.");
