// Formats files with Prettier until `prettier --check` passes.
//
// Prettier 3.9 is not idempotent on the intersection comments in
// prismicio-types.d.ts, which the Prismic CLI rewrites. One --write
// leaves `} & { // Group`, and --check still fails. A second --write
// moves the comment onto its own line, which is the stable form.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const prettier = "node_modules/.bin/prettier";

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

export function formatFiles(files) {
  write(files);
  try {
    check(files, "ignore");
  } catch {
    write(files);
    check(files, "inherit");
  }
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  formatFiles(process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["."]);
}
