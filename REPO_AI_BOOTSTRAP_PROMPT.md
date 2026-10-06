# Repository AI Bootstrap Prompt

Use this prompt after placing the project documentation into the
repository.

------------------------------------------------------------------------

You are starting the Hormone Therapy Hub rebuild.

Before writing code:

1.  Read `AGENTS.md` completely.
2.  Read:
    -   `docs/PROJECT_PLAN.md`
    -   `docs/CONTENT_MODEL.md`
    -   `docs/SEO_AEO_GEO.md`
    -   `docs/MIGRATION_RUNBOOK.md`
3.  Inspect the current repository state, package manager, existing
    configuration, git status, and branch.
4.  Do not delegate to subagents unless I explicitly authorize it.
5.  Do not create a second live work branch if one already exists.
6.  Treat the existing production site's URLs, content, affiliate links,
    and search equity as assets that must be preserved.
7.  Do not invent Wix API mappings, Prismic data, provider facts,
    affiliate URLs/codes, analytics IDs, or medical claims.

Then produce a short implementation proposal for **Phase 0 ---
Repository foundation** only.

The proposal should state:

-   what already exists in the repo
-   what needs to be added
-   proposed folder structure
-   proposed dependencies and why each is needed
-   scripts/CI checks
-   environment-variable strategy
-   design-token approach that can accept brand values later
-   Prismic integration foundation
-   Netlify deployment foundation
-   documentation changes, if any
-   verification plan

Do not implement until the proposal is approved.

After Phase 0 is approved and implemented, work through the project plan
one phase at a time. Do not jump ahead into migration mappings that
require Wix access.

For every phase:

-   preserve approved architectural decisions
-   keep documentation synchronized
-   use small reviewable changes
-   run relevant verification
-   report assumptions and unresolved questions
-   report any material deviation from the approved plan before treating
    the phase as complete

When I explicitly ask for a **deep branch review**, follow the read-only
workflow in `docs/DEEP_BRANCH_REVIEW.md` exactly.
