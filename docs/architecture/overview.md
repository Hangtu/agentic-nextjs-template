# Architecture Overview

> **Read when:** starting work on the project, or making any change that crosses layers.

## Shape of the system

One Next.js application (a modular monolith) on Vercel, backed by one PostgreSQL database.

```text
Browser ──► Vercel CDN ──► proxy.ts (locale routing, optimistic auth redirect)
                              │
                              ▼
                      Next.js App Router
     ┌──────────── src/app (routes: thin) ────────────┐
     │  Server Components  │  Server Actions  │  Route Handlers (/api)
     └──────────┬──────────┴────────┬─────────┴───────┬──────────┘
                ▼                   ▼                 ▼
        features/*/server: queries.ts (reads) · mutations.ts (writes)
           ← authentication + authorization happen HERE (data access layer)
                │
                ▼
        src/server: db (Drizzle) · auth (Better Auth) · logger · adapters
                │
                ▼
        PostgreSQL          Third parties (email, payments, storage) via adapters
```

## Key decisions

| Decision | Summary | ADR |
|---|---|---|
| App Router + Server Components + Cache Components | Server-first rendering; explicit `"use cache"` caching; streaming with Suspense | [0001](decisions/0001-nextjs-app-router-cache-components.md) |
| Feature-based structure | Vertical slices in `src/features/*`; one-way imports | [0002](decisions/0002-feature-based-structure.md) |
| Postgres + Drizzle | SQL-first typed schema, generated migrations | [0003](decisions/0003-postgres-drizzle.md) |
| Better Auth | Self-hosted sessions in our DB; plugins for orgs/2FA | [0004](decisions/0004-better-auth.md) |
| Tailwind + shadcn/ui on Base UI | Tokens in CSS; owned accessible components | [0005](decisions/0005-tailwind-shadcn-base-ui.md) |
| next-intl with locale-prefixed routes | `as-needed` prefix, hreflang, typed messages | [0006](decisions/0006-next-intl-routing.md) |
| Server Actions for UI mutations, Route Handlers for external APIs | One mutation path per consumer | [0007](decisions/0007-server-actions-and-route-handlers.md) |
| AGENTS.md + docs/ as the agent contract | One tool-agnostic source of truth | [0008](decisions/0008-agents-md.md) |

## Request lifecycles

**Page view (signed in):**
1. `proxy.ts` resolves the locale. If the session cookie is missing on an `(app)` route, it redirects to sign-in (optimistic check only).
2. The static shell (layout, nav) is served instantly; it was prerendered thanks to Cache Components.
3. Dynamic parts render inside `<Suspense>`. They call `features/x/server/queries.ts`, which runs `requireUser()` (the real check) and queries Postgres through Drizzle, returning DTOs.
4. HTML streams to the browser; only Client Components hydrate.

**Mutation from the UI:**
1. A Client Component calls a Server Action from `features/x/server/actions.ts`.
2. `createAction` authenticates, validates with the Zod schema, calls `mutations.ts` (which authorizes and writes), maps errors to `ActionResult`, and logs unexpected failures.
3. The action calls `updateTag(...)` for affected cache tags. The UI updates with fresh server data.

**External API call / webhook:**
1. `src/app/api/v1/**/route.ts`, wrapped with `withApiHandler`, authenticates (session, API key, or webhook signature), validates, and calls the same `mutations.ts` / `queries.ts`.

## Rendering and caching strategy

| Content | Strategy |
|---|---|
| Marketing pages, blog, docs, pricing | Static: `"use cache"` + `cacheLife("days" or "max")` + `cacheTag`; invalidated on publish |
| Shared reference data (plans, categories) | `"use cache"` + `cacheTag`; invalidated by the mutation |
| Per-user data (dashboard, settings) | Dynamic, streamed inside `<Suspense>`; never cached across users |
| Real-time-ish data | Dynamic; refresh with `router.refresh()`/`refresh()` or polling only if required |

Details: [data-fetching-and-caching.md](../backend/data-fetching-and-caching.md).

## Non-functional requirements (MVP baseline)

| Area | Target |
|---|---|
| Performance | Core Web Vitals "good" at p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 |
| Accessibility | WCAG 2.2 AA |
| SEO | Every public page indexable, localized, with metadata, sitemap, structured data |
| Security | OWASP Top 10 controls; auth checked in the data layer; patched dependencies |
| Privacy | No PII in logs; consent before non-essential tracking; account export/delete |
| Availability | Vercel + managed Postgres with point-in-time recovery; health endpoint |
| Observability | Errors tracked with release + context; structured logs; Web Vitals |
