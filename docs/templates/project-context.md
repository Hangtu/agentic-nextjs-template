# Project Context

- **Status:** proposed
- **Mode:** undecided
- **Kit revision:** record the adopted commit or release
- **Knowledge root:** docs/agent-kit
- **Approval:** pending

Status is `proposed` or `approved`. Mode is `kit`, `new`, `existing`, or `undecided` while diagnosing. Paths are relative to the target repository, not to this document. This is a decision record, not an executable configuration.

## Product and compatibility

Link the product brief; record observed framework/runtime versions and the supported, limited, or unsupported assessment. Identify evidence and unknowns separately. Do not record secrets or real user data.

## Capabilities

| Capability | State | Decision / evidence |
|---|---|---|
| ui | unknown | Inspect routes and components |
| public-pages | unknown | Confirm intended indexing, not just authentication absence |
| forms | unknown | Inspect submission/mutation paths |
| database | unknown | Inspect persistence requirements and adapters |
| auth | unknown | Inspect identity and private-data boundaries |
| i18n | unknown | Inspect languages and confirm requirements |
| url-state | unknown | Inspect shareable state requirements |
| analytics | unknown | Confirm measurement and privacy decisions |
| shared-cache | unknown | Inspect rendering configuration and actual cache use |
| external-api | unknown | Inspect consumers, webhooks, and jobs |

States: `active`, `inactive`, `unknown`. Resolve unknowns before approval; active does not mean the implementation is already correct.

## Conventions

Record actual paths for routes, feature/UI code, server/data access, specs, ADRs, glossary, and the instruction entry point. Record tools to preserve, new-project defaults selected, allowed migration scope, and the safe example to mirror. Do not duplicate existing product/architecture docs.

## Verification

| Check | Command | Baseline / result |
|---|---|---|
| Repository checks | Not yet inspected | Not run |

List exact approved commands for typecheck, lint, format, tests, build, E2E, and manual UI review. If unavailable or failing, record why, evidence, and a follow-up; do not invent a passing command. Reviewing a package script is not permission to execute unknown scripts during diagnosis.

## Deferred work

Link risks, baseline failures, migration tasks, and owner decisions. Identify serious security issues explicitly rather than excusing them as legacy preferences.

## Current work

Link the spec/issue; record the current revision, last verification, blockers, and the next concrete step. Handoffs reference this state and existing artifacts rather than replacing them with a temporary chat summary.
