# Design skills for this repo

Installed 2026-11-20 as project skills; Claude Code loads them when working in this repo. Copied from upstream (tests removed from ui-ux-pro-max), with the local changes listed below.

| Skill | Source | Commit | License |
|---|---|---|---|
| ui-ux-pro-max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | 2de1134 | MIT |
| taste-skill | github.com/Leonxlnx/taste-skill | f6b7657 | MIT |
| emil-design-eng | github.com/emilkowalski/skills | 64eb3de | MIT |
| apple-design | github.com/emilkowalski/skills | 64eb3de | MIT |
| web-design-guidelines | github.com/vercel-labs/agent-skills | 1a2c79d | MIT |
| react-best-practices | github.com/vercel-labs/agent-skills | 1a2c79d | MIT |

Local changes after a security review (2026-11-20):
- impeccable removed: its engine is a binary downloaded on first run that cannot be reviewed, and it asks for an account sign-in.
- taste-skill: the automatic Stop hook (scripts/gate.mjs on every turn end) was removed from SKILL.md. Run `node .claude/skills/taste-skill/scripts/gate.mjs <page>` by hand when you want the check. Its photo and icon scripts can still download from Wikimedia Commons, picsum.photos and cdn.jsdelivr.net.
- web-design-guidelines: fetched rules no longer override the user's instructions.
