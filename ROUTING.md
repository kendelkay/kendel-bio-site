# Creator Routing — Locked Temporary Production Architecture

**Status:** locked interim (Phase-1). One deployment, one engine, per-creator
config resolved by URL path. This is the **first implementation of a future
dynamic creator-routing system** — kept manual and minimal on purpose.

```
/<creator-slug>/
   ↓  serve the ONE root engine (index.html)
   ↓  engine loads /<creator-slug>/config.js   (relative to the path)
   ↓  resolve template + theme + funnel from that config
Render
```

- **Today (manual):** each creator is a folder `/<slug>/` holding `config.js`
  (+ avatar/background, reusing `terms.html`/`privacy.html`). The engine is
  never copied or edited — the root `index.html` renders every creator.
- **Tomorrow (same URLs, data-driven):** `/kendel/ /brandy/ /jade/ /alexis/ …`
  become records, not folders — the resolution layer maps a slug to a stored
  `SITE_CONFIG` (edge config / KV), no per-creator files, no `vercel.json` edit.
  The URL shape does not change, so nothing launched today has to move.

Brandy is **not** hardcoded as a special case — she is simply **registry entry
#1**. Kendel stays at `/` for now (her live root deployment) and can move to
`/kendel/` when the registry generalizes.

---

## The creator registry (manual, today)

Routing lives entirely in `vercel.json` and is generic:

```jsonc
{
  "redirects": [
    // one line per creator: no-slash → trailing-slash so the engine loads
    // /<slug>/config.js instead of the root config. THIS is the manual registry.
    { "source": "/brandy", "destination": "/brandy/" }
  ],
  "rewrites": [
    // generic catch-all: unmatched paths render the one engine. Static files
    // under /<slug>/ (config.js, avatar, terms/privacy) are served directly by
    // the filesystem BEFORE rewrites, so they are never swallowed.
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Add a creator (until the dynamic layer exists) — 2 steps
1. Create `/<slug>/config.js` from a template (e.g. `templates/v2.config.js`)
   plus the creator's `avatar` (and optional `background`). Reuse the root
   `terms.html`/`privacy.html` by copying them in (they read the name from
   config at runtime — no per-creator edit).
2. Add one redirect line: `{ "source": "/<slug>", "destination": "/<slug>/" }`.

No engine change. No new deployment. No duplicated HTML.

---

## Verified invariants (mock of Vercel routing + headless render)

| URL | Expectation | Result |
|---|---|---|
| `/` | Kendel (root config) | ✅ |
| `/xo` (Kendel vanity route) | root engine + routeMap redirect | ✅ `?src=…` |
| `/brandy/` | Brandy (her config, hero + support locked copy) | ✅ |
| `/brandy` | 307 → `/brandy/` | ✅ |
| `/brandy/config.js` | served as `application/javascript` | ✅ not swallowed |

---

## Reducing operator input (direction: zero fields beyond the launch package)

Each creator's page should be a pure render of their **launch package** — the
creator's own assets/handles — with no separate engineering questions. Progress:

- **Autonomous defaults:** template, theme, layout, funnel copy, legal pages,
  age-gate copy, routing — all preset. Optional fields (Fansly, socials,
  background, GTM) self-hide/fall back when omitted.
- **Flexible inputs:** payment fields accept a bare handle *or* a full URL
  (normalized to `https://cash.app/$…` / `https://venmo.com/u/…`).
- **Single drop:** a creator launches from one launch-package hand-off, not a
  Q&A. For Brandy that package is exactly four items — see `brandy/DEPLOYMENT.md`.

The remaining inputs are the creator's **own** data (links + photo); they can't
be defaulted, only sourced from the launch package. When the intake/launch
system feeds those in, required operator fields reach **zero**.
