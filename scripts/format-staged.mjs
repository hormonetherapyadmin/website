// Formats staged files with Prettier so `pnpm format:check` passes in CI.
// Run by .githooks/pre-commit.
import { execFileSync } from "node:child_process";

const prettier = "node_modules/.bin/prettier";

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

const staged = git(
  "diff",
  "--cached",
  "--name-only",
  "--diff-filter=ACMR",
  "-z",
);
if (staged.length === 0) process.exit(0);

// Re-staging a partially staged file would also stage its unstaged edits,
// so those files are only checked.
const partial = new Set(git("diff", "--name-only", "-z", "--", ...staged));
const toFormat = staged.filter((file) => !partial.has(file));
const toCheck = staged.filter((file) => partial.has(file));

if (toFormat.length > 0) {
  execFileSync(
    prettier,
    ["--write", "--ignore-unknown", "--log-level", "warn", ...toFormat],
    { stdio: "inherit" },
  );
  git("add", "--", ...toFormat);
}

if (toCheck.length > 0) {
  try {
    execFileSync(prettier, ["--check", "--ignore-unknown", ...toCheck], {
      stdio: "inherit",
    });
  } catch {
    console.error(
      "\npre-commit: these files are partly staged and not formatted.\n" +
        "Run `pnpm format`, stage the result, and commit again.",
    );
    process.exit(1);
  }
}
