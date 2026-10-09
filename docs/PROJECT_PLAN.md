# Hormone Therapy Hub --- Project Plan

## 1. Mission

Rebuild Hormone Therapy Hub from Wix as a modern, high-performance
Next.js + Prismic site deployed on Netlify while protecting the organic
visibility, answer-engine visibility, affiliate revenue, URLs, content,
and human voice that already make the existing site valuable.

This is a platform migration and experience redesign, not a content
reset.

Primary principle:

> Preserve what already works. Improve its structure, usability,
> presentation, maintainability, performance, and conversion experience.

## 2. Business Context

Hormone Therapy Hub is an affiliate-supported editorial site. Peggy
earns revenue through provider CTAs and affiliate relationships
distributed throughout editorial, review, and comparison content.

Initial provider partners:

-   Oestra
-   Winona
-   Alloy
-   Musely
-   MyMenoRx
-   Joi + Blokes
-   Effecty

The site already makes meaningful money. SEO/AEO equity and existing
public URLs must be treated as production assets.

Primary conversion outcomes:

1.  Affiliate outbound click
2.  Affiliate offer/code usage where applicable
3.  Secondary engagement with provider comparisons and related content
4.  Optional future owned-audience conversion such as newsletter signup

## 3. Positioning

Hormone Therapy Hub should feel like a trusted, independent, human-led
editorial and comparison resource.

It should not present as:

-   A medical clinic
-   A provider
-   A generic faceless affiliate site
-   A corporate health encyclopedia

Peggy's personal experience is the differentiator.

Recommended positioning concept:

> Real experiences, honest reviews, and practical guidance from a woman
> navigating hormone therapy herself.

Final marketing copy remains subject to owner/brand approval.

## 4. Editorial Boundary

Peggy is not a doctor or medical professional. Her work is
anecdotal/personal.

The redesign should make the distinction between these content classes
clear:

-   Peggy's firsthand experience/opinion
-   Provider/company-reported facts
-   General factual/educational material
-   External sources/references

Never manufacture medical authority.

Useful reusable editorial components include:

-   Peggy's Take
-   My Experience
-   What Surprised Me
-   What I Paid
-   What I'd Ask Your Doctor
-   Key Takeaways
-   Quick Answer
-   Sources / References
-   Affiliate disclosure

## 5. User Journey

Design around:

`Learn -> Explore -> Compare -> Choose`

### Learn

Search/AEO visitors arrive on informational content and receive a fast
answer, useful depth, Peggy's experience where relevant, sources, and
sensible next steps.

### Explore

Users discover treatments, topics, symptoms, and relevant providers
without being pushed immediately into a hard sell.

### Compare

Users can compare providers using structured, current facts and Peggy's
experience.

### Choose

Users reach a confident affiliate CTA with clear disclosure and context.

## 6. Proposed Information Architecture

Conceptual primary navigation:

-   HRT 101
-   Symptoms
-   Treatments
-   Providers
-   Reviews
-   Compare
-   Weight & HRT
-   About

This navigation does not imply new URL folders for existing content.

### Provider discovery

The Providers destination should support:

-   All providers
-   Provider cards
-   Peggy's summary/take
-   Pricing summary
-   Treatments
-   Lab requirements
-   Insurance/HSA/FSA where relevant
-   Availability
-   Review link
-   Affiliate CTA

Potential filters, only where data quality supports them:

-   Treatment
-   State availability
-   Labs/no labs
-   Insurance
-   HSA/FSA
-   Price range
-   Weight management
-   Telehealth characteristics

Avoid indexable filter permutations by default.

### Comparisons

Support curated comparisons based on genuine user value, not
mass-generated SEO pages.

Examples may include provider-vs-provider and "best for" editorial
comparisons, but each indexable comparison must contain substantive
unique editorial value.

## 7. Homepage Architecture

The approved slices and fields are in `docs/SLICE_MODEL.md`. The
mockup at `src/app/mockup/homepage` is the layout source.

Earlier proposed sequence:

1.  Hero with human/editorial positioning
2.  Primary actions: compare providers / start with HRT basics
3.  Trust strip: experience/testing/independence facts
4.  Peggy introduction and why the site exists
5.  "Where should I start?" pathways
6.  Provider discovery/comparison module
7.  Popular/important editorial guides
8.  "What I've actually tried" / firsthand experience section
9.  Weight + HRT pathway if strategically important
10. Peggy story/trust section
11. Latest or curated content
12. Disclosure/editorial-methodology trust links

