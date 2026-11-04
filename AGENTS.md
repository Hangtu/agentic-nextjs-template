# AGENTS.md

Instructions for AI coding agents (Claude, GPT/Codex, DeepSeek, Cursor, Copilot, …) and for humans.
This file is deliberately short. Detailed rules live in `docs/`. **Before you change code, open the doc that the routing table (§5) lists for your task.**

## 1. Project

- **Product:** FILL: one-liner (see `docs/product/brief.md`)
- **Stage:** MVP
- **Stack:**
  - Next.js 16 (App Router, Server Components, Cache Components) · React 19 (React Compiler) · TypeScript strict
  - Tailwind CSS v4 · shadcn/ui on Base UI · next-intl · Zod · React Hook Form · nuqs
  - PostgreSQL + Drizzle ORM · Better Auth
  - Vitest + Playwright · pnpm · Vercel
- **Bootstrapped?** If there is no `package.json` yet, follow `docs/playbooks/bootstrap-project.md` first.

## 2. Commands

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| **All checks (run before saying "done")** | `pnpm verify` |
| Type check / lint / format | `pnpm typecheck` · `pnpm lint` (`lint:fix`) · `pnpm format` |
| Unit + integration tests | `pnpm test` (`test:watch`) |
| E2E + accessibility tests | `pnpm test:e2e` |
| i18n key check | `pnpm i18n:check` |
| DB: generate / apply migration | `pnpm db:generate` · `pnpm db:migrate` |
| Add a UI component | `pnpm dlx shadcn@latest add <name>` |
| Bundle analysis | `pnpm analyze` |

## 3. Golden rules (non-negotiable)

1. **Mirror existing patterns.** Find the closest existing example and copy its structure. New libraries, folders or patterns need an ADR (`docs/architecture/decisions/`).
2. **Server Components by default.** Add `"use client"` only for interactivity, on the smallest leaf.
3. **The data layer is the security boundary.** Every query and mutation in `src/features/*/server/` checks authentication **and** authorization itself. `proxy.ts`, layouts and hidden buttons are never security.
4. **Validate every external input with Zod**: actions, route handlers, params, searchParams, webhooks, env.
5. **Mutations from the UI go through `createAction()`** in `features/<f>/server/actions.ts` and return `ActionResult`. External HTTP goes through `withApiHandler()` route handlers.
6. **Cache explicitly.** Use `"use cache"` + `cacheLife` + `cacheTag` for shared data only; never cache per-user data in shared caches. Put request-dependent UI inside `<Suspense>`. Invalidate with `updateTag`.
7. **No hardcoded user-facing text.** Every string goes in `messages/<locale>.json`, for **all** locales. Navigate only with `@/i18n/navigation`.
8. **Design tokens only.** Use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`), logical properties (`ms-*`, `pe-*`), and shadcn components (Base UI API: `render` prop, no Radix).
9. **Accessible by default (WCAG 2.2 AA).** Semantic HTML, labels, keyboard support, visible focus, contrast.
10. **Public pages are SEO-complete.** `generateMetadata` via `buildPageMetadata` (canonical + hreflang + OG), sitemap entry, JSON-LD. Private pages are `noindex`.
11. **TypeScript strict.** No `any`, `@ts-ignore` or `!`. Derive types from Zod schemas and Drizzle tables.
12. **Small, scoped changes.** Tests for new logic, and a failing test first for bug fixes. `pnpm verify` green before you say "done".

## 4. Where things go

```text
src/app/[locale]/(marketing|auth|app)/   routes only: thin pages, metadata, Suspense
src/app/api/                             external HTTP: v1 REST, webhooks, cron, health
src/features/<feature>/                  components/, hooks/, schemas.ts, types.ts, constants.ts,
                                         server/{queries,mutations,actions,cache-tags}.ts
