// Turns the Redirect document into the list Next serves at build time.
// A row with no destination, or one that points at itself, is left out.

export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

type RedirectLink = { link_type?: string; url?: string | null };

export function redirectRules(
  rows: readonly {
    from?: string | null;
    to?: RedirectLink | null;
    redirect_type?: string | null;
  }[],
): RedirectRule[] {
  const rules: RedirectRule[] = [];
  for (const row of rows) {
    const source = row.from?.trim();
    const destination = row.to?.url?.trim();
    if (!source || !destination || source === destination) continue;
    rules.push({
      source,
      destination,
      permanent: row.redirect_type !== "302 temporary",
    });
  }
  return rules;
}
