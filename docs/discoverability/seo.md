# SEO (Search Engine Optimization)

> **Read when:** creating or changing any public (indexable) page, URL, redirect, or content type.
> **See also:** [ai-discoverability.md](ai-discoverability.md) (LLMs and AI search), [i18n.md](i18n.md), [performance.md](../quality/performance.md) (Core Web Vitals affect ranking).

## Building blocks (created at bootstrap)

| Path | Purpose |
|---|---|
| `src/config/site.ts` | `siteConfig`: name, production URL, socials (`sameAs`), default OG image, organization info |
| `src/config/routes.ts` | `publicRoutes`: every indexable static route, which feeds the sitemap and `llms.txt` |
| `src/lib/seo/metadata.ts` | `buildPageMetadata({ locale, pathname, title, description, image?, noIndex? })`: canonical, hreflang, OG, Twitter |
| `src/lib/seo/json-ld.ts` | Typed JSON-LD builders (`schema-dts`): `organizationJsonLd()`, `breadcrumbJsonLd()`, `articleJsonLd()`… |
| `src/components/shared/json-ld.tsx` | `<JsonLd data={…} />`: renders a safe `<script type="application/ld+json">` |
| `src/app/sitemap.ts` | Sitemap with per-locale alternates |
| `src/app/robots.ts` | Crawl rules (search engines + AI bots; see [ai-discoverability.md](ai-discoverability.md)) |
| `src/app/[locale]/(marketing)/opengraph-image.tsx` | Generated default OG image (per-route overrides allowed) |

## Rules

### Metadata

- **SEO-1 (MUST)** Every public page exports `generateMetadata` using `buildPageMetadata`. Titles are unique and descriptive: about 50–60 characters, with the primary topic first, then `| Site name` (set by the root layout's `title.template`). Descriptions are unique and about 140–160 characters.
- **SEO-2 (MUST)** Every public page has a **self-referencing canonical URL** (absolute, production host, no query params except meaningful ones like pagination) and `alternates.languages` for every locale, plus `x-default` pointing at the default locale.
- **SEO-3 (MUST)** Every non-public area is `noindex`: `(app)`, `(auth)`, search results, filtered/sorted variants, previews, error pages. Use `robots: { index: false }` in metadata. Use `robots.txt` `Disallow` only for crawl waste (e.g., `/api/`), never to hide private pages.
- **SEO-4 (MUST)** Open Graph and Twitter metadata on every public page: `og:title`, `og:description`, `og:image` (1200×630, under 8 MB, text readable at small sizes), `og:locale`, `og:url`.
- **SEO-5 (MUST NOT)** Use obsolete tags: `meta keywords`, `rel=prev/next` as an indexing signal, or a `revisit-after` meta.

### URLs and status codes

- **SEO-10 (MUST)** URLs follow NAME-30…32: lowercase, kebab-case, readable, stable. Once published, a URL changes only with a **308** redirect from the old URL (in `next.config.ts` `redirects()`, or a redirects table for many).
- **SEO-11 (MUST)** Missing content returns a real **404** (`notFound()`); permanently removed content returns 410 or redirects to its closest replacement. Never return 200 with an error page.
- **SEO-12 (MUST)** One URL per piece of content: no duplicates through trailing slashes, case, tracking params, or `/en/` vs `/` for the default locale (the proxy redirects).

### Content and structure

- **SEO-20 (MUST)** Main content is **server-rendered HTML**: never client-only-fetched, never behind interactions. Crawlers and AI bots must see it without running JavaScript.
- **SEO-21 (MUST)** One `<h1>` per page matching the page topic, logical `h2`/`h3` sections, descriptive link text, and meaningful `alt` text (these are also a11y rules).
- **SEO-22 (MUST)** Internal links use real `<a href>` (our `Link`), never `onClick` navigation. Every public page is reachable within ~3 clicks from the home page, and listed in the sitemap.
- **SEO-23 (SHOULD)** Pages that target a search topic start from a [SEO page brief](../templates/seo-page-brief.md): intent, primary query, outline, schema type, internal links.
- **SEO-24 (MUST)** Show the published and updated dates on articles, and keep them truthful.

### Structured data (JSON-LD)

- **SEO-30 (MUST)** Add JSON-LD that matches **visible** content, with the `<JsonLd>` component:
  - **Site-wide (root marketing layout):** `Organization` (logo, `sameAs` socials) + `WebSite`.
  - **Pages below the home page:** `BreadcrumbList`.
  - **Blog and articles:** `Article` / `BlogPosting`, with `author` (a `Person` with `url`/`sameAs`), `datePublished` and `dateModified` (ISO 8601 with timezone), `image`.
  - **Product/pricing:** `SoftwareApplication` or `Product`, with `Offer`. Use `AggregateRating` only with real, visible reviews.
  - **Others, as content warrants:** `FAQPage` (semantic value; Google shows its rich results only for limited sites), `VideoObject`, `Event`, `ProfilePage`.
- **SEO-31 (MUST)** Validate new structured data with Google's Rich Results Test and the Schema.org validator before release. Check Google's search gallery: several rich-result types were retired in 2025–2026, so don't add a type for a rich result Google no longer shows unless the semantic value justifies it.
- **SEO-32 (MUST)** JSON-LD is serialized with `<` escaped as `<`, so it can't break out of the script tag. Only the `<JsonLd>` component may use `dangerouslySetInnerHTML`.

### Sitemaps and crawling

- **SEO-40 (MUST)** `src/app/sitemap.ts` lists every indexable URL × locale, with `alternates.languages` and an **accurate** `lastModified` (from content `updatedAt`, not the build time). Dynamic content (blog posts) comes from the DB, cached with tags.
- **SEO-41 (MUST)** Split sitemaps beyond 50,000 URLs (`generateSitemaps`).
- **SEO-42 (MUST)** Production `robots.ts` references the sitemap URL. Preview deployments are `noindex` (Vercel adds `X-Robots-Tag: noindex` on preview URLs; keep it).
- **SEO-43 (SHOULD)** Notify Bing/IndexNow when important content is published or updated (via `after()` in the publish mutation).

### Performance is SEO

- **SEO-50 (MUST)** Public pages meet the Core Web Vitals targets in [performance.md](../quality/performance.md).

## Example

```tsx
// src/app/[locale]/(marketing)/pricing/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.pricing" });
  return buildPageMetadata({ locale, pathname: "/pricing", title: t("title"), description: t("description") });
}
```

## Launch and ongoing

- Verify the domain in Google Search Console and Bing Webmaster Tools, and submit the sitemap. See [pre-launch-checklist.md](../playbooks/pre-launch-checklist.md).
- Monthly: check Search Console coverage errors, Core Web Vitals, and queries with high impressions but low CTR (improve their titles and descriptions).
