# Definition of Done

> **Read when:** before saying a task is finished, and when reviewing a PR. Skip the items that don't apply, but say which ones you skipped and why.

## Functionality
- [ ] Every acceptance criterion in the spec or issue is met.
- [ ] All states handled: loading, empty, error, success, no permission, long text, many items.
- [ ] Works in every locale, from mobile (320px) to desktop, and in light and dark mode.

## Code quality
- [ ] Follows the standards; mirrors existing patterns; no new pattern without an ADR.
- [ ] No `any`, `@ts-ignore`, `console.log`, commented-out code, or a `TODO` without an issue.
- [ ] No unused code, exports or dependencies (knip is clean).
- [ ] The diff contains only what the task needs.

## Tests
- [ ] Unit tests for new logic; integration tests for new queries, mutations and actions.
- [ ] An E2E test for any new or changed critical journey, including an axe scan.
- [ ] Bug fixes include a regression test that failed before the fix.
- [ ] `pnpm verify` passes locally, and CI is green.

## Security & privacy (see [security.md](../quality/security.md))
- [ ] Every action, route handler and data-layer query checks authentication **and** authorization on the server.
- [ ] All external input is validated with Zod.
- [ ] No secrets or personal data in client code, logs, URLs or error messages.
- [ ] Abuse-prone endpoints are rate-limited.

## Accessibility (see [accessibility.md](../quality/accessibility.md))
- [ ] Keyboard-operable with visible focus; labels and names present; contrast passes; axe shows 0 violations.

## i18n (see [i18n.md](../discoverability/i18n.md))
- [ ] No hardcoded user-facing strings; keys exist in **all** locales (`pnpm i18n:check`).
- [ ] Dates, numbers and currency go through the next-intl formatter.

## SEO & discoverability (public pages only; see [seo.md](../discoverability/seo.md))
- [ ] `generateMetadata` provides title, description, canonical, hreflang alternates and Open Graph.
- [ ] The page is in the sitemap; structured data is valid; private pages are `noindex`.

## Performance (see [performance.md](../quality/performance.md))
- [ ] No new client JavaScript without a reason; heavy client libraries are lazy-loaded.
- [ ] Images use `next/image` with `sizes`; no layout shift; no request waterfalls.
- [ ] New queries are backed by indexes.

## Data
- [ ] The migration is generated, reviewed and committed with the schema change, and stays backward compatible (expand → migrate → contract).

## Observability
- [ ] Unexpected errors are logged with context; key analytics events from the spec are emitted.

## Docs
- [ ] The spec status is updated; an ADR exists for any decision; docs reflect any changed convention; `.env.example` lists new env vars.
- [ ] The PR template is filled in, with screenshots or a recording for UI changes.
