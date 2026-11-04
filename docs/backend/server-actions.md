# Server Actions (UI mutations)

> **Read when:** adding or changing anything that writes data in response to a user action in our UI.
> **Related:** [forms.md](../standards/forms.md), [error-handling.md](../standards/error-handling.md), [auth.md](auth.md), [data-fetching-and-caching.md](data-fetching-and-caching.md).

Server Actions are **public HTTP endpoints**. Anyone can call them with any payload, whatever the UI allows. Treat every action like an API route.

## Layering

```text
Client Component ──► server/actions.ts      (transport: createAction → auth, validate, map errors, invalidate cache)
                         │
                         ▼
                     server/mutations.ts    (business rules + authorization + DB writes; reusable by API routes/jobs)
```

## Rules

- **ACT-1 (MUST)** Every action is built with `createAction()` and exported from `features/<feature>/server/actions.ts`. The file starts with `"use server";` and exports only actions.
- **ACT-2 (MUST)** Every action declares `access: "public" | "authenticated"` explicitly. The default is not "public"; you have to choose.
- **ACT-3 (MUST)** Validate input with the feature's Zod schema. `createAction` does this. Never read fields from raw `FormData` or trust client-sent IDs or roles.
- **ACT-4 (MUST)** Authorize in the mutation, by re-loading the target resource and checking ownership, role or membership. "The button was hidden" is not authorization.
- **ACT-5 (MUST)** Keep actions thin: call one or a few mutation functions, invalidate cache tags (`updateTag`), and return a minimal DTO (an ID, or a small object). Business logic lives in `mutations.ts`.
- **ACT-6 (MUST)** Return `ActionResult<T>`. Expected failures throw `AppError`, which `createAction` maps to codes. Never return raw error messages.
- **ACT-7 (MUST NOT)** Use actions to **read** data for rendering. Reads belong in Server Components (actions run sequentially and are not cached).
- **ACT-8 (MUST)** Make writes safe to repeat (double submit, retry): unique constraints + `onConflictDoNothing`/`DoUpdate`, or idempotency keys for payments and emails.
- **ACT-9 (MUST)** Rate-limit actions that are expensive or abuse-prone: sign-up-like flows, invitations, email sending, AI calls, exports. See [security.md](../quality/security.md).
- **ACT-10 (MUST)** To navigate after success, either return data and navigate on the client (`router.push`), or call `redirect()` **after** the mutation. Calling `redirect()` inside the handler is fine, because `createAction` rethrows navigation errors.
- **ACT-11 (MUST NOT)** Close over secrets or sensitive values inside inline actions in components. Define actions only in `actions.ts` files.

## The helpers (created at bootstrap; read them in the codebase)

```ts
// src/lib/errors.ts (isomorphic)
export const ERROR_CODES = [
  "validationFailed", "unauthenticated", "forbidden", "notFound", "conflict", "rateLimited", "internalError",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly messageKey: string | undefined; // optional specific i18n key in the "Errors" namespace

  constructor(code: ErrorCode, options?: { messageKey?: string; cause?: unknown }) {
    super(code, { cause: options?.cause });
    this.name = "AppError";
    this.code = code;
    this.messageKey = options?.messageKey;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
```

```ts
// src/lib/action-result.ts (isomorphic)
import type { ErrorCode } from "./errors";

export type FieldErrors = Partial<Record<string, string[]>>;
export type ActionFailure = { ok: false; code: ErrorCode; messageKey?: string; fieldErrors?: FieldErrors };
export type ActionResult<TData = undefined> = { ok: true; data: TData } | ActionFailure;
```

```ts
// src/server/action.ts
import "server-only";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";

import type { ActionResult } from "@/lib/action-result";
import { isAppError } from "@/lib/errors";
import { getCurrentUser, type SessionUser } from "@/server/auth/session";
import { logger } from "@/server/logger";

type Access = "public" | "authenticated";
type ActionContext<TAccess extends Access> = {
  user: TAccess extends "authenticated" ? SessionUser : SessionUser | null;
};

type ActionDefinition<TSchema extends z.ZodType, TData, TAccess extends Access> = {
  /** Stable name for logs and traces, e.g. "projects.create". */
  name: string;
  input: TSchema;
  access: TAccess;
  handler: (input: z.output<TSchema>, context: ActionContext<TAccess>) => Promise<TData>;
};

export function createAction<TSchema extends z.ZodType, TData, TAccess extends Access>(
  definition: ActionDefinition<TSchema, TData, TAccess>,
) {
  return async (raw: z.input<TSchema> | FormData): Promise<ActionResult<TData>> => {
    try {
      const user = await getCurrentUser();
      if (definition.access === "authenticated" && !user) {
        return { ok: false, code: "unauthenticated" };
      }

      const parsed = definition.input.safeParse(raw instanceof FormData ? formDataToObject(raw) : raw);
      if (!parsed.success) {
        return { ok: false, code: "validationFailed", fieldErrors: z.flattenError(parsed.error).fieldErrors };
      }

      // Safe: the access check above guarantees `user` matches ActionContext<TAccess>.
      const context = { user } as ActionContext<TAccess>;
      return { ok: true, data: await definition.handler(parsed.data, context) };
    } catch (error) {
      unstable_rethrow(error); // let redirect()/notFound() through
      if (isAppError(error)) {
        return { ok: false, code: error.code, ...(error.messageKey ? { messageKey: error.messageKey } : {}) };
      }
      logger.error("server_action_failed", { action: definition.name, error });
      return { ok: false, code: "internalError" };
    }
  };
}

function formDataToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue; // React internals
    const values = formData.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
}
```

## Example

```ts
// src/features/projects/server/actions.ts
"use server";

import { updateTag } from "next/cache";

import { createAction } from "@/server/action";

import { archiveProjectSchema, createProjectSchema } from "../schemas";
import { projectTags } from "./cache-tags";
import { archiveProject, createProject } from "./mutations";

export const createProjectAction = createAction({
  name: "projects.create",
  input: createProjectSchema,
  access: "authenticated",
  handler: async (input, { user }) => {
    const project = await createProject({ ownerId: user.id, ...input });
    updateTag(projectTags.byOwner(user.id));
    return { id: project.id };
  },
});

export const archiveProjectAction = createAction({
  name: "projects.archive",
  input: archiveProjectSchema, // z.object({ projectId: z.uuid() })
  access: "authenticated",
  handler: async ({ projectId }, { user }) => {
    await archiveProject({ projectId, actorId: user.id }); // throws AppError("notFound" | "forbidden")
    updateTag(projectTags.byId(projectId));
    updateTag(projectTags.byOwner(user.id));
  },
});
```

```ts
// src/features/projects/server/mutations.ts
import "server-only";
import { and, eq } from "drizzle-orm";

import { AppError } from "@/lib/errors";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";

export async function archiveProject({ projectId, actorId }: { projectId: string; actorId: string }) {
  const [updated] = await db
    .update(projects)
    .set({ status: "archived" })
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, actorId))) // authorization in the WHERE
    .returning({ id: projects.id });
  if (!updated) throw new AppError("notFound");
}
```

## Config guardrails (`next.config.ts`)

- Server Actions only accept requests from the same origin by default. Add `experimental.serverActions.allowedOrigins` only for known proxy domains, with an ADR.
- Keep the default body size limit (1 MB). Large uploads go directly to storage with presigned URLs, not through actions.
