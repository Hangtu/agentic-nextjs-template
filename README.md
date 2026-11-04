# AI-Ready Next.js Project Kit (2026)

A drop-in rulebook that makes AI coding agents (Claude, GPT/Codex, DeepSeek, Cursor, Copilot, …) build and maintain a Next.js app **the same way every time**: same structure, same patterns, same quality bar.

It contains no app code. It contains:
- the **rules** (architecture, code standards, security, accessibility, SEO, AI discoverability, i18n, performance, testing, operations);
- the **playbooks** an agent follows step by step (bootstrap, add a feature, add a page, change the DB, fix a bug, review, launch…);
- the **guardrails** that enforce the rules mechanically (git hooks, CI, lint and dependency config).

## How to use it

### Start a new project
1. Create an empty repository and copy **everything in this folder** into its root, including the hidden files (`.github/`, `.editorconfig`, `.gitattributes`, `.node-version`, `lefthook.yml`).
2. Open your agent in that folder and say:
   > "Create the app following AGENTS.md."

   The agent reads `AGENTS.md`, sees there is no `package.json`, and runs `docs/playbooks/bootstrap-project.md`. It asks you a few questions (name, locales, sign-in methods), scaffolds with the official generators, installs the latest compatible versions, and leaves `pnpm verify` green.
3. Fill in `docs/product/brief.md` and `docs/product/glossary.md` (the agent will ask for them otherwise).
4. Build features by asking, for example:
   > "Create feature: team invitations."

   The agent follows `docs/playbooks/add-feature.md`: it writes a spec in `docs/specs/`, waits for your approval, then implements, tests, and self-reviews.

### Add it to an existing project
Copy `AGENTS.md` and `docs/`. Then ask an agent to compare the codebase with `docs/architecture/project-structure.md` and the standards, and to write a migration plan as an ADR, before changing any code.

## How agents find the rules

| Tool | How it loads the rules |
|---|---|
| Codex, Cursor, Copilot, OpenCode, Cline, Kilo, Amp, Devin/Windsurf, Jules, Antigravity | Read `AGENTS.md` natively |
| Claude Code | Reads `AGENTS.md` natively (v2.1.277+) when no `CLAUDE.md` exists. Need Claude-only rules? Create `CLAUDE.md` containing `@AGENTS.md` plus those rules |
| Gemini CLI | Add `{"context":{"fileName":"AGENTS.md"}}` to `.gemini/settings.json` |
| Aider | Add `read: AGENTS.md` to `.aider.conf.yml` |
| DeepSeek models | Use them through any harness above. DeepSeek documents setups for Claude Code, Codex and OpenCode, all of which read `AGENTS.md` |

`AGENTS.md` stays short (always loaded); it routes the agent to the right doc in `docs/` for each task (loaded on demand).

## What's inside

```text
AGENTS.md                         entry point: commands, golden rules, map, routing table, boundaries
docs/
  README.md                       index of every doc + rule-ID prefixes
  product/                        brief, glossary, data inventory (fill per project)
  architecture/                   overview, project structure, tech stack, reference feature, ADRs
  standards/                      naming, code style, TypeScript, React, styling, state, forms, errors
  backend/                        data fetching & caching, server actions, API routes, database, auth
  quality/                        testing, accessibility, performance, security
  discoverability/                SEO, AI discoverability (GEO, llms.txt, AI crawlers), i18n, analytics & privacy
  operations/                     env & config, observability, deployment, dependencies
  workflow/                       agent workflow, definition of done, git & PRs
  playbooks/                      step-by-step procedures (bootstrap, features, pages, DB, bugs, review, launch…)
  templates/                      feature spec, bug report, SEO page brief
  specs/                          feature specs live here
.github/                          CI workflow, PR template, Dependabot
lefthook.yml                      git hooks (format, lint, commit message, typecheck, tests)
.editorconfig · .gitattributes · .node-version
```

## Stack (decided; see `docs/architecture/tech-stack.md` and the ADRs)

- **Framework:** Next.js App Router with Cache Components · React 19 + React Compiler · TypeScript strict
- **UI:** Tailwind CSS v4 · shadcn/ui on Base UI · next-intl · Zod · React Hook Form · nuqs
- **Data and auth:** PostgreSQL + Drizzle · Better Auth
- **Testing:** Vitest + Testing Library + PGlite · Playwright + axe
- **Tooling and hosting:** pnpm · ESLint + Prettier · lefthook · knip · Vercel

## Versions

The docs avoid pinned versions. Projects install the newest compatible releases (with a minimum release age, for supply-chain safety), and the lockfile freezes them. `docs/architecture/tech-stack.md` records the major versions the kit was last verified against (**November 2026**), and the two deliberate holds:
- TypeScript 6.0, because typescript-eslint doesn't support TS 7 yet;
- ESLint 9, because some Next.js lint plugins don't list ESLint 10 yet.

## Maintaining the kit

- Treat it like code: changes via PR, and every rule change updates its doc and, if it reflects a decision, an ADR.
- Quarterly: re-verify `tech-stack.md` against the latest releases, review the AI-crawler list in `ai-discoverability.md`, and check the pins.
- When an agent repeatedly makes the same mistake, add or sharpen a rule, or better, a lint rule or test that catches it.
