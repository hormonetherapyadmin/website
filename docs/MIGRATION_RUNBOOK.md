# Migration & Launch Runbook

## Objective

Move Hormone Therapy Hub from Wix to Prismic/Next.js/Netlify without
unnecessarily changing public URLs, losing content, breaking affiliate
revenue paths, or disrupting search visibility.

## Before Wix Access

-   Scaffold repo and documentation.
-   Implement content-model drafts.
-   Prepare migration schemas/interfaces.
-   Prepare URL manifest format.
-   Prepare crawl tooling plan.
-   Run the full public crawl. It does not need Wix access.
-   Do not invent Wix collection/API mappings before access confirms
    them.

## Discovery After Access

### Wix

Document:

-   Site pages
-   Blog/content collections
-   Dynamic pages
-   media
-   menus
-   redirects
-   SEO fields
-   structured data/custom code
-   embeds
-   affiliate links
-   reusable content
-   Wix-specific elements not exposed cleanly through API

Pages built in the Wix editor (as opposed to blog posts) are often not
exportable through the API. Plan for crawl-based extraction of those
pages, validated against the rendered page.

### Analytics/Search

Obtain when available:

-   GA4 property/config
-   Search Console
-   top organic landing pages
-   top queries
-   indexed pages
-   traffic trends
-   conversion/outbound-click events if present

### Domain

Capture:

-   registrar
-   nameservers
-   DNS records
-   verification TXT records
-   current Wix connection method
-   renewal/ownership information

The owner does not currently use domain-based email, but still capture
all DNS records rather than assuming MX is irrelevant.

## Source Crawl

Create a full crawl before migration.

Save enough data to validate:

-   URL/status
-   canonical
-   title/description
-   headings
-   indexability
-   internal links
-   external/affiliate links
-   images
-   structured data
-   content fingerprint or equivalent
-   rendered content availability

## Raw Export

Store raw Wix responses as immutable migration artifacts.

Suggested organization:

`migration/raw/<export-date>/...`

Never hand-edit raw export files to fix migration behavior. Fix
normalization logic instead.

## Normalized Model

Transform raw Wix content into repository-owned normalized records.

Each record should retain:

-   source ID
-   source URL/path
-   source type
-   destination type
-   destination/public path
-   title
-   dates
-   author
-   body/content blocks
-   media
-   links
-   SEO
-   relationships
-   affiliate destinations
-   manual-review flags

## Import

Prismic import must:

-   be rerunnable
-   map source IDs to destination IDs
-   log failures
-   avoid accidental duplicates
-   report unsupported fields/blocks
-   preserve relationships
-   avoid publishing incomplete records silently

Use dry-run/validation modes where feasible.

### Blog posts

`scripts/export-wix-blog.mjs` saves the Wix posts under
`migration/raw/<date>/blog/`. `scripts/import-wix-posts.mts` maps them
with `src/migration/wix-post.ts` and sends them to the Prismic
migration release. It never publishes the release.

-   `node scripts/import-wix-posts.mts` is a dry run. It writes a report
    to `migration/reports/` (not committed) and changes nothing.
-   `--write` sends the posts. `--only <slug,slug>` limits the run.
    `--export <date>` picks an older export.
-   A post already published in Prismic is skipped. `--replace
    <slug,slug>` overwrites it, including any edits made in Prismic.
-   `migration/state/wix-posts.json` (committed) maps each Wix post id
    to the Prismic document it created. The migration release cannot be
    read through the Content API, so this file is the only record of
    unpublished imports. Do not delete it, and commit it after every
    `--write`. A later run skips those posts, so edits Peggy makes in
    the release are safe. Naming a post with `--only` re-imports it over
    the release copy, which overwrites those edits. After a run that
    stopped partway, re-import the posts it lists with `--only`.
-   A photo whose filename (the Wix media id) is already in the media
    library is reused, not uploaded again.
-   `--write` refuses to send anything while any selected post has a
    problem the mapper cannot handle, such as a link that is not a web
    address. The report lists review flags (galleries, jump links,
    linked photos with no description) for Peggy to check after import,
    and what the mapper changed on purpose (links Wix made out of
    sentences, links pointed past a redirect).

Once Peggy edits imported posts in Prismic, do not re-import them. For
the final sync, export again and import only posts that are new or
changed in Wix since the last export, using `--only`. A full re-import
still does not write Category. Use the category script below for that
field. Re-importing a post with `--only` or `--replace` sends the post
again without Category, so run the category script again afterwards
for those posts.

### Post categories

`scripts/set-post-categories.mts` reads the live Wix categories and
sets Category on posts already published in Prismic. The labels are
the tightened names in `src/migration/post-category.ts`. It does not
create the two Wix posts that are not in Prismic, and it does not
change the story.

