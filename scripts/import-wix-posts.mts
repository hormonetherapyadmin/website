// Imports saved Wix blog posts into the Prismic migration release.
// Never publishes the release. Without --write it only writes a report.
//
//   node scripts/import-wix-posts.mts                 dry run, every saved post
//   node scripts/import-wix-posts.mts --write         send them to Prismic
//   --only <slug,slug>      limit the run to these posts. A post already in
//                           the migration release is re-imported only when
//                           named here, which overwrites edits made there
//   --replace <slug,slug>   overwrite these published posts, including any
//                           edits made in Prismic
//   --export <yyyy-mm-dd>   saved Wix export to read (default: newest)
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { parseArgs } from "node:util";
import {
  createClient,
  createMigration,
  createWriteClient,
  type ExistingPrismicDocument,
  type PendingPrismicDocument,
  type PrismicMigrationAsset,
  type PrismicMigrationDocument,
} from "@prismicio/client";
import type { PostDocument } from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import {
  mapWixPost,
  type MappedBlock,
  type MappedImage,
  type MappedPost,
  type WixPostInput,
} from "../src/migration/wix-post.ts";
import {
  planPost,
  type ImportState,
  type PostAction,
} from "../src/migration/post-plan.ts";
import { WIX_REDIRECTS } from "../src/migration/wix-redirects.ts";

const REPOSITORY = prismicConfig.repositoryName;

/** The Asset API fields this script reads. */
type Asset = {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
};
const STATE_FILE = "migration/state/wix-posts.json";
const RAW_DIR = "migration/raw";

const { values: args } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    only: { type: "string" },
    replace: { type: "string" },
    export: { type: "string" },
  },
});

const list = (value: string | undefined) =>
  new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

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

