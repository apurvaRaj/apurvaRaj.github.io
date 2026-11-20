# Design skills for this repo

Installed 2026-11-20 as project skills; Claude Code loads them when working in this repo. Copied unchanged from upstream (tests removed from ui-ux-pro-max).

| Skill | Source | Commit | License |
|---|---|---|---|
| ui-ux-pro-max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | 2de1134 | MIT |
| taste-skill | github.com/Leonxlnx/taste-skill | f6b7657 | MIT |
| impeccable | github.com/pbakaus/impeccable | b49177d | Apache-2.0 |
| emil-design-eng | github.com/emilkowalski/skills | 64eb3de | MIT |
| apple-design | github.com/emilkowalski/skills | 64eb3de | MIT |
| web-design-guidelines | github.com/vercel-labs/agent-skills | 1a2c79d | MIT |
| react-best-practices | github.com/vercel-labs/agent-skills | 1a2c79d | MIT |

Notes:
- impeccable runs a self-contained binary that it downloads on first use (checksum-pinned in scripts/engine-checksums.txt).
- web-design-guidelines fetches its current rule list from vercel-labs/web-interface-guidelines each time it runs.
- taste-skill's photos script can pull images from Wikimedia Commons and picsum.photos.
