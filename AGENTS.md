# AGENTS.md

Tool-agnostic instructions for agents and humans. Read the project contract first, then only the task-relevant docs.

## 1. Identify the work before acting

- **This repository:** a documentation and validation kit, not a Next.js application.
- **Active contract:** [docs/project-context.md](docs/project-context.md).
- **Requested operation:** [Doctor](docs/playbooks/adopt-project.md#doctor) reports only; [Adopt](docs/playbooks/adopt-project.md#adopt) applies an explicit approved plan; [Verify](docs/playbooks/adopt-project.md#verify) runs approved checks without repairs. Default to Doctor if unclear; no automatic transitions.
- **Missing/unapproved target contract:** Doctor and approved Verify are still available without installing the kit. Incorporation requires an approved plan; an approved contract alone is not permission for new writes.
- **Bootstrap:** only for an explicitly approved new application, never because a manifest is missing.
- **Existing app:** preserve compatible conventions and merge its instructions; do not replace its stack to match this kit.
- If the reference library was relocated, use the contract's paths, not the illustrative `docs/` or `src/` paths below.

## 2. Verification commands

| Context | Command |
|---|---|
| Maintain this kit | `node scripts/verify-kit.mjs` |
| Approved new application | `pnpm verify`, build, affected E2E, and manual UI review |
| Existing application | Exact commands and baseline recorded in its approved contract |

Do not invent scripts or install tools globally to satisfy a command. Report blocked checks and pre-existing failures; never claim an unexecuted check passed. Reading a reference snippet is not running it.

## 3. Quality and safety requirements

1. **Diagnose before adopting.** Inspect facts yourself, separate confirmed findings/hypotheses/preferences, and cite evidence, impact, priority, confidence, and the next action. Preservation/no-change is valid. Obtain explicit approval before incorporation.
2. **Small, coherent changes.** Reuse the closest safe, compatible example. Create only files with real responsibilities; no speculative layers. ADRs are for consequential trade-offs.
3. **Server-first.** In App Router, keep interactive client boundaries small. Keep server-only code and secrets off the client.
4. **Explicit access policy.** Public operations remain public deliberately; private operations authenticate and authorize in the data layer. UI, layouts, and proxy redirects are not security boundaries.
5. **Validate external input.** Use the approved validator (Zod for new apps) at actions, HTTP, params, webhooks, and env boundaries.
6. **Safe caching.** Cache only for a stated reason, with scope and invalidation; never place private or permission-dependent data in a shared cache.
7. **Accessible UI.** Target WCAG 2.2 AA: semantics, names, keyboard, focus, contrast, and appropriate states. Automated scans supplement manual review.
8. **Public discoverability.** Indexable pages have appropriate metadata, canonical URLs, sitemap coverage, and truthful structured data where relevant. Private areas are `noindex`; no invented schemas or reviews.
9. **Consistent design and content.** Use the project's tokens and primitives. When i18n is active, all locales and locale-aware navigation are required; otherwise normal Next navigation and monolingual copy are valid.
10. **Strict types and tests.** No new `any`, `@ts-ignore`, or non-null assertions. Test public behavior; reproduce bugs before fixing them. Record existing debt instead of weakening checks.
11. **Evidence, not confidence.** Check installed versions and their documentation for uncertain APIs. Measure performance before optimizing.
12. **Preserve intent.** Review both standards and acceptance criteria. Keep decisions/specs current and leave a durable next step for another agent.

Applicability and preservation rules: [architecture/applicability.md](docs/architecture/applicability.md). An optional capability is not permission to omit security on code that exists.

## 4. Read before the task

| Task | Read |
|---|---|
| Doctor / Adopt / Verify / missing context | `docs/playbooks/adopt-project.md`, `docs/architecture/applicability.md` |
| Update copied standards | `docs/playbooks/update-kit.md`; manual three-way review, no automatic sync |
| Create an approved new app | `docs/playbooks/bootstrap-project.md` |
| Feature | `docs/playbooks/add-feature.md`; choose an appropriately scoped reference |
| Page / public SEO | `docs/playbooks/add-page.md`, `docs/discoverability/seo.md` |
| Components / styling | `docs/standards/react-components.md`, `docs/standards/styling.md`, `docs/playbooks/add-ui-component.md` |
| Forms / UI writes | `docs/standards/forms.md`, `docs/backend/server-actions.md` |
| Reads / caching | `docs/backend/data-fetching-and-caching.md` |
| Database | `docs/backend/database.md`, `docs/playbooks/change-database-schema.md` |
| Identity / permissions | `docs/backend/auth.md`, `docs/quality/security.md` |
| External HTTP / webhooks / jobs | `docs/backend/api-routes.md`, `docs/playbooks/add-api-endpoint.md` |
| Multiple languages | `docs/discoverability/i18n.md`, `docs/playbooks/add-translations-or-locale.md` |
| Errors / monitoring | `docs/standards/error-handling.md`, `docs/operations/observability.md` |
| Env / dependencies | `docs/operations/environment-and-config.md`, `docs/operations/dependencies.md` |
| Testing / kit checks | `docs/quality/testing.md`, `docs/quality/kit-validation.md` |
| Performance / accessibility | `docs/quality/performance.md`, `docs/quality/accessibility.md` |
| Analytics / personal data | `docs/discoverability/analytics-and-privacy.md` |
| Bug / refactor | `docs/playbooks/fix-bug.md` / `docs/playbooks/refactor.md` |
| Review / finish | `docs/playbooks/code-review.md`, `docs/workflow/definition-of-done.md` |
| Naming / Git | `docs/standards/naming.md`, `docs/workflow/git-and-prs.md` |
| CI / deploy | `docs/operations/deployment.md`, `docs/operations/application-ci.md` |

Full index: [docs/README.md](docs/README.md). Day-to-day procedure: [agent-workflow.md](docs/workflow/agent-workflow.md).

## 5. Boundaries

**Always:** keep scope small, protect existing work, test changed behavior, run the contract's checks, update the owning doc, and report evidence and limitations.

**Ask first:** dependency changes; auth/permission/security policy; DB rewrites or destructive schema changes; CI/build/lint/TS configuration; large migrations or deletion; paid/external operations; commits, pushes, or PRs. Approval of a specific implementation plan covers its listed changes, not unrelated operations.

**Never:** overwrite an existing instruction file or configuration during adoption; expose secrets/PII; bypass checks; hand-edit lockfiles or applied migrations; force-push; perform destructive non-local DB operations; leave fake success or mock production data.

## Framework-owned rules

Bootstrap copies a generator-owned Next.js block into this slot only if the installed generator emits one. Preserve the block verbatim, exactly once; report absence or changed delimiters instead of inventing content.

<!-- agent-kit:nextjs-rules:start -->
<!-- Next.js maintains the block below (bootstrap copies it from create-next-app; `next dev` keeps it updated). Do not edit it by hand. -->
<!-- agent-kit:nextjs-rules:end -->
