# Project Context

- **Status:** approved
- **Mode:** existing
- **Kit revision:** fictional validation fixture
- **Knowledge root:** docs/agent-kit
- **Approval:** fixture owner approved the listed scope (test data, not real adoption evidence)

## Capabilities

| Capability | State | Decision / evidence |
|---|---|---|
| ui | active | Accessible UI |
| public-pages | active | Indexable home page |
| forms | inactive | No submissions |
| database | active | Existing persistence retained |
| auth | active | Existing provider retained |
| i18n | active | Existing catalogs retained |
| url-state | inactive | No filters |
| analytics | inactive | No tracking |
| shared-cache | inactive | Static content needs no shared data cache |
| external-api | inactive | No external consumers |

## Conventions

Preserve existing ORM, identity provider, app/components structure, npm, and instruction files. Normalize only the selected feature.

## Verification

| Check | Command | Baseline / result |
|---|---|---|
| Typecheck | npm run check | Not executed; this fixture tests contract validation only |

## Deferred work

Runtime bootstrap/build/browser evidence is separate from these fixtures.

## Current work

Test contract structure; no application is generated or migrated by this fixture.
