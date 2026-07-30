# Creator Identity & Address Strategy

Permanent platform documentation. This decides more than URLs — it defines creator
**identity**, public **address**, **deployment architecture**, and **ownership
model**.

## Ownership boundary (permanent)
> Engineering establishes the consequences; the Founder selects the product
> direction. This decision does not belong to Engineering — its responsibility is
> complete. The model selection is a **Founder Product Decision**.

## Candidate models
- **A — Dedicated domain root:** public URL = creator's own domain root
  (`brandiburr.com/`); each creator conceived as a standalone site.
- **B — Shared platform slug:** public URL = platform domain + path
  (`platform.example/brandy/`); one deployment, creators are paths.
- **C — Custom domain → shared internal routing:** public URL = creator's own
  domain root (`brandiburr.com/`), internally one CI engine resolves the creator by
  host/slug.

## Engineering Assessment (consequences only — no recommendation)

| Dimension | A — Dedicated domain | B — Shared slug | C — Custom domain → shared routing |
|---|---|---|---|
| Branding / identity | Own domain | Platform slug (weak creator identity) | Own domain |
| SEO | Own authority | Platform owns authority; creator is a subpath | Own authority |
| Maintainability | Low if separate sites (N engines) | High (one engine) | High (one engine) |
| Deployment | Fragmentation risk | One CI pipeline | One CI pipeline |
| Ownership / portability | Creator owns domain | Locked to platform URL | Creator owns domain |
| Onboarding / migration | Heavy (per site) | Trivial (add a slug; changes public URL) | Moderate (attach domain + host rule + config; keeps URL) |
| Scalability | Poor as separate sites | Strong | Strong |
| Analytics | Fragmented | Unified + per-creator GTM | Unified + per-creator GTM |
| Support | N systems | One system | One system |
| Runtime / fix propagation | Manual per site | Automatic (one engine) | Automatic (one engine) |

**Key engineering fact:** A's *branded-root URL* and B/C's *single-engine
propagation* are both achievable only in **C**. A delivers the branded URL only as
separate sites (forfeiting propagation) or by collapsing into C's internals. This is
an engineering consequence, not a recommendation.

## Founder Product Decision
**[ Pending: A / B / C ]**

The deciding question is product, not engineering: **must each creator own a branded
domain and their SEO/audience?** If yes → a branded-root model (A or C). If a shared
platform address is acceptable → B. Engineering implements whichever is selected
within the canonical single-engine model.

## Rejected Models (engineering grounds — institutional memory, prevents drift)
Rejected regardless of which of A/B/C is selected, because they caused or would
recreate the Platform Deployment Integrity incident:
1. **Per-creator separate deployments / separate Vercel projects.** The runtime and
   every future fix do not propagate; N systems to maintain; this *is* the
   fragmentation incident.
2. **Manual `vercel --prod` deploys.** Bypass CI, untracked in git, not reproducible
   (e.g. `hero.jpg` lived only on a local machine); silent drift.
3. **Forked / duplicated engine per creator.** Breaks single-engine propagation — a
   creator can be stranded on an old, unprotected engine.
4. **Mixed models across creators.** Heterogeneity re-fragments the platform; the
   Standard must be uniform.

*(On selection, the two non-chosen A/B/C models move here with the Founder's product
rationale, completing the record.)*

## Decision Impact
Consequences of each candidate, documented neutrally so the record is complete the
moment a model is selected. Not a recommendation or selection.

### If A — Dedicated domain root
- **Changes now:** formal adoption of per-creator standalone sites. *(A's only
  non-fragmenting implementation collapses into C's internals — as standalone
  deploys it is a Rejected pattern.)*
- **Unchanged:** `brandiburr.com` stays at root.
- **Migration active:** stand up / maintain a disciplined, runtime-bearing
  deployment per creator.
- **Migration unnecessary:** shared slug routing; host→config resolution.
- **Future onboarding:** a new domain + its own deployment per creator (heaviest;
  highest drift risk).

### If B — Shared platform slug
- **Changes now:** a platform domain becomes the public address; Brandy's URL becomes
  `platform/brandy` (`brandiburr.com` → 301 or retired).
- **Unchanged:** the one engine / runtime / CI; the `/brandy/` slug (Migration #001)
  is essentially the final public form.
- **Migration active:** merge Migration #001 nearly as-is; redirect / retire custom
  domains to the platform domain.
- **Migration unnecessary:** host→config resolution; per-creator custom-domain
  attachment.
- **Future onboarding:** add `/slug/config.js` + one `vercel.json` line → live.
  Simplest; creators share the platform domain.

### If C — Custom domain → shared internal routing
- **Changes now:** custom-domain-root becomes the public identity over one shared
  engine; `brandiburr.com` stays at root.
- **Unchanged:** the one engine / runtime / CI; the `/brandy/` slug becomes the
  internal route (not the public URL).
- **Migration active:** Migration #001 (internal slug) + host→config mapping (Vercel
  host rewrite, verified on a preview) + move `brandiburr.com` domains to the
  canonical project.
- **Migration unnecessary:** the separate `brandi-burr` project; all manual deploys.
- **Future onboarding:** creator points a domain → attach to the canonical project +
  `/slug/config.js` + host rule → live at their own domain root. Slightly more than
  B; preserves branding / ownership.

## References
- Canonical process: [`CREATOR_MIGRATION_STANDARD.md`](./CREATOR_MIGRATION_STANDARD.md)
- Investigation archive: [`incidents/2026-07-platform-deployment-integrity.md`](./incidents/2026-07-platform-deployment-integrity.md)
- Migration #001 (frozen candidate): [`migrations/001-brandy.md`](./migrations/001-brandy.md)
