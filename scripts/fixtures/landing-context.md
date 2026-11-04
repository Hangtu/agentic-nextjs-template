# Project Context

- **Status:** approved
- **Mode:** new
- **Kit revision:** fictional validation fixture
- **Knowledge root:** docs
- **Approval:** fixture owner approved the listed scope (test data, not real adoption evidence)

## Capabilities

| Capability | State | Decision / evidence |
|---|---|---|
| ui | active | Accessible UI |
| public-pages | active | Indexable home page |
| forms | inactive | No submissions |
| database | inactive | No persistence |
| auth | inactive | No accounts |
| i18n | inactive | One language |
| url-state | inactive | No filters |
| analytics | inactive | No tracking |
| shared-cache | inactive | Static content needs no shared data cache |
| external-api | inactive | No external consumers |

## Conventions

src/app, monolingual Next navigation, no DB/auth/message helpers.

## Verification

| Check | Command | Baseline / result |
|---|---|---|
| Typecheck | pnpm typecheck | Not executed; this fixture tests contract validation only |

## Deferred work

Runtime bootstrap/build/browser evidence is separate from these fixtures.

## Current work

Test contract structure; no application is generated or migrated by this fixture.