Do not over-optimize the homepage for affiliate clicks at the expense of
trust.

## 8. Page Templates

### Article

The field list to build is in `docs/SLICE_MODEL.md`. The post is one
page type with no slices. Quick answer, key takeaways, FAQ, and
pros/cons are headings in the story when a post actually has them.

Recommended structure:

-   Breadcrumbs
-   H1
-   Dek/summary
-   Author
-   Published/updated dates
-   Relevant trust/context
-   Quick Answer when useful
-   Key Takeaways when useful
-   Main editorial content
-   Peggy's Experience/Take components
-   Contextual provider/affiliate components
-   Tables/callouts/media
-   FAQ only when genuinely useful
-   Sources/references
-   Related providers/comparisons/articles
-   Author block
-   Appropriate disclosure

Preserve existing high-performing content and intent during migration.

### Provider

Provider is a structured entity, not merely an article.

Core fields should include identity, the affiliate visit link, a short
description, her quote, one coupon code, one monthly price,
formulation, labs, insurance, HSA/FSA, state availability, how to get
started. The visit link is the only outbound clinic
link. A clinic on the site is one Peggy has tried. A clinic page is a
Page.

### Provider Review

A review references a Provider and contains Peggy's editorial
experience.

Possible sections:

-   Summary/verdict
-   Who it may suit
-   What Peggy used/tested
-   Signup
-   Consultation
-   Pricing experience
-   Labs
-   Treatment/order
-   Shipping
-   Support
-   Cancellation where tested
-   What Peggy liked
-   What Peggy didn't
-   Pros/cons
-   Provider facts
-   CTA
-   Disclosure
-   Sources
-   Related comparisons

Do not claim firsthand testing where it did not occur.

### Comparison

Use canonical Provider data for factual cells and editorial fields for
Peggy's comparison commentary.

Comparison tables must be semantic/crawlable and usable on small
screens.

### About / Peggy

Build strong human credibility around:

-   Peggy's story
-   Why she created HTH
-   Timeline/experience
-   What she has personally tried
-   How she evaluates providers
-   Clear non-medical boundary
-   Editorial/affiliate transparency

## 9. Prismic Content Model

See `docs/CONTENT_MODEL.md`.

The central architectural rule is separation of entity facts from
editorial prose.

Provider facts should not be copied manually into every
review/comparison.

Offers should be independently manageable where useful so a
code/destination can be updated centrally.

## 10. Design System

Brand designer will provide final logo/colors/type. The working palette
is Navy & raspberry from the homepage mockup, with Besley for headings.
The content measure is 88rem, with the mockup gutter. Those values live
in `src/app/globals.css`.

Engineering should establish semantic tokens such as:

-   background
-   surface
-   text
-   muted text
-   border
-   accent
-   CTA
-   success/warning only when semantically needed
-   spacing scale
-   radius scale
-   container widths
-   typography roles

Do not bake temporary brand colors into component logic.

Visual goals:

-   Modern
-   Beautiful
-   Warm
-   Editorial
-   Human
-   Trustworthy
-   Readable
-   Premium but approachable
-   Conversion-aware without feeling salesy

Reference sites are inspiration, not templates to copy.

## 11. Technical Architecture

Recommended baseline:

-   Current stable Next.js App Router
-   TypeScript strict mode
-   Prismic SDK/integration
-   Netlify Next.js deployment support
-   Server Components by default
-   Route handlers/server actions only where justified
-   Centralized metadata helpers
-   Centralized route resolution
-   Centralized affiliate CTA component/event handling
-   CMS preview support
-   Environment validation
-   Error/not-found boundaries
-   Image optimization strategy
-   Sitemap/robots generation

Select supporting packages conservatively. Every production dependency
should solve a real problem.

## 12. Route Resolution

Do not derive public paths solely from Prismic custom type.

Maintain a route resolver capable of preserving historical paths.

A Prismic Review document may resolve to `/alloy-review-page`, not
`/reviews/alloy`.

Legacy URL preservation takes priority over prettier architecture.

## 13. SEO / AEO / GEO

Goals:

-   Preserve existing rankings/traffic first
-   Improve semantic structure
-   Improve machine extractability
-   Improve content relationships/internal linking
-   Improve performance
-   Improve trust/entity clarity
-   Improve answer-first usefulness without flattening Peggy's voice

Implement:

