# Launch audit — 20 Nov 2026

Measured on the production build (`npm run build`), served statically, in headless Chromium with software WebGL (SwiftShader). Real GPUs render the scene faster than this environment, so performance numbers here are conservative.

## Lighthouse 13.6

| Page | Device | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|
| Home | Mobile (simulated 4G, 4× CPU) | 92 | 100 | 100 | 100 |
| Home | Desktop | 98 | 100 | 100 | 100 |
| Case study (FidelFolio) | Mobile | 100 | 100 | 100 | 100 |
| Case study (FidelFolio) | Desktop | 100 | 100 | 100 | 100 |
| Insights | Mobile | 100 | 100 | 100 | 100 |
| Insights | Desktop | 100 | 100 | 100 | 100 |

Home on mobile: LCP 1.4 s, CLS ≈ 0, TBT 350 ms (the WebGL scene initialising after the page is idle).

Fixes made during the audit:
- The hero entrance moved from JavaScript to CSS, so the name paints immediately (mobile LCP 5.6 s → 1.4 s).
- The 3D field now starts after load, when the main thread is idle.
- Breadcrumbs were hidden from assistive tech while containing focusable links; they are now a real `nav` landmark.

## Performance design

- three.js (~150 KB gzipped) loads only on the home page, after first paint, via a dynamic import.
- Particle count adapts: 32,000 desktop, 20,000 on 4-core devices, 11,000 on phones. Pixel ratio capped at 2 (1.5 on phones); it drops automatically if frames run long.
- Rendering pauses when the tab is hidden. One clock (GSAP ticker) drives Lenis, ScrollTrigger and WebGL.
- Fonts are self-hosted, subset by Unicode range, `font-display: swap`.
- Inner pages ship almost no JavaScript (navigation state and diagram reveal only).

## Accessibility and progressive enhancement

| Check | Result |
|---|---|
| Keyboard | Skip link, nav, hero CTAs, all 8 skill domains, case-study links, AI workflow steps and contact links reachable in order, with visible focus rings |
| Screen readers | One `h1` per page; canvas is `aria-hidden`; diagrams have a caption and a text list of their connections; skill and AI panels use `aria-pressed` and `aria-live` |
| Reduced motion | No smooth scroll, no pinning, no particle drift or intro; the field snaps per chapter; journey becomes a vertical list |
| No WebGL | Canvas hidden, background gradient instead; every interaction still works |
| No JavaScript | All content readable: journey stacks vertically, projects visible, links work |
| Touch and small screens | Tested at 390 × 844 and 820 × 1180; mobile nav trimmed; floating 3D labels hidden on small screens (the list remains) |
| Contrast | Body text ≥ 4.5:1 on the midnight background; text over the scene sits where the field is dim, with a text shadow on phones |

## SEO

- Static HTML for every page; all professional content, project text, headings and links are crawlable.
- Unique title (≤ 70 characters) and meta description per page; canonical URLs; trailing-slash URLs that match GitHub Pages.
- Open Graph and Twitter cards with a 1200 × 630 image.
- JSON-LD: Person, WebSite, ProfilePage (home, about), BreadcrumbList (inner pages), CreativeWork (case studies), ItemList (projects), Article (articles, when published).
- `sitemap-index.xml` (21 URLs, excludes 404 and drafts), `robots.txt`, RSS at `/rss.xml`, custom 404.
- Empty category pages are `noindex` until they have articles.
- Internal links: case studies ↔ experience ↔ skill domains ↔ home; no broken internal links across 24 HTML files.

## Deployment

- `.github/workflows/deploy.yml` builds with Node 22, checks that key files exist, and publishes with the official Pages actions.
- Requires **Settings → Pages → Source: GitHub Actions** (one-time).
- Custom domain and analytics/verification IDs are repository variables; see README.

## Known limits and next steps

- Case studies have no screenshots yet (see CONTENT-GAPS.md).
- No articles are published yet; the hub is ready for them.
- Cross-browser: tested in Chromium. Safari and Firefox use the same standard WebGL2 and CSS; give the site a quick look in both after launch.
