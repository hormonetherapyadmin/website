# SEO / AEO / GEO Requirements

## Priority

The current site already has established search value. The first
objective is preservation; optimization follows.

## URL Rules

-   Preserve existing indexable URLs by default.
-   Do not change paths for aesthetics.
-   Maintain a version-controlled URL migration manifest.
-   Redirect only intentionally.
-   Use one-hop permanent redirects.
-   Avoid redirect chains and loops.
-   Internal links should point directly to final canonical URLs.
-   Canonical host is `https://www.hormonetherapyhub.com`; the apex
    domain 301-redirects to it. No trailing slashes.
-   Wix system URLs (`/blog`, `/blog-feed.xml`, `/sitemap.xml` and
    its sub-sitemaps, any `/blog/categories/…`, `/blog/page/N`, or
    tag URLs found by the crawl) need a disposition like any other URL.

## Indexing Control

-   Every environment is `noindex` unless `ALLOW_INDEXING=true`.
-   `ALLOW_INDEXING=true` is set only in the Netlify production
    context, only at cutover.
-   When indexing is on, `robots.txt` allows all user agents. Do not
    block AI/answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
    PerplexityBot, Google-Extended) in robots or Netlify bot settings.

## Affiliate Links

-   Affiliate links use `rel="sponsored nofollow noopener noreferrer"`
    and open in a new tab. This keeps the live site's behavior and
    adds `sponsored`, as Google asks for affiliate links.

## Content Preservation

-   Migrate all current content.
-   Do not silently shorten or rewrite ranking copy.
-   Preserve intent, headings, important phrases, media, and links
    unless an approved editorial task changes them.
-   Repackage with stronger information design without erasing Peggy's
    voice.

## Metadata

Preserve/audit:

-   title
-   meta description
-   canonical
-   robots directives
-   Open Graph/social metadata
-   published/updated dates
-   author

Metadata changes on high-value pages should be deliberate and
reviewable.

## Semantic Content

-   One meaningful H1.
-   Logical heading hierarchy.
-   Real HTML text for primary content.
-   Semantic lists/tables.
-   Descriptive link text.
-   Useful breadcrumbs.
-   Answer-first summaries only where they help the reader.
-   Key takeaways only where they summarize substantive content.

## Structured Data

Use schema only when accurate and supported by visible content.

Potentially appropriate:

-   WebSite
-   Organization where factual
-   Person for Peggy
-   Article/BlogPosting
-   BreadcrumbList

Other schema requires case-by-case justification.

The live site already emits `BlogPosting`, `Person`, `Organization`,
and `ImageObject` on posts. Migrated pages must match or exceed that
coverage.

Do not imply medical review or medical organization status.

## AEO / GEO

Optimize for clear extraction and attribution through:

-   concise direct answers near relevant questions
-   strong entity naming
-   explicit author identity
-   first-person experience labels
-   structured provider facts
-   clear comparison tables
-   descriptive headings
-   sources/references
-   dates/freshness
-   coherent internal relationships

Do not write robotic "AI answer" copy. Peggy's human voice is a
strategic asset.

## Internal Linking

Use content relationships to create useful links among:

-   articles
-   treatments
-   topics
-   providers
-   reviews
-   comparisons

Prefer contextual links over giant repetitive SEO link blocks.

## Programmatic Pages

Do not generate indexable pages solely because structured data makes
them easy to generate.

Every indexable comparison, best-of, treatment, topic, or geographic
page must have distinct user value and adequate editorial substance.

## Filters

Provider filters should not create uncontrolled crawlable URL
permutations.

Default implementation should avoid indexable faceted navigation unless
a specific SEO strategy approves individual facets.

`/search` is always noindex, including when `ALLOW_INDEXING=true`.
The canonical is `/search`. `?q=` repeats that search for someone with
the link. It is not a separate indexable URL, and the page has no type
filter.

## Sitemap

`/sitemap.xml` lists the canonical URL of every published Page and Post
still set to Index, plus the HTML sitemap at `/sitemap`. It leaves out
`/search`, mockup routes, and the homepage while `/` is still the
placeholder. `lastmod` is that document's last publication time in
Prismic, when one exists. The page at `/sitemap` is built in the app,
not stored in Prismic, and it also links Home. When indexing is on,
`robots.txt` points at `/sitemap.xml`.

## Performance

Core Web Vitals are part of search quality.

Prioritize:

-   server rendering
-   low JS
-   optimized images
-   stable layouts
-   efficient fonts
-   minimal third-party scripts

## Launch Monitoring

Capture prelaunch baseline and monitor after launch:

-   indexed pages
-   Search Console clicks/impressions
-   top queries
-   top landing pages
-   canonical/index coverage
-   404s
-   sitemap processing
-   Core Web Vitals
-   affiliate click/revenue signals where available

A temporary ranking fluctuation may occur, but unexplained
URL/canonical/indexing losses are defects to investigate.
