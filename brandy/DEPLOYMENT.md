# Brandy — Production Deployment (Template V2)

**One engine · one template library · config-driven.** Brandy reuses the
production engine (`../index.html`) and **Template V2 "Social Curiosity"**
unchanged. No engine change, no new template, no redesign, no fork.

This folder is a **Phase-1 interim deployment** per `../ARCHITECTURE.md`: a
self-contained bundle that reuses the byte-identical engine. When the Phase-2
resolution layer lands, Brandy moves to a URL-resolved config on the single
platform and this folder retires. The engine is **never edited** here — any
engine fix propagates from the root `index.html`.

---

## 1. Template V2 → engine audit (verified)

Every field Brandy's config uses is consumed by the production engine. Rendered
headlessly (mobile 430px) and asserted:

| Field | Engine path | Result |
|---|---|---|
| `pageTitle` / `name` = "brandy" | `document.title`, `buildName()` | ✅ renders |
| `pageType: "exclusive"` | `IS_CLEAN=false` → `AGE_GATE_ENABLED=true` | ✅ age gate armed |
| `bio` (locked hero) | `buildBio()` → `.bio-text` under name (classic order) | ✅ "what i can't post on other socials 😏" |
| `tipCard.title` (locked support) | `buildTipCard()` → `.matcha-title` | ✅ "spoil me a little ☕️" |
| `tipCard.payments.cashapp` / `.venmo` | `PAYMENT_REGISTRY` → built-in "cash app" / "venmo" labels | ✅ wired (hidden until href set) |
| `links[]` (OnlyFans/Fansly, `ageGate:true`) | `buildLinks()` → routes via 18+ modal | ✅ wired (hidden until href set) |
| `socials{}` | `buildSocials()` | ✅ wired (hidden until href set) |
| `background` (video → color fallback) | `resolveBackground()` | ✅ falls back to `#f3ebe7` when asset absent |
| `avatar` | `buildAvatar()` | ✅ wired (asset absent → needs Brandy photo) |
| `footerLinks` (terms/privacy) | `buildFooter()` | ✅ renders |
| `ageGate` copy | modal text nodes | ✅ "Sensitive Content" |
| theme/layout | omitted → `soft` theme + `classic` layout | ✅ inherits Midnight design language 1:1 |

**Design integrity:** no `theme`/`layout`/`vars` overrides → identical typography,
spacing, glass buttons, and animations as Kendel's live site and Template V2.
Only the two locked V2 revisions differ from the base. Mobile-first (the engine's
430px breakpoint governs).

---

## 2. Required configuration fields — status

| Field | Required? | Status |
|---|---|---|
| `name` / `pageTitle` | yes | ✅ "brandy" |
| `pageType` | yes | ✅ exclusive |
| `bio` (hero) | locked | ✅ set |
| `tipCard.title` | locked | ✅ set |
| `tipCard.payments.cashapp` | **yes** | ⛔ **blank — operator handle needed** |
| `tipCard.payments.venmo` | **yes** | ⛔ **blank — operator handle needed** |
| `links[0].href` (OnlyFans) | **yes** | ⛔ **blank — operator URL needed** |
| `links[1].href` (Fansly) | optional | ⛔ blank (omit if unused) |
| `avatar.jpg` asset | **yes** | ⛔ **missing — Brandy photo needed** |
| `background.mp4` asset | optional | ⛔ missing (color fallback works without it) |
| `socials{}` | optional | ⛔ blank (auto-hides) |
| `gtmId` | optional | — omitted (no analytics until provided) |
| `footerLinks` | yes | ✅ terms + privacy (reusable, name-agnostic) |

Blank/missing optional fields **do not render** — no empty buttons or spacing.
Blank **required** fields are intentionally left empty (never guessed): a dead or
mis-routed tip/CTA link is a production defect.

---

## 3. External dependency validation

| Dependency | Where | Status |
|---|---|---|
| Google Fonts (Poppins) | engine `<head>` | ✅ 200 |
| `themidnightcreator.com` (referral signature, platform default) | engine footer mark | platform default, present on Kendel's live site too |
| Cash App / Venmo / OnlyFans / Fansly destinations | Brandy's links | ⏳ **cannot validate until real URLs provided** (sandbox proxy blocks these hosts; validate against the live handles at deploy time) |

---

## 4. Deployment bundle (this folder) — ready

```
brandy/
  index.html    ← engine, BYTE-IDENTICAL to root (sha256 verified, never edited)
  config.js     ← Brandy's V2-based config (valid JS, node --check passes)
  terms.html    ← reused verbatim (reads creator name from config at runtime)
  privacy.html  ← reused verbatim
  vercel.json   ← SPA rewrite → index.html
  avatar.jpg    ← MISSING (operator asset)
  background.mp4← MISSING (optional; color fallback otherwise)
```

---

## 5. Exact deployment sequence (run when assets land)

1. Drop `avatar.jpg` (and optional `background.mp4`) into `brandy/`.
2. Fill the 3 required hrefs in `brandy/config.js`:
   - `tipCard.payments.cashapp` → `https://cash.app/$<handle>`
   - `tipCard.payments.venmo`   → `https://venmo.com/u/<handle>`
   - `links[0].href` (OnlyFans) → `https://onlyfans.com/<handle>`
   (Fansly + socials + gtmId optional.)
3. Validate: `node --check brandy/config.js`.
4. Re-render preview and confirm every CTA/tip/social link resolves to a live 200.
5. Deploy the `brandy/` folder as its own Vercel project (root directory =
   `brandy/`), attach Brandy's domain.
6. Post-deploy smoke test on mobile: hero + support copy, age-gate modal opens
   before OnlyFans, every tip/CTA opens the correct destination.

No step touches the engine, the Template Library, Kendel's live config, or `main`.

---

## 6. Remaining blockers → one operator action each

| # | Blocker | Single operator action |
|---|---|---|
| 1 | Cash App link blank | Send Cash App handle → I set `cashapp` |
| 2 | Venmo link blank | Send Venmo handle → I set `venmo` |
| 3 | OnlyFans link blank | Send OnlyFans URL → I set `links[0].href` |
| 4 | Avatar missing | Send Brandy's photo → I add `avatar.jpg` |
| 5 | Background missing (optional) | Send video/image, OR say "use color fallback" |
| 6 | Deploy target confirm | Confirm Brandy ships from `kendel-bio-site` (recommended) as her own Vercel project |
| 7 | Fansly / socials / GTM (optional) | Send any you want live, or "skip" |
