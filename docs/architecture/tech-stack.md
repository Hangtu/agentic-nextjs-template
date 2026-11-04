# Tech Stack

> **Read when:** choosing a library or API, adding a dependency, or when your memory of an API may be outdated.
> **Policy:** see [dependencies.md](../operations/dependencies.md). Changing anything in this table requires an ADR.

## Versions policy

- Install commands in these docs carry **no version numbers**. New projects get the newest compatible release (respecting pnpm's `minimumReleaseAge`).
- `pnpm-lock.yaml` locks the exact versions of each app; CI installs with `--frozen-lockfile`.
- The **"Verified with"** column records the major versions these docs were last checked against. If you install a newer major, read its migration guide before copying any snippet from these docs, and update this table.

## The stack

| Concern | Choice | Verified with (2026-11) | Why |
|---|---|---|---|
| Runtime | Node.js **Active LTS** | 26 | Vercel default; set in `engines.node` and `.node-version` |
| Package manager | pnpm | 12 | Fast, strict, supply-chain settings |
| Framework | Next.js App Router, **Cache Components**, Turbopack | 16.4 | RSC, streaming, explicit caching |
| UI runtime | React, **React Compiler** on | 19.3 / compiler 1.0 | Auto-memoization |
| Language | TypeScript, strict | 6.0 (pinned `~6.0`) | typescript-eslint doesn't support TS 7 yet; see the note below |
| Styling | Tailwind CSS, CSS-first config | 4.3 | Design tokens in CSS, zero runtime |
| Components | shadcn/ui on **Base UI** (preset `base-nova`) | shadcn CLI 4, `@base-ui/react` 1 | Owned, accessible primitives; `cn()` + `cva` variants |
| Icons | lucide-react | 1 | Tree-shakable |
| Theming | next-themes | 0.4 | Class-based dark mode without a flash on load |
| i18n | next-intl | 4.14 | App Router + `next/root-params`, ICU messages, typed keys |
| Validation | Zod | 4 | One schema for client + server |
| Forms | React Hook Form + `@hookform/resolvers` | 7 | See [forms.md](../standards/forms.md) |
| URL state | nuqs | 2 | Type-safe search params |
| Database | PostgreSQL (Neon, or any managed Postgres) | 17+ | Relational, JSONB, mature |
| ORM / migrations | Drizzle ORM + drizzle-kit | 0.45 / 0.31 | SQL-first, typed, no codegen |
| Auth | Better Auth (+ Drizzle adapter) | 1.7 | Self-hosted, plugins (orgs, 2FA, passkeys) |
| Env validation | `@t3-oss/env-nextjs` | 0.13 | Fails fast at build |
| Toasts | sonner | 2 | Accessible live region |
| Email (when needed) | Resend + React Email | — | Transactional email |
| Unit/integration tests | Vitest + Testing Library + PGlite | 5 | Fast; real Postgres in-process |
| E2E tests | Playwright + `@axe-core/playwright` | 1.64 | Cross-browser + accessibility |
| HTTP mocking | MSW | 3 | Mock third-party APIs in tests |
| Lint / format | ESLint (flat config) + Prettier | ESLint 9 (pinned `^9`), Prettier 3 | Some plugins don't support ESLint 10 yet; see the note below |
| Git hooks | lefthook + commitlint | 2 / 21 | Fast, cross-platform |
| Dead code | knip | 6 | Unused files/exports/deps |
| Hosting | Vercel | — | Previews, Fluid compute, CDN |
| Observability | Vercel Analytics + Speed Insights, Sentry (errors), OpenTelemetry via `@vercel/otel` | — | See [observability.md](../operations/observability.md) |

**Pins to revisit:**
- **TypeScript 7**: switch when typescript-eslint supports it (peer range includes 7).
- **ESLint 10**: switch when `eslint-plugin-react`, `eslint-plugin-import` and `eslint-plugin-jsx-a11y` (bundled in `eslint-config-next`) list ESLint 10 in their peers.

## Not in the stack (don't add without an ADR)

| Don't use | Use instead |
|---|---|
| Pages Router, `getServerSideProps`, `getStaticProps`, `next/router` | App Router, Server Components, `@/i18n/navigation` |
| `middleware.ts` | `src/proxy.ts` (export `proxy`) |
| `unstable_cache`, `export const revalidate`, `fetch(..., { next: { revalidate } })` for new code | `"use cache"` + `cacheLife` + `cacheTag` |
| `revalidateTag(tag)` with one argument | `updateTag(tag)` in Server Actions; `revalidateTag(tag, "max")` elsewhere |
| `<Image priority>` | `<Image preload>` (or `loading="eager"` / `fetchPriority="high"`) |
| `next lint` | `pnpm lint` (ESLint CLI) |
| `tailwind.config.js` theme config | `@theme` in `src/app/globals.css` |
| Radix imports (`@radix-ui/*`, `radix-ui`), `asChild` | Base UI via shadcn components; `render` prop |
| `forwardRef`, `React.FC`, `Context.Provider` | `ref` prop, typed function components, `<Context value>` |
| NextAuth / Auth.js, Clerk, Lucia | Better Auth |
| Prisma, TypeORM, Sequelize, raw `pg` queries in features | Drizzle |
| axios, got, request | `fetch` with `AbortSignal.timeout()` |
| moment, dayjs | `Intl` via next-intl formatters; `date-fns` for date math |
| lodash, underscore, ramda | Native JS (`Object.groupBy`, `structuredClone`, `toSorted`, …) |
| Redux, MobX, Recoil, Jotai | Server state + URL state; Context; Zustand only with an ADR |
| styled-components, Emotion, CSS-in-JS, Sass | Tailwind + CSS variables |
| Jest, Enzyme, Cypress | Vitest, Testing Library, Playwright |
| `uuid` v4 for primary keys | UUIDv7 (`uuidv7()` in Postgres 18+, or the `uuid` package's `v7`) |
| TypeScript `enum`, `namespace` | `as const` objects/arrays + unions; ES modules |

## Official docs (for the installed major versions)

| Library | Docs |
|---|---|
| Next.js | `node_modules/next/dist/docs/` (bundled, version-matched), https://nextjs.org/docs |
| React | https://react.dev/reference |
| Tailwind CSS | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com/docs |
| Base UI | https://base-ui.com/react/overview |
| next-intl | https://next-intl.dev/docs |
| Drizzle | https://orm.drizzle.team/docs |
| Better Auth | https://better-auth.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev |
| Playwright | https://playwright.dev/docs |
| nuqs | https://nuqs.dev |