function loadPosts(exportDate: string): WixPostInput[] {
  const directory = `${RAW_DIR}/${exportDate}/blog`;
  const posts: WixPostInput[] = [];
  for (const file of readdirSync(directory).sort()) {
    if (!file.endsWith(".json")) continue;
    const page = JSON.parse(readFileSync(`${directory}/${file}`, "utf8")) as {
      posts?: WixPostInput[];
    };
    posts.push(...(page.posts ?? []));
  }
  return posts;
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

/** Media library assets by filename. Wix media ids are unique filenames. */
async function libraryAssets(writeToken: string) {
  const byName = new Map<string, Asset>();
  let cursor: string | undefined;
  do {
    const url = new URL("https://asset-api.prismic.io/assets");
    url.searchParams.set("pageSize", "100");
    if (cursor) url.searchParams.set("cursor", cursor);
    const response = await fetch(url, {
      headers: {
        repository: REPOSITORY,
        authorization: `Bearer ${writeToken}`,
      },
    });
    if (!response.ok)
      throw new Error(`Prismic Asset API failed with HTTP ${response.status}`);
    const page = (await response.json()) as {
      items?: Asset[];
      cursor?: string;
    };
    for (const asset of page.items ?? []) byName.set(asset.filename, asset);
    cursor = page.items?.length ? page.cursor : undefined;
  } while (cursor);
  return byName;
}

function readState(): ImportState {
  return existsSync(STATE_FILE)
    ? (JSON.parse(readFileSync(STATE_FILE, "utf8")) as ImportState)
    : {};
}

function counts(values: Iterable<string>) {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

const env = loadEnv(readFileSync(".env.local", "utf8"));
const writeToken = env.PRISMIC_WRITE_TOKEN;
if (!writeToken) {
  throw new Error(
    "Set PRISMIC_WRITE_TOKEN in .env.local. Prismic → Settings → API & Security → Write APIs.",
  );
}

const exportDate =
  args.export ??
  readdirSync(RAW_DIR)
    .filter((name) => /^\d{4}-\d{2}-\d{2}$/.test(name))
    .sort()
    .at(-1);
if (!exportDate) throw new Error(`No saved Wix export in ${RAW_DIR}`);

const only = list(args.only);
const replace = list(args.replace);
const saved = loadPosts(exportDate);
const savedSlugs = new Set(saved.map((post) => post.slug));
for (const slug of [...only, ...replace]) {
  if (!savedSlugs.has(slug)) throw new Error(`No saved post with slug ${slug}`);
}

const context = {
  tagLabels: await tagLabels(env),
  redirects: new Map(WIX_REDIRECTS.map(({ from, to }) => [from, to])),
  postSlugs: new Set(saved.flatMap((post) => (post.slug ? [post.slug] : []))),
};
const posts = saved
  .filter((post) => !only.size || only.has(post.slug ?? ""))
  .map((post) => mapWixPost(post, context));

const client = createClient(REPOSITORY, {
  ...(env.PRISMIC_ACCESS_TOKEN
    ? { accessToken: env.PRISMIC_ACCESS_TOKEN }
    : {}),
});
const repository = await client.getRepository();
const lang =
  repository.languages.find((language) => language.is_master)?.id ?? "en-us";
const published = new Map(
  (await client.getAllByType("post", { fetch: "post.title" })).flatMap(
    (document) => (document.uid ? [[document.uid, document.id] as const] : []),
  ),
);
const state = readState();
const library = await libraryAssets(writeToken);

const plans = posts.map((post) => ({
  post,
  plan: planPost(post, published, state, replace, only),
}));
const blocked = plans.filter(({ post }) => post.problems.length);

// Story and cover photos, deduplicated by Wix URL, then split by whether
// the media library already has the file.
const photos = new Map<string, MappedImage>();
for (const { post, plan } of plans) {
  if (plan.action === "skip") continue;
  if (post.data.image) photos.set(post.data.image.url, post.data.image);
  for (const block of post.data.body) {
    if (block.type === "image") photos.set(block.image.url, block.image);
  }
}
const reused = [...photos.values()].filter((photo) =>
  library.has(photo.filename),
);

const report = {
  export: exportDate,
  ranAt: new Date().toISOString(),
  write: args.write,
  summary: {
    posts: plans.length,
    actions: counts(plans.map(({ plan }) => plan.action)),
    photos: photos.size,
    photosAlreadyInPrismic: reused.length,
    photosToUpload: photos.size - reused.length,
    review: counts(plans.flatMap(({ post }) => post.review)),
    tables: plans.reduce(
      (total, { post }) => total + post.data.tables.length,
      0,
    ),
    changes: plans.reduce((total, { post }) => total + post.changes.length, 0),
    blocked: blocked.length,
  },
  posts: plans.map(({ post, plan }) => ({
    uid: post.uid,
    wixId: post.sourceId,
    title: post.title,
    ...plan,
    blocks: counts(post.data.body.map((block) => block.type)),
    linkedPhotos: post.data.body.filter(
      (block) => block.type === "image" && block.link,
    ).length,
    tables: post.data.tables.length,
    tags: post.tags,
    review: post.review,
    problems: post.problems,
    changes: post.changes,
  })),
  result: null as null | {
    created: string[];
    updated: string[];
    error?: string;
  },
};

function writeReport() {
  mkdirSync("migration/reports", { recursive: true });
  const file = `migration/reports/wix-posts-${report.ranAt.replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}

console.log(`Wix export ${exportDate}: ${plans.length} posts`);
console.log(report.summary.actions);
console.log(
  `photos: ${photos.size} (${reused.length} already in Prismic, ${photos.size - reused.length} to upload)`,
);
for (const { post, plan } of plans) {
  if (plan.action === "skip") console.log(`  skip ${post.uid}: ${plan.reason}`);
  if (plan.action === "update")
    console.log(`  update ${post.uid} (${plan.reason})`);
}
console.log("review flags:", report.summary.review);
console.log(`tables: ${report.summary.tables}`);
console.log(`changed on purpose: ${report.summary.changes} (listed per post)`);

if (!args.write) {
  console.log(`dry run. Report: ${writeReport()}`);
  process.exit(0);
}

if (blocked.length) {
  console.log(`Report: ${writeReport()}`);
  throw new Error(
    `${blocked.length} posts have problems the mapper must handle first. Nothing was sent.`,
  );
}

const migration = createMigration();
const assets = new Map<string, PrismicMigrationAsset>();

function migrationAsset(photo: MappedImage) {
  let asset = assets.get(photo.url);
  if (!asset) {
    asset = migration.createAsset(photo.url, photo.filename, {
      alt: photo.alt,
    });
    assets.set(photo.url, asset);
  }
  return asset;
}

/** An image field value for a file the media library already has. */
function libraryImage(asset: Asset, alt: string) {
  return {
    id: asset.id,
    url: asset.url,
    dimensions: { width: asset.width ?? 0, height: asset.height ?? 0 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
    alt: alt || null,
    copyright: null,
  };
}

function coverImage(photo: MappedImage) {
  const existing = library.get(photo.filename);
  return existing ? libraryImage(existing, photo.alt) : migrationAsset(photo);
}

function storyBlock(block: MappedBlock) {
  if (block.type !== "image") return block;
  const existing = library.get(block.image.filename);
  const linkTo = block.link ? { linkTo: block.link } : {};
  return existing
    ? {
        type: "image" as const,
        ...libraryImage(existing, block.image.alt),
        ...linkTo,
      }
    : { type: "image" as const, id: migrationAsset(block.image), ...linkTo };
}

function postDocument(post: MappedPost) {
  return {
    type: "post",
    uid: post.uid,
    lang,
    tags: post.tags,
    data: {
      title: post.data.title,
      sub_title: post.data.sub_title,
      body: post.data.body.map(storyBlock),
      ...(post.data.tables.length ? { tables: post.data.tables } : {}),
      ...(post.data.image ? { image: coverImage(post.data.image) } : {}),
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
  };
}

const sent: Array<{
  post: MappedPost;
  plan: PostAction;
  document: PrismicMigrationDocument;
}> = [];
for (const { post, plan } of plans) {
  if (plan.action === "skip") continue;
  // The generated Post type describes a fetched document, so every field is
  // required. This release only writes the fields the Wix post actually has.
  const document = postDocument(post) as PendingPrismicDocument<PostDocument>;
  sent.push({
    post,
    plan,
    document:
      plan.action === "create"
        ? migration.createDocument(document, post.title)
        : migration.updateDocument(
            // The Migration API reads the id. The other fetched-document
            // fields (url, dates, versions) are not sent.
            {
              ...document,
              id: plan.prismicId,
            } as ExistingPrismicDocument<PostDocument>,
            post.title,
          ),
  });
}

const writeClient = createWriteClient(REPOSITORY, { writeToken });
let failure: unknown;
try {
  await writeClient.migrate(migration, {
    reporter(event) {
      if (
        event.type === "assets:creating" ||
        event.type === "documents:creating" ||
        event.type === "documents:updating"
      ) {
        const { current, total } = event.data;
        if (current === total || current % 10 === 0)
          console.log(`${event.type} ${current}/${total}`);
      }
    },
  });
} catch (error) {
  failure = error;
} finally {
  // Record every document Prismic created, even when the run stopped
  // partway, so the next run updates it instead of making a duplicate.
  const created: string[] = [];
  const updated: string[] = [];
  for (const { post, plan, document } of sent) {
    const id = document.document.id;
    if (!id) continue;
    if (plan.action === "create") created.push(post.uid);
    else if (!failure) updated.push(post.uid);
    state[post.sourceId] = { uid: post.uid, prismicId: id };
  }
  mkdirSync("migration/state", { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
  report.result = {
    created,
    updated,
    ...(failure
      ? { error: failure instanceof Error ? failure.message : String(failure) }
      : {}),
  };
  console.log(
    `created ${created.length}, updated ${updated.length}. Report: ${writeReport()}`,
  );
}
if (failure) throw failure;
console.log("The migration release is not published.");
