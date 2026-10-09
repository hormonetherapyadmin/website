"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { groupResults, resultLead, type SearchHit } from "@/lib/search";
import styles from "./search.module.css";

const EMPTY_PROMPT = "Enter a search term above to find pages and blog posts.";

export function SearchExperience({
  hits,
  initialQuery,
  palette,
  serif,
}: {
  hits: readonly SearchHit[];
  initialQuery: string;
  palette?: string;
  serif?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const groups = useMemo(() => groupResults(hits, query), [hits, query]);
  const count = groups.reduce((sum, group) => sum + group.hits.length, 0);
  const term = query.trim();

  function onQuery(value: string) {
    setQuery(value);
    const params = new URLSearchParams(window.location.search);
    const next = value.trim();
    if (next) params.set("q", next);
    else params.delete("q");
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `/search?${search}` : "/search",
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Search</h1>
      <form
        className={styles.form}
        role="search"
        action="/search"
        method="get"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={styles.field}>
          <label className={styles.iconLabel} htmlFor="site-search">
            <span className={styles.srOnly}>Search pages and blog posts</span>
            <SearchIcon />
          </label>
          <input
            id="site-search"
            className={styles.input}
            name="q"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={200}
            placeholder="Search Hormone Therapy Hub"
            value={query}
            aria-controls="search-results"
            autoFocus
            onChange={(event) => onQuery(event.target.value)}
          />
          {term ? (
            <button
              type="button"
              className={styles.clear}
              onClick={() => onQuery("")}
            >
              Clear
            </button>
          ) : null}
        </div>
        {palette ? (
          <input type="hidden" name="palette" value={palette} />
        ) : null}
        {serif ? <input type="hidden" name="serif" value={serif} /> : null}
      </form>

      <p className={styles.status} aria-live="polite" aria-atomic="true">
        {term ? (
          <>
            {resultLead(count)} <span className={styles.term}>“{term}”</span>.
          </>
        ) : (
          EMPTY_PROMPT
        )}
      </p>
      {term && count === 0 ? (
        <p className={styles.hint}>
          Try a provider name, a symptom, or a few words from a title.
        </p>
      ) : null}

      <div id="search-results">
        {groups.length > 0 ? (
          <div className={styles.groups}>
            {groups.map((group) => (
              <section
                key={group.kind}
                aria-labelledby={`${group.kind}-results`}
              >
                <h2 id={`${group.kind}-results`} className={styles.groupTitle}>
                  {group.label}{" "}
                  <span className={styles.count}>({group.hits.length})</span>
                </h2>
                <ul className={styles.grid}>
                  {group.hits.map((hit) => (
                    <li key={`${hit.kind}:${hit.id}`}>
                      <ResultCard hit={hit} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultCard({ hit }: { hit: SearchHit }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {hit.image ? (
          <Image
            src={hit.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
            className={styles.photo}
          />
        ) : null}
      </div>
      {hit.label || hit.date ? (
        <p className={styles.meta}>
          {hit.label ? <span className={styles.kind}>{hit.label}</span> : null}
          {hit.date ? (
            <time dateTime={hit.published}>
              <CalendarIcon />
              {hit.date}
            </time>
          ) : null}
        </p>
      ) : null}
      <h3 className={styles.title}>
        <a href={hit.href}>{hit.title}</a>
      </h3>
      {hit.excerpt ? <p className={styles.excerpt}>{hit.excerpt}</p> : null}
    </article>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
