// Sends the composed site pages to the Prismic migration release.
// Never publishes the release. Without --write it only writes a report.
//
//   node scripts/import-site-pages.mts            dry run
//   node scripts/import-site-pages.mts --write    send them to Prismic
//   --only <uid,uid>     limit the run. A page already in the release is
//                        re-imported only when named here
//   --replace <uid,uid>  overwrite these published pages
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
import type {
  HomepageDocument,
  PageDocument,
  ProviderDocument,
} from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import { planPost, type ImportState } from "../src/migration/post-plan.ts";
import {
  HOMEPAGE,
  SITE_PAGES,
  pageImages,
  replaceImages,
  type LocalImage,
  type SitePage,
} from "../src/migration/site-pages.ts";

const REPOSITORY = prismicConfig.repositoryName;
const STATE_FILE = "migration/state/site-pages.json";

type Asset = {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
};

const { values: args } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    only: { type: "string" },
    replace: { type: "string" },
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

function readState(): ImportState {
  return existsSync(STATE_FILE)
    ? (JSON.parse(readFileSync(STATE_FILE, "utf8")) as ImportState)
    : {};
}

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

function counts(values: Iterable<string>) {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

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

const ALLOY_ID = "asz9cxcAADEAer1m";
const INNER_BALANCE_ID = "asf4zhEAAC4AYFel";

const known = new Set([...SITE_PAGES.map((page) => page.uid), HOMEPAGE.uid]);
const only = list(args.only);
const replace = list(args.replace);
for (const uid of [...only, ...replace]) {
  if (!known.has(uid)) throw new Error(`No site page with uid ${uid}`);
}

const env = loadEnv(readFileSync(".env.local", "utf8"));
const writeToken = env.PRISMIC_WRITE_TOKEN;
if (!writeToken) {
  throw new Error(
    "Set PRISMIC_WRITE_TOKEN in .env.local. Prismic → Settings → API & Security → Write APIs.",
  );
}

const selected = SITE_PAGES.filter((page) => !only.size || only.has(page.uid));
const client = createClient(REPOSITORY, {
  ...(env.PRISMIC_ACCESS_TOKEN
    ? { accessToken: env.PRISMIC_ACCESS_TOKEN }
    : {}),
});
const repository = await client.getRepository();
const lang =
  repository.languages.find((language) => language.is_master)?.id ?? "en-us";
const published = new Map(
  (await client.getAllByType("page", { lang: "*" })).flatMap((document) =>
    document.uid ? [[document.uid, document.id] as const] : [],
  ),
);
const [homepageDocument, alloy, innerBalance] = await Promise.all([
  client.getSingle<HomepageDocument>("homepage").catch(() => null),
  client.getByID<ProviderDocument>(ALLOY_ID).catch(() => null),
  client.getByID<ProviderDocument>(INNER_BALANCE_ID).catch(() => null),
]);
if (homepageDocument && homepageDocument.id !== HOMEPAGE.id) {
  throw new Error(
    `Homepage id is ${homepageDocument.id}, expected ${HOMEPAGE.id}`,
  );
}
if (alloy && alloy.uid !== "alloy") {
  throw new Error(`Document ${ALLOY_ID} is ${alloy.uid}, not alloy`);
}
if (innerBalance && innerBalance.uid !== "inner-balance") {
  throw new Error(
    `Document ${INNER_BALANCE_ID} is ${innerBalance.uid}, not inner-balance`,
  );
}
const state = readState();
const library = await libraryAssets(writeToken);

const plans = selected.map((page) => {
  const missing = pageImages(page)
    .filter((image) => !existsSync(image.path))
    .map((image) => `missing photo ${image.path}`);
  return {
    page,
    plan: planPost(
      { sourceId: page.sourceId, uid: page.uid, problems: missing },
      published,
      state,
      replace,
      only,
    ),
  };
});
const homepageMissing = pageImages(HOMEPAGE)
  .filter((image) => !existsSync(image.path))
  .map((image) => `missing photo ${image.path}`);
const homepagePlan =
  !only.size || only.has(HOMEPAGE.uid)
    ? {
        page: HOMEPAGE,
        plan: planPost(
          {
            sourceId: HOMEPAGE.sourceId,
            uid: HOMEPAGE.uid,
            problems: homepageMissing,
          },
          new Map(
            homepageDocument
              ? [[HOMEPAGE.uid, homepageDocument.id] as const]
              : [],
          ),
          state,
          replace,
          only,
        ),
      }
    : null;
const jobs = homepagePlan ? [...plans, homepagePlan] : plans;
const blocked = jobs.filter(({ page }) =>
  pageImages(page).some((image) => !existsSync(image.path)),
);

const photos = new Map<string, LocalImage>();
for (const { page, plan } of jobs) {
  if (plan.action === "skip") continue;
  for (const image of pageImages(page)) photos.set(image.filename, image);
}
const reused = [...photos.values()].filter((image) =>
  library.has(image.filename),
);

const report = {
  ranAt: new Date().toISOString(),
  write: Boolean(args.write),
  summary: {
    pages: jobs.length,
    actions: counts(jobs.map(({ plan }) => plan.action)),
    photos: photos.size,
    photosAlreadyInPrismic: reused.length,
    photosToUpload: photos.size - reused.length,
    blocked: blocked.length,
  },
  pages: jobs.map(({ page, plan }) => ({
    uid: page.uid,
    title: page.title,
    ...plan,
    slices: page.slices.map(
      (slice) => `${slice.slice_type}/${slice.variation}`,
    ),
    review: page.review,
    changes: page.changes,
  })),
  result: null as null | {
    created: string[];
    updated: string[];
    error?: string;
  },
};

function writeReport() {
  mkdirSync("migration/reports", { recursive: true });
  const file = `migration/reports/site-pages-${report.ranAt.replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}

console.log(`${jobs.length} site pages`);
console.log(report.summary.actions);
console.log(
  `photos: ${photos.size} (${reused.length} already in Prismic, ${photos.size - reused.length} to upload)`,
);
if (alloy) {
  const next =
    alloy.data.name === "Alloy" ? "already Alloy" : "will become Alloy";
  console.log(`alloy name: ${alloy.data.name ?? "(empty)"} (${next})`);
}
for (const { page, plan } of jobs) {
  if (plan.action === "skip") console.log(`  skip ${page.uid}: ${plan.reason}`);
  if (plan.action === "update")
    console.log(`  update ${page.uid} (${plan.reason})`);
  for (const note of page.review) console.log(`  review ${page.uid}: ${note}`);
  for (const change of page.changes)
    console.log(`  change ${page.uid}: ${change}`);
}

if (!args.write) {
  console.log(`dry run. Report: ${writeReport()}`);
  process.exit(0);
}

if (blocked.length) {
  console.log(`Report: ${writeReport()}`);
  throw new Error(
    `${blocked.length} pages have missing photos. Nothing was sent.`,
  );
}

const migration = createMigration();
const assets = new Map<string, PrismicMigrationAsset>();

function imageField(image: LocalImage) {
  const existing = library.get(image.filename);
  if (existing) return libraryImage(existing, image.alt);
  let asset = assets.get(image.filename);
  if (!asset) {
    const bytes = readFileSync(image.path);
    const file = new File([bytes], image.filename, { type: "image/jpeg" });
    asset = migration.createAsset(file, image.filename, { alt: image.alt });
    assets.set(image.filename, asset);
  }
  return asset;
}

function pageDocument(page: SitePage) {
  return {
    type: "page" as const,
    uid: page.uid,
    lang,
    data: {
      slices: replaceImages(page.slices, (image) => imageField(image)),
      indexing: true,
    },
  };
}

function homepageDocumentData() {
  return {
    ...(homepageDocument?.data ?? {
      footer_copyright_text: HOMEPAGE.footer_copyright_text,
      footer_cookies_link: HOMEPAGE.footer_cookies_link,
      footer_social_links: HOMEPAGE.footer_social_links,
    }),
    meta_title: HOMEPAGE.meta_title,
    meta_description: HOMEPAGE.meta_description,
    slices: replaceImages(HOMEPAGE.slices, (image) => imageField(image)),
  };
}

const sent: Array<{
  page: SitePage;
  plan: (typeof plans)[number]["plan"];
  document: PrismicMigrationDocument<PageDocument | HomepageDocument>;
}> = [];
for (const { page, plan } of plans) {
  if (plan.action === "skip") continue;
  const document = pageDocument(page) as PendingPrismicDocument<PageDocument>;
  sent.push({
    page,
    plan,
    document:
      plan.action === "create"
        ? migration.createDocument(document, page.title)
        : migration.updateDocument(
            {
              ...document,
              id: plan.prismicId,
            } as ExistingPrismicDocument<PageDocument>,
            page.title,
          ),
  });
}

if (homepagePlan && homepagePlan.plan.action !== "skip") {
  const data = homepageDocumentData();
  const document = {
    type: "homepage" as const,
    lang,
    data,
  };
  sent.push({
    page: HOMEPAGE,
    plan: homepagePlan.plan,
    document:
      homepagePlan.plan.action === "create"
        ? migration.createDocument(
            document as PendingPrismicDocument<HomepageDocument>,
            HOMEPAGE.title,
          )
        : migration.updateDocument(
            {
              ...document,
              id: homepagePlan.plan.prismicId,
            } as ExistingPrismicDocument<HomepageDocument>,
            HOMEPAGE.title,
          ),
  });
}

const innerBalanceSent = sent.some((item) => item.page.uid === "inner-balance");
if (innerBalanceSent && innerBalance) {
  const visit = innerBalance.data.visit;
  const visitHasText =
    visit &&
    "text" in visit &&
    typeof visit.text === "string" &&
    visit.text.trim().length > 0;
  migration.updateDocument(
    {
      ...innerBalance,
      data: {
        ...innerBalance.data,
        ...(visit && visit.link_type === "Web" && !visitHasText
          ? { visit: { ...visit, text: "Visit Inner Balance" } }
          : {}),
        page: {
          link_type: "Document" as const,
          id: () => migration.getByUID("page", "inner-balance"),
        },
      },
    } as ExistingPrismicDocument<ProviderDocument>,
    innerBalance.data.name || "Inner Balance",
  );
  console.log("inner-balance brand page will point at the new page");
}

const homepageSent = sent.some((item) => item.page.uid === "homepage");
if (homepageSent && alloy && alloy.data.name !== "Alloy") {
  migration.updateDocument(
    {
      ...alloy,
      data: { ...alloy.data, name: "Alloy" },
    } as ExistingPrismicDocument<ProviderDocument>,
    "Alloy",
  );
  console.log(
    `alloy name will change from ${alloy.data.name ?? "(empty)"} to Alloy`,
  );
}

if (sent.length === 0) {
  console.log(`Nothing to send. Report: ${writeReport()}`);
  process.exit(0);
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
  const created: string[] = [];
  const updated: string[] = [];
  for (const { page, plan, document } of sent) {
    const id = document.document.id;
    if (!id) continue;
    if (plan.action === "create") created.push(page.uid);
    else if (!failure) updated.push(page.uid);
    state[page.sourceId] = { uid: page.uid, prismicId: id };
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
  console.log(`Report: ${writeReport()}`);
}

if (failure) throw failure;
