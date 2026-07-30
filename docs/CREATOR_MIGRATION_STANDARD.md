# Creator Deployment Standard

The single, repeatable process for putting **any** creator onto the canonical
deployment model. This is not a Brandy process — Brandy is **Migration #001**.
Every future creator uses this exact playbook, and every migration produces a
**Creator Deployment Report** (`docs/migrations/<NNN>-<slug>.md`).

## Canonical model (locked — the destination of every migration)
- **One repository** — `kendelkay/kendel-bio-site`.
- **One renderer** — root `index.html` (carries the Link Runtime). Never forked, never copied per creator.
- **One Vercel project** — the canonical CI project (production branch `main`).
- **One production branch** — `main`. Merge → CI auto-deploys. **Zero manual `vercel --prod`.**
- **Creator = config, resolved by slug/domain** — `/<slug>/config.js` (+ `hero.jpg`/assets, reused `terms.html`/`privacy.html`). Custom domains attach to the canonical project and resolve to the creator.
- **Shared engine assets are absolute** (`/link-runtime.js`); only `config.js` and creator assets are relative, so the runtime loads at every slug path.

---

## 1. Migration Prerequisites
- [ ] Canonical Vercel project confirmed (production branch = `main`, currently serving the runtime).
- [ ] The creator's **final, validated** `config.js` (real handles/URLs; never a draft).
- [ ] All creator **binary assets committed** to the repo (`/<slug>/hero.jpg` or avatar/background) — nothing left "add locally before deploy."
- [ ] The creator's **current live source located** and captured in the report (project, domain, deploy method) so rollback is possible.
- [ ] Domain access in Vercel (to move the custom domain to the canonical project) and DNS as needed.
- [ ] Deployment Protection state known for the target (must be **Disabled (Production)** for a public creator page).

## 2. Migration Sequence
1. Branch off `main`: `feat/creator-migration-<NNN>-<slug>`.
2. Add `/<slug>/config.js` (final config; asset paths **relative**, e.g. `hero.jpg?v=1`). Commit `/<slug>/hero.jpg` (+ any assets). Copy `terms.html`/`privacy.html` into `/<slug>/` (they read the name from config).
3. Add one registry line to root `vercel.json`: `{ "source": "/<slug>", "destination": "/<slug>/" }` (no-slash → trailing-slash). The generic catch-all rewrite already serves the root engine for `/<slug>/`.
4. Run **Verification Gates** (§3). Open a PR; on green, **merge to `main`** → CI deploys the canonical project.
5. In Vercel: **move the creator's custom domain(s)** to the canonical project; set **Deployment Protection = Disabled (Production)**. Do **not** delete the creator's old project yet.
6. Run **Post-Migration Validation** (§6) on the live domain.

## 3. Verification Gates (must pass before merge)
- [ ] `node link-runtime.selfcheck.mjs` green (engine unchanged/healthy).
- [ ] Headless render of `/<slug>/`: correct **name/title**, config is the creator's (spot-check the OnlyFans/support URLs), **no 4xx** on `/<slug>/config.js` or `/link-runtime.js`.
- [ ] `/<slug>/?lrdebug=1` badge shows `loaded: yes`, `build: <current>`.
- [ ] Forced IG-iOS (`__LB_FORCE_ENV`): tapping the age-gated CTA → 18+ → **interstitial appears, destination preserved, no silent open, no loop**.
- [ ] **No regression at `/`** (Kendel) or any existing slug — assets 200, runtime loads.

## 4. Rollback
- Rollback is **domain-level and fast**: re-attach the creator's custom domain to their **previous project** in Vercel (seconds, no data loss). Their last known-good deployment is untouched.
- The migration PR can also be reverted on `main` (the `/<slug>/` folder + one `vercel.json` line) with no effect on other creators.
- **Never delete the old project** until Post-Migration Validation has passed and a stability window (recommend 24–48h) has elapsed. The old project is the rollback anchor.

## 5. Completion Criteria (all true)
- [ ] Creator served by the **canonical CI project** from `main` (no manual deploy in the path).
- [ ] Live domain renders the creator correctly; **runtime present** (badge `loaded: yes`).
- [ ] Age-gated CTA shows the interstitial inside Instagram on a **real device** (or is queued as the Class-B manual QA in the report).
- [ ] Old manual/separate project is decommissioned **or** explicitly retained as the rollback anchor with an end date.
- [ ] **Creator Deployment Report** committed under `docs/migrations/`.

## 6. Post-Migration Validation (on the live domain)
- [ ] Domain status **Valid Configuration** on the canonical project (apex + `www`).
- [ ] Root/creator page renders correct identity, links, support, 18+ modal.
- [ ] `?lrdebug=1` badge: `loaded: yes`, expected `build`, and inside Instagram `embedded=true` → CTA → `intercepted:1 last=fallback`, interstitial visible, **OnlyFans does not silently open**.
- [ ] No regression on any other creator.
- [ ] Report's **rollback state** recorded (old project retained/decommissioned + date).

---

## Required output — Creator Deployment Report
Every migration commits `docs/migrations/<NNN>-<slug>.md` from `docs/migrations/REPORT_TEMPLATE.md`, capturing at minimum: **source · destination · runtime version · deployment project · domain · verification · rollback state**. This is permanent operational documentation.
