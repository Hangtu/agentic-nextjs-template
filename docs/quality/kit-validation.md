# Kit Validation

> **Read when:** changing this kit, its instructions, adoption behavior, or validation scripts.

## Local and CI checks

```bash
node scripts/verify-kit.mjs
```

Requires Node.js 22+ and no third-party dependencies. The command syntax-checks kit scripts, checks local Markdown targets/heading anchors and duplicate normative rule IDs, validates the active/context-template structure, and runs Node's built-in tests. Root CI runs it on the declared runtime matrix.

Tests exercise approved landing, authenticated-app, and existing-project **contract fixtures**, invalid/unknown states, reference errors, and the regression where docs-only CI tried to run an app pipeline.

The checker is read-only. Test cases create and clean isolated temporary fixtures. Neither checker nor tests install dependencies, execute project commands from a contract, scan secret env files, or access a database/network.

## Limits

- This is a small Markdown contract checker, not a complete CommonMark/YAML parser or a semantic audit of every instruction.
- Remote URLs, framework APIs, rendered UI, actual accessibility, real authorization, deployment configuration, and agent behavior are not proved by these tests.
- Fictional contract fixtures are not generated applications or evidence of a successful bootstrap.
- For relocated libraries, review links and the merged entry point against the target tree; kit-mode checks do not validate the entire consumer repo.
- Test workflow configuration in GitHub as well as locally; do not report a remote run as green without evidence.

## Application validation scenarios

These are release acceptance exercises, **not currently automated by kit CI**. Record the kit revision, exact tool/package versions, commands, outcomes, manual checks, and required intervention. Do not mark a scenario passed without executing it.

| Scenario | Required evidence | Initial status |
|---|---|---|
| New monolingual landing | Approved contract; no DB/auth/i18n/analytics installed unnecessarily; verify/build/E2E; metadata/sitemap; keyboard/focus/responsive/contrast review | Not executed |
| New app with accounts and persistence | Approved auth/DB choices; migrations on local DB; anonymous/other-user access tests; private noindex; verify/build/E2E and UI review | Not executed |
| Existing inconsistent App Router app | Read-only report; approved preservation/migration boundaries; baseline results; one area normalized; instructions/config preserved; re-adoption produces no duplicate block or contract | Not executed |

Add an i18n scenario before advertising that combination as runtime-tested. A successful landing does not validate every possible capability combination.

## Maintaining the checks

Write a failing regression test before fixing a contract/CI bug. Prefer validating observable contract behavior over asserting prose wording. Keep the supported Markdown syntax explicit and add fixtures for parsing changes.

Update [the implementation spec](../specs/adaptive-adoption-mvp.md) and this evidence description when adding real bootstrap automation. Never replace an unexecuted scenario with a passing structural assertion.
