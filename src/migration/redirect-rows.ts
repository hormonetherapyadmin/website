// Turns the approved redirect list into the repeatable group on the
// one Redirect document. Every To is a document link, so the address
// follows that document. A problem here stops the import.

import type { WixRedirect } from "./wix-redirects.ts";

export type RedirectTarget = {
  id: string;
  type: "homepage" | "page" | "post";
  uid?: string | null;
};

export type RedirectRow = {
  from: string;
  to: {
    link_type: "Document";
    id: string;
    type: RedirectTarget["type"];
    uid?: string;
    url: string;
  };
  redirect_type: "301 permanent";
  reason: string;
};

export function redirectRows(
  rows: readonly WixRedirect[],
  targets: ReadonlyMap<string, RedirectTarget>,
  livePaths: ReadonlySet<string>,
): RedirectRow[] {
  const problems: string[] = [];
  const froms = new Set<string>();

  for (const row of rows) {
    if (!row.from.startsWith("/") || row.from !== row.from.toLowerCase()) {
      problems.push(`${row.from} must be a lowercase path starting with /`);
    }
    if (row.from.length > 1 && row.from.endsWith("/")) {
      problems.push(`${row.from} has a trailing slash`);
    }
    if (froms.has(row.from)) problems.push(`${row.from} is listed twice`);
    froms.add(row.from);
    if (livePaths.has(row.from)) problems.push(`${row.from} is a live page`);
    if (!row.reason.trim()) problems.push(`${row.from} has no reason`);
    if (row.from === row.to) problems.push(`${row.from} points at itself`);
    if (!targets.has(row.to)) {
      problems.push(`${row.from} goes to ${row.to}, which is not a document`);
    }
  }

  for (const row of rows) {
    if (froms.has(row.to))
      problems.push(`${row.from} chains through ${row.to}`);
  }

  if (problems.length) {
    throw new Error(problems.join("\n"));
  }

  return rows.map((row) => {
    const target = targets.get(row.to);
    if (!target) throw new Error(`${row.to} disappeared`);
    return {
      from: row.from,
      to: {
        link_type: "Document",
        id: target.id,
        type: target.type,
        ...(target.uid ? { uid: target.uid } : {}),
        url: row.to,
      },
      redirect_type: "301 permanent",
      reason: row.reason,
    };
  });
}
