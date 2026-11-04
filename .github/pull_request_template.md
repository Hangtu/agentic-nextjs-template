## Summary
<!-- What and why, in 1–3 lines. Link the spec (docs/specs/…) or issue. -->

## Changes
<!-- Grouped by layer: data · server · UI · i18n · tests · docs -->

## Screenshots / recording
<!-- Required for UI changes: light + dark, mobile + desktop, each locale where relevant -->

## How was this tested?
<!-- Commands run and results; manual checks (keyboard, screen reader, locales) -->

## Checklist (docs/workflow/definition-of-done.md)
- [ ] `pnpm verify` passes; E2E updated/passing for changed journeys
- [ ] Auth + authorization checked in the data layer; inputs validated with Zod
- [ ] No hardcoded user-facing text; keys added to all locales
- [ ] Accessible: keyboard, focus, labels, contrast, axe clean
- [ ] Public pages: metadata, canonical, hreflang, sitemap, JSON-LD
- [ ] Migration reviewed and backward compatible (if any)
- [ ] Docs/spec/ADR/`.env.example` updated (if conventions, decisions or env changed)
- [ ] No new dependency, or the dependency checklist in docs/operations/dependencies.md is answered below

## Notes for reviewers
<!-- Risks, follow-ups, anything you want a second opinion on -->
