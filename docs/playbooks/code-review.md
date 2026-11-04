# Playbook: Code Review

> **Use when:** reviewing a PR, or self-reviewing your own diff before reporting "done". Any agent can run this as a reviewer: read the diff, don't edit, report findings.

## Procedure

1. **Context:** read the PR description, linked spec or issue, and acceptance criteria.
2. **Diff:** `git diff main...HEAD` (or the PR diff). For each changed file, open enough surrounding code to understand it.
3. **Check** each category below. Cite the rule ID from the docs for every finding.
4. **Run** `pnpm verify` (and E2E if UI or flows changed) if CI hasn't.
5. **Report** in the format at the end. Approve only with zero blockers and zero majors.

## Checklist by category

| Category | Look for | Rules |
|---|---|---|
| **Correctness** | Meets acceptance criteria; edge cases (empty, null, long, concurrent, double submit); error paths handled | ERR-*, ACT-8 |
| **Security** | Auth + authorization in the data layer; Zod validation; no IDOR; no secrets/PII leaks; rate limits; safe redirects; SSRF | SEC-*, AUTH-*, DATA-2 |
| **Data** | Migration reviewed and backward compatible; indexes; no N+1; transactions; limits | DB-* |
| **Caching** | Shared caches never hold per-user data; tags defined and invalidated; `<Suspense>` placement | DATA-4…9 |
| **Architecture** | Files in the right place; no cross-feature imports; thin routes; server-only respected; no new pattern without an ADR | ARCH-*, STYLE-5 |
| **React** | Server-first; small client leaves; no effects for derived state; keys; all UI states | RC-*, STATE-* |
| **Types** | No `any`/`!`/unsafe `as`; discriminated unions; types derived from schemas/DB | TS-* |
| **Accessibility** | Semantics, names, keyboard, focus, contrast, target size, forms | A11Y-*, FORM-* |
| **i18n** | No hardcoded text; keys in all locales; ICU; formatter for dates/numbers; logical CSS | I18N-*, CSS-6 |
| **SEO** (public pages) | Metadata, canonical, hreflang, sitemap, JSON-LD, noindex for private pages | SEO-*, GEO-* |
| **Performance** | Client JS added?; images/fonts; waterfalls; heavy deps lazy-loaded | PERF-* |
| **Tests** | Tests exist for new logic, a regression test for fixes, behavior-focused, deterministic | TEST-* |
| **Naming & style** | Names follow conventions; comments explain why; no dead code | NAME-*, STYLE-* |
| **Docs** | Spec, ADR, `.env.example` and changed conventions updated | AGENT-1…3 |

## Severity

- **blocker:** security hole, data loss/corruption risk, broken build or tests, violates a MUST in security, auth or data rules.
- **major:** violates any other MUST, missing tests for new logic, accessibility failure, missing i18n.
- **minor:** SHOULD-level issue, maintainability concern.
- **nit:** taste; optional.

## Report format

```markdown
**Verdict:** approve | request changes
**Summary:** <1–3 lines>

| # | Severity | File:line | Rule | Finding | Suggested fix |
|---|---|---|---|---|---|
| 1 | blocker | src/features/projects/server/mutations.ts:42 | AUTH-21 | Update doesn't scope by ownerId, so any user can archive any project | Add `eq(projects.ownerId, actorId)` to WHERE and check the row count |

**Verified:** <commands run + results>
```
