# Spec: Official Agent Skill Discovery and Incorporation

- **Status:** Implemented (documentation workflow; no generic installer)
- **Scope / owner:** Agent-resource guidance for the Doctor / Adopt / Verify kit workflow
- **Project contract:** [project-context.md](../project-context.md)
- **Approval:** The user approved limiting skills newly recommended or incorporated by the kit to official product sources, requested discovery during diagnosis, approved the Vercel, Neon, and Next.js first-party sources, and requested adding Cloudflare's `security-audit` as a reviewed official skill with its use scoped appropriately.

## Objective and scope

Help agents use product-specific expertise from the makers of tools actually used by a target project. During Doctor, discover and suggest relevant official skills; during Adopt, incorporate a named skill only through an explicitly approved plan. Official vendor authorship is a source qualification, not automatic proof of applicability, safety, compatibility, or permission.

In scope:
- First-party source verification and focused discovery for active tools relevant to the diagnosis/task.
- Vercel and Neon catalogs plus Next.js AI-agent/skills guidance as approved first-party discovery sources; reviewed Cloudflare `security-audit` as an option only for an explicitly requested security review, with the same verification method for other active products.
- Evidence-backed, optional recommendations in the Doctor report.
- Reviewed, approval-gated incorporation in Adopt, with provenance and local override preservation.

Out of scope:
- Installing or modifying skills during Doctor, Verify, or without a named approved Adopt plan.
- Unofficial/community skills newly recommended or incorporated by the kit; automatic discovery crawlers, installers, updates, or synchronization; new dependencies or a CLI.
- Deleting existing target skills, invoking/relying on existing unofficial skills as kit guidance, changing agent runtimes, provisioning products, or following skill instructions without review and authorization.

## Acceptance criteria

1. Doctor distinguishes actual active tools from mentions/examples, using project instructions, contract, manifests/configuration, and relevant source evidence without opening secret env files.
2. Doctor checks only first-party vendor documentation/catalogs for tools materially relevant to the current task or finding; it does not inventory every dependency.
3. A candidate is called official only when published by a vendor-controlled source or directly linked from that product's first-party documentation. Unverified sources are not promoted as official.
4. The approved Vercel, Neon, and Next.js first-party sources are included for discovery. Matches require evidence that the relevant product is used or actively evaluated; Next.js does not imply Vercel, and PostgreSQL does not imply Neon. Cloudflare `security-audit` is mentioned only for explicit security-audit requests, never as a routine Doctor action. Approval of a source does not approve every listed skill or an installation.
5. A Doctor recommendation reports the exact skill/source, triggering evidence, purpose, target-agent compatibility, and disposition; no match is not a defect. Unavailable source/runtime evidence is reported as not checked or unverified.
6. Doctor remains read-only: no saving reports to target, copying/installing skills, executing skill content, or automatic transition to Adopt.
7. Adopt incorporation requires explicit approval naming the exact skill/source, runtime/location, files/config, authorized installer/dependencies, security/license/conflict review, provenance, and update/override policy.
8. Official status alone never overrides local instructions, the approved contract, security rules, or operation permissions. Existing skills are not automatically removed or replaced; non-official skills are not used or recommended by kit-guided work and require a separate owner decision before removal.
9. No dynamic fetcher, generic installer, or new dependency is introduced. Tests validate documented source and permission boundaries, not actual upstream skill content or runtime behavior.

## Implementation

- `docs/architecture/agent-skills.md` owns official-source criteria, matching, report expectations, and incorporation boundaries.
- `docs/playbooks/adopt-project.md` integrates discovery into Doctor and approval-gated use into Adopt/Verify.
- `docs/templates/adoption-report.md` adds an optional evidence-based skills section.
- `docs/README.md`, `AGENTS.md`, and `README.md` link the policy from the relevant entry points.
- Kit validation tests guard the source references and Doctor/Adopt boundary.

## Verification and rollout

- Run `node scripts/verify-kit.mjs` and `git diff --check`.
- The scenario in [kit validation](../quality/kit-validation.md) exercises a Vercel+Neon project, an alternate database/provider, and unavailable source/runtime evidence. Manual agent judgement and vendor catalog freshness remain outside automated kit checks.
- Do not claim an upstream skill was installed or runtime-validated from documentation-only checks.

## Implementation evidence

- Added the official-source and relevance policy, approved Vercel/Neon/Next.js discovery sources, conditional Cloudflare `security-audit` review record, Doctor report guidance, and approval-gated Adopt/Verify boundaries.
- Cloudflare repository ownership/license metadata and the pinned README/entry-point `SKILL.md` were inspected read-only; no skill or validator was installed or executed, and no target audit was performed.
- `node scripts/verify-kit.mjs` passes: 62 tests, 89 Markdown files, 289 local references, and 377 unique rule IDs.
- `git diff --check` passes. Automated tests validate documentation contracts, not upstream catalog freshness, agent judgment, or skill runtime behavior.
- The manual agent-resource discovery scenario remains **not executed**.

## Decisions and current state

- Default outcome: suggest a relevant official skill; incorporation is a separate approved Adopt decision. “Official” does not mean “auto-install.”
- Existing, non-official skills are preserved as target-owned state, reported as outside policy, and not invoked or relied on by kit-guided work; removal still requires a separate approved decision.
- No generic skill format or agent runtime is assumed. If compatibility cannot be established, suggest only and state the limitation.
