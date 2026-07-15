# Brandy — Production Deployment (Template V2)

**One deployment · one engine · unlimited creator configs.** Brandy is served by
the **single existing `kendel-bio-site` deployment** at the path **`/brandy/`**,
rendered by the **one root engine** (`../index.html`) from her own config. No new
Vercel project, no engine change, no new template, no duplicated HTML, no fork,
no redesign.

> A separate Vercel project is explicitly **not** the target and is not used here.
> If a same-deployment path ever proved slower to launch than a throwaway project,
> a temporary project would be the only fallback — it wasn't needed: `/brandy/` on
> the one deployment is validated and ready.

Brandy is **not** hardcoded as a special case — she is **registry entry #1** of
the generic creator-routing model in `../ROUTING.md` (the locked temporary
architecture). Adding `/kendel/ /jade/ /alexis/ …` later is one folder + one
redirect line each, evolving toward data-driven `/<slug>/` resolution with the
same URLs. The engine is **never edited**.

---

## How one engine serves every creator (validated)

Routing is pure config in the root `../vercel.json` — a generic catch-all plus a
one-line-per-creator redirect registry (no Brandy-specific rewrite):

```
/            → root index.html + root config.js    → Kendel
/brandy/     → root index.html + /brandy/config.js → Brandy   (generic catch-all rewrite)
/brandy      → 307 redirect → /brandy/                        (registry line; makes relative paths resolve)
/brandy/*    → static files served directly (filesystem is checked BEFORE rewrites)
```

Verified with a Vercel-accurate mock (redirects → filesystem → rewrites) + headless render:

| URL | Result |
|---|---|
| `/` | ✅ Kendel renders ("kendel kay", matcha tip) — **no regression** |
| `/brandy/` | ✅ Brandy renders ("brandy", hero + support locked copy) |
| `/brandy` | ✅ 307 → `/brandy/` |
| `/brandy/config.js` | ✅ served as `application/javascript` — **not** swallowed by the rewrite |

---

## Template V2 → engine audit (verified)

Every field Brandy's config uses is consumed by the one engine. Rendered
headlessly (mobile 430px) and asserted:

| Field | Result |
|---|---|
| `pageTitle` / `name` = "brandy" | ✅ |
| `pageType: "exclusive"` → age gate armed | ✅ |
| `bio` (locked hero) | ✅ "what i can't post on other socials 😏" |
| `tipCard.title` (locked support) | ✅ "spoil me a little ☕️" |
| `tipCard.payments.cashapp` / `.venmo` (built-in labels) | ✅ wired (hidden until href set) |
| `links[]` OnlyFans/Fansly (`ageGate:true` → 18+ modal) | ✅ wired (hidden until href set) |
| `socials{}` | ✅ wired (hidden until href set) |
| `background` (video → color fallback `#f3ebe7`) | ✅ |
| `avatar` | ✅ wired (asset absent → needs Brandy photo) |
| `footerLinks` terms/privacy | ✅ (name-agnostic, reused verbatim) |
| theme/layout omitted → `soft` + `classic` | ✅ Midnight design language inherited 1:1 |

Only the two locked V2 revisions differ from the base. Typography, spacing, glass
buttons, and animations are identical to Kendel's live site. Mobile-first.

---

## Operator inputs — reduced to FOUR

Everything else is autonomous. To go live, supply only:

| # | Input | Sets |
|---|---|---|
| 1 | **OnlyFans URL** | `links[0].href` |
| 2 | **Cash App** (handle or full URL) | `tipCard.payments.cashapp` |
| 3 | **Venmo** (handle or full URL) | `tipCard.payments.venmo` |
| 4 | **Avatar** (photo) | `brandy/avatar.jpg` |

Optional (autonomous defaults if omitted): Fansly link → hidden; socials → hidden;
background → color fallback `#f3ebe7`; GTM → analytics off. Blank/missing fields
never render — no empty buttons or spacing.

These four are intentionally left blank rather than guessed: a dead or mis-routed
tip/CTA link is a production defect.

---

## Deployment bundle (this folder)

```
brandy/
  config.js     ← Brandy's V2-based config (valid JS; both locked revisions preserved)
  terms.html    ← reused verbatim (reads creator name from config at runtime)
  privacy.html  ← reused verbatim
  DEPLOYMENT.md ← this file
  avatar.jpg    ← supplied by operator (input #4)
  background.mp4← optional (color fallback otherwise)
../vercel.json  ← single-deployment routing (Kendel at /, Brandy at /brandy/)
../index.html   ← the ONE engine (unchanged)
```

---

## Deployment sequence (autonomous, runs the moment the 4 inputs land)

1. Add `avatar.jpg` to `brandy/`; set the 3 hrefs in `brandy/config.js`
   (OnlyFans, Cash App, Venmo). Normalize handles → full URLs
   (`https://cash.app/$<h>`, `https://venmo.com/u/<h>`).
2. `node --check brandy/config.js`.
3. Re-render `/brandy/` headlessly; confirm every CTA/tip link resolves to a live 200.
4. Commit + push; the single `kendel-bio-site` deployment publishes `/brandy/`.
5. Post-deploy smoke test on mobile: hero + support copy; age-gate opens before
   OnlyFans; each tip/CTA opens the correct live destination.
6. Return the live production URL: `https://<production-domain>/brandy/`.

No step touches the engine, the Template Library, or Kendel's config/render.
