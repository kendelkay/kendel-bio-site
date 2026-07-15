# Link-in-Bio Templates

Reusable config variants for the Link-in-Bio rendering engine (`/index.html`).
The engine is unchanged; each template is just a `SITE_CONFIG` you drop in as a
creator's `config.js`.

## Template V2 — `v2.config.js`

Executive Design Revision, based 1:1 on Kendel Kay's production design (same
engine, same Midnight design language, same components). Only two revisions from
the base:

1. **Hero headline** (`bio`): `what i can't post on other socials 😏`
2. **Support section** (`tipCard`): title `spoil me a little ☕️`, with **Cash App**
   and **Venmo** (via the plug-and-play `payments` map — identical `.matcha-card`
   styling to Kendel's tip card).

Layout is left at the default (classic) order, so the hero headline renders
directly under the name — no layout, spacing, typography, or animation changes.

### Use it for a creator
1. Copy `templates/v2.config.js` → the creator's `config.js`.
2. Fill in the per-creator placeholders: `name` / `pageTitle`, `socials`, `links`,
   the `tipCard.payments` handles (`cashapp`, `venmo`) and optional `referral`,
   and swap `avatar` / `background` assets.
3. Leave `theme` unset to inherit the base design; set `pageType` per funnel
   (`exclusive` for age-gated NSFW, `clean` for SFW).

Blank/missing fields simply don't render — no empty buttons or spacing.
