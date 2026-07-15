/* ============================================================================
 * TEMPLATE V2 — reusable Link-in-Bio variant (Executive Design Revision).
 *
 * Based 1:1 on Kendel Kay's production design (same rendering engine, same
 * Midnight design language, same components) — the ONLY revisions from the base
 * are the two locked below:
 *
 *   1. Hero headline (`bio`) : "what i can't post on other socials 😏"
 *   2. Support section       : title "spoil me a little ☕️" with Cash App + Venmo
 *
 * This is a TEMPLATE for future creator variations — it does NOT modify the base
 * template (index.html) or Kendel's live config.js. To use it for a creator:
 * copy this file to that creator's `config.js`, then fill in the per-creator
 * placeholders (name, socials, links, payment handles, avatar/background).
 *
 * Every field is optional: blank/missing values simply don't render (no empty
 * button, icon, or spacing). Layout is left at the default (classic) order so
 * the hero headline renders directly under the name — exactly like the base.
 * ========================================================================== */

window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v2" },

  /* --- Per-creator (fill in) --- */
  pageTitle: "creator name",
  name: "creator name",

  /* Funnel type: "exclusive" (NSFW, age-gated) — matches the base implementation. */
  pageType: "exclusive",

  /* Google Tag Manager container id (omit / "" to disable analytics) */
  gtmId: "",

  /* Branding: no overrides — inherits the base Midnight design language exactly,
     just like Kendel's live site. */
  // theme: { ... }

  /* Background — same treatment as the base (video). Swap the asset per creator;
     omit the whole block to fall back to the default color. */
  background: {
    type: "video",
    video: "background.mp4",
    color: "#f3ebe7",
    position: "65% 15%",
    filter: "brightness(1.08) contrast(1.16) saturate(1.22) sepia(0.04)",
    overlay: true,
  },

  /* Avatar (omit to hide) */
  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  /* --- HERO HEADLINE (locked V2 revision) ---
     Renders as the tagline directly under the name (classic layout order). */
  bio: "what i can't post on other socials 😏",

  /* Socials — per-creator. Blank URL hides that platform. */
  socials: {
    instagram: "",
    x:         "",
    tiktok:    "",
    snapchat:  "",
  },

  /* Main CTAs — per-creator. `ageGate: true` routes through the 18+ modal. */
  links: [
    { text: "free exclusive content 💖", href: "", ageGate: true },
    { text: "fansly 🎀",                 href: "", ageGate: true },
  ],

  /* --- SUPPORT SECTION (locked V2 revision) ---
     "spoil me a little ☕️" with Cash App + Venmo. Uses the plug-and-play
     `payments` map so the bubbles render with the built-in "cash app" / "venmo"
     labels and the exact same styling as Kendel's tip card (.matcha-card /
     .matcha-bubble). Fill in each handle URL; a blank URL hides that method.
     The referral line is optional — omit it to hide. */
  tipCard: {
    title: "spoil me a little ☕️",
    payments: {
      cashapp: "",   // e.g. "https://cash.app/$yourhandle"
      venmo:   "",   // e.g. "https://venmo.com/u/yourhandle"
    },
    referral: { text: "new to cash app? start here ✨", href: "" },
  },

  /* Footer links (omit to hide the footer) */
  footerLinks: [
    { text: "terms",          href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],

  /* 18+ modal copy — only used by exclusive funnels. */
  ageGate: {
    icon: "👁️",
    title: "Sensitive Content",
    body: "This destination may contain content intended for adults. Please confirm that you are at least 18 years of age before continuing.",
    confirmText: "I am 18+ • Continue",
    cancelText: "Cancel",
  },
};
