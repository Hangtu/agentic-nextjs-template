# Playbook: Bootstrap a New Project

> **Use when:** the repo contains this kit (AGENTS.md + docs/) but no `package.json` yet, and the user asks you to "create the app" or "set up the project".
> **Outcome:** a running Next.js app that follows every doc in this kit, with all guardrails active and `pnpm verify` green.
> **Principle:** prefer **official generators** (create-next-app, shadcn, Better Auth CLI, drizzle-kit) over hand-written config, so the config always matches the installed versions. Snippets below show *our additions*. If a generator's output differs from a snippet, the generator wins: adapt the snippet and note the difference in your report.

## 0. Ask the user (one batch, with defaults)

| Question | Default |
|---|---|
| Project name (package name, kebab-case) and product one-liner | from the user's request |
| Locales and default locale | `en` (default), `es` |
| Production domain | `example.com` placeholder |
| Sign-in methods | Email + password, plus GitHub OAuth if credentials exist |
| Teams/organizations from day one? | No (user-owned resources) |
| Local database | Docker Postgres (`postgres:17`) or a Neon dev branch URL |

Write the answers into `docs/product/brief.md` (sections marked `FILL`).

## 1. Prerequisites

- Node.js **current Active LTS**: `node -v`. Use the LTS major everywhere below (`engines.node`, `.node-version`).
- pnpm: `npm install -g pnpm@latest` (Corepack is no longer bundled with recent Node versions).
- Git repo initialized; working tree clean.

## 2. Scaffold Next.js into a temporary folder, then merge

The kit files already exist in the root, so generate into `.bootstrap/` and move the files over:

```bash
pnpm create next-app@latest .bootstrap --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --react-compiler --cache-components --agents-md --disable-git --yes
```

Move everything from `.bootstrap/` to the root **except**:
- `README.md`: keep the kit's README until step 16.
- `AGENTS.md`: copy only the generated `<!-- BEGIN:nextjs-agent-rules --> … <!-- END:nextjs-agent-rules -->` block into the placeholder section at the bottom of our `AGENTS.md`.

Then delete `.bootstrap/` and run `pnpm install`.

Check the generated `next.config.ts` has `cacheComponents: true` and `reactCompiler: true`. Read `node_modules/next/dist/docs/` (the bundled docs) for anything that differs from these docs.

## 3. Versions, engines, pnpm safety

```bash
pnpm add -D typescript@~6.0 eslint@^9    # pins explained in docs/architecture/tech-stack.md
```

In `package.json`, add `"engines": { "node": ">=<LTS major>" }` and keep `"packageManager"` as pnpm sets it. Create `.node-version` with the LTS major (the kit includes one; update it).

`pnpm-workspace.yaml` must contain the supply-chain settings ([dependencies.md](../operations/dependencies.md), DEP-3):

```yaml
minimumReleaseAge: 4320   # minutes (3 days): don't install versions younger than this
```

Dependency build scripts are blocked by default. Review them with `pnpm ignored-builds`, and allow only the ones needed (typically `sharp`, `esbuild`, `@tailwindcss/oxide`, `lefthook`) using `pnpm approve-builds` or the allow-list setting of the installed pnpm major.

**Drift check:** compare installed majors (`pnpm list --depth 0`) with the "Verified with" column in [tech-stack.md](../architecture/tech-stack.md). For any newer major, read its migration guide before using snippets from these docs.

## 4. Install the stack

```bash
pnpm add next-intl zod drizzle-orm pg @vercel/functions better-auth @t3-oss/env-nextjs \
  react-hook-form @hookform/resolvers nuqs next-themes sonner uuid server-only \
  @vercel/analytics @vercel/speed-insights schema-dts
pnpm add -D drizzle-kit @types/pg tsx vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom @electric-sql/pglite msw \
  @playwright/test @axe-core/playwright prettier prettier-plugin-tailwindcss eslint-config-prettier \
  eslint-plugin-check-file lefthook @commitlint/cli @commitlint/config-conventional knip
pnpm exec playwright install --with-deps chromium
```

## 5. shadcn/ui on Base UI

```bash
pnpm dlx shadcn@latest init --base base --preset base-nova
pnpm dlx shadcn@latest add button input textarea label field card badge dialog dropdown-menu sheet skeleton separator sonner tooltip
```

