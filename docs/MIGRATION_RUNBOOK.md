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

## URL Manifest

No production cutover until every crawled public URL has a disposition.

`KEEP` is the default.

For redirects, validate:

-   source does not serve 200
-   destination is canonical
-   single hop
-   no loops
-   internal links use destination directly

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
