# API Route Handlers

> **Read when:** exposing HTTP endpoints for external clients, mobile apps, webhooks, cron jobs, or files that aren't pages.
> **Not for:** our own UI's reads (use Server Components) or mutations (use [Server Actions](server-actions.md)).

## When to use a Route Handler

| Need | Use |
|---|---|
| Third-party or mobile client calls our API | `src/app/api/v1/<resource>/route.ts` |
| Incoming webhook (Stripe, GitHub, email provider) | `src/app/api/webhooks/<provider>/route.ts` |
| Scheduled job (Vercel Cron) | `src/app/api/cron/<job>/route.ts` |
| Health check | `src/app/api/health/route.ts` |
| Generated non-HTML files (feeds, `llms.txt`) | `src/app/<file>/route.ts` |

## Rules

- **API-1 (MUST)** Wrap every handler in `withApiHandler()` from `@/server/api`. It catches errors, maps `AppError` codes to HTTP statuses, logs unexpected failures, and adds a request ID.
- **API-2 (MUST)** Authenticate explicitly:
  - user session (`getCurrentUser()`) for first-party clients;
  - API key (hashed in the DB, scoped, revocable) for integrations;
  - a signature for webhooks;
  - the `CRON_SECRET` bearer token for cron.

  Unauthenticated access is an explicit, reviewed decision.
- **API-3 (MUST)** Validate path params, query strings and bodies with Zod. Reject unknown fields on writes (`z.strictObject`).
- **API-4 (MUST)** Call the feature's `server/queries.ts` and `server/mutations.ts`. Never put business logic or DB access in the route file.
- **API-5 (MUST)** Follow REST conventions:
  - plural nouns: `GET /api/v1/projects`, `POST /api/v1/projects`, `GET/PATCH/DELETE /api/v1/projects/{projectId}`;
  - correct status codes: 200, 201 + `Location`, 204, 400, 401, 403, 404, 409, 422, 429, 500;
  - camelCase JSON.
- **API-6 (MUST)** Version public APIs in the path (`/api/v1`). Breaking changes go to `/v2`; old versions get a `Deprecation` header and a sunset date.
- **API-7 (MUST)** Return errors as RFC 9457 Problem Details (`application/problem+json`): `{ type, title, status, detail?, instance?, code, errors? }`. Never include stack traces or internal messages.
- **API-8 (MUST)** Paginate every list. Use cursor pagination, `{ data: [...], nextCursor: string | null }`, with `limit` capped (default 20, max 100).
- **API-9 (MUST)** Rate-limit public endpoints, per API key or per IP; return `429` with `Retry-After`.
- **API-10 (MUST)** Webhooks:
  - verify the signature against the **raw** body (`await request.text()`) before parsing;
  - reject old timestamps;
  - process idempotently, storing the provider's event ID with a unique constraint;
  - return `2xx` quickly and move slow work to `after()` or a queue.
- **API-11 (MUST)** CORS is closed by default. Allow specific origins only for documented API consumers. Never use `*` with credentials.
- **API-12 (MUST)** Cookie-authenticated endpoints that change state (`POST/PATCH/DELETE`) verify the `Origin` header against our domain, to prevent CSRF. Server Actions do this automatically; Route Handlers don't.
- **API-13 (SHOULD)** Document public endpoints in an OpenAPI 3.1 spec. Zod 4's `z.toJSONSchema()` can generate the schemas.

## The helper (created at bootstrap)

```ts
// src/server/api.ts
import "server-only";
import { NextResponse } from "next/server";

import { type ErrorCode, isAppError } from "@/lib/errors";
import { logger } from "@/server/logger";

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  validationFailed: 422, unauthenticated: 401, forbidden: 403, notFound: 404,
  conflict: 409, rateLimited: 429, internalError: 500,
};

export function problem(code: ErrorCode, init?: { detail?: string; errors?: unknown; headers?: HeadersInit }) {
  const status = STATUS_BY_CODE[code];
  return NextResponse.json(
    { type: `https://errors.example.com/${code}`, title: code, status, code, detail: init?.detail, errors: init?.errors },
    { status, headers: { "Content-Type": "application/problem+json", ...init?.headers } },
  );
}

export function withApiHandler<TContext>(
  name: string,
  handler: (request: Request, context: TContext) => Promise<Response>,
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isAppError(error)) return problem(error.code);
      logger.error("api_handler_failed", { route: name, error });
      return problem("internalError");
    }
  };
}
```

> Replace `https://errors.example.com` with a docs URL under `siteConfig.url` when the API is public.

## Example

```ts
// src/app/api/v1/projects/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { createProjectSchema } from "@/features/projects/schemas";
import { createProject } from "@/features/projects/server/mutations";
import { listProjects } from "@/features/projects/server/queries";
import { getCurrentUser } from "@/server/auth/session";
import { problem, withApiHandler } from "@/server/api";

const listQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET = withApiHandler("projects.list", async (request) => {
  // Check auth here first: data-layer requireUser() redirects, which is right for pages but not for APIs.
  if (!(await getCurrentUser())) return problem("unauthenticated");
  const query = listQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) return problem("validationFailed", { errors: z.flattenError(query.error).fieldErrors });
  const page = await listProjects(query.data); // auth-aware
  return NextResponse.json(page);
});

export const POST = withApiHandler("projects.create", async (request) => {
  const user = await getCurrentUser();
  if (!user) return problem("unauthenticated");
  const body = createProjectSchema.strict().safeParse(await request.json());
  if (!body.success) return problem("validationFailed", { errors: z.flattenError(body.error).fieldErrors });
  const project = await createProject({ ownerId: user.id, ...body.data });
  return NextResponse.json(project, { status: 201, headers: { Location: `/api/v1/projects/${project.id}` } });
});
```

## Cron jobs (Vercel)

Declare schedules in `vercel.json` (`"crons": [{ "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }]`). The handler checks `request.headers.get("authorization") === \`Bearer ${env.CRON_SECRET}\``, and must be idempotent.
