# Spec: <Feature name>

- **Status:** Draft | Approved | In progress | Implemented
- **Feature folder:** `src/features/<feature>/`
- **Owner:** <name> · **Date:** YYYY-MM-DD · **Links:** <issue, designs>

## 1. Summary
Problem, who has it, and what success looks like (2–4 sentences).

## 2. User stories
- As a <role>, I want <capability>, so that <benefit>.

## 3. Scope
- **In:** …
- **Out (not now):** …

## 4. Acceptance criteria
Write testable statements:
- **AC1:** Given <state>, when <action>, then <result>.
- **AC2:** When <trigger>, the system shall <response>.

## 5. UX
- **Routes:** `/[locale]/…` (group: marketing | auth | app)
- **States:** loading · empty · error · success · no permission
- **Components:** new / reused
- **Copy:** i18n namespace `<Feature>`; key list or draft copy

## 6. Data model
Tables/columns/indexes/constraints; migration type (additive or expand/contract), with a rollout plan for breaking changes.

## 7. Server
| Function | File | Access rule (who can do what) |
|---|---|---|
| `listX()` | `server/queries.ts` | owner only |
| `createX()` | `server/mutations.ts` | signed-in user |
| `createXAction` | `server/actions.ts` | authenticated |

Cache tags and what invalidates them. API endpoints (if any external consumers).

## 8. Security & privacy
Personal data collected (purpose, retention), abuse cases, rate limits, audit events.

## 9. SEO / discoverability (public pages only)
Target query and intent, metadata, schema.org type, sitemap entry, internal links.

## 10. Accessibility
Special considerations: custom widgets, drag-and-drop alternatives, live announcements.

## 11. Analytics
| Event | When | Properties (no PII) |
|---|---|---|
| `x_created` | after a successful create | `x_id` |

## 12. Testing plan
Unit · integration (including "other user can't access") · E2E journey + axe.

## 13. Open questions
- …

## 14. Tasks
- [ ] Schema + migration
- [ ] Queries / mutations / actions + tests
- [ ] UI + states
- [ ] Pages + metadata
- [ ] i18n (all locales)
- [ ] E2E
- [ ] Docs updated
