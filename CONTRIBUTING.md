# Contributing

Thanks for helping make agent-assisted Next.js work more predictable. You do not need to install the kit or scaffold an application to contribute.

## What belongs here

Good contributions:

- a failing regression test for a contract, link, operation boundary, or script defect;
- a contradiction between documents, resolved at the owning source;
- evidence from a real Doctor/Adopt/Verify exercise in an isolated project;
- a clearer instruction that reduces divergent behavior between agents;
- artwork or documentation polish that does not overstate maturity.

Please do **not** add:

- generated application code or a full-stack scaffold;
- unofficial skill packs, a CLI framework, or automatic skill synchronization; official product skills follow the reviewed, approval-gated policy in [agent-skills.md](docs/architecture/agent-skills.md);
- dependencies without a concrete demonstrated need;
- invented adoption evidence, ratings, testimonials, or compatibility claims;
- consumer project names, URLs, secrets, or personal data without permission.

## Before you start

1. Read [`AGENTS.md`](AGENTS.md) and the [project contract](docs/project-context.md).
2. For a defect, search existing issues; report security issues privately via [SECURITY.md](SECURITY.md).
3. For a substantial rule change, open an issue or draft PR first with the problem, affected operation, and evidence.
4. Keep a change scoped. Do not use this repository to bootstrap a test application: use a separate target directory.

## Local checks

Requirements: **Node.js 22+**. The kit intentionally uses only Node’s built-in modules.

```bash
node scripts/verify-kit.mjs
git diff --check
```

`verify-kit` runs syntax checks, Markdown reference/rule checks, project-contract/provenance validation, operation/report guards, and the regression suite. It does not type-check or build a Next.js application; there is no application here.

`pnpm verify` belongs to consumer applications with their own manifest; do not add a root package just to imitate that command here. Report unavailable tooling instead of installing global packages to make a check appear green.

Maintainers preparing the public repository page should follow [docs/operations/github-presentation.md](docs/operations/github-presentation.md). That guide covers metadata and settings; changing them is a separate, explicitly authorized operation.

## Changing contracts or rules

- Write a **failing regression test first** for a defect in behavior, validation, links, or CI.
- Prefer validating observable contract shape over anchoring a test to prose wording.
- Update the document that owns a convention; do not leave two competing versions.
- A consequential, hard-to-reverse decision needs an ADR. A routine file or folder does not.
- Doctor must remain read-only; Verify must not repair source or configuration.
- Never weaken a check, skip a test, guess a missing commit/date, or replace a consumer’s instructions to make an example pass.

## Artwork and README changes

- Keep artwork original and self-contained; do not import third-party fonts, logos, or stock images.
- Preserve accessible `<title>`, `<desc>`, and `role="img"` in SVGs.
- Social preview must be **1280 × 640 PNG** and **under 1 MiB**.
- Follow [`assets/README.md`](assets/README.md) to regenerate it, then inspect the result visually.
- Do not add popularity, adoption, or production-readiness claims without recorded evidence.

## Pull requests

- Use a short-lived branch and a Conventional Commit title, for example `docs(readme): clarify doctor boundary`.
- Complete the PR template: scope, evidence, commands actually run, blocked checks, and remaining risks.
- State if AI assistance was used and what you verified yourself. A human remains accountable for the change.
- Keep unrelated cleanups out of the diff. Generated files and applied migrations are never hand-edited.
- Do not commit, push, deploy, or change remote repository settings unless you have authorization.

## License

By contributing, you agree that your contribution is licensed under the repository’s [MIT License](LICENSE), copyright © 2026 frutit.app. Only submit work you have the right to contribute.