-   Canonicals
-   Metadata
-   Open Graph/social metadata
-   Breadcrumbs
-   XML sitemap
-   robots rules
-   Article/BlogPosting structured data where valid
-   Breadcrumb structured data where valid
-   Organization/WebSite/Person/entity data only where factual and
    appropriate
-   Semantic tables/lists/headings
-   Author pages/context
-   Published/updated dates
-   Sources where content uses them
-   Related-content graph
-   Descriptive internal anchors

Do not:

-   Stuff keywords
-   Create schema unsupported by visible content
-   Create fake medical-review signals
-   Mass-produce thin comparison/location pages
-   Hide SEO text
-   make filter permutations indexable accidentally

## 14. Affiliate System

Build a consistent affiliate component system.

Possible placements:

-   Inline text CTA
-   Provider card CTA
-   Review hero CTA
-   Pricing CTA
-   Sticky mobile CTA only if UX testing supports it
-   Comparison CTA
-   Offer/coupon callout

Each CTA should be able to carry analytics context without authors
manually constructing event data.

Potential event properties:

-   provider
-   offer
-   page/content ID
-   content type
-   placement
-   CTA label
-   destination category

Do not place secrets or sensitive identifiers in analytics.

## 15. Analytics

During discovery:

1.  Determine whether existing GA4 exists.
2.  Preserve existing property/measurement continuity if possible.
3.  Obtain Search Console access.
4.  Establish pre-migration baseline.
5.  Document key landing pages and search queries.
6.  Establish affiliate click tracking baseline if available.

Before launch, verify analytics on production and prevent duplicate
initialization/events.

## 16. Migration Strategy

Use a staged ETL-style process:

`Wix -> raw export -> normalized JSON -> validated mapping -> Prismic import`

### Stage A: Inventory

Build a crawl/content inventory containing:

-   URL
-   status
-   canonical
-   title
-   description
-   H1
-   headings
-   content type guess
-   internal links
-   outbound/affiliate links
-   images
-   structured data
-   published/updated date where available
-   indexability
-   GA/Search Console metrics when available
-   migration disposition

### Stage B: Wix extraction

Export through supported Wix APIs where possible.

Store raw snapshots without editing them.

### Stage C: Normalization

Transform Wix records into a repository-owned intermediate schema.

Normalize:

-   rich text
-   links
-   media
-   author
-   dates
-   SEO metadata
-   provider references
-   categories/topics
-   affiliate links
-   embeds
-   unsupported blocks/manual-review flags

### Stage D: Prismic import

Map normalized records to Prismic documents using the Migration API.

Maintain stable source IDs and source-\>Prismic mappings.

### Stage E: Validation

Compare source and destination for:

-   URL
-   title/H1
-   substantive content
-   images
-   internal links
-   affiliate links
-   metadata
-   dates
-   authorship
-   indexability
-   provider facts
-   structured content

### Stage F: Manual editorial QA

Review important revenue/traffic pages by hand.

Prioritize pages using Search Console, analytics, backlinks, and
affiliate value.

## 17. URL Migration Manifest

Create a version-controlled manifest for every known public URL.

Suggested fields:

-   source_url
-   source_path
-   content_type
-   disposition
-   destination_path
-   canonical_path
-   reason
-   traffic_priority
-   revenue_priority
-   validation_status
-   notes

Default disposition is `KEEP`.

CI or a validation script should fail when a known source URL has no
disposition.

## 18. Domain / DNS / Hosting

The owner currently uses free Gmail, not domain-based email, reducing
mail-migration complexity.

Do not assume domain registration must move to Netlify.

Keep these concepts separate:

-   Registrar
-   DNS provider
-   Netlify hosting

Final choice should be made after Wix/domain access is available.

### Cutover outline

-   Confirm domain ownership/registrar
-   Capture complete DNS records
-   Reduce TTL ahead of cutover where appropriate
-   Verify Netlify production domain
-   Verify HTTPS
-   Verify redirects/canonicals
-   Verify analytics
-   Freeze Wix publishing for final sync
-   Run final migration/sync
-   Change DNS
-   Crawl production
-   Check 404/5xx
-   Check Search Console
-   Submit/confirm sitemap
-   Monitor rankings/traffic/revenue
-   Keep rollback information available

## 19. Environments

Recommended:

-   Local development
-   Netlify deploy previews
-   Production

Preview/staging must not become accidentally indexable.

Use separate environment variables and avoid production migration
credentials in client code.

