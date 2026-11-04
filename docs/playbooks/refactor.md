# Playbook: Refactor

> **Use when:** improving structure without changing behavior. **Ask first** if the refactor touches more than ~10 files or wasn't requested.

## Steps

1. **State the goal** in one sentence: what gets better (duplication removed, boundary fixed, file split, naming aligned with the docs).
2. **Lock in behavior.** Make sure tests cover the code you'll touch. If they don't, add characterization tests first and commit them separately.
3. **Small steps.** Move or rename first (commit), then change structure (commit), then clean up (commit). Each step keeps `pnpm verify` green.
4. **No behavior changes.** Don't fix bugs, change UI, or alter APIs in the same change. Note them for follow-up instead.
5. **Follow the docs.** Refactored code must match the current standards. If the docs are wrong, update them (AGENT-1) in a separate commit with a clear message.
6. **Mind the public contracts.** Exported names used across features, URLs, API responses, DB schema, i18n keys and analytics event names change only with a migration plan.

## Verify

`pnpm verify`, `pnpm build`, and `pnpm test:e2e`. Run `pnpm analyze` if the refactor touches client components. The bundle must not grow.

## Done when

Same behavior, better structure, all checks green, and the diff is easy to review (moves separated from edits).
