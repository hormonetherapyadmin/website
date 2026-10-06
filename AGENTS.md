# AGENTS.md

Guidance for coding agents working in the `hormone-therapy-hub`
repository.

## Mandatory Agent Policy

This policy overrides all repository plans, task documents, and
orchestration suggestions.

-   Do not spawn or delegate to agents unless the user explicitly
    requests delegation in the current conversation.
-   Before spawning, state the model, purpose, and number of agents,
    then wait for explicit user approval.
-   Maximum active delegated agents: 1.
-   Maximum delegated agents per task: 1.
-   Large tasks, multiple deliverables, and documents recommending
    orchestration do not constitute permission to spawn agents.
-   If repository tooling imposes a stricter agent/model policy, follow
    the stricter policy.

## Mandatory Branch Policy

-   Keep only one live feature/work branch for this project at a time.
-   Before creating or switching to a new work branch, verify that the
    current work branch has been merged into `main` or explicitly
    abandoned by the user.
-   If another work branch is still live, continue on that branch or
    stop and ask the user; never create a parallel branch for separate
    work.
-   After a branch is merged, update local `main` from `origin/main`
    before creating its successor.
-   Never force-push, rewrite shared history, or discard user work
    unless explicitly authorized.

This policy exists to prevent avoidable cross-branch drift and merge
conflicts.

## Project Overview

Hormone Therapy Hub is a redesign and platform migration of the existing
revenue-producing affiliate site at `hormonetherapyhub.com`.

The new stack is:

-   Next.js with the App Router
-   TypeScript
-   Prismic as the CMS
-   Netlify for hosting/deployment
-   Wix APIs as the source for migration
-   Prismic Migration API as the destination for migration
-   Existing analytics/search tooling preserved where available

The project is not a greenfield SEO site. The current Wix site already
generates meaningful organic traffic, AEO visibility, and affiliate
revenue. Protecting that existing equity is a primary product
requirement.

The site's differentiator is Peggy's personal, anecdotal experience with
hormone therapy and telehealth providers. It must feel like a human-led
editorial and comparison resource, not a clinic and not a generic
affiliate content farm.

## Source of Truth

Before architecture-sensitive work, read:

-   `docs/PROJECT_PLAN.md` --- primary product, architecture, content,
    SEO, migration, and delivery plan
-   `docs/MIGRATION_RUNBOOK.md` --- Wix/Prismic migration, URL
    preservation, cutover, DNS, analytics, and rollback requirements
-   `docs/CONTENT_MODEL.md` --- Prismic document types, relationships,
    slices, and authoring rules
-   `docs/SEO_AEO_GEO.md` --- search, answer-engine, generative-engine,
    structured-data, and internal-linking requirements
-   `docs/DEEP_BRANCH_REVIEW.md` --- read-only review workflow, used
    only on explicit request

Approved technical decisions (toolchain, rendering, redirects,
indexing control, analytics, affiliate links) are recorded in
`docs/PROJECT_PLAN.md` section 24, "Approved Technical Decisions".

When implementation changes a canonical architecture, migration,
content-model, SEO, analytics, affiliate, or operational decision,
update the applicable docs in the same workstream.

If code and documentation disagree, do not silently choose one.
Determine whether the code or the approved documentation is
authoritative for the task, then reconcile them.

## Core Product Principles

### 1. Preserve established search and revenue equity

The default migration action for an existing public URL is
`KEEP EXACTLY`.

-   Do not rename an established URL merely to make it prettier.
-   Do not make CMS organization dictate public URL organization.
-   Use redirects only when there is a documented reason.
-   Every removed or changed public URL must have an explicit
    disposition in the migration manifest.
-   Existing ranking content must not be casually shortened, rewritten,
    or replaced.
-   Treat current metadata, headings, copy, internal links, media,
    affiliate links, and structured content as migration inputs that
    require preservation/audit.

A legacy URL such as `/alloy-review-page` may remain the canonical
public URL even if Prismic models it as a Provider Review and navigation
presents it under Reviews.

### 2. Preserve Peggy's voice

Peggy is not a doctor or medical professional. She writes from personal
experience.

