# Updating the site

Everything below is a file edit followed by a push to `main`. The site rebuilds and publishes in about two minutes.

## Add an article

1. Copy `src/content/insights/article-template.md` to a new file, for example `src/content/insights/designing-agentic-workflows.md`. The file name becomes the URL: `/insights/designing-agentic-workflows/`.
2. Fill in the frontmatter:

   ```yaml
   title: "Designing agentic workflows people can trust"
   description: "One or two sentences. This is also the Google snippet and the social preview text."
   date: 2026-12-01
   category: ai-agents-llm   # one of the keys in src/config/categories.ts
   tags: [agents, mcp, human-in-the-loop]
   draft: false
   ```
3. Write the body in Markdown. Use `##` and `###` headings; the table of contents, reading time, related articles, RSS entry, sitemap entry and Article structured data are generated for you.

Keep `draft: true` while writing; drafts are never built.

## Add a project case study

1. Copy an existing file in `src/content/projects/`. The file name is the URL.
2. Update the frontmatter. `order` sets its position on the home page and the projects page.
3. The architecture diagram is optional. Nodes sit on a 1000 × 520 board:

   ```yaml
   diagram:
     caption: "What the diagram shows, in one sentence."
     nodes:
       - { id: api, label: "Public API", x: 300, y: 260, kind: process }   # kinds: source, process, store, surface, actor, ledger
       - { id: db,  label: "Database",   x: 600, y: 260, kind: store }
     edges:
       - [api, db, "writes"]   # [from, to, optional label]
   ```
4. Write the body with these sections: Overview, The problem, The technical challenge, Architecture and solution, My role, Key engineering decisions.
5. To link it from a role, add its file name (without `.md`) to `projects:` in that role's file in `src/content/experience/`.

## Add a learning-log day

1. Put the lesson page in `public/learning/` (for example `public/learning/ddia/ch05-replication.html`). Link back with `../index.html` or `/learning/`.
2. Add `src/content/learning/day-02-replication.md`:

   ```yaml
   day: 2
   title: "Replication"
   description: "What the lesson covers."
   date: 2026-11-21
   href: /learning/ddia/ch05-replication.html
   topics: [Leaders and followers, Replication lag]
   exercises: []
   ```

## Update a role, skills or the journey

- Roles: `src/content/experience/*.md`.
- Skill domains and journey stages on the home page: `src/config/home.ts`.
- Name, headline, email and social links: `src/config/site.ts`.

## Regenerate the resume PDF and social image

Edit `tools/resume.html` or `tools/og.html`, then:

```bash
pip install playwright && playwright install chromium
python3 tools/make-assets.py
```

## Add a photo

Put a square photo at `public/images/apurva-raj.jpg` (at least 600 × 600) and replace the monogram block in `src/pages/about.astro` with:

```astro
<img class="portrait" src="/images/apurva-raj.jpg" alt="Apurva Raj" width="200" height="200" />
```
