// Formats staged files with Prettier so `pnpm format:check` passes in CI.
// Run by .githooks/pre-commit.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { formatContent, formatFiles } from "./format.mjs";

const prettier = "node_modules/.bin/prettier";
const maxBuffer = 50 * 1024 * 1024;

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

function prettierInfo(file) {
  return JSON.parse(
    execFileSync(prettier, ["--file-info", file], { encoding: "utf8" }),
  );
}

const staged = git(
  "diff",
  "--cached",
  "--name-only",
  "--diff-filter=ACMR",
  "-z",
);
if (staged.length === 0) process.exit(0);

// Re-staging a partially staged file would also stage its unstaged edits.
// Do that only when those edits disappear after the same Prettier pass.
const partial = new Set(git("diff", "--name-only", "-z", "--", ...staged));
const toFormat = staged.filter((file) => !partial.has(file));
const toCheck = staged.filter((file) => partial.has(file));

if (toFormat.length > 0) {
  formatFiles(toFormat);
  git("add", "--", ...toFormat);
}

const blocked = [];
const formatted = [];

for (const file of toCheck) {
  const info = prettierInfo(file);
  if (info.ignored || info.inferredParser == null) continue;

  try {
    const formattedWork = formatContent(file, readFileSync(file));
    const formattedIndex = formatContent(
      file,
      execFileSync("git", ["show", `:${file}`], { maxBuffer }),
    );
    if (!formattedWork.equals(formattedIndex)) {
      blocked.push(file);
      continue;
    }
    writeFileSync(file, formattedWork);
    formatted.push(file);
  } catch {
    blocked.push(file);
  }
}

if (formatted.length > 0) git("add", "--", ...formatted);

if (blocked.length > 0) {
  console.error(
    "\npre-commit: these files are partly staged and have unstaged edits that are not formatting:\n" +
      blocked.map((file) => `  ${file}`).join("\n") +
      "\nStage or stash those edits, then commit again.",
  );
  process.exit(1);
}