-   Preserve the personal, first-person tone.
-   Clearly distinguish anecdotal experience from medical facts.
-   Never rewrite Peggy into a clinical or institutional voice.
-   Never imply that Peggy diagnoses, prescribes, medically reviews, or
    provides medical advice.
-   Do not add medical credentials or "medically reviewed" claims unless
    a real qualified reviewer and review workflow are later supplied.
-   Use careful editorial language for health claims and
    preserve/strengthen sourcing where appropriate.

### 3. Build a trusted editorial + comparison platform

The primary user journey is:

`Learn -> Explore -> Compare -> Choose`

Affiliate conversion is important, but usefulness and trust come first.

The site should support:

-   Educational/editorial content
-   Provider profiles
-   Peggy's provider reviews
-   Provider comparison
-   Treatment/topic discovery
-   Weight + HRT content
-   Transparent affiliate CTAs and offers
-   Clear authorship and review methodology
-   Strong related-content and internal-linking systems

### 4. Structured data before duplicated prose

Provider facts should live in structured provider data whenever
practical.

Examples:

-   Pricing
-   Consultation fees
-   Membership fees
-   Treatment options
-   Lab requirements
-   Insurance
-   HSA/FSA
-   State availability
-   Shipping
-   Eligibility
-   Affiliate destination
-   Coupon/offer
-   Last verified date
-   Personally tested status

Do not hard-code the same provider fact into multiple components/pages
when it can be sourced from the canonical provider document.

### 5. Owner-friendly CMS

After launch, Peggy will manage content.

-   Prismic labels must use plain editorial language.
-   Prefer a small, intentional slice library.
-   Avoid a generic page-builder with dozens of ambiguous variants.
-   Add field help text where an author could reasonably be confused.
-   Model repeated facts once and reference them.
-   Preview behavior must make sense to a non-developer.

## Current Affiliate Providers

Initial provider entities include:

-   Oestra
-   Winona
-   Alloy
-   Musely
-   MyMenoRx
-   Joi + Blokes
-   Effecty

Treat this list as initial migration scope, not a permanently hard-coded
list. Providers must be CMS-driven.

## Information Architecture

Primary conceptual navigation should support:

-   HRT 101
-   Symptoms
-   Treatments
-   Providers
-   Reviews
-   Compare
-   Weight & HRT
-   About

Navigation hierarchy does not require URL hierarchy. Preserve
established URLs unless a migration decision explicitly says otherwise.

`/providers` should become a meaningful comparison/discovery
destination, not merely a list of links.

## Content Architecture

Expected Prismic repeatable types:

-   Article
-   Provider
-   Provider Review
-   Comparison
-   Category
-   Topic
-   Treatment
-   Author
-   Offer
-   Page (general site pages such as Privacy, Terms, Contact)
-   Redirect

Expected singleton types:

-   Site Settings
-   Navigation
-   Homepage
-   Providers Landing
-   Editorial Standards / How We Review
-   Affiliate Disclosure

The final schema is documented in `docs/CONTENT_MODEL.md`. Do not add or
materially change a content type without updating that document.

## Design Direction

The visual identity is being developed separately by a brand designer.
Logo, final palette, and final typography may arrive later.

Implementation should therefore:

-   Build a strong layout and component system without coupling
    semantics to temporary colors.
-   Use design tokens/CSS variables for brand values.
-   Keep components resilient to later typography and palette changes.
-   Favor modern editorial layouts, strong readability, warm human
    presence, useful comparison UI, and restrained conversion design.
-   Avoid visually impersonating a clinic.
-   Avoid copying inspiration sites.

Reference feel/inspiration includes MenoHello, Joi + Blokes, and Hers,
but these are inspiration only.

## Affiliate Guardrails

Affiliate revenue is a core business outcome.

-   Affiliate destinations must be CMS-managed where possible.
-   Preserve existing affiliate links/codes during migration unless
    explicitly replaced.
-   Do not accidentally strip query parameters or tracking identifiers.
-   Centralize reusable offers rather than duplicating codes in prose.
-   Make affiliate disclosures clear and accessible.
-   Track outbound affiliate clicks using the approved analytics event
    model.
