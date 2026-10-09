// Saves unmodified Wix Blog query responses under migration/raw/.
// Reads .env.local. Does not send WIX_ACCOUNT_ID: the ID on the API Keys
// page is rejected unless it is the account that owns the site.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const POSTS_URL = "https://www.wixapis.com/blog/v3/posts/query";
const PAGE_SIZE = 20;
const FIELDSETS = [
  "URL",
  "CONTENT_TEXT",
  "METRICS",
  "SEO",
  "RICH_CONTENT",
  "REFERENCE_ID",
];

function loadEnv(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

async function queryPosts(headers, cursor) {
  const response = await fetch(POSTS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      fieldsets: FIELDSETS,
      query: { cursorPaging: { limit: PAGE_SIZE, cursor } },
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Wix blog query failed with HTTP ${response.status}`);
  }
  return body;
}

const env = loadEnv(await readFile(".env.local", "utf8"));
if (!env.WIX_API_KEY || !env.WIX_SITE_ID) {
  throw new Error("WIX_API_KEY and WIX_SITE_ID must be set in .env.local");
}

const headers = {
  "Content-Type": "application/json",
  Authorization: env.WIX_API_KEY,
  "wix-site-id": env.WIX_SITE_ID,
};

const date = new Date().toISOString().slice(0, 10);
const directory = join("migration", "raw", date, "blog");
await mkdir(directory, { recursive: true });

let cursor;
let page = 0;
let count = 0;
do {
  page += 1;
  const body = await queryPosts(headers, cursor);
  const payload = JSON.parse(body);
  const posts = Array.isArray(payload.posts) ? payload.posts : [];
  count += posts.length;
  const file = join(directory, `posts-${String(page).padStart(3, "0")}.json`);
  await writeFile(file, `${body}\n`);
  cursor = payload.pagingMetadata?.cursors?.next;
  console.log(`${file} ${posts.length} posts`);
} while (cursor);

console.log(`saved ${count} posts in ${page} pages`);
