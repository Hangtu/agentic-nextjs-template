# Project Context

- **Status:** approved
- **Mode:** new
- **Kit source:** https://github.com/Hangtu/agentic-nextjs-template
- **Kit revision:** aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
- **Adopted at:** 2026-11-03
- **Update policy:** manual-review
- **Knowledge root:** docs
- **Approval:** fixture owner approved the listed scope (test data, not real adoption evidence)

## Capabilities

| Capability | State | Decision / evidence |
|---|---|---|
| ui | active | Accessible UI |
| public-pages | active | Indexable home page |
| forms | active | Private mutations require authorization |
| database | active | PostgreSQL selected |
| auth | active | Better Auth selected |
| i18n | inactive | One language |
| url-state | inactive | No filters |
| analytics | inactive | No tracking |
| shared-cache | inactive | Static content needs no shared data cache |
| external-api | inactive | No external consumers |

## Conventions

src/features and server-only data access; PostgreSQL/Drizzle and Better Auth selected.

## Verification

| Check | Command | Baseline / result |
|---|---|---|
| Typecheck | pnpm verify | Not executed; this fixture tests contract validation only |

## Deferred work

Runtime bootstrap/build/browser evidence is separate from these fixtures.

## Current work

Test contract structure; no application is generated or migrated by this fixture.