-   `node scripts/set-post-categories.mts` is a dry run.
-   `--write` puts the category updates in the migration release.
    `--publish` publishes that release. `--only <slug>` limits the run.

### Site pages

The composed pages go to the same kind of migration release as the
posts. `scripts/import-site-pages.mts` reads `src/migration/site-pages.ts`
and never publishes. A dry run writes a report under
`migration/reports/` and changes nothing. `--write` sends the pages.
`--only <uid,uid>` limits the run and is the only way to overwrite a
page already in the release. `--replace <uid,uid>` overwrites a
published page. `migration/state/site-pages.json` records the Prismic
id of each unpublished page. Commit it after every `--write`.

A link to this site is a relative path, such as `/trusted-providers`,
`/post/my-review`, or `/#eight-online-hrt-clinics-side-by-side`. A link
to another site, including a medical source or a YouTube video, keeps
its full address. Affiliate destinations stay on the brand.

Checked against the published repository on 2026-10-23. A page that
is already published is skipped. `--replace` is the only way to
overwrite it, and that also overwrites edits made in Prismic.

Already published, so this import does not send them:

-   `/blog`, as a Page. The content model still describes Blog as its
    own single page type. That type does not exist. The published page
    is Hero, a featured post, and the post grid.
-   `/trusted-providers`. Hero, boxes, one brand promo per clinic, a
    posts row, and a ribbon.
-   `/trackers-and-testing`. Hero, the kit story, Mira, Proov, and a
    ribbon. Its UID is not the Wix slug `trackersandtesting`. That URL
    decision is still open. Do not create a second page at the Wix slug
    until it is made.

The homepage is published. `--replace homepage` keeps the hero and the
divider, fills the empty benefit and button links, and adds Start here,
Latest posts, the clinic comparison, the quote, and the story. The
footer fields already on the document stay. The scaffold meta title and
description are replaced with the page's own heading and intro. The
same run renames the Alloy brand from Musely to Alloy when that name is
still wrong, and leaves the rest of the brand. Midi's comparison row
uses the review stored on that brand, which is the weight-loss post.

`/about` is published. `--replace about` fills the empty story with
the October 2026 Wix copy and keeps the rest of the document. The
eyebrow stays About Peggy. The portrait already on the page stays.
Winston sits on the left of the story. The divider under the hero and
the posts row stay. The stock doctor banner stays off.

`/faq` and `/ishrtforme` are published. `--replace` is how a later
edit reaches the release. `/faq` closes with one centered Buttons
slice. `/ishrtforme` keeps its ribbon.

`/inner-balance` is a new Page. The visit link, price, steps, and
specialties stay on the Inner Balance brand. The page does not copy
the affiliate URL or the second price card. The same run points that
brand's Page field at the new page. The other clinic pages are not
composed yet.

A clinic page does not get a "What it cost me" section. The price and
the price note stay on the brand and show in the hero. The first-year
average stays on the homepage comparison. Inner Balance had that
section; it is being removed there, and the other clinic pages do not
get it.

Still to send:

1.  The old trusted-providers address. `/copy-of-trusted-providers`
    redirects to `/trusted-providers`. The Redirect type is not built
    yet, so that redirect is a later document.

The live signup form on the trusted-providers page has no slice yet.
The published page does not include it.

Editorial Standards and Affiliate Disclosure are still listed as
singletons in `docs/CONTENT_MODEL.md` and have no custom type yet.
They are not part of this order.

The other Wix site pages, including privacy, contact, and the clinic
pages that have no slice composition, stay out until each one is
composed. Their copy is not rewritten to fill a page.

## URL Manifest

No production cutover until every crawled public URL has a disposition.

`KEEP` is the default.

For redirects, validate:

-   source does not serve 200
-   destination is canonical
-   single hop
-   no loops
-   internal links use destination directly

### Wix redirects to recreate in Prismic

The complete list from Wix → SEO → URL Redirect Manager (owner
screenshot, 2026-10-09), with destinations approved by the owner the
same day, plus the dead addresses below. The Redirect type is built on
the branch after the blog migration. Then create one Redirect document
per row (see `docs/CONTENT_MODEL.md`), all `301 permanent`.

`src/migration/wix-redirects.ts` holds the same list. Change both
together. The post importer uses it to point links in posts straight
at the destination, so imported posts never link to a redirect.

Every row is a single hop. Each destination exists on Wix today except
`/trusted-providers`, a new address for the trusted providers page.
Each destination must also exist on the new site before cutover, or
the build fails.

