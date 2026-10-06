# Prismic Content Model

## Purpose

Model reusable facts separately from Peggy's editorial prose, preserve
legacy public URLs, and keep authoring simple enough for Peggy to manage
after handoff.

## Singleton Documents

### Site Settings

Suggested fields:

-   Site name
-   Default SEO title/description
-   Default social image
-   Site notice/disclaimer
-   Social links
-   Global affiliate disclosure reference/text
-   Footer configuration/reference

### Navigation

-   Primary navigation groups
-   Provider links/references
-   Utility links
-   CTA if approved

Do not hard-code provider names into the navigation component.

### Homepage

Use intentional slices/fields for the approved homepage structure.

### Providers Landing

-   Hero
-   Intro
-   Featured provider references
-   Comparison intro
-   Editorial content/slices
-   SEO fields

### Editorial Standards / How We Review

Explain firsthand testing, provider-reported information, affiliate
relationships, updates, and Peggy's non-medical role.

### Affiliate Disclosure

Canonical disclosure content that can be linked/reused.

## Repeatable Documents

### Author

Fields:

-   Name
-   UID
-   Photo
-   Short bio
-   Long bio
-   Role descriptor
-   Experience/timeline content
-   Social links if applicable
-   SEO fields

Do not create credential fields that imply medical expertise unless
actually applicable.

### Provider

Canonical provider facts.

Suggested fields:

-   Name
-   UID/internal identifier
-   URL section, only if the provider has a public page (see Public
    Path Strategy)
-   Logo
-   Short description
-   Official website
-   Default affiliate destination
-   Personally tested status
-   Testing notes/date
-   Last verified date
-   Starting price
-   Consultation fee
-   Membership fee
-   Price notes
-   Lab requirement
-   Lab notes
-   Insurance
-   HSA/FSA
-   Shipping
-   Eligibility
-   State availability
-   Treatment references
-   Weight-management support
-   Pros
-   Cons
-   Offer references
-   Review reference(s)
-   Related content
-   Source/verification notes
-   SEO fields where provider has a public page

Avoid overloading Provider with long review prose.

### Provider Review

Fields:

-   Title
-   UID
-   URL section (see Public Path Strategy)
-   Provider reference
-   Author reference
-   Published date
-   Updated date
-   Summary/verdict
-   Personally tested declaration
-   Review sections/slices
-   Pros/cons if editorially specific
-   Related comparisons
-   Related articles
-   SEO title
-   SEO description
-   Social image
-   Canonical override only when required
-   Indexability control with safe default

### Article

Fields:

-   Title
-   UID
-   URL section (see Public Path Strategy)
-   Dek
-   Author
-   Published date
-   Updated date
-   Category
-   Topic references
-   Treatment references
-   Provider references
-   Hero image
-   Body slices
-   Related content
-   SEO title
-   SEO description
-   Social image
-   Canonical override only when required
-   Indexability control with safe default

### Comparison

Fields:

-   Title
-   UID
-   URL section (see Public Path Strategy)
-   Author
-   Provider references
-   Editorial verdict/summary
-   Comparison configuration
-   Body slices
-   Related content
-   Dates
-   SEO fields

Factual comparison cells should be sourced from Provider documents where
practical.

### Treatment

-   Name
-   UID
-   Description
-   Related articles
-   Related providers
-   SEO fields/public path if it has an indexable landing page

### Topic

-   Name
-   UID
-   Description
-   Related content
-   SEO fields/public path if indexable

### Category

Use only where it provides meaningful editorial taxonomy. Avoid
duplicating Topic semantics.

### Offer

Suggested fields:

-   Name/internal label
-   Provider reference
-   Display copy
-   Coupon code
-   Affiliate destination
-   Terms/notes
-   Active
-   Start/end date if applicable
-   Last verified date

Do not silently fall back from an expired offer to an unrelated
destination without product approval.

### Page

General site pages that are not articles, reviews, or comparisons,
such as Privacy Policy, Terms, Contact, Medical Disclosures, and
one-off Wix pages found in the inventory.

-   Title
-   UID
-   URL section
-   Body slices
-   SEO title
-   SEO description
-   Social image
-   Indexability control with safe default

### Redirect

One document per redirect. Published redirects are written to
Netlify's `_redirects` file at build time.

-   From path --- key text, must start with `/`. Help text: "The old
    address, for example /old-page. Goes live after the site rebuilds,
    usually within a few minutes."
-   To --- link field. Prefer linking to a document so the redirect
    follows that document if its URL changes. External URLs are
    allowed.
-   Type --- select, `301 permanent` (default) or `302 temporary`.
-   Reason --- required key text, so every redirect stays explained.

The build fails if a From path is also a live page, duplicates
another From path, or forms a chain or loop.

## Symptoms

The "Symptoms" navigation group is served by Topic documents. There is
no separate Symptom type.

## Slice Library

Keep this intentionally small.

Initial candidates:

-   Rich Text
-   Image + Text
-   Key Takeaways
-   Quick Answer
-   Peggy's Take
-   Personal Experience
-   Pros / Cons
-   Provider Card / Featured Provider
-   Provider Grid
-   Provider Comparison
-   Comparison Table
-   Pricing Breakdown
-   Treatment Options
-   FAQ
-   Quote
-   Editorial Callout
-   Affiliate CTA
-   Offer Callout
-   Newsletter CTA (future/optional)
-   Related Articles
-   Sources / References
-   Video / Embed
-   Timeline / Steps

This list is a starting inventory, not a commitment. Phase 2 trims
overlapping candidates (for example Provider Card / Provider Grid /
Provider Comparison / Comparison Table, and Affiliate CTA / Offer
Callout) before building.

Before adding a new slice, ask whether an existing slice can represent
the editorial intent cleanly. Avoid variants that differ only
cosmetically.

## Public Path Strategy

A document's Prismic type and UID do not automatically define its public
URL.

Use an explicit route/path resolver that can preserve historical Wix
paths.

Rule:

-   UID is the Wix slug, unchanged (typos included).
-   Every routable editorial type (Article, Provider Review,
    Comparison, Page, and Provider/Treatment/Topic when they have a
    public page) has a required **URL section** select field:
    -   "Blog post (/post/…)" → `/post/<uid>` (default)
    -   "Site page (/…)" → `/<uid>`
-   The public path is always section + UID. There is no free-text
    path field.
-   Prismic only guarantees UID uniqueness within one type, so the
    build fails if two documents of any type resolve to the same path.

Migration populates UID and URL section from the URL manifest.

## Freshness

Provider facts should expose a `last_verified_date`.

The UI should make freshness visible where useful, especially on
reviews/comparisons/pricing.

Do not automatically update this date when unrelated editorial fields
change.

## Relationships

Preferred graph:

-   Review -\> Provider
-   Comparison -\> Providers
-   Article -\> Topics/Treatments/Providers
-   Provider -\> Offers
-   All editorial documents -\> Author
-   Landing pages -\> curated document references as needed

Avoid circular authoring dependencies that make migration or editing
fragile.
