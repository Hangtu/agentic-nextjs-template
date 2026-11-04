# Playbook: Add a Page

> **Use when:** adding a new route (public marketing page, app screen, auth screen).

## Inputs

- Purpose of the page, audience, and whether it is **public (indexable)** or private.
- For public pages that target search: a [SEO page brief](../templates/seo-page-brief.md).

## Steps

1. **Pick the route group:** `(marketing)` public, `(auth)` sign-in flows, `(app)` signed-in product. Path: `src/app/[locale]/(group)/<kebab-path>/page.tsx` (naming: NAME-30…32).
2. **Write a thin page.**
   - `export default async function <Name>Page(props: PageProps<"/[locale]/<path>">)`.
   - Compose feature components; no business logic or DB access in the route file (ARCH-1).
   - One `<h1>`.
   - Request-dependent parts go inside `<Suspense fallback={<Skeleton/>}>` (DATA-4).
3. **Metadata.**
   - Public pages: `generateMetadata` using `buildPageMetadata` (title, description, canonical, hreflang, OG) (SEO-1…4).
   - Private pages: `robots: { index: false }` (inherited from the group layout) plus a title.
4. **Dynamic segments.**
   - Await `params`; validate IDs/slugs (Zod) and call `notFound()` for invalid or missing data.
   - For public dynamic pages, add `generateStaticParams` when the set is known, and cache the data with `"use cache"` + tags.
5. **States.**
   - `loading.tsx` if the whole route waits on data;
   - the group `error.tsx` already exists (add a route-specific one only if the recovery differs);
   - `not-found` handling.
6. **i18n.** Page namespace keys in every locale, including the `Metadata.<page>` title and description.
7. **SEO extras (public pages).**
   - Add the route to `publicRoutes` in `src/config/routes.ts` (sitemap + llms.txt).
   - Add JSON-LD (`BreadcrumbList`, plus the content type) with `<JsonLd>`.
   - Override the OG image if the page deserves its own.
8. **Navigation.** Link to the page from at least one existing page or menu, using `Link` from `@/i18n/navigation`.
9. **Tests.** An E2E visit in every locale (renders, has `h1`, axe clean). Public pages: assert the canonical and `hreflang` tags exist.

## Verify

`pnpm verify`; `pnpm build` (Cache Components errors surface at build time); view the page in every locale, at mobile width, and with the keyboard. For public pages, run Lighthouse on the preview (SEO 100, Accessibility 100).

## Done when

The page is reachable, localized, accessible, has correct metadata/indexing, and the checks pass.
