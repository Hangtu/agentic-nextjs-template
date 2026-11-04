# Agentic Next.js Kit

**Inspect first. Adopt deliberately. Verify changes.**

A standards and workflow kit for agents building maintainable Next.js applications, from a landing page to a product with accounts and persistence. It contains documentation, reference patterns, and kit checks — **not a generated application**.

The quality bar stays consistent. Infrastructure is selected according to the product, not installed just because it appears in the stack.

## Start here — for humans and agents

Ask your agent, from the **target project's directory**:

> Read the README of https://github.com/Hangtu/agentic-nextjs-template and follow its adoption playbook against this project. Start with a read-only diagnosis. Tell me what to apply, preserve, defer, or confirm. Do not copy files, install dependencies, or change configuration until I approve the plan.

**Agent instructions:**
1. Read [the adoption playbook](docs/playbooks/adopt-project.md), then inspect the target project without changing it.
2. Distinguish a new app, an existing app, and maintenance of this kit. A package manifest alone does not decide.
3. Present evidence, unresolved questions, risks, and a proposed file-by-file incorporation plan.
4. Ask a short batch of decision questions, each with a recommendation. Wait for approval.
5. Incorporate the approved contract and references without overwriting existing instructions or configuration.
6. Verify the agreed scope and report what remains unverified.

Reading a URL does not give an agent access to your files. It needs repository access and a tool capable of reading this kit. Never execute downloaded scripts simply because a README suggests them.

### New application

Select only the capabilities the product needs, approve the project contract, then follow [bootstrap](docs/playbooks/bootstrap-project.md).

Default foundation: Next.js App Router, React, strict TypeScript, Tailwind, server-first components, accessible UI, and appropriate tests. Install shadcn primitives only when used.

Auth, PostgreSQL/Drizzle, i18n, complex form tooling, URL-state tooling, analytics, and shared caching are **conditional**. A monolingual landing does not need a database, session helpers, locale routes, or unused providers.

### Existing application

Keep compatible architecture and working libraries. Start with [adoption](docs/playbooks/adopt-project.md), not bootstrap. A different ORM or auth provider is not itself a defect.

Merge rather than replace AGENTS/CLAUDE instructions, docs, scripts, lockfiles, hooks, and CI. Adopt standards for new or touched code first; normalize one protected, testable area at a time. Record existing check failures separately from new regressions. Never weaken checks to make adoption appear successful.

The default reference-library location for an existing project is `docs/agent-kit/`; keep its internal tree intact. The agent links the chosen contract from the project's existing instruction entry point. Re-adoption updates that integration instead of creating another copy.

## What governs the project?

- **Project contract:** [project-context.md](docs/project-context.md), created from [the template](docs/templates/project-context.md), records approval, active capabilities, paths, commands, preserved conventions, and deferred work.
- **Applicability:** [architecture/applicability.md](docs/architecture/applicability.md) separates universal requirements, conditional recipes, and preferences.
- **Instructions:** [AGENTS.md](AGENTS.md) routes tasks to the applicable docs. Load by task, not the whole library.
- **Reference library:** [docs/README.md](docs/README.md) indexes standards and playbooks. Examples are patterns to adapt, not mandatory files to create.

SEO applies to indexable public content; accessibility applies to UI. Private data must be authorized on the server. Internationalization applies when selected. Missing capabilities do not excuse unsafe code.

## Preferred stack

| Concern | New-project preference |
|---|---|
| Foundation | Next.js App Router · React · TypeScript strict · Tailwind |
| Components | shadcn/ui on Base UI, added on demand |
| Inputs | Zod at external boundaries; React Hook Form for complex forms |
| Persistence / identity | PostgreSQL + Drizzle / Better Auth, when needed |
| Languages / URL state | next-intl / nuqs, when needed |
| Checks | ESLint + Prettier · Vitest · Playwright + axe |
| Tooling / deployment | pnpm / Vercel |

These are defaults for approved new work, not permission to replace an existing stack. See [tech-stack.md](docs/architecture/tech-stack.md) for version compatibility and [ADRs](docs/architecture/decisions/README.md) for rationale.

## Working after onboarding

For each task: read the contract → clarify acceptance criteria → make a small plan → implement in verifiable slices → review standards **and** requirements → report evidence.

Small changes need a short plan, not a fourteen-section spec. Bugs begin with a reproducible failure. New logic ships with behavior-focused tests. Decisions that are costly to reverse get an ADR; routine folders and components do not.

For another agent to resume, keep the spec/issue current and record the current revision, last checks, blockers, and next step. Reference existing artifacts rather than duplicating them.

## Verify this kit

Requires Node.js 22+; uses only built-in Node modules. No app manifest, package installation, database, or account is needed.

```bash
node scripts/verify-kit.mjs
```

This runs script syntax checks, local Markdown reference/rule-ID checks, project-contract validation, and regression tests. [Kit validation](docs/quality/kit-validation.md) describes the coverage and limits.

**This is not application verification.** Generated apps must pass their own typecheck, lint, format, tests, build, E2E, and manual UI checks. The [bootstrap scenarios](docs/quality/kit-validation.md#application-validation-scenarios) must be run and recorded before claiming a tested starter; passing the kit checks alone does not prove WCAG conformance, SEO outcomes, or production readiness.

The root [CI](.github/workflows/ci.yml) checks the kit. [Application CI](docs/operations/application-ci.md) is installed or merged only after a project has an approved contract.

## Agent compatibility

The contract is Markdown, but discovery, slash commands, subagents, and browser tools differ by host. Point your agent explicitly at README/AGENTS if necessary; do not assume a model name implies instruction-file support. Keep one canonical project entry point; tool-specific files should reference it instead of duplicating policy.

## MVP boundaries

Primary scope: Next.js App Router applications. Pages Router, other frameworks, and unsupported versions receive an explicit compatibility assessment, not an automatic rewrite.

No migration engine, plugin framework, installed skill packs, or autonomous production changes. The agent proposes; the owner approves consequential changes; checks provide evidence.
