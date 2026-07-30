# Incident — Platform Deployment Integrity (2026-07)

**Status:** Closed (Engineering). Remaining work is a **Founder Product Decision**
(creator URL model), not engineering.

## Summary
A P0 "creator links open OnlyFans inside Instagram's in-app browser" surfaced a
deeper problem: creator link deployments had **fragmented** — no single canonical
deployment path. A protection (the Link Runtime) cannot protect systems it never
reaches. Engineering built the runtime, proved the reach problem, standardized the
deployment model, and separated the remaining product decision.

## Root cause
Creator deployments fragmented across **CI deployments, manual deployments,
divergent branches, separate Vercel projects, and separate production branches**.
The Link Runtime was merged only to `main`, but live creator domains deploy from
other branches / a manual bundle, so the fix reached no confirmed live creator
domain.

## Key facts established (from git / GitHub — Vercel-config cells were Ops reads)
- **Repos:** `kendelkay/kendel-bio-site` (bio platform), `kendelkay/OTGAgency.io`
  (separate Next.js portal). No `brandiburr` repo in the account.
- **Runtime presence (git):** the Link Runtime exists only on `main` (+ in-flight
  branches). **Absent** from `kendel-prod`, `template-v2`, and the Brandy branch.
- **Vercel projects evidenced:** `kendel-bio-site` (CI), `link-kendelkay` (CI),
  `brandi-burr` (**separate, Git-disconnected, manual `vercel --prod`** from a static
  bundle serving `brandi-burr.com` / `www.brandiburr.com`).
- **CI bypass:** the `brandi-burr` project — a hand-assembled static bundle
  (`dist/brandi-burr-production-final/`) with a locally-added `hero.jpg` not in git;
  its `index.html` predates and lacks the runtime.
- **Docs vs. reality:** the Brandy branch `DEPLOYMENT.md` claimed "no separate
  project, served at `/brandy/`"; the shipped `README-DEPLOY.txt` said the opposite
  ("existing `brandi-burr` Vercel project, domain root"). The `/brandy/` routing was
  never on `main`.

## Engineering delivered (repo `kendel-bio-site`)
- **Link Runtime** (canonical outbound-navigation layer, incl. Instagram/embedded
  browser escape) — PR #2; refined to the two-abstraction, frozen-interface design
  (Destination + Environment Provider).
- **Evidence-based platform truth:** iOS cannot be forced out of the in-app browser
  from a web page; escape is a guided flow, not a forced redirect. iOS escape is
  manual-QA (Class B), never claimed as automated.
- **Production execution diagnostic** — PR #4 (merged); generalized into the reusable
  **Midnight Diagnostics** framework (PR #5, frozen pending priority).
- **Platform fix:** the shared runtime asset now loads from an absolute path so it
  works at any path depth — PR #7 (**merged**, `main` @ `d5a9154`).
- **Creator Deployment Standard** — the canonical, repeatable migration playbook +
  Creator Deployment Report; Migration #001 (Brandy) executed at the repo level and
  verified — PR #6 (**frozen candidate**, pending the URL decision).

## Canonical deployment model (locked)
One repository · one renderer · one Vercel project · one production branch (`main`) ·
one CI pipeline · creator configuration resolved by slug/domain · **zero** manual
creator deployments · **zero** creator-specific renderer forks.

## Open — Founder Product Decision (next work item gate)
Select the canonical creator URL model (A / B / C) — see
[`../CREATOR_IDENTITY_AND_ADDRESS_STRATEGY.md`](../CREATOR_IDENTITY_AND_ADDRESS_STRATEGY.md).
No engineering proceeds on creator routing until the model is selected.

## Ops actions still required to finish Migration #001 (post-decision)
Confirm the canonical Vercel project; commit `hero.jpg`; move the `brandiburr.com`
domains to the canonical project; disable Deployment Protection; run the real-device
Instagram validation; retire the manual `brandi-burr` project once stable (it remains
the rollback anchor until then).

## Related PRs (kendel-bio-site)
- #2 Link Runtime · #3 iOS interstitial (frozen) · #4 diagnostic (merged) ·
  #5 Midnight Diagnostics (frozen) · #6 Creator Deployment Standard + Migration #001
  (frozen candidate) · #7 absolute runtime path (merged).
