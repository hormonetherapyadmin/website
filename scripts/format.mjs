// Formats files with Prettier until a write no longer changes them.
//
// Prettier 3.9 is not idempotent on the intersection comments in
// prismicio-types.d.ts, which the Prismic CLI rewrites. Intermediate
// results can already pass `prettier --check`, so stop only when the
// bytes settle.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const prettier = "node_modules/.bin/prettier";
const maxBuffer = 50 * 1024 * 1024;
const maxPasses = 5;

function write(files) {
  execFileSync(
    prettier,
    ["--write", "--ignore-unknown", "--log-level", "warn", ...files],
    { stdio: "inherit" },
  );
}

function check(files, stdio) {
  execFileSync(prettier, ["--check", "--ignore-unknown", ...files], {
    stdio,
  });
}

function isDirectory(file) {
  try {
    return statSync(file).isDirectory();
  } catch {
    return false;
  }
}

function treeHash(root) {
  const hash = createHash("sha256");
  const walk = (current) => {
    const entries = readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      if (
        entry.name === ".git" ||
        entry.name === "node_modules" ||
        entry.name === ".next"
      ) {
        continue;
      }
      const path = join(current, entry.name);
      hash.update(path);
      if (entry.isDirectory()) walk(path);
      else hash.update(readFileSync(path));
    }
  };
  walk(root);
  return hash.digest();
}

export function formatContent(file, input) {
  let current = Buffer.isBuffer(input) ? input : Buffer.from(input);
  for (let pass = 0; pass < maxPasses; pass++) {
    const next = execFileSync(
      prettier,
      ["--stdin-filepath", file, "--log-level", "warn"],
      { input: current, maxBuffer },
    );
    if (next.equals(current)) {
      execFileSync(prettier, ["--check", "--stdin-filepath", file], {
        input: next,
        maxBuffer,
        stdio: "ignore",
      });
      return next;
    }
    current = next;
  }
  execFileSync(prettier, ["--check", "--stdin-filepath", file], {
    input: current,
    maxBuffer,
    stdio: ["pipe", "inherit", "inherit"],
  });
  return current;
}

export function formatFiles(files) {
  const directories = files.filter(isDirectory);
  const concrete = files.filter((file) => !isDirectory(file));

  for (let pass = 0; pass < maxPasses; pass++) {
    const before = directories.map(treeHash);
    if (directories.length > 0) write(directories);
    if (directories.every((dir, index) => treeHash(dir).equals(before[index])))
      break;
  }

  for (let pass = 0; pass < maxPasses; pass++) {
    const before = concrete.map((file) => readFileSync(file));
    if (concrete.length > 0) write(concrete);
    if (
      concrete.every((file, index) => readFileSync(file).equals(before[index]))
    )
      break;
  }

  if (files.length > 0) check(files, "inherit");
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  formatFiles(process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["."]);
}