## 20. Testing Strategy

### Unit/logic

Prioritize:

-   URL resolution
-   migration transforms
-   provider normalization
-   affiliate event payload construction
-   metadata helpers
-   redirect manifest validation

### Integration

Test:

-   Prismic document -\> route -\> render
-   Provider relationship rendering
-   Review/comparison data
-   404 behavior
-   preview behavior
-   sitemap/canonical consistency

### E2E / smoke

High-value flows:

-   Homepage -\> provider
-   Article -\> contextual provider CTA
-   Provider -\> review
-   Comparison -\> affiliate CTA
-   Navigation/mega menu
-   Mobile navigation
-   Legacy URL loads
-   Redirect target
-   not-found

### Migration regression set

Maintain a fixture list of highest-value current URLs and assert:

-   expected status
-   expected canonical
-   title presence
-   primary content presence
-   affiliate destination presence where expected

## 21. Accessibility

Target WCAG 2.2 AA.

Include accessibility in component acceptance criteria rather than
deferring it to launch.

## 22. Delivery Phases

### Phase 0 --- Repository foundation

-   Scaffold Next.js/TypeScript
-   Establish lint/typecheck/build
-   Netlify baseline
-   Environment handling
-   Docs
-   AGENTS.md
-   CI baseline
-   Initial design tokens

Exit: deployable shell with green verification.

### Phase 1 --- Discovery and preservation baseline

Mostly requires Wix/analytics access. The public crawl does not and
can start as soon as Phase 0 is done; it is the best record of the
site before anything changes.

-   Full crawl
-   Wix API investigation
-   GA4/Search Console baseline
-   Affiliate inventory
-   DNS/domain inventory
-   URL manifest
-   Content-type inventory
-   High-value page list

Exit: no meaningful public URL/content class is unknown.

### Phase 2 --- Prismic architecture

-   Define custom types
-   Define slices
-   Route resolver
-   Preview
-   Seed/sample content
-   Authoring labels/help text

Exit: Peggy's future editing workflow is coherent and core templates can
be populated without hard-coded content.

### Phase 3 --- Core frontend/design system

-   Header/mega menu
-   Footer
-   Layout/container/type primitives
-   Article template
-   Provider template
-   Review template
-   Comparison template
-   Homepage
-   About/editorial standards
-   Responsive/accessibility behavior

Exit: primary content experiences work with representative CMS content.

### Phase 4 --- Comparison/provider system

-   Provider directory
-   Filters where justified
-   Provider cards
-   Comparison tables
-   Offer/CTA system
-   Affiliate event model

Exit: Learn -\> Explore -\> Compare -\> Choose journey is functional.

### Phase 5 --- Migration tooling

-   Wix extractor
-   Raw snapshot
-   Normalizer
-   Importer
-   media/link handling
-   mapping state
-   dry-run/validation reports
-   fixture tests

Exit: migration can be rerun predictably and failures are visible.

### Phase 6 --- Full content migration and packaging

-   Import all content
-   Preserve existing copy
-   Apply new layout/slices where mapped
-   Resolve manual-review cases
-   Validate links/media/affiliate data
-   Editorial QA

Exit: all source content has a documented destination/disposition.

### Phase 7 --- SEO/AEO/GEO hardening

-   Metadata/canonicals
-   schema
-   sitemap/robots
-   breadcrumbs
-   internal linking
-   author/entity context
-   answer-first modules where useful
-   performance

Exit: technical search checklist passes and source-vs-destination parity
is documented.

### Phase 8 --- Analytics/revenue verification

-   GA4 continuity/new setup
-   affiliate event verification
-   Search Console
-   key conversion journeys
-   baseline dashboards/reports if desired

Exit: revenue-critical events and search monitoring are observable.

### Phase 9 --- Prelaunch deep branch review

Explicitly request a deep branch review.

Review the complete implementation against `main`, the project plan, URL
manifest, migration requirements, SEO requirements, and affiliate
behavior.

Resolve verified findings before launch.

### Phase 10 --- Cutover

Follow `docs/MIGRATION_RUNBOOK.md`.

Exit: production serves intended site/domain with verified URLs,
canonicals, analytics, affiliate destinations, sitemap, HTTPS, and no
material crawl failures.

### Phase 11 --- Postlaunch stabilization

Monitor:

