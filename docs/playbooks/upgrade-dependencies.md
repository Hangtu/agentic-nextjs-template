# Playbook: Upgrade Dependencies

## Routine (patch/minor, usually via Dependabot)

1. Read the changelog for anything notable (deprecations, behavior changes).
2. Check out the PR branch, run `pnpm install --frozen-lockfile`, then `pnpm verify` and `pnpm test:e2e`.
3. Merge if green and the preview deployment looks right.

## Major upgrades (ask first)

1. **One major at a time.** Never combine two framework majors in one PR.
2. **Read** the official migration guide and release notes. For Next.js, also read the bundled docs in `node_modules/next/dist/docs/` after upgrading.
3. **Use the official codemods** when they exist: `pnpm dlx @next/codemod@latest upgrade latest`, or `next upgrade`; React/TS/Tailwind/ESLint upgrade tools.
4. **Upgrade:** `pnpm add <pkg>@latest` (or the target major), then `pnpm install`.
5. **Fix** type errors and deprecations properly. Don't suppress them.
6. **Update the docs:**
   - the "Verified with" column in [tech-stack.md](../architecture/tech-stack.md);
   - any snippet or rule whose API changed;
   - the "Outdated patterns" table with the newly deprecated APIs;
   - an ADR if the upgrade changes a decision (e.g., moving to TypeScript 7 or ESLint 10 once the pins in tech-stack.md can be lifted).
7. **Verify:** `pnpm verify`, `pnpm build`, `pnpm test:e2e`, plus a manual pass over key journeys on the preview deployment. Watch errors and Web Vitals after release.

## Security releases

Critical framework advisories (Next.js, React, Better Auth, Drizzle, pg) are applied within 48 hours (SEC-50). Check the advisory for extra steps, such as rotating secrets.
