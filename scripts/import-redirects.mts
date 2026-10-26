// Sends the approved redirects as one Redirect document.
// Never publishes the release. Without --write it only prints the rows.
//
//   node scripts/import-redirects.mts            dry run
//   node scripts/import-redirects.mts --write    send the document
//
// --write replaces the whole list with src/migration/wix-redirects.ts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  createClient,
  createMigration,
  createWriteClient,
  type ExistingPrismicDocument,
  type PrismicDocument,
} from "@prismicio/client";
import type { RedirectDocument } from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import {
  redirectRows,
  type RedirectTarget,
} from "../src/migration/redirect-rows.ts";
import { WIX_REDIRECTS } from "../src/migration/wix-redirects.ts";

const REPOSITORY = prismicConfig.repositoryName;
const STATE_FILE = "migration/state/redirect.json";

const { values: args } = parseArgs({
  options: { write: { type: "boolean", default: false } },
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

function pathOf(document: PrismicDocument) {
  if (document.type === "homepage") return "/";
  if (!("uid" in document) || !document.uid) return null;
  return document.type === "post"
    ? `/post/${document.uid}`
    : `/${document.uid}`;
}

const env = loadEnv(readFileSync(".env.local", "utf8"));
const writeToken = env.PRISMIC_WRITE_TOKEN;
if (!writeToken) {
  throw new Error(
    "Set PRISMIC_WRITE_TOKEN in .env.local. Prismic → Settings → API & Security → Write APIs.",
  );
}

const client = createClient(REPOSITORY, {
  ...(env.PRISMIC_ACCESS_TOKEN
    ? { accessToken: env.PRISMIC_ACCESS_TOKEN }
    : {}),
});
const repository = await client.getRepository();
const lang =
  repository.languages.find((language) => language.is_master)?.id ?? "en-us";

const [pages, posts, homepage, published] = await Promise.all([
  client.getAllByType("page", { lang: "*" }),
  client.getAllByType("post", { lang: "*" }),
  client.getSingle("homepage"),
  client.getSingle<RedirectDocument>("redirect").catch(() => null),
]);

const targets = new Map<string, RedirectTarget>();
const livePaths = new Set<string>();
for (const document of [homepage, ...pages, ...posts]) {
  const path = pathOf(document);
  if (!path) continue;
  livePaths.add(path);
  const type =
    document.type === "homepage" || document.type === "post"
      ? document.type
      : "page";
  targets.set(path, {
    id: document.id,
    type,
    uid: "uid" in document ? document.uid : null,
  });
}

const rows = redirectRows(WIX_REDIRECTS, targets, livePaths);
for (const row of rows) console.log(`${row.from} → ${row.to.url}`);
console.log(`${rows.length} redirects, all 301 permanent`);

const state = existsSync(STATE_FILE)
  ? (JSON.parse(readFileSync(STATE_FILE, "utf8")) as { prismicId?: string })
  : {};
const existingId = published?.id ?? state.prismicId;
console.log(
  existingId
    ? `will update ${existingId}`
    : "will create the Redirect document",
);

if (!args.write) {
  console.log("dry run. Nothing was sent.");
  process.exit(0);
}

const migration = createMigration();
const data = { redirects: rows } as RedirectDocument["data"];
const document = existingId
  ? migration.updateDocument(
      {
        id: existingId,
        type: "redirect",
        lang: published?.lang ?? lang,
        data,
      } as ExistingPrismicDocument<RedirectDocument>,
      "Redirects",
    )
  : migration.createDocument({ type: "redirect", lang, data }, "Redirects");

const writeClient = createWriteClient(REPOSITORY, { writeToken });
await writeClient.migrate(migration);
const id = document.document.id;
if (!id)
  throw new Error("Prismic did not return an id for the Redirect document");
mkdirSync("migration/state", { recursive: true });
writeFileSync(STATE_FILE, `${JSON.stringify({ prismicId: id }, null, 2)}\n`);
console.log(`Sent ${id}. The release is not published.`);
