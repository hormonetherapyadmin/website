# Hormone Therapy Hub

The live site at [hormonetherapyhub.com](https://www.hormonetherapyhub.com)
is this Next.js + Prismic app on Vercel. The Vercel project is
[`website-v3hp`](https://website-v3hp.vercel.app/). The apex domain
redirects to `www`. Wix is the former host and the migration source.
DNS stays in the Wix account; see `docs/WIX_DOMAIN.md`.

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

See `.env.example`. Production has `ALLOW_INDEXING=true`. Leave it
unset everywhere else, including local development and Vercel Preview,
so those environments stay `noindex`.