-   Do not use deceptive CTA language or obscure the distinction between
    editorial opinion and affiliate relationship.
-   Do not change affiliate destinations, codes, networks, or tracking
    behavior without explicit verification.

## SEO / AEO / GEO Guardrails

This project must protect and improve machine-readable content without
sacrificing human readability.

Required principles:

-   Server-render indexable primary content.
-   Preserve canonical URLs.
-   One intentional canonical per indexable page.
-   Maintain an explicit redirect manifest.
-   Generate XML sitemaps from canonical indexable content.
-   Use semantic HTML and logical heading hierarchy.
-   Keep comparison information in crawlable HTML, not client-only UI.
-   Use appropriate structured data only when supported by visible page
    content.
-   Expose author, published/updated dates, breadcrumbs, and relevant
    entity relationships.
-   Do not manufacture FAQ content or schema solely for search engines.
-   Do not generate thin programmatic comparison/location pages.
-   Use concise answer-first sections where they genuinely improve
    content.
-   Preserve valuable existing copy unless a content decision explicitly
    changes it.
-   Treat Core Web Vitals, accessibility, and performance as SEO
    requirements.
-   Avoid indexable faceted/filter URLs unless deliberately approved.

## URL Preservation Contract

Every existing public URL must be represented in the migration inventory
with one of:

-   `KEEP` --- same public URL and same canonical intent
-   `REDIRECT` --- documented 301 destination
-   `NOINDEX` --- retained but intentionally removed from indexing, with
    reason
-   `REMOVE` --- exceptional; requires explicit approval and a
    redirect/HTTP disposition

Default: `KEEP`.

No URL migration should be inferred from a new folder structure, Prismic
type, title, slug preference, or navigation change.

## Migration Architecture

Never implement Wix -\> Prismic as an opaque one-pass copy.

Use:

`Wix API -> raw immutable export -> normalized migration model -> validation -> Prismic Migration API`

Requirements:

-   Save a raw source snapshot.
-   Make transforms deterministic and rerunnable.
-   Use stable source identifiers.
-   Maintain source-to-destination mapping.
-   Make reruns idempotent where practical.
-   Produce validation/error reports.
-   Do not silently drop unsupported Wix content.
-   Record manual-review cases.
-   Preserve SEO fields, dates, media, links, and affiliate
    destinations.
-   Validate migrated content against the public Wix page/crawl, not
    only the API payload.

## Analytics

If an existing GA4 property is available, preserve it unless explicitly
decided otherwise. If none exists, create/configure analytics as a
separate approved setup task.

Track at minimum:

-   Page views through the approved analytics setup
-   Affiliate CTA clicks
-   Provider identity
-   CTA placement/context
-   Destination/offer identity where appropriate
-   Comparison interactions that are useful for product decisions

Do not introduce duplicate analytics initialization.

Search Console continuity is important for launch monitoring.

## Accessibility

Target WCAG 2.2 AA for implemented UI.

At minimum:

-   Semantic landmarks
-   Keyboard-accessible navigation and menus
-   Visible focus
-   Proper labels and names
-   Meaningful alt text workflow
-   Sufficient contrast after brand tokens are finalized
-   No information conveyed only by color
-   Accessible comparison tables and filter controls
-   Reduced-motion respect where animation is used

## Performance

Performance is a product and SEO requirement.

-   Prefer server components by default.
-   Add client components only where interactivity requires them.
-   Minimize third-party JavaScript.
-   Optimize responsive images.
-   Prevent layout shift.
-   Load fonts deliberately.
-   Avoid shipping entire provider datasets to the client when server
    rendering can do the work.
-   Keep comparison/filter behavior progressive where practical.

## Security and Privacy

-   Keep Prismic/Wix/Netlify credentials server-side and out of source
    control.
-   Never expose migration tokens to browser code.
-   Validate environment variables.
-   Do not log secrets or complete sensitive API payloads.
-   Treat third-party scripts as production dependencies requiring
    review.
