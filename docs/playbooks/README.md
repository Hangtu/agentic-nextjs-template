# Playbooks

Step-by-step procedures for recurring tasks. Agents: when a task matches a playbook, **follow it step by step** and mention in your report that you did. Each playbook ends with a verification step; don't skip it.

| Task | Playbook |
|---|---|
| Create the app from this kit | [bootstrap-project.md](bootstrap-project.md) |
| Build a new feature ("create feature X") | [add-feature.md](add-feature.md) |
| Add a page or route | [add-page.md](add-page.md) |
| Add an HTTP endpoint, webhook, or cron job | [add-api-endpoint.md](add-api-endpoint.md) |
| Add or change tables or columns | [change-database-schema.md](change-database-schema.md) |
| Add a UI component | [add-ui-component.md](add-ui-component.md) |
| Add translations or a new language | [add-translations-or-locale.md](add-translations-or-locale.md) |
| Fix a bug | [fix-bug.md](fix-bug.md) |
| Refactor without changing behavior | [refactor.md](refactor.md) |
| Upgrade dependencies | [upgrade-dependencies.md](upgrade-dependencies.md) |
| Review a change (your own or someone else's) | [code-review.md](code-review.md) |
| Prepare for production launch | [pre-launch-checklist.md](pre-launch-checklist.md) |

Playbook format: **Use when → Inputs → Steps → Verify → Done when**. When you add a playbook, keep that format and add it to this table and to the routing table in `AGENTS.md`.
