# Playbook: Diagnose and Adopt

> **Use when:** bringing this kit into a new/existing project, re-adopting it, or resolving missing project context.
> **Default:** read-only diagnosis. A request to evaluate/copy the kit is not permission for a stack migration.

## 1. Establish source, target, and intent

- Identify this kit's source revision and the target repository/package. Inspect working-tree status and do not disturb uncommitted work.
- Distinguish `kit` maintenance, `new` application work, and an `existing` application. Use the user's intent plus actual source/dependencies, not package.json presence alone.
- Read target instructions first, including AGENTS/CLAUDE and workspace/nested instructions. A new contract cannot silently override them.
- If the user only wants to maintain this kit, use its contract and stop the adoption flow.

## 2. Inspect without modifying

Read manifests, lockfile metadata, runtime/config files, routes, representative UI and data/mutation code, tests, docs, and CI. Do not install packages, run unreviewed scripts, connect to databases, provision services, or open secret env files. Use `.env.example` for variable names only.

Identify:
- observed framework/versions versus declared ranges;
- public indexable pages versus private areas;
- identity/authorization, persistence, forms, languages, URL state, shared caching, external consumers, analytics/privacy;
- actual paths and a safe existing pattern worth preserving;
- current verification commands and evidence of failures, distinguishing not-run from passed.

Sampling is not an exhaustive audit. State which areas were inspected and what remains unknown.

Primary compatibility: Next.js App Router. For Pages Router, other frameworks, or unverified versions, offer a limited adoption or a separately scoped migration. Never bootstrap over an existing application to make it compatible.

## 3. Propose, ask, and stop

Present [the adoption report](../templates/adoption-report.md) **in conversation**, without writing into the target yet. Classify each material area: apply, preserve, defer, not applicable now, or confirm. Cite files and reasons.

Ask at most five initial questions about unresolved decisions, each with a recommendation. Do not ask users to repeat facts available in code. Common decisions: intended indexing, languages, first migration area, providers to preserve, and allowed changes to checks.

Show the proposed capability states and exact incorporation plan. Resolve unknown states before approving the contract. Serious safety defects remain findings even when their remediation is a separate task.

**Wait for explicit approval before creating/copying/editing target files.** If the user already approved a specific plan, execute only those steps; do not repeatedly ask for the same authorization.

## 4. Incorporate non-destructively

1. Agree the **knowledge root**. New apps can use `docs/`; existing apps default to an unused `docs/agent-kit/`, or reuse the previously adopted location.
2. Copy the reference library with its relative tree intact. Keep existing product/spec/ADR documents canonical through path mappings in the contract. Do not transplant the source kit's own active contract or implementation spec as target-project facts: create the target contract from [the template](../templates/project-context.md).
3. Preserve existing README, AGENTS/CLAUDE, docs indexes, configs, hooks, CI, manifests, and lockfiles. Merge only the approved sections. Do not copy this kit's root CI into an application.
4. In the existing instruction entry point, add/update exactly one managed block:

```markdown
<!-- agent-kit:adoption:start -->
## Engineering kit
Project contract: <repository-relative path to approved project-context.md>.
Read the contract first, then its applicable reference docs. Preserve the project's existing instructions and report unresolved conflicts before acting.
<!-- agent-kit:adoption:end -->
```

5. Create/update the contract with actual paths, selected providers, capabilities, approval, commands, baseline debt, and next work. If markers already exist, replace that block only; multiple blocks are a conflict to resolve, not a reason to append.
6. Reconcile incompatible instructions explicitly in the same approved change. A pointer cannot neutralize an old unconditional rule that remains in force.
7. For new apps, proceed to [bootstrap](bootstrap-project.md) only when scaffolding/install/config steps are approved. For existing apps, leave runtime and dependency changes out unless listed in the plan.

Update links and root-path examples in the merged entry point for the selected knowledge root. Verify references still resolve; don't create duplicate glossaries, specs, or ADR histories.

## 5. Establish a baseline and improve one area

Run only reviewed, approved commands; record invocation, revision, result, and blocked prerequisites. Do not call missing commands, new ignore lists, weakened thresholds, or skipped tests a successful baseline.

Agree which touched/new code must meet the adopted standards. Protect an existing area's behavior with characterization tests before reorganizing it. Keep moves, behavior changes, and tool migrations independently reviewable; never perform a cleanup of the whole repo as an adoption side effect.

## 6. Verify and report

- Review the diff for overwrites, secrets, unintended tool changes, and broken links.
- Check there is one contract and one integration block at the previously chosen location.
- Verify the capability decisions against the inspected scope, particularly private data and indexable routes.
- Run agreed checks; compare with baseline and identify new regressions.
- Report documentation incorporation separately from application compliance, build/E2E, manual accessibility, or production readiness.

Re-adoption: read the prior contract, compare revision/decisions, present only the proposed delta, and obtain approval for changed scope. No repeated installs, duplicate blocks, or silent provider migrations.

See [applicability](../architecture/applicability.md) and [agent workflow](../workflow/agent-workflow.md).