Add the semantic tokens from [styling.md](../standards/styling.md) (success token pair, z-index utilities, `scroll-padding-top`) to `src/app/globals.css`.

## 6. Configure Next.js

```ts
// next.config.ts (merge with the generated file)
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: { remotePatterns: [] }, // add exact hosts only (SEC-24)
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);
```

The CSP (SEC-21) is added later in report-only mode, once third-party scripts are known. Create an issue for it now.

## 7. TypeScript strictness

Add the flags from [typescript.md](../standards/typescript.md) to `tsconfig.json` (keep everything the generator wrote; remove `baseUrl` if present). Add `"types": ["vitest/globals"]` only if you enable Vitest globals (we don't: import from `vitest`).

## 8. Folder structure and i18n

1. Create the tree from [project-structure.md](../architecture/project-structure.md): `src/features/`, `src/components/{layout,shared}`, `src/server/{db/schema,auth}`, `src/lib/seo`, `src/hooks`, `src/i18n`, `src/config`, `src/types`, `messages/`, `e2e/`, `scripts/`.
2. Create `src/i18n/routing.ts`, `navigation.ts`, `request.ts` and the `[locale]/layout.tsx` from [i18n.md](../discoverability/i18n.md).
3. Move the generated `src/app/layout.tsx` and `page.tsx` into `src/app/[locale]/`. `[locale]/layout.tsx` is the root layout. Delete `src/app/layout.tsx`; there must be no pass-through root layout.
4. Create the route groups `(marketing)`, `(auth)`, `(app)`, each with a `layout.tsx`. `(auth)` and `(app)` set `robots: { index: false }`. Add `(app)/error.tsx`, `(marketing)/error.tsx`, `[locale]/not-found.tsx` and `src/app/global-error.tsx` ([error-handling.md](../standards/error-handling.md)).
5. Create `messages/en.json` and `messages/<other>.json` with the namespaces `Common`, `Navigation`, `Metadata`, `Validation`, `Errors` (one key per `ErrorCode`, plus `boundary.*`).
6. Create `src/types/next-intl.d.ts`:

```ts
import type messages from "../../messages/en.json";
import type { routing } from "@/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
```

7. Create `scripts/check-messages.ts`. It loads every `messages/*.json`, flattens the keys, and exits with code 1 listing the keys missing from, or extra in, each locale compared to the default locale.

## 9. Proxy

```ts
// src/proxy.ts
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { APP_ROUTE_PREFIXES } from "@/config/routes";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

function stripLocale(pathname: string): string {
  const [, maybeLocale, ...rest] = pathname.split("/");
  return routing.locales.includes(maybeLocale as never) ? `/${rest.join("/")}` : pathname;
}

export function proxy(request: NextRequest) {
  // Optimistic redirect only (ARCH-6, AUTH-2). Real checks happen in the data layer.
  const path = stripLocale(request.nextUrl.pathname);
  const isAppRoute = APP_ROUTE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (isAppRoute && !getSessionCookie(request)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## 10. Database and auth

1. `drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
```

2. Create `src/server/db/index.ts` ([database.md](../backend/database.md)) and `src/env.ts` ([environment-and-config.md](../operations/environment-and-config.md)).
3. Create `src/server/auth/auth.ts`:
   - `betterAuth({ database: drizzleAdapter(db, { provider: "pg", usePlural: true }), emailAndPassword: { enabled: true }, plugins: [nextCookies()] })`
   - rate limiting with `storage: "database"`
   - social providers only when their env vars exist
   - `src/app/api/auth/[...all]/route.ts` with `toNextJsHandler(auth)`
   - `src/lib/auth-client.ts` with `createAuthClient()`

   Follow the Better Auth Next.js docs **for the installed version**.
4. Generate the auth schema with Better Auth's CLI (see its docs for the current command) into `src/server/db/schema/auth.ts`, and export it from `schema/index.ts`.
5. Create `src/server/auth/session.ts` ([auth.md](../backend/auth.md)).
6. `pnpm db:generate && pnpm db:migrate` against the local database.

## 11. Core helpers

Create these exactly as specified in the docs (read each doc's snippet):

| File | Spec |
|---|---|
| `src/lib/errors.ts`, `src/lib/action-result.ts`, `src/server/action.ts` | [server-actions.md](../backend/server-actions.md) |
| `src/server/api.ts` | [api-routes.md](../backend/api-routes.md) |
| `src/server/logger.ts`, `src/lib/monitoring.ts` | [observability.md](../operations/observability.md) |
| `src/lib/forms.ts` (`applyActionErrors`), `src/components/shared/translated-field-error.tsx`, `translated-form-error.tsx` | [forms.md](../standards/forms.md) |
| `src/config/site.ts`, `routes.ts` (`publicRoutes`, `APP_ROUTE_PREFIXES`), `navigation.ts` | [environment-and-config.md](../operations/environment-and-config.md), [seo.md](../discoverability/seo.md) |
| `src/lib/seo/metadata.ts`, `src/lib/seo/json-ld.ts`, `src/components/shared/json-ld.tsx` | [seo.md](../discoverability/seo.md) |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`, `llms.txt/route.ts`, `(marketing)/opengraph-image.tsx` | [seo.md](../discoverability/seo.md), [ai-discoverability.md](../discoverability/ai-discoverability.md) |
| `src/app/api/health/route.ts` | [observability.md](../operations/observability.md) |
| `src/components/layout/` (site header with skip link + locale switcher + theme toggle, footer with legal links) | [accessibility.md](../quality/accessibility.md), [i18n.md](../discoverability/i18n.md) |

Root layout providers: `ThemeProvider` (next-themes, `attribute="class"`), `NuqsAdapter` (`nuqs/adapters/next/app`), `<Toaster />`, `<Analytics />`, `<SpeedInsights />`.

## 12. Lint, format, hooks

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import checkFile from "eslint-plugin-check-file";

const navigationPaths = [
  { name: "next/link", message: "Use Link from @/i18n/navigation (I18N-7)." },
  {
    name: "next/navigation",
    importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
    message: "Use @/i18n/navigation (I18N-7).",
  },
];
const ban = (groups, message) => ({ group: groups, message });
const always = [
  ban(["@radix-ui/*", "radix-ui"], "Use our shadcn/ui (Base UI) components (CSS-22)."),
  ban(["../../*"], "Use the @/ alias for cross-folder imports (STYLE-2)."),
];
const noDb = ban(["@/server/db", "@/server/db/**"], "Only server/ folders may access the database (ARCH-4).");
const noServer = ban(["@/server/**"], "Server-only code can't be imported here (ARCH-3).");
const noFeatures = ban(["@/features/**"], "Features can't be imported here; compose in src/app (ARCH-2).");
const noApp = ban(["@/app/**"], "Nothing imports from src/app (ARCH-1).");
const noComponents = ban(["@/components/**"], "Not allowed by the dependency rules (project-structure.md).");
const noHooks = ban(["@/hooks/**"], "Not allowed by the dependency rules (project-structure.md).");
const restrict = (...groups) => ["error", { paths: navigationPaths, patterns: [...always, ...groups] }];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow" },
        { selector: "function", format: ["camelCase", "PascalCase"] },
      ],
      "no-console": "error",
      "react/no-danger": "error",
      "import/no-default-export": "error",
      "no-restricted-imports": restrict(noDb),
    },
  },
  // Default exports are required by Next.js special files and config files.
  {
    files: ["src/app/**", "src/proxy.ts", "src/instrumentation*.ts", "src/i18n/request.ts", "*.config.{ts,mjs,mts}"],
    rules: { "import/no-default-export": "off" },
  },
  // Dependency rules (docs/architecture/project-structure.md). Later blocks override earlier ones.
  { files: ["src/features/**"], rules: { "no-restricted-imports": restrict(noDb, noFeatures, noApp) } },
  { files: ["src/features/*/server/**"], rules: { "no-restricted-imports": restrict(noFeatures, noApp) } },
  { files: ["src/components/**"], rules: { "no-restricted-imports": restrict(noServer, noFeatures, noApp) } },
  { files: ["src/hooks/**"], rules: { "no-restricted-imports": restrict(noServer, noFeatures, noApp, noComponents) } },
  { files: ["src/lib/**"], rules: { "no-restricted-imports": restrict(noServer, noFeatures, noApp, noComponents, noHooks) } },
  { files: ["src/server/**"], rules: { "no-restricted-imports": restrict(noFeatures, noApp, noComponents, noHooks) } },
  // File and folder naming (NAME-10).
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": ["error", { "**/*.{ts,tsx}": "KEBAB_CASE" }, { ignoreMiddleExtensions: true }],
      "check-file/folder-naming-convention": ["error", { "src/!(app)/**/": "KEBAB_CASE", "src/app/**/": "NEXT_JS_APP_ROUTER_CASE" }],
    },
  },
  // The JSON-LD component is the only allowed dangerouslySetInnerHTML (RC-44).
  { files: ["src/components/shared/json-ld.tsx"], rules: { "react/no-danger": "off" } },
  { files: ["scripts/**", "e2e/**", "**/*.test.{ts,tsx}"], rules: { "no-console": "off" } },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**", "src/components/ui/**", "playwright-report/**"]),
]);
```

> `src/components/ui/**` is generated by shadcn and ignored by lint; review changes there manually. If `check-file` rejects a Next.js folder such as `llms.txt`, add a narrow ignore for that folder only.

```js
// prettier.config.mjs
/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
  tailwindFunctions: ["cn", "cva"],
};
```

Add `.prettierignore` (`pnpm-lock.yaml`, `drizzle/`, `.next/`, `public/`). The kit's `lefthook.yml` is already in the root. Add `commitlint.config.mjs` (`export default { extends: ["@commitlint/config-conventional"] };`) and run `pnpm exec lefthook install`.

`knip.json`: `{ "$schema": "https://unpkg.com/knip@latest/schema.json", "ignore": ["src/components/ui/**"], "ignoreDependencies": ["tailwindcss"] }`. Adjust it until knip reports only real issues.

## 13. Tests

```ts
// vitest.config.mts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true }, // native in Vite 8+; on older Vite use the vite-tsconfig-paths plugin
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"], // @testing-library/jest-dom/vitest + server-only mock
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    env: { SKIP_ENV_VALIDATION: "true" },
  },
});
```

- `src/test/setup.ts`: `import "@testing-library/jest-dom/vitest";` and `vi.mock("server-only", () => ({}));` (top level: Vitest 5 requires `vi.mock` at module top level). Vitest 5 clears mocks between tests by default.
- MSW 3 (when a test needs HTTP mocks): import `http`/`HttpResponse` from `msw/http` and `setupServer` from `msw/node`, and start the server with `server.listen({ onUnhandledFrame: "error" })` (renamed from `onUnhandledRequest` in v3).
- `src/test/db.ts`: creates a PGlite instance, applies `drizzle/` migrations (`migrate` from `drizzle-orm/pglite/migrator`), and exports `testDb`, `resetDatabase()` and `createTestUser()`. Data-layer tests mock `@/server/db` to `testDb` and `@/server/auth/session` to return the test user.
- `playwright.config.ts`:
  - `testDir: "e2e"`;
  - `webServer: { command: "pnpm build && pnpm start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI }`;
  - a `setup` project that signs in and saves `storageState`;
  - Chromium by default (add Firefox/WebKit in CI nightly if needed).
- Write `e2e/smoke.spec.ts`: the home page renders in each locale, has an `h1`, and has 0 axe violations.

## 14. Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "analyze": "next build --analyze",
    "typecheck": "next typegen && tsc --noEmit",
    "lint": "eslint --cache --max-warnings=0 .",
    "lint:fix": "eslint --cache --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "i18n:check": "tsx scripts/check-messages.ts",
    "knip": "knip",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "verify": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm i18n:check && pnpm knip && pnpm test"
  }
}
```

## 15. Env and git hygiene

- Create `.env.example` from [environment-and-config.md](../operations/environment-and-config.md), and a local `.env.local`.
- `.gitignore` includes: `.env*` with `!.env.example`, `.next/`, `next-env.d.ts`, `playwright-report/`, `test-results/`, `e2e/.auth/`, `.eslintcache`, `*.tsbuildinfo`.

## 16. Finish

1. Replace `README.md` with a project README: name, one-liner, the commands table from `AGENTS.md`, local setup steps, and links to `AGENTS.md` and `docs/`.
2. Fill in the `AGENTS.md` "Project" section (name, one-liner, locales).
3. Run `pnpm verify`, `pnpm build`, and `pnpm test:e2e`. All must pass.
4. Report using the agent workflow format, including every place where a generator's output differed from this playbook. Propose doc fixes for those places.
5. Commit: `chore: bootstrap project from kit` (only if the user asked you to commit).
