# Rebuild plan

Brief: an immersive, animation-led personal site for Apurva Raj that is also a fast, crawlable portfolio and a long-term knowledge hub, hosted on GitHub Pages.

## 1. Creative direction: "Signal from the noise"

Raj's work, from market data to agentic systems to public-health apps, turns large, noisy inputs into structures people can trust. The whole site is one particle field that keeps reorganising itself into the structure each chapter talks about.

- **Field, not decoration.** One WebGL field of light points runs behind the home page. It starts as a scattered galaxy, condenses into a core, becomes a career path, splits into eight skill clusters, settles into a quiet backdrop for projects, and finally converges to a single point at the contact section.
- **Palette.** Midnight `#06080F`, deep navy `#0B1222`, ink `#E8ECF4`, slate `#8D96AA`, signal blue `#5B8CFF`, amber `#FFB547` (used sparingly for "the important point"). Blue is structure, amber is insight.
- **Type.** Archivo (variable width) for display, pushed wide for the name and condensed for numbers; Newsreader for long-form reading and article bodies. Self-hosted.
- **Restraint.** The scene carries the spectacle. Typography, layout and UI chrome stay quiet. Articles get no 3D at all.

## 2. Sitemap

```
/                         home: the immersive story
/projects/                index of case studies
/projects/<slug>/         7 case studies
/experience/              full experience timeline
/about/                   philosophy, principles, background
/insights/                knowledge hub index (articles + learning log)
/insights/<slug>/         article
/insights/category/<c>/   category pages
/insights/tags/<t>/       tag pages
/learning/                learning log (Day 1: storage engines)
/learning/ddia/...        interactive lessons (kept as-is)
/rss.xml  /sitemap-index.xml  /robots.txt  /404.html  /resume.pdf
```

## 3. Home: chapters and motion spec

| # | Chapter | HTML content | Field state | Motion |
|---|---|---|---|---|
| 0 | Hero | Name, positioning, 13+ years, two CTAs | Spiral galaxy with a bright core; cursor pushes particles | Particles condense from scatter (1.6 s) while the name reveals line by line; no loader |
| 1 | Intro | One-paragraph positioning | Galaxy tilts and the core grows | Text fades in |
| 2 | Journey | 7 stages | A rising helix, one coil per stage | Desktop: pinned horizontal track, progress bar; mobile: vertical list |
| 3 | Technical universe | 8 domains, their tools, and where they were used | 8 clusters joined by filaments | Selecting a domain (hover, focus, tap) flies the camera to its cluster and opens its panel |
| 4 | Projects | 7 project panels, each linking to its case study | Flat, dim star plane (backdrop) | Each panel wipes in with a clip-path reveal; numbers are real only |
| 5 | AI & agentic systems | How an agentic workflow runs | Field dims | Interactive SVG: step through LLM → tool → human approval → logged run |
| 6 | Experience | 5 roles (summary) | Field brightens to a grid | Rows reveal |
| 7 | Insights | Latest notes/articles | Grid | Static |
| 8 | Contact | Email, LinkedIn, GitHub, resume | All particles converge into one point | Convergence driven by scroll; CTA is plain HTML |

Easing: `cubic-bezier(.23,1,.32,1)` for entrances, `expo.out` for GSAP text, scroll-scrubbed morphs with a 0.12 lerp. Durations under 1 s for UI, scroll-bound for the scene.

## 4. Architecture

- **Astro (static generation).** Every page is real HTML at build time: best for SEO, GitHub Pages, and direct URL access. Content lives in Markdown/YAML collections, so adding a project or article is a file, not a component.
- **No React.** The 3D and motion are vanilla TypeScript modules loaded as Astro client scripts. This keeps JavaScript small; React Three Fiber would add ~150 KB without a benefit here.
- **three.js + GSAP/ScrollTrigger + Lenis.** One renderer, one canvas, one clock. The scene module is only loaded on the home page.
- **Progressive enhancement.** All content works without JavaScript and without WebGL. Reduced motion: no smooth scroll, no morph drift, no pinning; the field shows a still frame per chapter.
- **Deployment.** GitHub Actions builds the site and publishes it to Pages.

## 5. Content sources and gaps

Sources: the resume doc (Oct 2026), the current site, and what Raj has told Claude about his projects. Nothing is invented; anything missing is left out of the page and listed in `docs/CONTENT-GAPS.md`.
