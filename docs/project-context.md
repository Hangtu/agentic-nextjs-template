# Project Context

- **Status:** approved
- **Mode:** kit
- **Kit source:** https://github.com/Hangtu/agentic-nextjs-template
- **Kit revision:** unreleased
- **Adopted at:** not-applicable
- **Update policy:** manual-review
- **Knowledge root:** docs
- **Approval:** user approved the adaptive-adoption proposal and requested implementation; this does not authorize a consumer app bootstrap.

## Product and compatibility

This repository contains engineering standards, recipes, and dependency-free kit validation. It has no generated Next.js application. Maintaining it is not evidence that any application scenario has been executed.

## Capabilities

| Capability | State | Decision / evidence |
|---|---|---|
| ui | inactive | No application UI in this repository |
| public-pages | inactive | No deployed application routes |
| forms | inactive | No application mutations |
| database | inactive | No application persistence or migrations |
| auth | inactive | No application identities or sessions |
| i18n | inactive | Documentation is not a multi-locale app |
| url-state | inactive | No application URL state |
| analytics | inactive | No tracking installed |
| shared-cache | inactive | No application cache |
| external-api | inactive | No application HTTP endpoints |

## Conventions

- Entry point: `AGENTS.md`; product-facing usage: `README.md`.
- Library: `docs/`; specs: `docs/specs/`; ADRs: `docs/architecture/decisions/`.
- Product/glossary templates: `docs/product/`. They describe a future consumer product, not facts about an initialized app.
- Kit scripts/tests: `scripts/*.mjs`, using built-in Node modules. No root package.json is required.
- Root CI validates the kit. App workflows/hooks are recipes, not active kit dependencies.
- This is the source kit, not an adopted consumer. Its provenance fields deliberately have no adoption date/self-referential commit; consumers record real source commit/date after approved incorporation.
- Doctor/Adopt/Verify select the current operation only. They do not replace project mode or grant extra permissions.
- Preserve accepted ADR decisions; ADR 0009 scopes their applicability to approved projects.

## Verification

| Check | Command | Baseline / result |
|---|---|---|
| Kit checks and regression tests | `node scripts/verify-kit.mjs` | Run after kit changes |
| Whitespace errors | `git diff --check` | Run before reporting |
| Presentation files and artwork | `node scripts/verify-kit.mjs` | Structure/dimensions automated; visual and remote GitHub settings remain manual |
| Generated app checks | Not applicable in kit mode | Execute separately using the scenario checklist |

## Deferred work

See [kit validation](quality/kit-validation.md) for the application scenarios and unexecuted bootstrap/browser evidence. Do not label the kit a tested production starter until those results exist.

GitHub remote settings—About, topics, social preview upload, private advisories, secret scanning, branch protection—are documented in [the presentation guide](operations/github-presentation.md) and remain manual. No remote setting was changed by this work.

## Current work

The [adoption MVP](specs/adaptive-adoption-mvp.md) is the committed baseline. The approved [report, operation, and update improvements](specs/doctor-operations-and-updates.md) are implemented with local evidence recorded in that spec. The [repository presentation](specs/repository-presentation.md) refresh is implemented locally; GitHub About/topics/social-preview settings remain manual. Next: validate real app/adoption/update scenarios in isolated target projects, rather than adding more rules. No app/bootstrap, remote-settings change, commit, or push is authorized as a continuation shortcut.
