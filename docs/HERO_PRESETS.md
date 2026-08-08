# Hero Presets — hero presentation is *configuration*, not engine behavior

**Status:** Permanent platform architecture.
**Scope:** documentation of an existing capability. No engine change; no new preset
code. This file records *what the system already is*.

## The discovery

A creator's hero — the top of the link page: the name, the handles, the profile
image (or not), and the background (video / image / color) — is **not** a layout
the engine hard-codes per creator. It is a small set of **configuration fields**
the one renderer (`index.html`) already reads. Restyling a hero end-to-end (Kendel's
video-first hero, Brandi's image hero, a minimal text hero) requires **zero engine
changes** — only different values in `config.js`.

That makes a hero a **preset**: a *named, reusable recipe* over existing config
fields. Not a page layout, not engine behavior — configuration.

## The primitives a hero is composed from

Every hero is fully described by four existing `config.js` fields. Nothing else is
involved.

| Field | Controls | Values |
|---|---|---|
| `avatar` | The square profile image | a path shows it; **omit the field to remove it** |
| `background.type` | The primary visual | `"video"` · `"image"` · `"color"` |
| `layout.order` | Which blocks render, in what order | array of `name`, `socials`, `cta`, `tipCard`, `bio`, `newsletter`, `custom`, `footer`, and the flexible `spacer` |
| `theme.vars` | Name prominence (typeface unchanged) | `--lb-name-size` (a responsive `clamp`), `--lb-name-weight` |

Two composition rules do all the visual work:

- **Remove the avatar** (omit the field) → the `background` becomes the primary
  visual. A video/image hero is simply "no avatar + a media background."
- **`spacer` in `layout.order`** → a flexible gap (`flex: 1 1 auto`) that pushes
  everything after it to the bottom of the viewport. Put `name` + `socials` before
  the spacer and the controls after it, and the name/handles sit at the top while
  the CTA/tip drop into the lower third — clear of a face in the background media.

## The preset catalog

These are the **documented recipes**. Each is just the field values above.

| Hero Preset | `avatar` | `background.type` | `layout.order` | Name prominence | Use for |
|---|---|---|---|---|---|
| **Classic** | shown | `color` / `image` | `[avatar, name, bio, socials, cta, tipCard, …]` | default | Standard link-in-bio; profile photo leads |
| **Avatar First** | shown | `color` / `image` | `[avatar, name, socials, cta, …]` | default | Personal brand where the face is the hook |
| **Video First** | *omitted* | `video` | `[name, socials, spacer, cta, tipCard, …]` | raised | A looping video is the primary visual; controls float over the lower third |
| **Kendel** | *omitted* | `video` (`background.mp4`) | `[name, socials, spacer, cta, tipCard, custom, footer]` | `clamp(56px,11vw,90px)` / `900` | Kendel's live hero — a concrete instance of **Video First** |
| **Brandi** | *omitted* | `image` (`hero.jpg`) | `[name, socials, spacer, cta, tipCard, footer, custom]` | default | Brandi's live hero — Video First's sibling with a still image |
| **Minimal** | *omitted* | `color` | `[name, cta, footer]` | default | Text-only, no socials/tip — a clean funnel |

**Kendel** and **Brandi** are the two shipped instances; **Classic / Avatar First /
Video First / Minimal** are the reusable family they generalize into. "Video First"
and "Avatar First" are the two poles: *is the primary visual the creator's face in a
media background, or a framed profile image?*

## What exists in the engine today (honest current state)

- The engine renders whatever these four fields specify. All six recipes above work
  **right now** with no code change — they are configuration.
- The engine has a `LAYOUT_PRESETS` map (`classic`, `creator`, `exclusive`,
  `minimal`, …) that names **`layout.order` only**. A Hero Preset is a *superset* of
  that: order **plus** avatar presence, background type, and name vars.
- There is **no `HERO_PRESETS` registry** in the engine, and this document does not
  add one. A creator's hero is assembled by setting the four fields directly (as
  Kendel and Brandi do). Formalizing a named `HERO_PRESETS` map in the engine — so a
  config could say `hero: { preset: "video-first" }` — is a **possible future** that
  should only be built when Product specifies it. Until then, the presets live here,
  as documented recipes.

## Why this is permanent architecture

Because hero presentation is configuration, the platform gets creator-specific heroes
with **no forks of the renderer**. One engine, one code path, styled per creator by
data. That is the same principle the [deployment model](./incidents/2026-07-platform-deployment-integrity.md)
locks in — one renderer, configuration resolved per creator — applied to the hero.
New creators pick a preset; they never get a bespoke layout.
