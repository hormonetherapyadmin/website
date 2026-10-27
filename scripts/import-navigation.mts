// Sends the header and footer as the Navigation document.
// Never publishes the release. Without --write it only prints the menu.
//
//   node scripts/import-navigation.mts            dry run
//   node scripts/import-navigation.mts --write    send the document
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  createClient,
  createMigration,
  createWriteClient,
  type ExistingPrismicDocument,
} from "@prismicio/client";
import type { NavigationDocument } from "../prismicio-types";
import prismicConfig from "../prismic.config.json" with { type: "json" };
import {
  NAVIGATION_MENU,
  navigationData,
  type MenuPage,
} from "../src/migration/navigation-menu.ts";

const REPOSITORY = prismicConfig.repositoryName;
const STATE_FILE = "migration/state/navigation.json";

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

function labelOf(link: {
  label?: string;
  pageUid?: string;
  providerUid?: string;
}) {
  return link.label || link.providerUid || link.pageUid || "(blank)";
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
const [pageDocuments, published] = await Promise.all([
  client.getAllByType("page"),
  client.getSingle<NavigationDocument>("navigation").catch(() => null),
]);
const pages = new Map<string, MenuPage>();
for (const page of pageDocuments) {
  if (page.uid) pages.set(page.uid, { id: page.id, uid: page.uid });
}

const data = navigationData(pages) as NavigationDocument["data"];
console.log(
  `Button: ${data.header_button_label} → ${data.header_button_link && "url" in data.header_button_link ? data.header_button_link.url : ""}`,
);
for (const item of NAVIGATION_MENU.main) {
  if (!item.links) {
    console.log(item.label);
    continue;
  }
  console.log(item.label);
  for (const link of item.links) {
    const heading = link.columnHeading ? `${link.columnHeading}: ` : "  ";
    console.log(`${heading}${labelOf(link)}`);
  }
}
for (const column of NAVIGATION_MENU.footer) {
  console.log(
    `Footer ${column.heading}: ${column.links.map(labelOf).join(", ")}`,
  );
}

const state = existsSync(STATE_FILE)
  ? (JSON.parse(readFileSync(STATE_FILE, "utf8")) as { prismicId?: string })
  : {};
const existingId = published?.id ?? state.prismicId;
console.log(
  existingId
    ? `will update ${existingId}`
    : "will create the Navigation document",
);

if (!args.write) {
  console.log("dry run. Nothing was sent.");
  process.exit(0);
}

const migration = createMigration();
const document = existingId
  ? migration.updateDocument(
      {
        id: existingId,
        type: "navigation",
        lang: published?.lang ?? lang,
        data,
      } as ExistingPrismicDocument<NavigationDocument>,
      "Main Nav",
    )
  : migration.createDocument({ type: "navigation", lang, data }, "Main Nav");

const writeClient = createWriteClient(REPOSITORY, { writeToken });
await writeClient.migrate(migration);
const id = document.document.id;
if (!id) throw new Error("Prismic did not return an id for Navigation");
mkdirSync("migration/state", { recursive: true });
writeFileSync(STATE_FILE, `${JSON.stringify({ prismicId: id }, null, 2)}\n`);
console.log(`Sent ${id}. The release is not published.`);
