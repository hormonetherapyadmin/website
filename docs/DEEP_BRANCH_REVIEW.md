# Deep Branch Review

Read-only review workflow referenced from `AGENTS.md`. Use it only when
the user explicitly asks for a "deep branch review".


A deep branch review is a special read-only review mode for large,
architecture-sensitive, SEO-sensitive, migration-sensitive, or
launch-sensitive changes.

Enter this mode only when the user explicitly asks for a "deep branch
review" or clearly requests this specific repository-wide review
workflow. Do not enter it automatically after implementation and do not
treat ordinary requests to review, inspect, check, or verify code as a
deep branch review.

## Review Boundary

Unless the user specifies another base, review the current branch
against `main`.

The review is read-only:

-   Do not modify files.
-   Do not apply fixes.
-   Do not create commits.
-   Do not change branches.
-   Do not rewrite or clean the worktree.
-   Do not spawn delegated agents unless separately authorized under the
    Mandatory Agent Policy.
-   Non-destructive commands used for inspection and verification are
    allowed.

Treat the review as independent verification. Do not assume an
implementation is correct because it was produced earlier in the same
conversation. Verify behavior from repository state, diff, tests,
source-of-truth documentation, and relevant manifests.

## Phase 1: Establish the Change Map

Before looking for individual bugs, understand the complete change.

1.  Inspect the full committed branch diff between the merge base of the
    base branch and `HEAD`.
2.  Separately inspect staged and unstaged working-tree changes.
3.  Inspect the combined changed-file list and diff statistics.
4.  Read relevant source-of-truth docs.
5.  Group changed files into logical subsystems/change cohorts.
6.  Identify dependencies and data flow between groups.
7.  Identify high-risk groups using this file.
8.  Identify generated, lock, snapshot, migration-output, or mechanical
    files that do not warrant equal review depth.

Do not review a large change merely in alphabetical file order.

Useful project-specific review groups may include:

-   Next.js routes/layouts
-   Design system/components
-   Prismic models/querying
-   Article rendering
-   Provider/review/comparison rendering
-   SEO metadata/canonicals/schema/sitemaps
-   Affiliate tracking
-   Wix extraction/normalization/import
-   URL/redirect manifest
-   Analytics
-   Netlify/deployment/config
-   Tests/docs

## Phase 2: Review Each Change Group

Determine intended behavior before judging implementation. Trace beyond
changed lines when necessary.

Check for:

-   Incorrect behavior and regressions
-   Broken caller/callee assumptions
-   Missing edge cases
-   Input-validation/trust-boundary problems
-   Migration loss/corruption
-   Non-idempotent migration behavior
-   Prismic model/query disagreement
-   Broken URL/canonical preservation
-   Redirect loops/chains
-   Accidental noindex/indexing changes
-   Metadata regressions
-   Structured-data claims unsupported by visible content
-   Client-only content that should be indexable
-   Affiliate tracking/destination loss
-   Duplicate analytics events
-   Medical claims introduced beyond source content
-   Accessibility regressions
-   Material performance regressions
-   Error-handling/recovery failures
-   Tests that do not exercise claimed behavior
-   Missing tests for material new behavior

For migration-sensitive changes, explicitly trace:

`Wix source -> raw export -> normalized record -> Prismic document -> Next.js query -> rendered URL -> metadata/canonical -> links/CTA`

For provider data, explicitly trace:

`Provider document -> review/comparison/article reference -> rendered fact -> affiliate destination`

## Phase 3: Cross-Group Integration Review

After reviewing groups, perform a separate integration pass.

Look for:

-   Content-model fields not consumed correctly by UI
-   UI assumptions not enforced by the CMS model
-   URL manifest disagreement with route resolution
-   Canonical disagreement with sitemap/internal links
-   Provider facts duplicated outside canonical data
-   Offer/affiliate changes not reflected across placements
-   Migration fields dropped between normalization and import
-   Preview behavior differing materially from production
-   Client/server boundary mistakes
-   Analytics names/properties disagreeing across components
-   New filters producing crawlable duplicate URLs
-   Staging indexability
-   Combined changes that violate project guardrails

This pass is mandatory for large branches.

## Phase 4: Verification

Run the smallest useful checks first, then broader checks justified by
scope.

Possible verification:

-   Targeted tests
-   Lint
-   Typecheck
-   Production build
-   Route/link checks
-   Legacy URL fixture checks
-   Redirect manifest validation
-   Migration fixture/dry-run validation
-   Structured-data validation
-   Accessibility checks
-   Bundle/performance inspection where relevant
-   Repository CI command when defined

Tests/static checks are evidence, not proof. Continue reasoning about
behavior even when they pass.

Do not modify production code merely to make verification easier.

## Finding Verification Standard

Before reporting a finding, verify it against the actual repository.

A finding needs a concrete failure mode, contract violation, security
issue, migration/data-integrity risk, SEO/revenue risk, accessibility
defect, or material maintainability/operational consequence.

Do not report:

-   Pure style preferences
-   Hypothetical issues without a plausible trigger
-   Issues contradicted elsewhere in the repo
-   Intentional behavior documented by source-of-truth docs
-   Generic defensive-programming suggestions without concrete risk
-   Duplicate manifestations of the same root cause

Actively attempt to disprove suspected findings. If it cannot be
verified, omit it or label it an unresolved question.

## Finding Severity

-   **Critical** --- likely severe production outage, widespread loss of
    indexed URLs/revenue, security compromise, irreversible content/data
    corruption, or similarly catastrophic failure.
-   **Major** --- concrete correctness, SEO, revenue, accessibility,
    security, data-integrity, or reliability defect that can materially
    affect users or production.
-   **Minor** --- real defect or meaningful maintainability/operational
    problem with limited impact.

Do not inflate severity.

## Finding Format

Lead with findings, ordered by severity and then confidence.

For each finding include:

1.  Severity
2.  File and line/smallest useful range
3.  Concise defect
4.  Concrete triggering scenario
5.  Impact
6.  Evidence/reasoning
7.  Suggested fix direction without implementing it

After findings include:

-   **Cross-cutting assessment**
-   **Plan reconciliation**
-   **Verification performed**
-   **Residual risks**

If no verified findings remain, say so explicitly.

## Large-Change Review Discipline

For roughly 50+ changed files, or whenever the diff is too large to
reason about as one unit:

1.  Build the complete change map.
2.  Divide into logical review groups.
3.  Review each group independently.
4.  Track suspected findings across groups.
5.  Perform cross-group integration review.
6.  Deduplicate by root cause.
7.  Re-check surviving findings against final repository state.
8.  Only then produce the final review.

For roughly 150+ changed files, prioritize semantic coverage: executable
code, CMS schemas, migration transforms, routing, SEO contracts,
analytics, affiliate behavior, trust boundaries, and cross-system
contracts. Deprioritize generated/mechanical changes unless they
evidence a deeper issue.

Do not reduce review depth merely because the branch is large.