| From | To | Reason |
| --- | --- | --- |
| `/copy-of-hrt-doctors` | `/hrt-doctors-review-costs-services` | Old copy of the HRT Doctors page. `/hrt-doctors` does not exist |
| `/copy-of-joi-women-s-wellness` | `/hrt-doctors-review-costs-services` | Wix chained this through `/general-8/…` and `/tipstofindprovider/…`. Goes straight to the page it names |
| `/copy-of-men-s-hrt` | `/hair-loss` | Wix redirect |
| `/copy-of-midi-health` | `/mymenopauserx` | Wix redirect |
| `/copy-of-pricing-insurance` | `/ishrtforme` | Wix redirect |
| `/copy-of-providers` | `/formuations` | Wix redirect |
| `/copy-of-trusted-providers` | `/trusted-providers` | Not in Wix. The live trusted providers page moves to a new address (owner decision, 2026-10-09) |
| `/copy-of-winona` | `/musely` | Wix redirect |
| `/copy-of-winona-review-page` | `/winona-review-page` | Old copy of the Winona review. Wix pointed at `/evernow-review-page`, a 404 |
| `/costandformunlations` | `/costandinsurance` | Wix redirect |
| `/trustedproviders` | `/trusted-providers` | Not in Wix. A 404 on Wix that 23 blog links point to, the page's intended address |
| `/general-8` | `/tipstofindprovider` | Wix redirect |
| `/general-8/hrt-doctors-review-costs-services` | `/hrt-doctors-review-costs-services` | Old folder path of the HRT Doctors page |
| `/general-8/winona-plans-costs-insurance-accapted` | `/winona-review-page` | Old folder path of the Winona page |
| `/tipstofindprovider/hrt-doctors-review-costs-services` | `/hrt-doctors-review-costs-services` | Wix redirect target. Wix shows the tips page at any path under it |
| `/tipstofindprovider/winona-plans-costs-insurance-accapted` | `/winona-review-page` | Wix redirect target. Wix shows the tips page at any path under it |
| `/home` | `/` | Wix redirect |
| `/hrt-semiglutide` | `/` | Misspelling. Wix pointed at `/hrt-semaglutide`, a 404 |
| `/hrt-semaglutide` | `/` | Not in Wix. A 404 on Wix that blog posts link to |
| `/semaglutide-comparison-chart` | `/skincare` | Wix redirect |
| `/services-1` | `/joiwommenswellness` | Wix redirect |
| `/winona-plans-costs-insurance-accapted` | `/winona-review-page` | Wix redirect |

Notes:

-   The two `/tipstofindprovider/…` rows are not in Wix. They were Wix
    redirect targets, and Wix serves the tips page at any path under
    `/tipstofindprovider` with 200 and a self-canonical, so those
    addresses may have links. The new site has no nested pages.
-   Keep the slugs exactly as written, typos included (`accapted`,
    `formuations`, `joiwommenswellness`, `costandformunlations`).

### Dead post addresses

Blog posts link to these `/post/…` addresses. Each was a 404 on the
live site on 2026-10-09 with no Wix redirect. The owner approved
sending all of them to `/blog` (2026-10-09). Add each as a Redirect,
`/post/…` → `/blog`. The importer also sends any link to a post that
is not in the Wix export to `/blog`, and lists it in the report.

| Dead address | Linked from |
| --- | --- |
| `/post/signs-that-you-need-hormone-replacement-therapy` | 3 posts |
| `/post/heart-health-and-bioidentical-hormones` | 3 posts |
| `/post/hormone-replacement-benefits-your-brain` | 3 posts |
| `/post/what-are-bioidentical-hormones-made-of` | 3 posts |
| `/post/bioidentical-estrogen-and-progesterone` | 2 posts |
| `/post/estrogen` | 2 posts |
| `/post/the-benefits-of-hormone-replacement-therapy-for-bone-health-during-menopause` | 1 post |
| `/post/can-hormone-replacement-help-with-hair-loss` | 1 post |
| `/post/hormone-replacement-therapy-cost` | 1 post |
| `/post/shopping-for-online-hormone-replacement-therapy-hrt` | 1 post |

### Site pages that blog posts link to

Not redirects yet. Decide these with the site page migration.

-   `/home-1` is live on Wix (200) but missing from its sitemap. 18
    links in blog posts go to it. It needs a URL decision.
-   The importer writes site links in lowercase, so `/FAQ` and `/Home`
    (404 on Wix) reach `/faq` and `/`.

### Posts to finish by hand after import

From the 2026-10-08 export. The import report lists the same flags.

Tables. The importer moves each of the 24 Wix tables into the post's
Tables group and leaves a `{{table}}`, `{{table2}}`, … line where it
sat (see `docs/SLICE_MODEL.md`). Nothing to rebuild, except:

-   `/post/alloy-vs-musely-estrogen-creams-patches-tablets-compared`
    is already live in Prismic and is not re-imported. Its story has a
    `{{table}}` line with no table (empty on 2026-10-09), so readers
    see no table. Peggy adds it as the first item in Tables.