-   404/5xx
-   Search Console coverage
-   sitemap
-   canonical selection
-   top landing pages
-   organic clicks/impressions
-   Core Web Vitals
-   affiliate clicks/revenue
-   unexpected traffic drops

Avoid broad content experiments during the immediate stabilization
period unless needed to fix a regression.

### Phase 12 --- Growth

Only after stability:

-   New content clusters
-   Curated comparison expansion
-   Internal-link improvements
-   content refresh workflow
-   provider data freshness workflow
-   conversion testing
-   optional email/newsletter strategy

## 23. Definition of Done

The project is complete when:

-   Existing content has a documented migration outcome.
-   Existing valuable URLs are preserved or explicitly redirected.
-   Core pages render from Prismic.
-   Peggy can manage content without developer intervention for normal
    editorial tasks.
-   Affiliate links/codes work and are trackable.
-   Analytics/Search Console continuity is established where access
    permits.
-   SEO metadata/canonicals/sitemap/robots are verified.
-   Provider facts are structured and reusable.
-   The site is responsive, accessible, performant, and visually
    production-ready.
-   Domain/DNS cutover is complete.
-   Postlaunch crawl has no unexplained material errors.
-   Documentation reflects production reality.

## 24. Approved Technical Decisions

Approved by the project owner on 2026-10-05. Speed, SEO, and AEO are
the top priorities, and nothing may degrade the existing site's
established search and revenue equity.

### Observed facts about the live Wix site (2026-10-05)

-   Canonical host is `https://www.hormonetherapyhub.com`. The apex
    domain 301-redirects to `www`.
-   URLs have no trailing slash.
-   Two URL shapes: about 26 site pages at the root (for example
    `/alloy-review-page`, `/formuations`, `/copy-of-weight-gain`) and
    about 150 blog posts under `/post/<slug>`. Plus Wix system URLs:
    `/blog`, `/blog-feed.xml`, `/sitemap.xml`,
    `/pages-sitemap.xml`, `/blog-posts-sitemap.xml`,
    `/blog-categories-sitemap.xml`.
-   Reviews exist in both shapes (`/alloy-review-page` and
    `/post/mymenopauserx-review`), so a document's type cannot decide
    its URL.
-   Affiliate links go through affiliate networks (for example
    `alloy.sjv.io`, `musely.pxf.io`), open in a new tab, and use
    `rel="nofollow noreferrer"` (some add `noopener`).
-   Blog posts emit `BlogPosting`, `Person`, `Organization`, and
    `ImageObject` structured data.
-   No GA measurement ID appears in the static HTML. Wix injects it
    through Marketing Integrations. Google Tag is connected. The GA4
    measurement ID is `G-VK8P9CJBX2`. Meta Pixel, Google Tag Manager,
    TikTok Pixel, Facebook Catalog, and Google Merchant Feed are not
    connected. Wix's own Analytics reports are also in use.
-   `/my-addresses` (a Wix members page) is in the pages sitemap and
    needs an explicit disposition.

These are a snapshot. The Phase 1 crawl is the authoritative
inventory.

### Toolchain

-   Node 24 LTS, pinned in `.nvmrc`, `package.json` `engines`, and
    `netlify.toml`.
-   pnpm, pinned through the `packageManager` field.
-   Latest stable Next.js App Router, React, TypeScript strict mode.
-   Prismic with Slice Machine (`@prismicio/client`,
    `@prismicio/next`, `@prismicio/react`), added in Phase 2 once the
    Prismic repository exists.
-   Tailwind CSS v4. Brand values are CSS variables exposed through
    `@theme`; components use only semantic token names (for example
    `bg-surface`, `text-accent`), never raw palette classes.
-   ESLint (Next.js config) and Prettier.
-   A pre-commit hook (`.githooks/pre-commit`, enabled by the
    `prepare` script on `pnpm install`) formats staged files with
    Prettier, so the CI format check does not fail on push. A Cursor
    `afterFileEdit` hook (`.cursor/hooks.json`) formats agent edits.
-   Vitest for logic; Playwright with axe for smoke, legacy-URL, and
    accessibility checks.
-   Netlify with its Next.js runtime, configured in `netlify.toml`.
-   GitHub Actions CI: format check, lint, typecheck, unit tests,
    build, and Playwright smoke tests. Lighthouse CI with performance
    budgets on deploy previews is added in Phase 3, once there are
    real templates to measure.
-   Environment variables are read through `src/lib/env.ts` without
    a validation library.

### Rendering and content updates

