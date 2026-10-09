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

The homepage is one single page type. Its slices, the shared Section
fields, and the rich text rules are specified in `docs/SLICE_MODEL.md`.

### Blog

The blog index is one single page type at `/blog`. It has no slices.
The title, dek, topic links, and the telehealth reasons at the bottom
of the live page are fields. The post grid is every Post, newest
first. Field ids are in `docs/SLICE_MODEL.md`.

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

Custom type, `customtypes/author`. One person, one document.

Fields:

-   UID
-   Name
-   Name title — a short line under the name, on the byline and the
    author card
-   About
-   Profile

Peggy B. is the author document. A post with an empty Author field
uses her. Choose another author only when the post is not hers.

Do not create credential fields that imply medical expertise unless
actually applicable.

### Provider

One clinic, one document. She updates a price, a coupon, or a logo
here, and every slice that shows that fact updates with it. A slice
stores a content relationship to the clinic. The slice decides which
fields it fills in. It does not keep its own copy of the price.

The clinic is a custom type, `customtypes/provider`. Peggy fills it
in tabs. A tab is a group of fields. The model is in that file.

Tabs:

-   Profile — name, logo, short description, visit link, page link
-   Price — the monthly price, the three price-box lines, and the coupon code
-   Care — labs, HSA, states
-   Words — her short quote

A clinic has no public page and no SEO tab. A clinic page is a Page.
Slices on that page point at the clinic. Visit is the only link to the
clinic's own site. Page is a link to the site page about this clinic,
and it stays blank until that page exists. The sidebar name uses Page.
A review link is written on the slice that shows it.

Field ids are in `docs/SLICE_MODEL.md`. The long review stays on the
Provider review. A story inserts a clinic with a token such as
`{{provider:inner-balance:offer}}`, which reads the Profile and Price
tabs.

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
-   Review sections/slices
-   Pros/cons if editorially specific
-   Related comparisons
-   Related articles
-   SEO title
-   SEO description
-   Social image
-   Canonical override only when required
-   Indexability control with safe default

### Post

One Wix blog post becomes one Post. The page type is
`customtypes/post`. It has no slice zone. The story is one rich
text field. Field ids, the Wix mapping, and the pieces the mockup
adds are in `docs/SLICE_MODEL.md`.

Fields:

-   Title
-   UID
-   Subtitle (`sub_title`, the line under the title and the card; the Wix excerpt)
-   Personal note
-   Story
-   Image
-   Caption
-   Author
-   Published
-   Category (a select on the post, not a Category document)
-   Sources
-   SEO title, SEO description, and social image (the page type's SEO tab)
-   Canonical override only when required
-   Indexability control with safe default

The card reads Title, Image, Subtitle, Published, Category, and the
minutes to read. Clinics in the sidebar come from provider tokens in
the story. A paragraph that is only `{{photos}}` places the next two
photos side by side. Minutes to read, Keep reading, and the document
tags are derived. Published is the original publish date. There is no updated
date. Migration writes the Wix excerpt into Subtitle.

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

The post's Category field is a select: Review, Comparison, My
experience, or HRT 101. Wix blog categories are a different list and
are not copied onto this select. Migration leaves Category empty. Do
not create Category documents for those four labels, and do not give
them public pages, until an indexing decision says the blog filter
should be a real URL.

Use a Category document only where it provides a meaningful editorial
taxonomy of its own. Avoid duplicating Topic semantics.

### Callout

A reusable box inserted in the flow of a post. Callout has no public
page, so it is a custom type. A post points at it with a content
relationship. It cannot be embedded inside a rich text field.

Fields are specified in `docs/SLICE_MODEL.md`.

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

The homepage slices, the shared Section group, and the shared rich text
component are specified in `docs/SLICE_MODEL.md`. Copy that Section group
and those rich text presets onto later slices.

The post and the blog index do not use slices. A post pulls a
clinic's offer or facts into the story with a provider token. Review,
provider, and trusted-providers slices are not specified yet.
Candidates:

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

Trim overlapping candidates before building them (for example Provider
Card / Provider Grid / Provider Comparison / Comparison Table, and
Affiliate CTA / Offer Callout). The homepage clinic comparison is the
comparison slice. A post inserts a clinic offer with a provider
token. It does not insert a Callout.

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
-   A Post is always `/post/<uid>`. It has no URL section field.
-   A Clinic has no public URL. A clinic page is a Page, and the slices
    on that page point at the clinic.
-   Every other routable editorial type (Provider Review, Comparison,
    Page, and Treatment/Topic when they have a public page)
    has a required **URL section** select field:
    -   "Blog post (/post/…)" → `/post/<uid>` (default)
    -   "Site page (/…)" → `/<uid>`
-   The public path is always section + UID, except for a Post,
    whose section is fixed. There is no free-text path field.
-   Prismic only guarantees UID uniqueness within one type, so the
    build fails if two documents of any type resolve to the same path.

Migration populates UID, and URL section where that field exists, from
the URL manifest.

## Freshness

The comparison chart has a Prices checked date. That is the day the
prices in that chart were confirmed. A clinic does not store its own
checked date.

Do not automatically update the chart date when unrelated editorial
fields change.

## Relationships

Preferred graph:

-   Review -\> Provider
-   Comparison -\> Providers
-   Clinics in the sidebar come from provider tokens in the story, in the order each clinic is first named. The name links to the clinic's Page field. A blank Page leaves the name as text.
-   Clinic -\> Page. The clinic stores which site page is about it. Slices on that page still point back at the clinic for its facts.
-   Keep reading is the newest posts in the same category, then the newest posts in any category. It is not a field.
-   Callout -\> Provider
-   Homepage slices -\> Provider, Post, Provider Review, and Comparison
-   All editorial documents -\> Author
-   A story token looks up a Provider by its UID. That lookup is not a
    content relationship.
-   Landing pages -\> curated document references as needed

Avoid circular authoring dependencies that make migration or editing
fragile. The clinic's Page field and the slices on that page are the
one accepted pair: the clinic names its page, and the page names the
clinic.