-   Check the two posts with more than one table:
    `beyond-basic-hormone-labs-why-i-use-joi-blokes-for-comprehensive-testing`
    (3) and `is-it-perimenopause-5-signs-you-shouldn-t-wait-for-your-period-to-stop`
    (2).

Gallery. The only Wix gallery is a 4-photo collage in
[`/post/effecty-hormone-replacement-therapy-review`](https://www.hormonetherapyhub.com/post/effecty-hormone-replacement-therapy-review).
It imports as four full-width photos. No gallery piece will be built
(owner decision, 2026-10-09). Peggy redesigns those photos within the
story, for example with `{{photos}}` rows.

Jump links. `/post/musely-sleep-well-cream-review-ingredients-fix-menopause-sleep`
keeps the words of its in-page links, without the links.

Photo descriptions. Wix has no alt text on 125 of 142 covers and 129
story photos. Nothing reliable can fill them: Wix filenames are often
`image.png` or a hash, and the post title on the cover repeats the
heading. They import with no description and render as decorative.
Peggy adds descriptions in Prismic over time, starting with the most
visited posts. Two exceptions:

-   A linked photo with no description takes its caption as the
    description, because a screen reader names the link with it.
-   These posts have a linked photo with neither, so the link has no
    name. Peggy describes those photos:
    `winona-hormone-replacement-therapy-review-updated-2025-new-products-and-prices`,
    `who-is-mymenopauserx`, `alloy-m4-face-cream-review`,
    `pandia-health-review-of-process-products-and-cost`,
    `mymenopauserx-review`, `midi-health-vs-winona-hrt`,
    `my-alloy-vs-join-midi-hrt`, `winona-hrt-cost`,
    `winona-estrogen-cream-vs-estradiol-patch`,
    `winona-vaginal-estrogen-cream`, and
    `winona-vs-alloy-hormone-replacement-side-by-side-comparison`.

## Media

Validate:

-   source media downloaded/imported successfully
-   dimensions/quality are acceptable
-   alt text preserved where meaningful
-   decorative images handled appropriately
-   no accidental hotlink dependency on Wix if avoidable
-   no broken embeds

## Affiliate QA

For every revenue-important page:

-   compare old and new affiliate links
-   preserve required tracking parameters
-   preserve coupon codes
-   verify CTA destination
-   verify disclosure
-   verify analytics event
-   check desktop/mobile

Create a high-priority affiliate QA list from known partners and
analytics/revenue information.

## SEO QA

For high-value pages compare old vs new:

-   URL
-   status
-   canonical
-   title
-   description
-   H1
-   substantive content
-   headings
-   indexability
-   author/date
-   internal links
-   structured data where relevant
-   images
-   affiliate links

## Prelaunch Checklist

-   Production build passes
-   Deep branch review completed
-   Migration validation passes
-   URL manifest complete
-   High-value pages manually QA'd
-   404 page works
-   sitemap correct
-   robots correct
-   production canonicals correct
-   deploy previews/staging protected from indexing (`ALLOW_INDEXING`
    unset everywhere except the production context)
-   Netlify primary domain set to `www.hormonetherapyhub.com`, apex
    redirecting to it
-   analytics verified
-   affiliate events verified
-   affiliate destinations verified
-   HTTPS/domain configuration ready
-   DNS snapshot saved
-   rollback procedure documented
-   Wix content freeze window agreed

## Cutover

1.  Announce/follow content freeze.
2.  Run final Wix extraction.
3.  Normalize/import delta or final dataset.
4.  Run migration validation.
5.  Set `ALLOW_INDEXING=true` in the Netlify production context only,
    then deploy the final production build. Without this step the
    production site stays `noindex` and would drop out of search.
6.  Verify Netlify production target before DNS.
7.  Change DNS as planned.
8.  Verify HTTPS.
9.  Run legacy URL smoke suite.
10. Crawl production.
11. Verify analytics.
12. Verify representative affiliate clicks.
13. Verify sitemap/robots/canonicals, and that production responses
    have no `X-Robots-Tag: noindex` header.
14. Confirm Search Console property/verification.
15. Submit/confirm sitemap as appropriate.

## Rollback

Before cutover document the exact DNS values required to restore the
prior serving configuration if needed.

Rollback triggers should focus on catastrophic serving/routing failures,
not normal short-lived DNS propagation differences.

Content/migration defects that can be safely corrected forward may not
require DNS rollback.

## Postlaunch

Monitor closely:

-   404s
-   5xx
-   redirect behavior
-   canonical/indexing issues
-   Search Console coverage
-   top landing pages
-   organic clicks/impressions
-   affiliate click volume
-   revenue signals
-   Core Web Vitals
-   user-reported issues

Compare against the prelaunch baseline.

Do not delete migration snapshots/manifests immediately after launch.
