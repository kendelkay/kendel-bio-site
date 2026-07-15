# Link-in-Bio Template System

**One engine. Many personalities.**

The renderer (`/index.html`) is a single, never-forked engine. Every creator's
page is defined entirely by a **config variant** (`SITE_CONFIG`). You launch a
creator by **selecting a template**, not by editing HTML.

- Keep one rendering engine (`index.html`).
- Creator-specific content is entirely config-driven.
- Never fork the engine for an individual creator.
- Every improvement becomes a reusable template variant here.

## Catalog — `templates.json`

| ID | Name | Theme | Layout | Funnel |
|----|------|-------|--------|--------|
| V1  | Classic | soft (base) | classic | clean |
| V2  | Social Curiosity | soft (base) | classic | exclusive |
| V3  | Luxury | luxury (gold/black) | luxury | clean |
| V4  | Girlfriend Experience | rose | creator | exclusive |
| V5  | Fitness | charcoal + lime | personal-brand | clean |
| V6  | Cosplay | violet + magenta | creator | clean |
| V7  | Gaming | dark + neon | creator | clean |
| V8  | Minimal | minimal | minimal | clean |
| V9  | VIP | luxury (gold/black) | exclusive | exclusive |
| V10 | Custom Enterprise | indigo | business | clean |

Each variant leans on the engine's built-in **theme presets** (`soft`, `dark`,
`minimal`, `luxury`) and **layout presets** (`classic`, `creator`,
`personal-brand`, `business`, `exclusive`, `minimal`, `luxury`), or supplies its
own palette via `theme.colors` — all config, no engine changes.

## Launch a creator

1. Pick a template from the catalog above.
2. Copy `templates/<id>.config.js` → the creator's `config.js`.
3. Fill in the per-creator fields: `name`/`pageTitle`, `socials`, `links`,
   `tipCard` payment handles, `avatar`/`background` assets, `gtmId`.
4. Set `pageType` (`exclusive` = age-gated, `clean` = SFW). Leave `theme`/`layout`
   as the template sets them, or override any subset.

Blank/missing fields don't render — no empty buttons or spacing. The engine is
never touched; a new personality is always a new config.
