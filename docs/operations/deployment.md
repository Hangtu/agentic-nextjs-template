# Deployment and CI/CD (Vercel + GitHub Actions)

> **Read when:** changing CI, environments, migrations-in-deploy, domains, or release process.

## Environments

| Environment | Trigger | Database | URL |
|---|---|---|---|
| Local | `pnpm dev` | Local Postgres (Docker) or a personal Neon branch | `localhost:3000` |
| Preview | Every PR (Vercel Git integration) | Neon branch per PR (Neon ↔ Vercel integration), migrated automatically | `*.vercel.app` (noindex) |
| Production | Merge to `main` | Production DB (PITR enabled, daily backups) | custom domain |

## Pipeline

```text
PR opened ─► GitHub Actions "ci" (quality job + e2e job) ─► Vercel preview deploy ─► review on preview
merge to main ─► "ci" on main ─► migrate production DB ─► Vercel production deploy ─► smoke check
```

- **DEPLOY-1 (MUST)** CI gates every PR. The required checks are:
  - `pnpm install --frozen-lockfile`
  - `typecheck`, `lint`, `format:check`, `i18n:check`, `knip`
  - unit/integration tests
  - build
  - E2E with axe against the production build and a Postgres service
- **DEPLOY-2 (MUST)** Production migrations run **before** the new code serves traffic, from CI (`pnpm db:migrate` with the production `DATABASE_URL` stored as a GitHub environment secret, protected by required reviewers), or from the Vercel build step for previews. Never run them from a laptop.
- **DEPLOY-3 (MUST)** Migrations are backward compatible (DB-33), so the previous deployment keeps working during rollout and Vercel **Instant Rollback** is always safe.
- **DEPLOY-4 (MUST)** Pin the Node version through `engines.node` in `package.json` (current Active LTS). `.node-version` matches.
- **DEPLOY-5 (MUST)** Production env vars are set in Vercel per environment. Preview never uses production secrets or production data.
- **DEPLOY-6 (MUST)** After a production deploy, run the smoke check: `/api/health` returns 200, the home page renders, and sign-in works. On failure, roll back first and investigate second.
- **DEPLOY-7 (SHOULD)** Enable Vercel Deployment Protection on previews if they contain unreleased features, and the Vercel Firewall/WAF with rate-limit rules for auth and API routes.
- **DEPLOY-8 (MUST)** Scheduled jobs use Vercel Cron (`vercel.json`) calling `/api/cron/*` with `CRON_SECRET`, and are idempotent.

## Releases and rollback

- Every merge to `main` is a release; the git SHA is the release ID (passed to error tracking).
- Rollback: Vercel dashboard → Instant Rollback to the previous deployment. If a migration was involved, it was backward compatible, so the old code still works. Then fix forward.
- Hotfix: branch from `main` → PR → expedited review → merge.

## Portability (if leaving Vercel)

`output: "standalone"` + a Dockerfile runs anywhere Node does. You then also need:
- a shared cache handler for `"use cache"` across instances;
- a CDN in front;
- image optimization (`sharp`);
- a cron replacement;
- log/trace shipping.

Record the move in an ADR.
