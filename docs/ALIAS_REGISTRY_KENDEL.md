# Alias Registry — Kendel (canonical)

**Status:** Canonical Alias Registry for Kendel (baseline / rotation #0). This is a
**record and a proposal** — it rotates nothing, deploys nothing, and changes no
production behavior. It is the seed of Midnight's future Link Rotation Engine.

**Scope guardrails honored:** no redesign · destinations unchanged · page content
unchanged · metadata unchanged · analytics unchanged. Only the *public path* is proposed
to rotate; every attribution `src` is preserved verbatim.

---

## How aliases work (the mechanism, for the record)
- `kendel-bio-site/config.js` → `routeMap`: `"<path>": "<attribution_src>"`.
- `index.html` reads `window.location.pathname`; on a match it
  `location.replace(origin + "/?src=" + encodeURIComponent(src) + <existing query>)`.
- So **every alias resolves to the same canonical destination — the root link page `/`** —
  differing only by the `?src=` analytics tag (read by GTM `GTM-M6PJ9FJC`).
- `vercel.json` is a plain SPA rewrite (`/(.*) → /index.html`); there are **no** server
  301/302 redirects. The redirect is client-side.
- **Domain:** not recorded in the repo. Kendel is served by a Vercel project
  (`kendel-bio-site` and/or `link-kendelkay`); the live domain(s) are a Vercel/DNS fact,
  not in git. Full URLs below are written `<kendel-domain>/<path>`.

## Canonical destination
`https://<kendel-domain>/` — the root link page. **One destination; the aliases are
attribution-tagged front doors to it.** (The outbound button destinations — OnlyFans,
Fansly, X, TikTok, YouTube, Amazon, Cash App — are separate and unchanged.)

---

## STEP 1 — Active aliases (13, discovered)
All 13 are present in the canonical `routeMap` → **all config-active**. "Where referenced"
is inferred from the attribution `src` (the channel each is distributed on). Real traffic
usage is analytics data (GTM) not reachable from the sandbox → **usage: unknown**, not asserted.

| # | Full URL | Attribution `src` (destination = `/?src=…`) | Status | Referenced on (inferred) | Active? | Unused? |
|---|---|---|---|---|---|---|
| 1 | `<kendel-domain>/xo` | `instagram_kendelkay` | config-active | Instagram @kendelkay (primary) | Yes | unknown (analytics) |
| 2 | `<kendel-domain>/official` | `instagram_kendelkayofficial` | config-active | Instagram @kendelkayofficial | Yes | unknown |
| 3 | `<kendel-domain>/kk` | `instagram_bykendelkay` | config-active | Instagram @bykendelkay | Yes | unknown |
| 4 | `<kendel-domain>/kendel` | `instagram_kendelkayy` | config-active | Instagram @kendelkayy | Yes | unknown |
| 5 | `<kendel-domain>/ringtoss` | `instagram_ringtossgirl` | config-active | Instagram @ringtossgirl (campaign) | Yes | unknown — campaign, possibly dormant |
| 6 | `<kendel-domain>/diary` | `instagram_kendelkaydiary` | config-active | Instagram @kendelkaydiary | Yes | unknown |
| 7 | `<kendel-domain>/archives` | `instagram_kendelkayarchives` | config-active | Instagram @kendelkayarchives | Yes | unknown |
| 8 | `<kendel-domain>/closet` | `instagram_kendelkaycloset` | config-active | Instagram @kendelkaycloset | Yes | unknown |
| 9 | `<kendel-domain>/model` | `instagram_kendelkay_ai` | config-active | Instagram @kendelkay_ai | Yes | unknown — possibly dormant |
| 10 | `<kendel-domain>/x` | `x_kendelkay` | config-active | X @kendelkay | Yes | unknown |
| 11 | `<kendel-domain>/xx` | `x_bykendelkay` | config-active | X @bykendelkay | Yes | unknown |
| 12 | `<kendel-domain>/tt` | `tiktok_kendelkay` | config-active | TikTok @kendelkay | Yes | unknown |
| 13 | `<kendel-domain>/yt` | `youtube_kendelkay` | config-active | YouTube @kendelkay | Yes | unknown |

## STEP 2 — Reserved aliases (proposed replacements; NOT activated)
**Naming system:** *warm-invitation lexicon* — one lowercase word, invitational/intimate,
matching Kendel's soft brand voice; **no abbreviations, no numbers, no random strings**;
each distinct. The **attribution `src` is the immutable key** (carries analytics); the
visible path is the rotating surface. One-to-one with the active set, `src` preserved.

| # | OLD path | NEW path (reserved) | Attribution `src` (unchanged) |
|---|---|---|---|
| 1 | `/xo` | `/hey` | `instagram_kendelkay` |
| 2 | `/official` | `/hello` | `instagram_kendelkayofficial` |
| 3 | `/kk` | `/hi` | `instagram_bykendelkay` |
| 4 | `/kendel` | `/me` | `instagram_kendelkayy` |
| 5 | `/ringtoss` | `/play` | `instagram_ringtossgirl` |
| 6 | `/diary` | `/pages` | `instagram_kendelkaydiary` |
| 7 | `/archives` | `/saved` | `instagram_kendelkayarchives` |
| 8 | `/closet` | `/fits` | `instagram_kendelkaycloset` |
| 9 | `/model` | `/muse` | `instagram_kendelkay_ai` |
| 10 | `/x` | `/more` | `x_kendelkay` |
| 11 | `/xx` | `/extra` | `x_bykendelkay` |
| 12 | `/tt` | `/clips` | `tiktok_kendelkay` |
| 13 | `/yt` | `/watch` | `youtube_kendelkay` |

*Reserved-pool (spare human words for future rotations, not yet assigned):* `/come-in`,
`/peek`, `/wander`, `/closer`, `/stay`, `/begin`, `/wardrobe`, `/notes`.

## Archived aliases
None yet. After a rotation, the retired OLD paths move here (kept redirecting for a
grace window before removal).

## Rotation history
| Rotation | Date | Change | By |
|---|---|---|---|
| #0 (baseline) | — | registry established; 13 active, 13 reserved | Engineering (proposal) |

---

## STEP 3 — Rotation plan (proposal — DO NOT ROTATE YET)

Per alias: **OLD ↓ NEW** (see the table above). The rotation is one edit to `routeMap`
per pair, `src` preserved.

- **Redirect strategy.** Unchanged mechanism — the new path is a `routeMap` key redirecting
  (client-side `location.replace`) to `/?src=<same attribution>`. No new redirect type; no
  server 301 introduced (would be a redesign — out of scope).
- **Rollback safety.** **Additive-first, two-phase.** Phase A: *add* the NEW keys alongside
  the OLD (both live, same `src`) → deploy → verify. Phase B (later): archive the OLD keys.
  Rollback at any point = revert the `config.js` commit → CI redeploys; because OLD and NEW
  share the same `src`, there is **no analytics discontinuity** and no broken link during
  the grace window.
- **Analytics impact.** **None.** Every `?src=` value is preserved byte-for-byte, so GTM
  attribution is continuous across the rotation. (Distinguishing old-vs-new traffic would
  require changing `src` — deliberately *not* done, per "do not modify analytics.")
- **Production impact.** Adding `routeMap` keys is a `config.js`-only change → one CI deploy
  to take effect. Additive: existing aliases keep working; page content, metadata, styling,
  destinations, and analytics are untouched. Until deployed, a NEW path simply serves the
  root page with no `src` (no error).

## One-click rotation (future engine — spec, not built)
The rotation operation = **swap ACTIVE ↔ RESERVED in `routeMap`, `src` fixed**, executed
additive-first (add NEW → grace window → archive OLD), with a recorded rotation-history
entry and a one-commit revert as rollback. This registry's shape (canonical destination ·
active · reserved · archived · history · rotation op) is the data model that engine consumes.

---

*Canonical Alias Registry for Kendel — baseline. Amend additively. Nothing here rotates,
deploys, or changes production; activation is a separate, approved step.*
