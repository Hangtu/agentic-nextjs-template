# Agent Workflow

> **Read when:** always. This is how every AI agent (Claude, GPT/Codex, DeepSeek, …) and every human works in this repo. `AGENTS.md` summarizes it.

## Which instruction wins

1. The user's explicit instruction for the current task.
2. This repo's docs (`AGENTS.md` → `docs/`).
3. Existing code patterns.
4. Your training data.

- **1 vs 2:** follow the user, but say so in your report and propose a doc update or ADR.
- **2 vs 3:** the docs win for new code; mention the inconsistency.
- **Your training data may be outdated.** Installed package versions and these docs win over memory.

## The loop

1. **Orient.** Open only the docs the `AGENTS.md` routing table lists for your task. Find the closest existing example and mirror it. In a new codebase, mirror [reference-feature.md](../architecture/reference-feature.md).
2. **Clarify.** Ask when requirements are ambiguous, acceptance criteria are missing, or the task is in "Ask first". Batch your questions (≤ 5), each with a recommended default. Don't ask about things the docs already decide.
3. **Plan, scaled to the task:**
   - trivial: just do it;
   - small: state the files you'll touch and the tests you'll write;
   - feature: write `docs/specs/<feature>.md` from the [template](../templates/feature-spec.md), then wait for approval unless told to proceed.
4. **Implement** in vertical slices (schema → data layer → actions → UI → i18n → tests), keeping the app compiling. Search before you create anything new.
5. **Verify.**
   - `pnpm verify` passes.
   - The E2E tests for affected journeys pass.
   - For UI changes, look at the running app: every locale, mobile width, dark mode, keyboard only.

   **Never claim something works if you didn't run it.**
6. **Self-review** your diff with [code-review.md](../playbooks/code-review.md). Fix every blocker and major finding.
7. **Report:**

```markdown
**Summary:** what and why (1–3 lines)
**Changes:** files, grouped by layer
**Verification:** commands run + results; what was checked manually
**Decisions & assumptions:** + docs/ADRs updated
**Follow-ups / risks:** or "none"
```

## Boundaries

**Always**
- Run `pnpm verify` before saying "done".
- Keep changes scoped to the task; list unrelated problems in the report instead of fixing them.
- Add tests for new logic, and a regression test for every bug fix.
- Update the owning doc in the same change when you change a convention, command or dependency.

**Ask first**
- Adding, removing or major-upgrading a dependency.
- Dropping or renaming columns/tables, or rewriting existing data.
- Changes to auth, permissions, CSP/security headers, CORS or rate limits.
- Changes to CI/CD, env var names, `next.config.ts`, `tsconfig.json` or `eslint.config.mjs`.
- Deleting features or files, or large refactors that weren't requested.
- Anything that costs money or touches external systems.
- Committing, pushing or opening PRs, unless you were asked to.

**Never**
- Commit or print secrets or real personal data.
- Weaken checks:
  - `--no-verify`
  - `@ts-ignore`
  - `eslint-disable` without a rule name and reason
  - `.skip` / `.only` left in tests
  - loosened lint or type config
  - deleting a failing test
- Hand-edit generated files: applied migrations, `pnpm-lock.yaml`, `next-env.d.ts`, the `nextjs-agent-rules` block in `AGENTS.md`.
- Force-push to `main`.
- Run destructive commands against non-local databases.
- Leave placeholders: a `TODO` without an issue, mock data or fake success in production code.

## Don't invent APIs

1. Check the installed version in `package.json` and `node_modules/<pkg>/package.json`.
2. Read the types or the docs **for that major version**. Next.js ships its docs in `node_modules/next/dist/docs/`; read them before writing Next.js code.
3. Check the "Outdated patterns" table in [tech-stack.md](../architecture/tech-stack.md).
4. Still unsure? Write the smallest code that would prove it and type-check it. Don't guess.

## When stuck

If the same error survives 3 attempts, stop. Report the exact error, your hypotheses, what you tried, and what you need.

## Keeping docs alive

- **AGENT-1 (MUST)** A change to a convention, pattern, command or dependency updates the doc that owns it, in the same change.
- **AGENT-2 (MUST)** Record significant decisions as ADRs in `docs/architecture/decisions/`.
- **AGENT-3 (MUST)** Keep `docs/specs/<feature>.md` in sync with what was built, and set its status when done.

## Multi-agent work

- Split work by feature or layer; one agent edits a given file at a time.
- Reviewer agents report findings and don't edit.

## Optional tooling (per developer, not required)

| Tool | Use |
|---|---|
| Next.js MCP: built into `next dev` at `/_next/mcp`; connect with `npx -y next-devtools-mcp@latest` | Build/runtime errors, routes, logs, docs |
| Playwright MCP (`@playwright/mcp`) | Click through flows, screenshots, console errors |
| shadcn MCP (`pnpm dlx shadcn@latest mcp`) | Search and add registry components |
| Context7 or another docs MCP | Version-specific library docs |

Config file per tool:

| Tool | Config file |
|---|---|
| Claude Code, Copilot CLI | `.mcp.json` |
| Cursor | `.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` |
| Codex | `.codex/config.toml` |
| OpenCode | `opencode.json` |
