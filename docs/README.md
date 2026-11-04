# Documentation Index

Everything an agent or developer needs to build and maintain this project. `AGENTS.md` (repo root) is the entry point; this page lists every doc and when to read it.

## Product (project-specific; fill these first)
| Doc | Read when |
|---|---|
| [product/brief.md](product/brief.md) | Understanding what we're building and for whom |
| [product/glossary.md](product/glossary.md) | Naming domain concepts in code, DB, URLs, UI |
| [product/data-inventory.md](product/data-inventory.md) | Collecting or sharing personal data |

## Architecture
| Doc | Read when |
|---|---|
| [architecture/overview.md](architecture/overview.md) | First day; cross-layer changes |
| [architecture/project-structure.md](architecture/project-structure.md) | Creating any file or folder |
| [architecture/tech-stack.md](architecture/tech-stack.md) | Choosing libraries/APIs; checking versions and outdated patterns |
| [architecture/reference-feature.md](architecture/reference-feature.md) | Building a feature (the pattern to mirror) |
| [architecture/decisions/](architecture/decisions/README.md) | Understanding or changing a technical decision (ADRs) |

## Standards (how code is written)
| Doc | Read when |
|---|---|
| [standards/naming.md](standards/naming.md) | Naming anything |
| [standards/code-style.md](standards/code-style.md) | Writing any code |
| [standards/typescript.md](standards/typescript.md) | Writing types; touching tsconfig |
| [standards/react-components.md](standards/react-components.md) | Writing components, pages, layouts |
| [standards/styling.md](standards/styling.md) | Tailwind, tokens, shadcn/Base UI |
| [standards/state-management.md](standards/state-management.md) | Deciding where state lives |
| [standards/forms.md](standards/forms.md) | Forms and validation |
| [standards/error-handling.md](standards/error-handling.md) | Anything that can fail |

## Backend
| Doc | Read when |
|---|---|
| [backend/data-fetching-and-caching.md](backend/data-fetching-and-caching.md) | Reading data, caching, invalidation |
| [backend/server-actions.md](backend/server-actions.md) | UI mutations |
| [backend/api-routes.md](backend/api-routes.md) | External HTTP endpoints, webhooks, cron |
| [backend/database.md](backend/database.md) | Schema design, queries, migrations |
| [backend/auth.md](backend/auth.md) | Authentication and authorization |

## Quality
| Doc | Read when |
|---|---|
| [quality/testing.md](quality/testing.md) | Writing tests |
| [quality/accessibility.md](quality/accessibility.md) | Any UI work |
| [quality/performance.md](quality/performance.md) | Pages, client code, images, dependencies |
| [quality/security.md](quality/security.md) | Auth, input, data exposure, headers, dependencies |

## Discoverability
| Doc | Read when |
|---|---|
| [discoverability/seo.md](discoverability/seo.md) | Public pages, URLs, metadata, sitemap |
| [discoverability/ai-discoverability.md](discoverability/ai-discoverability.md) | LLM/AI search visibility, robots, llms.txt |
| [discoverability/i18n.md](discoverability/i18n.md) | Any user-facing text; locales |
| [discoverability/analytics-and-privacy.md](discoverability/analytics-and-privacy.md) | Tracking, cookies, personal data |

## Operations
| Doc | Read when |
|---|---|
| [operations/environment-and-config.md](operations/environment-and-config.md) | Env vars, site config, feature flags |
| [operations/observability.md](operations/observability.md) | Logging, errors, monitoring |
| [operations/deployment.md](operations/deployment.md) | CI/CD, environments, migrations in deploy, rollback |
| [operations/dependencies.md](operations/dependencies.md) | Adding or updating packages |

## Workflow
| Doc | Read when |
|---|---|
| [workflow/agent-workflow.md](workflow/agent-workflow.md) | Always: how agents (and humans) work here |
| [workflow/definition-of-done.md](workflow/definition-of-done.md) | Before saying "done"; reviewing |
| [workflow/git-and-prs.md](workflow/git-and-prs.md) | Branches, commits, PRs |

## Playbooks and templates
- [playbooks/](playbooks/README.md): step-by-step procedures (bootstrap, add feature/page/endpoint, schema change, bug fix, refactor, upgrades, review, launch)
- [templates/](templates/): feature spec, bug report, SEO page brief
- [specs/](specs/README.md): feature specs for this project

## Rule IDs
Rules are cited by ID in reviews (e.g., `SEC-4`). Prefixes:

| Prefix | Area |
|---|---|
| `NAME` | Naming |
| `STYLE` | Code style |
| `TS` | TypeScript |
| `RC` | React components |
| `CSS` | Styling |
| `STATE` | State management |
| `FORM` | Forms |
| `ERR` | Error handling |
| `DATA` | Data fetching and caching |
| `ACT` | Server Actions |
| `API` | API routes |
| `DB` | Database |
| `AUTH` | Auth |
| `TEST` | Testing |
| `A11Y` | Accessibility |
| `PERF` | Performance |
| `SEC` | Security |
| `SEO` | SEO |
| `GEO` | AI discoverability |
| `I18N` | i18n |
| `PRIV` | Privacy |
| `ENV` | Environment and config |
| `OBS` | Observability |
| `DEPLOY` | Deployment |
| `DEP` | Dependencies |
| `GIT` | Git and PRs |
| `AGENT` | Agent workflow |
| `ARCH` | Architecture |