src/components/{ui,layout,shared}/       shadcn primitives · chrome · cross-feature composites
src/server/                              db (Drizzle), auth (Better Auth), action.ts, api.ts, logger
src/lib/                                 isomorphic helpers: cn, errors, action-result, seo
src/i18n/ · messages/                    next-intl routing/navigation/request · catalogs
src/config/ · src/env.ts                 site/routes/navigation config · validated env
drizzle/ · e2e/ · docs/                  migrations · Playwright · knowledge base
```

Import direction: `app → features → shared`. **Features never import other features.** Only `server/` folders touch the DB.
Full tree and rules: `docs/architecture/project-structure.md`.

## 5. Read before you start (routing table)

| If your task is… | Read first |
|---|---|
| Creating the project from this kit | `docs/playbooks/bootstrap-project.md` |
| A new feature ("create feature X") | `docs/playbooks/add-feature.md` → `docs/architecture/reference-feature.md` |
| A page or route | `docs/playbooks/add-page.md`, `docs/discoverability/seo.md` |
| A component or styling | `docs/standards/react-components.md`, `docs/standards/styling.md`, `docs/playbooks/add-ui-component.md` |
| A form or mutation | `docs/standards/forms.md`, `docs/backend/server-actions.md` |
| Reading or caching data | `docs/backend/data-fetching-and-caching.md` |
| Database schema or queries | `docs/backend/database.md`, `docs/playbooks/change-database-schema.md` |
| Auth, sessions, permissions | `docs/backend/auth.md`, `docs/quality/security.md` |
| An API endpoint, webhook, or cron | `docs/backend/api-routes.md`, `docs/playbooks/add-api-endpoint.md` |
| Text, translations, a new language | `docs/discoverability/i18n.md`, `docs/playbooks/add-translations-or-locale.md` |
| SEO, robots, sitemap, llms.txt | `docs/discoverability/seo.md`, `docs/discoverability/ai-discoverability.md` |
| Errors, logging, monitoring | `docs/standards/error-handling.md`, `docs/operations/observability.md` |
| Env vars, config, feature flags | `docs/operations/environment-and-config.md` |
| Tests | `docs/quality/testing.md` |
| Performance | `docs/quality/performance.md` |
| Accessibility | `docs/quality/accessibility.md` |
| Analytics, cookies, personal data | `docs/discoverability/analytics-and-privacy.md` |
| Adding or upgrading a dependency | `docs/operations/dependencies.md`, `docs/playbooks/upgrade-dependencies.md` |
| A bug | `docs/playbooks/fix-bug.md` |
| A refactor | `docs/playbooks/refactor.md` |
| Reviewing code (yours or others') | `docs/playbooks/code-review.md`, `docs/workflow/definition-of-done.md` |
| Naming anything | `docs/standards/naming.md` |
| Git, commits, PRs | `docs/workflow/git-and-prs.md` |
| Deploying, CI | `docs/operations/deployment.md` |
| Unsure which library or API to use | `docs/architecture/tech-stack.md` (incl. "Not in the stack") |

Index of all docs: `docs/README.md`.

## 6. How to work

1. **Orient:** read the routing-table docs and the closest existing example.
2. **Clarify:** ask about ambiguous requirements (batched, each question with a default).
3. **Plan:** for features, write `docs/specs/<feature>.md` and get approval.
4. **Implement** in vertical slices.
5. **Verify:** `pnpm verify` + E2E + look at the UI.
6. **Self-review** with `docs/playbooks/code-review.md`.
7. **Report:** summary, changes, verification, decisions, follow-ups.

Details: `docs/workflow/agent-workflow.md`.

**Your training data may be outdated.** Before using an API you're unsure of, check the installed version and its docs (Next.js docs are bundled in `node_modules/next/dist/docs/`).

## 7. Boundaries

- ✅ **Always:**
  - run `pnpm verify`;
  - keep changes scoped;
  - write tests;
  - update the doc that owns a convention when you change it;
  - use existing components and helpers.
- ⚠️ **Ask first:**
  - adding, removing or major-upgrading dependencies;
  - dropping or renaming DB columns/tables, or data rewrites;
  - auth, permissions, CSP/CORS/rate-limit changes;
  - CI/CD, build, lint or TS config changes;
  - deleting features;
  - large unrequested refactors;
  - anything that costs money or touches external services;
  - committing, pushing, or opening PRs (unless asked).
- 🚫 **Never:**
  - commit or print secrets or personal data;
  - bypass checks (`--no-verify`, `@ts-ignore`, unexplained `eslint-disable`, `.skip`/`.only`, loosening configs, deleting failing tests);
  - edit applied migrations, the lockfile, or generated files;
  - force-push `main`;
  - run destructive commands on non-local databases;
  - leave placeholders or mock data in production code;
  - invent APIs or use outdated patterns (Pages Router, `middleware.ts`, `unstable_cache`, `forwardRef`, Radix `asChild`, `tailwind.config.js`).

<!-- Next.js maintains the block below (bootstrap copies it from create-next-app; `next dev` keeps it updated). Do not edit it by hand. -->
