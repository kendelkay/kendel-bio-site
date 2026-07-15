# Link-in-Bio Platform — Architecture

**Destination: one deployment, one engine, one template library, unlimited creators.**

This document is the north star. Do not optimize around today's deployment
model — optimize toward the platform below. Today's single-config deployment and
any per-creator deployment are **migration steps**, not the destination.

---

## Target architecture (the destination)

```
Creator URL
   ↓  resolve creator  (slug → creator id)
Resolve creator config  (creator id → SITE_CONFIG)
   ↓
Load template           (config selects template + theme + layout + funnel)
   ↓
Render page             (the ONE engine renders it)
   ↓
Done
```

- **One deployment** — a single Vercel project + domain serves every creator.
- **One rendering engine** — `index.html`, never forked, never duplicated.
- **One template library** — `templates/` (V1–V10): infrastructure, versioned,
  generic.
- **Unlimited creator configurations** — each creator is just a `SITE_CONFIG`,
  resolved at request time. No new deployment, repo, or HTML per creator.

### Non-negotiables
- **No separate deployments per creator.**
- **No duplicated repositories.**
- **No duplicated HTML.**
- **One platform serving unlimited creators.**

---

## Layers

| Layer | Role | Changes when… |
|---|---|---|
| **Engine** (`index.html`) | Pure renderer. Reads a `SITE_CONFIG`, renders. | A **universal** fix/feature — propagates to all templates + creators. |
| **Template Library** (`templates/`) | Reusable personalities (theme + layout + funnel + copy). | A **template-specific** change (e.g., V2 only). |
| **Creator config** | One creator's content, based on a template. | A **creator-specific** change (Brandy only). |
| **Resolution layer** (target) | Maps a Creator URL → that creator's config. | The one new platform capability to build for the destination. |

**Scope routing rule:** universal → engine · template personality → library · one
creator → their config. A real improvement is applied at the highest layer it
belongs to, so it propagates as far as it correctly should — and no further.

---

## What reaching the destination requires (the one universal change)

Today the engine hardcodes its config: `<script src="config.js">`. The single
universal change to become multi-tenant is **dynamic config resolution** — the
engine loads the config for the *resolved creator* instead of a fixed file:

1. **URL → slug.** `platform/<slug>` (path) or `<slug>.platform` (subdomain).
   A `vercel.json` rewrite routes any slug to the engine with the slug available.
2. **Slug → config.** Resolve the creator's `SITE_CONFIG` from a config source
   served by the *same* deployment — static per-creator config objects, or a
   small edge config / KV lookup. (Creator record references which **template**
   it's based on; the config is the template + the creator's fields.)
3. **Config → render.** The unchanged engine renders it.

This is a **universal engine capability**, added once — not a per-creator fork.
Everything else (templates, creator content) is already config-driven.

---

## Migration path

- **Phase 0 — today.** Single-config deployment (Kendel at root `config.js`).
  Template Library merged to `main` as infrastructure. ✅
- **Phase 1 — interim (Brandy).** Brandy may deploy **independently** using
  Template V2 if that's the fastest launch. This is a **migration step**: a
  separate deployment reusing the same engine + a V2-based config. Acceptable to
  ship a creator now; **not the destination**.
- **Phase 2 — the platform.** Add the resolution layer + dynamic config loading
  to the one deployment. Move every creator (Kendel, Brandy, future) to
  URL-resolved configs on the single platform. Retire per-creator deployments.

Each phase preserves the invariant: **one engine, config-driven, never forked.**

---

## Principles

- The **Template Library is infrastructure**; a **creator is implementation**.
  Treat them independently; never delay the library for one creator's validation.
- Every improvement becomes reusable at its correct layer (engine / template /
  creator) — optimize on **production usage**, not assumptions.
- One rendering engine · one template library · one launch workflow:
  **select Template · Theme · Funnel · Personality → resolve config → render.**
