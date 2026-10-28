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
-   `ALLOW_INDEXING=true` is set only in the Vercel Production
    environment, only at cutover.
-   When indexing is on, `robots.txt` allows all user agents. Do not
    block AI/answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
    PerplexityBot, Google-Extended) in robots or Vercel Firewall and
    bot protection.

## Affiliate Links

-   Affiliate links use `rel="sponsored nofollow noopener noreferrer"`
    and open in a new tab. This keeps the live site's behavior and
    adds `sponsored`, as Google asks for affiliate links.
-   A clinic's Visit link is its affiliate link. Every designed visit
    CTA (provider Hero, Brand promo's name, product photo, and visit
    button, Quote, Side by side, Clinic comparison, the Clinic facts
    offer box, and story offer and facts) sets that rel, the new tab, and
    `data-provider` and `data-placement` itself, through
    `visitLinkProps` in `src/lib/affiliate-link.ts`. The Visit field's
    "Open in a new tab" checkbox does not change this.

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

What the app emits, as one JSON-LD `@graph` per page, built in
`src/lib/structured-data.ts`:

-   Homepage: `WebSite` and `Organization`, the same as the live
    homepage. The Organization is the site name and URL. There is no
    logo until the brand delivery.
-   Post: `BlogPosting` and `BreadcrumbList`. Headline is the post
    title, the `h1`. Description is the meta description, or the
    subtitle when that is empty. `datePublished` is Published. Image is
    the cover, with its size. Author is a `Person` from the Author
    document: name, name title as `description`, and profile photo.
    Peggy's `url` is `/about`, the page her byline links to.
    `articleSection` is Category and `keywords` are the document tags,
    both shown on the post. Publisher is the Organization. The
    breadcrumb is Home, Blog, and the title, as shown.
-   There is no `dateModified`. A post has no updated date, and the
    Wix last published date is not copied (see `docs/SLICE_MODEL.md`).
    The live site emits `dateModified`; this is the one property it
    has that the new posts do not.
-   Pages, search, and the HTML sitemap emit none. The live site emits
    none on site pages. A clinic page could later carry a `Product` or
    `Review`, but that needs its own decision.

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

`/slice-simulator` is the Page Builder thumbnail route. It is always
noindex. It is not a public page.

## Sitemap

`/sitemap.xml` lists the canonical URL of the published Homepage and
every published Page and Post still set to Index, plus the HTML sitemap
at `/sitemap`. It leaves out `/search`, `/slice-simulator`, and mockup
routes. `lastmod` is
that document's last publication time in
Prismic, when one exists. The page at `/sitemap` is built in the app,
not stored in Prismic, and it also links Home. When indexing is on,
`robots.txt` points at `/sitemap.xml`.

## llms.txt

`/llms.txt` is a static Markdown file at `public/llms.txt`. It tells an
AI agent what the site is and links the main public pages, clinic
overviews, and the reviews those overviews point at. The HTML sitemap
remains the full list of indexable URLs.

The file follows the [llms.txt](https://llmstxt.org/) format. It does
not offer an agent API, booking, or checkout. The root layout points
at it with `rel="describedby"`. Pages do not have separate Markdown
copies. Agents should read the public HTML pages.

Do not describe Peggy as a clinician, and do not state a price, coupon,
or clinic fact in this file unless that fact is already on the linked
page. When a linked page changes address, update this file in the same
change. Archived, noindex pages stay out of it.

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
