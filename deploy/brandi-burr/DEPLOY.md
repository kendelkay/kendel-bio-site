# brandiburr.com — runtime safety hotfix (deploy tonight)

**What this is:** the same static bundle the `brandi-burr` Vercel project already
serves, **now with the Link Runtime included** (`link-runtime.js` + the engine loads
it). Deploying this makes `brandiburr.com` safe: outbound links escape Instagram's
in-app browser (guided interstitial on iOS, Chrome handoff on Android).

**Why a manual deploy:** the `brandi-burr` Vercel project is **Git-disconnected** —
it does not deploy from `main`, so no merge reaches it. It only updates via
`vercel --prod`. (Engineering cannot run this — no Vercel auth in CI/sandbox.)

Verified at the domain root headlessly (8/8): renders "Brandi Burr"; runtime loads
with **no 404**; diagnostic `build lr-diag-1`; forced Instagram-iOS → age-gate →
**interstitial appears, `onlyfans.com/burr_brandi` preserved, no silent open**.

---

## Option 1 — Redeploy this bundle (fastest; keeps the domain where it is)

```bash
# 1) Add the hero photo (not in git) into this folder:
#    deploy/brandi-burr/hero.jpg     # without it, the page uses a color background
cd deploy/brandi-burr

# 2) Link to the EXISTING project (keeps brandiburr.com attached):
vercel link          # select  kendel-kay-s-projects / brandi-burr

# 3) Ship to production:
vercel --prod
```

Then in the Vercel dashboard:
- **brandi-burr → Settings → Deployment Protection → Disabled (Production)**
  (the old bundle noted a 403 from protection — must be off for a public link).

## Verify (do this before sending to Brandi)
1. Desktop Safari/Chrome: open `https://brandiburr.com/?lrdebug=1` → bottom-left badge shows
   `LinkRuntime v1  build lr-diag-1  loaded: yes`. No badge → the deploy didn't land.
2. **Real iPhone, inside Instagram:** DM yourself `https://brandiburr.com/?lrdebug=1`, tap it.
   Badge → `env: instagram / ios  embedded=true`. Tap **"what i can't post on other socials"**
   → 18+ → **the "Open in your browser" interstitial appears** (Copy link / Continue here);
   **OnlyFans does NOT open silently inside Instagram**. Age gate + destination correct. No loop.
3. Confirm the page shows Brandi (hero photo once `hero.jpg` is added, OnlyFans/Cash App/Venmo, 18+ modal).

## Option 2 — Canonical (later, after the Founder URL decision)
Move `brandiburr.com` to the canonical CI project and serve Brandy from `main` via
`/brandy/` + host routing (see `docs/migrations/001-brandy.md` + PR #6). That retires
this manual bundle entirely. Not required tonight.

> This bundle is a **temporary safety bridge**. It duplicates the engine as a static
> export (a Rejected pattern long-term) purely to protect Brandi tonight without a
> domain move. The canonical migration supersedes it.
