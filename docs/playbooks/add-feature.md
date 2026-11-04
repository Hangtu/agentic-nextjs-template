# Playbook: Add a Feature

> **Use when:** the user asks to "create/build/add feature X", i.e. a new capability with its own data, UI or rules.

## Inputs

- What the user wants, who it is for, and why.
- Product context from [brief.md](../product/brief.md) and terms from [glossary.md](../product/glossary.md).
- Missing acceptance criteria? Ask (≤ 5 questions, each with a default), or draft them in the spec for approval.

## Steps

1. **Spec.** Create `docs/specs/<feature>.md` from [feature-spec.md](../templates/feature-spec.md). Fill in:
   - scope (in/out) and acceptance criteria;
   - the data model and authorization rules ("who can do what");
   - routes, UI states, i18n namespace, SEO (if public), analytics events, tests.

   Summarize it to the user and **wait for approval** unless they told you to proceed autonomously.
2. **Glossary.** Add any new domain terms to `docs/product/glossary.md`.
3. **Data.** If the feature needs tables or columns, follow [change-database-schema.md](change-database-schema.md).
4. **Feature folder.** Create `src/features/<feature>/` mirroring [reference-feature.md](../architecture/reference-feature.md):
   1. `constants.ts`, `types.ts` (DTOs), `schemas.ts` (Zod, with i18n error keys).
   2. `server/cache-tags.ts`, then `server/queries.ts` (auth-aware reads returning DTOs).
   3. `server/mutations.ts` (authorization in `WHERE`, `AppError` for expected failures).
   4. `server/actions.ts` (`createAction`, `access` set explicitly, `updateTag`).
5. **UI.**
   1. Build Server Components first; add Client Components only for interactivity.
   2. Reuse `components/ui` and `components/shared`. Need a new primitive? Follow [add-ui-component.md](add-ui-component.md).
   3. Implement all states: loading skeleton, empty, error, success.
6. **Routes.** Add pages with [add-page.md](add-page.md): thin route files that compose feature components, with metadata, `<Suspense>` around dynamic parts, and an error boundary.
7. **i18n.** Add the feature namespace to **every** `messages/<locale>.json`. Use ICU for plurals and variables.
8. **Navigation.** Add entries to `src/config/navigation.ts` if the feature appears in menus. Add public routes to `src/config/routes.ts` (sitemap/llms.txt).
9. **Tests.**
   - unit: schemas, permission and pure functions;
   - integration: queries and mutations with PGlite, including an "other user can't access" case;
   - component: interactive client logic;
   - E2E: the main journey, with an axe scan.
10. **Analytics.** Emit the events defined in the spec (no personal data).
11. **Docs.** Set the spec status to `Implemented`; record an ADR if you made a significant decision; update any doc whose convention changed.

## Verify

- `pnpm verify` and `pnpm test:e2e` pass.
- Manual check, or browser tooling: every locale, mobile width, dark mode, keyboard only, and sign-out redirect.
- Self-review with [code-review.md](code-review.md).

## Done when

The [Definition of Done](../workflow/definition-of-done.md) is satisfied and the report lists the spec, the changes, and the verification evidence.