-   Every page is pre-rendered at build time.
-   Prismic fetches are cached and tagged `prismic`.
-   On publish, a Prismic webhook calls `POST /api/revalidate`, which
    checks the shared secret and expires the `prismic` tag. Edits are
    live on the next request, without a rebuild.
-   New documents render on first request and are then cached.
-   Local development does not cache Prismic responses. The webhook
    does not reach localhost, and a cached miss would keep a just
    published document off the page.
-   Preview uses Prismic preview with Next.js draft mode (Phase 2).

### URLs

-   Keep the `www` host, no trailing slash (`trailingSlash: false`),
    and lowercase Wix slugs exactly as they are, typos included.
-   Each editorial document's UID is its Wix slug. A Post is always
    `/post/<uid>` and has no URL section field. Every other routable
    editorial type has a required "URL section" field that chooses
    between "Blog post (/post/…)" and "Site page (/…)". The public
    path is the section plus the UID. New content of those types
    defaults to blog post.
-   The build fails if two documents resolve to the same path, or if a
    known legacy URL from the URL manifest has no disposition.
-   `/blog-feed.xml` is kept as an RSS feed at the same path.

### Redirects

-   Redirects are managed in Prismic as a Redirect document type
    (From path, To link, 301/302, required Reason). See
    `docs/CONTENT_MODEL.md`.
-   A build step reads all Redirect documents and writes Netlify's
    `_redirects` file, so redirects are served by Netlify's edge
    without running app code per request.
-   The build fails on a redirect whose From path is a live page, on
    chains, on loops, and on duplicate From paths. A failed build
    leaves the previous deploy live.
-   The revalidation webhook also triggers a Netlify build hook when a
    Redirect document changes. Redirects therefore go live after a
    rebuild (minutes), not instantly.
-   Phase 2 must verify that Netlify's Next.js runtime honors
    `_redirects` from `public/`. Fallback: Next.js `redirects()` in
    `next.config.ts`, also populated from Prismic at build time.

### Indexing control

-   The site is `noindex` everywhere by default: an
    `X-Robots-Tag: noindex, nofollow` header on every response and a
    disallow-all `robots.txt`.
-   Indexing is enabled only when `ALLOW_INDEXING=true`. Set it only in
    the Netlify production context, only at cutover. See
    `docs/MIGRATION_RUNBOOK.md`.
-   When indexing is enabled, `robots.txt` allows all user agents,
    including AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
    PerplexityBot, Google-Extended). Netlify firewall/bot settings must
    not block them.

### Speed

-   Server Components by default. Client code is limited to the
    mobile menu, one shared delegated click listener for CTA tracking,
    and the offer copy-code button.
-   Images through Prismic's image CDN (`PrismicNextImage`) with
    explicit dimensions.
-   No font is loaded until brand fonts arrive; system font stacks
    until then. Brand fonts are self-hosted through `next/font`.
-   No UI component library, no client-side data fetching, no
    third-party scripts beyond GA.

### Affiliate links

-   Designed CTAs (visit buttons, offer boxes, coupon codes) read their
    destination from Provider and Offer documents.
-   Affiliate links written in post text are kept exactly as Peggy wrote
    them, including tracking parameters. Posts are her main affiliate
    channel. They do not update when a Provider's destination changes;
    a changed affiliate link needs a find-and-replace across posts.
-   Keep current link behavior (new tab, `nofollow`, `noreferrer`,
    `noopener`) and add `sponsored`. In post text, a link is affiliate
    when its host is on the affiliate domain list in
    `src/lib/affiliate-link.ts`. Wix marked these inconsistently, so its
    per-link `rel` is not copied.
-   No `/go/<provider>` redirect links.
-   Show the affiliate disclosure next to the first CTA on a page, not
    only in the footer.
-   Sticky mobile CTA only on review pages and only after measurement.

### Analytics

-   Reuse Peggy's existing GA4 property, measurement ID
    `G-VK8P9CJBX2`, found in Wix Marketing Integrations under Google
    Tag.
-   Load through `@next/third-parties` `GoogleAnalytics`, in production
    only, initialized once.
-   One affiliate event, `affiliate_click`, with properties
    `provider`, `offer`, `placement`, `page_type`, `page_path`, and
    `link_domain`, marked as a GA4 key event. CTA components fill
    these automatically.
-   Search Console verification before launch.

### Open questions for the owner

-   Who has Search Console access?
-   Where is the domain registered?
