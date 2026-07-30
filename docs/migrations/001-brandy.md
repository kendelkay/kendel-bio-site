# Creator Deployment Report — #001 Brandi Burr

Produced by the [Creator Deployment Standard](../CREATOR_MIGRATION_STANDARD.md). Migration #001 — the first execution of the standard.

| Field | Value |
|-------|-------|
| **Migration #** | 001 |
| **Creator** | Brandi Burr |
| **Slug** | `/brandy/` |
| **Date** | 2026-07-30 |
| **Source (from)** | Vercel project **`brandi-burr`** (separate, **Git-disconnected**) · manual **`vercel --prod`** from `dist/brandi-burr-production-final/` on branch `claude/brandy-template-v2-deploy-44mli6` · **no Link Runtime** in the bundle |
| **Destination (to)** | canonical Vercel project (**PENDING Ops confirm** — `kendel-bio-site` or `link-kendelkay`) · repo `kendelkay/kendel-bio-site` · branch `main` · slug `/brandy/` |
| **Runtime version** | `lr-diag-1` (present on `main`; loads on `/brandy/` via absolute `/link-runtime.js`) |
| **Deployment project** | **PENDING (Ops)** — the canonical project (prod branch = `main`) |
| **Domain(s)** | `brandiburr.com`, `www.brandiburr.com` (tested); `brandi-burr.com` per the bundle README — **confirm which are attached to the `brandi-burr` project** and move all to canonical |
| **Production commit** | after this PR merges to `main` |
| **Verification** | **repo gates PASS** — `link-runtime.selfcheck` 23/23; `/brandy/` headless 11/11 (renders "Brandi Burr" from `/brandy/config.js`, runtime loads with no 4xx, `build lr-diag-1`, forced IG-iOS interstitial appears + destination `onlyfans.com/burr_brandi` preserved, no silent open; Kendel `/` no regression). **Live + real-device: PENDING (Ops)** |
| **Rollback state** | `brandi-burr` project **retained as the rollback anchor** (its last manual deploy is untouched); decommission only after live validation + 24–48h stable |

## Assets committed
- [x] `/brandy/config.js` (final production config — real OnlyFans `burr_brandi`, Cash App `$brandiburr`, Venmo `Brandi-Burr-51`, IG/TikTok/Snap; asset paths relative)
- [ ] `/brandy/hero.jpg` — **BLOCKER (Ops): the hero photo is not in git** (the manual bundle added it locally). Until committed, `/brandy/` falls back to the color background. Supply the photo to complete.
- [x] `/brandy/terms.html` + `/brandy/privacy.html` (reused root pages)

## Verification gates (repo) — PASS
- [x] self-check 23/23 · [x] `/brandy/` render + no 4xx · [x] diagnostic badge `lr-diag-1` · [x] forced IG interstitial + destination preserved · [x] no regression at `/`

## Post-migration validation (live) — PENDING (Ops)
- [ ] `brandiburr.com` domains show **Valid Configuration** on the canonical project
- [ ] root renders **Brandi Burr** (hero photo once committed, OnlyFans/Cash App/Venmo, 18+ modal first)
- [ ] `brandiburr.com/?lrdebug=1` → `loaded: yes`, `build lr-diag-1`; inside Instagram `embedded=true` → CTA → `intercepted:1 last=fallback`, interstitial visible, **no silent OnlyFans**
- [ ] **Deployment Protection = Disabled (Production)** (the bundle noted a 403 from protection)
- [ ] no regression on Kendel

## Notes / Ops handoff (to finish Migration #001)
1. **Confirm the canonical project** (A) — which of `kendel-bio-site` / `link-kendelkay` has production branch `main`. That becomes the destination project.
2. **Commit `hero.jpg`** (B) into `/brandy/`.
3. Merge this PR → CI deploys the canonical project.
4. In Vercel: **move `brandiburr.com` + `www` (+ `brandi-burr.com`)** from the `brandi-burr` project to the canonical project; **disable Deployment Protection** for production.
5. Run the live validation above; on pass, retire the `brandi-burr` project (or keep dormant as anchor with an end date).

## Domain-resolution note
This ports Brandy at the **slug path `/brandy/`** (the validated `ROUTING.md` model). For `brandiburr.com`'s **root** to serve Brandy, attach the domain to the canonical project with a host rule/redirect to `/brandy/` — author + verify that host rewrite on a Vercel **preview** before production (host-based rewrites can't be verified off-Vercel). The slug page itself is fully verified here.
