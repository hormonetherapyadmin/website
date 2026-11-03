// Fills an empty Meta title or Meta description on the Homepage, Pages,
// and Blog posts. Leaves a field that already has text. Does not publish
// unless --publish is passed.
//
//   node scripts/set-page-seo.mts            dry run
//   node scripts/set-page-seo.mts --write    send the updates
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
import type {
  HomepageDocument,
  PageDocument,
  PostDocument,
} from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import { HOMEPAGE, SITE_PAGES } from "../src/migration/site-pages.ts";

const REPOSITORY = prismicConfig.repositoryName;
const { values: args } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    publish: { type: "boolean", default: false },
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
if (!env.PRISMIC_WRITE_TOKEN) {
  throw new Error("PRISMIC_WRITE_TOKEN must be set in .env.local");
}

/** Pages that live in Prismic and are not in the site-page source. */
const PAGE_SEO: Record<string, { title: string; description: string }> = {
  blog: {
    title:
      "Blog Posts and information on Bioidentical Hormone Replacement Therapies",
    description:
      "Clinic reviews, pricing, and what I've learned. Does HRT help with weight loss, hair thinning, night sweats, hot flashes, mood, and sleep?",
  },
  "trusted-providers": {
    title: "Trusted providers | Hormone Therapy Hub",
    description:
      "Seven telehealth clinics I've been a patient at, what each one was best at for me, and the codes I use.",
  },
  "trackers-and-testing": {
    title: "Trackers & Testing | Hormone Therapy Hub",
    description:
      "Hormone trackers I used when one blood draw came back normal, including Mira and Proov, and what they showed me.",
  },
};

/** Posts whose Wix meta description was empty. */
const POST_DESCRIPTIONS: Record<string, string> = {
  "winona-hormone-replacement-therapy-review-updated-2025-new-products-and-prices":
    "I became a Winona patient in March 2024. What I was first prescribed, what I use now, and the products and prices on the page.",
  "midi-health-vs-gennev-for-hormone-replacement-which-is-the-most-affordable":
    "Midi Health and Gennev both start with a 30-minute consult. How they compare on cost, insurance, and whether you meet a doctor.",
  "alloy-m4-tretinoin-face-creams-before-after":
    "Alloy's M4 and tretinoin face creams: what I used, how long they lasted, and my before-and-after while on menopause HRT.",
  "oestra-by-inner-balance-vs-midi-health":
    "I've been a patient of both Inner Balance and Midi Health. How Oestra and Midi compare, from my own care. Not medical advice.",
  "fountain-hrt-vs-winona-vs-midi-health":
    "Fountain HRT, Winona, and Midi Health compared on products and cost. I've been a patient of Winona and Midi, not Fountain.",
  "my-alloy-for-menopause-cost-to-get-started":
    "What Alloy prescribed me when I started, what it cost, and the code I use for $10 off a first order.",
  "is-the-estrogen-patch-bioidentical":
    "Is the estrogen patch bioidentical? What I've learned as a patient who has tried several telehealth hormone clinics.",
};

const pageSeo = new Map<string, { title: string; description: string }>();
for (const page of SITE_PAGES) {
  const title = page.meta_title?.trim() ?? "";
  const description = page.meta_description?.trim() ?? "";
  if (!title || !description) {
    throw new Error(`${page.uid} is missing SEO copy in the site-page source`);
  }
  pageSeo.set(page.uid, { title, description });
}
pageSeo.set("/", {
  title: HOMEPAGE.meta_title.trim(),
  description: HOMEPAGE.meta_description.trim(),
});
for (const [uid, copy] of Object.entries(PAGE_SEO)) {
  pageSeo.set(uid, copy);
}

const client = createClient(REPOSITORY, {
  ...(env.PRISMIC_ACCESS_TOKEN
    ? { accessToken: env.PRISMIC_ACCESS_TOKEN }
    : {}),
});

type SeoDocument =
  | ExistingPrismicDocument<HomepageDocument>
  | ExistingPrismicDocument<PageDocument>
  | ExistingPrismicDocument<PostDocument>;

type SeoUpdate = {
  label: string;
  document: SeoDocument;
  title: string;
  description: string;
};

const updates: SeoUpdate[] = [];
const problems: string[] = [];

function withSeo<T extends HomepageDocument | PageDocument | PostDocument>(
  document: ExistingPrismicDocument<T>,
  update: { title: string; description: string },
): ExistingPrismicDocument<T> {
  return {
    ...document,
    data: {
      ...document.data,
      meta_title: update.title,
      meta_description: update.description,
    },
  } as ExistingPrismicDocument<T>;
}

function queue(
  label: string,
  document: SeoDocument,
  currentTitle: string | null | undefined,
  currentDescription: string | null | undefined,
  copy: { title: string; description: string } | undefined,
) {
  const title = currentTitle?.trim() ?? "";
  const description = currentDescription?.trim() ?? "";
  if (title && description) return;
  const nextTitle = title || copy?.title?.trim() || "";
  const nextDescription = description || copy?.description?.trim() || "";
  if (!nextTitle || !nextDescription) {
    problems.push(`${label} has no SEO copy`);
    return;
  }
  updates.push({
    label,
    document,
    title: nextTitle,
    description: nextDescription,
  });
}

const homepage = await client.getSingle("homepage");
queue(
  "/",
  homepage as ExistingPrismicDocument<HomepageDocument>,
  homepage.data.meta_title,
  homepage.data.meta_description,
  pageSeo.get("/"),
);

for (const page of await client.getAllByType("page")) {
  queue(
    `/${page.uid}`,
    page as ExistingPrismicDocument<PageDocument>,
    page.data.meta_title,
    page.data.meta_description,
    page.uid ? pageSeo.get(page.uid) : undefined,
  );
}

for (const post of await client.getAllByType("post")) {
  const title = asText(post.data.title).trim();
  const uid = post.uid ?? post.id;
  queue(
    `/post/${uid}`,
    post as ExistingPrismicDocument<PostDocument>,
    post.data.meta_title,
    post.data.meta_description,
    {
      title,
      description: POST_DESCRIPTIONS[uid] ?? "",
    },
  );
}

if (problems.length) {
  for (const problem of problems) console.log(`problem: ${problem}`);
  throw new Error("SEO copy is missing for a published page");
}

console.log(`to update ${updates.length}`);
for (const update of updates) {
  const currentTitle = (
    update.document.data as { meta_title?: string | null }
  ).meta_title?.trim();
  const currentDescription = (
    update.document.data as { meta_description?: string | null }
  ).meta_description?.trim();
  console.log(update.label);
  if (!currentTitle) console.log(`  title: ${update.title}`);
  if (!currentDescription) console.log(`  description: ${update.description}`);
}

if (!args.write) {
  console.log("Dry run. Nothing was sent.");
  process.exit(0);
}

const migration = createMigration();
for (const update of updates) {
  const document = update.document;
  if (document.type === "homepage") {
    migration.updateDocument(withSeo(document, update), update.label);
  } else if (document.type === "page") {
    migration.updateDocument(withSeo(document, update), update.label);
  } else if (document.type === "post") {
    migration.updateDocument(withSeo(document, update), update.label);
  }
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
console.log(`Updated ${updates.length} documents in the migration release.`);

if (!args.publish) {
  console.log("The migration release is not published.");
  process.exit(0);
}

const published = await writeClient.publishMigrationRelease();
console.log(`Published ${published.totalItems} documents.`);