-   Use least-privilege API credentials where supported.
-   Do not add tracking pixels, session replay, advertising scripts, or
    other data collection without explicit approval.

## Working Style

-   Prefer small, reviewable changes over broad rewrites.
-   Preserve established behavior unless the task explicitly changes it.
-   Read the relevant docs before architecture-sensitive edits.
-   Follow established patterns in touched code.
-   Keep content/data concerns separate from presentation.
-   Do not hard-code CMS content to finish a screen unless it is clearly
    temporary and documented.
-   Do not invent provider facts, pricing, medical claims, affiliate
    codes, URLs, analytics IDs, or migration mappings.
-   Keep docs in sync with material decisions.

## High-Risk Areas

Exercise extra care around:

-   Public URL/canonical changes
-   Redirects and 404 behavior
-   Wix migration transforms
-   Prismic UID/path resolution
-   Existing article copy and headings
-   Affiliate URLs/codes/tracking
-   Provider pricing/facts
-   Medical/health claims
-   Structured data
-   Sitemap/robots behavior
-   Analytics continuity
-   Search Console/domain verification
-   DNS/domain transfer/cutover
-   Image migration and alt text
-   Content dates/authorship
-   Comparison filtering that could create crawl traps
-   Environment/secrets handling

Do not assume the nearest local implementation is canonical in these
areas. Check project docs.

## Testing Expectations

For meaningful changes, run the smallest relevant verification first and
broader checks before finishing when practical.

Expected checks once scripts exist:

-   Lint
-   Typecheck
-   Unit/targeted tests for touched logic
-   Production build for meaningful cross-surface changes
-   Link/route validation for routing changes
-   Schema/structured-data validation for SEO changes
-   Migration fixture tests for migration transforms
-   Accessibility checks for major UI work

For migration/cutover work, also validate:

-   Known legacy URLs return expected status/canonical
-   Redirect chains do not appear
-   No accidental 404s
-   Affiliate destinations are intact
-   Metadata parity where preservation is required
-   Sitemap contains intended canonical URLs
-   robots behavior is correct
-   production analytics fires once
-   staging/preview environments are not indexable

If verification cannot be run, state that clearly in the handoff.

## Deep Branch Review

When the user explicitly asks for a "deep branch review", follow
`docs/DEEP_BRANCH_REVIEW.md` exactly. Do not enter that mode
otherwise.

## Plan Reconciliation

When reviewing work implemented from an approved plan, reconcile the
final implementation against that plan.

Flag material decisions introduced, changed, omitted, or interpreted
beyond what the approved plan specified.

Pay particular attention to:

-   Public URL/canonical behavior
-   Content architecture and Prismic schemas
-   Migration data flow
-   Affiliate tracking/destinations
-   Analytics
-   SEO/AEO/GEO behavior
-   Structured data
-   New production dependencies
-   External APIs/services
-   Caching/revalidation
-   Error/fallback/recovery behavior
-   Performance assumptions
-   User-visible UX decisions
-   Accessibility
-   DNS/deployment/cutover behavior
-   Canonical sources of provider facts

For each material deviation report:

1.  What differs
2.  Why the implementation appears to have made that decision
3.  Implications/risks
4.  Whether explicit user approval is needed

Also identify planned items not implemented, meaningful assumptions
caused by ambiguity, and new production dependencies with justification.

## Editing Rules

-   Do not revert unrelated user changes.
-   Treat the worktree as potentially dirty.
-   Prefer non-destructive, non-interactive git usage.
-   Update nearby docs when behavior/architecture changes.
-   Add comments sparingly and only when they materially improve
    clarity.
-   Do not silently reformat or rewrite migrated editorial content.
-   Do not make broad SEO/content changes as incidental cleanup.

## Good Agent Handoff

A strong handoff includes:

-   What changed
-   Why it changed
-   Assumptions made
-   URLs/content types affected
-   SEO/canonical/redirect implications
-   Affiliate implications
-   Migration implications
-   What was verified
-   Remaining risks
-   Material deviations from the approved plan
-   Meaningful implementation decisions not specified in the plan
-   Planned items not implemented
-   New production dependencies and why

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
