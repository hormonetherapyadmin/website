# Hormone Therapy Hub

Rebuild of [hormonetherapyhub.com](https://www.hormonetherapyhub.com)
from Wix to Next.js + Prismic on Netlify.

Start with `AGENTS.md` and `docs/PROJECT_PLAN.md`. Approved technical
decisions are in section 24 of the project plan.

## Requirements

- Node 24 (see `.nvmrc`)
- pnpm, via Corepack: `corepack enable pnpm`

## Setup

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

## Scripts

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Local dev server                                     |
| `pnpm build`        | Production build                                     |
| `pnpm lint`         | ESLint                                               |
| `pnpm typecheck`    | Generate Next.js route types, then `tsc`             |
| `pnpm format`       | Prettier write (`format:check` to verify)            |
| `pnpm test`         | Vitest unit tests                                    |
| `pnpm test:e2e`     | Playwright smoke + accessibility tests (build first) |
| `pnpm check`        | Everything CI runs, in order                         |

## Environment variables

See `.env.example`. The site is `noindex` unless `ALLOW_INDEXING=true`,
which is set only in Netlify's production context at cutover.
