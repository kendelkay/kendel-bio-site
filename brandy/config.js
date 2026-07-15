/* ============================================================================
 * BRANDY — production creator config (based on Template V2 "Social Curiosity").
 *
 * ONE engine (../index.html), config-driven. This file is Brandy's config only:
 * it does NOT modify the engine, the Template Library, or Kendel's live config.
 * It reuses Template V2 1:1 — same Midnight design language, same components,
 * same classic layout — with the two locked V2 revisions preserved verbatim:
 *
 *   1. Hero (`bio`)   : "what i can't post on other socials 😏"
 *   2. Support (tipCard.title) : "spoil me a little ☕️"  (Cash App + Venmo)
 *
 * Every field is optional: blank/missing values simply do not render (no empty
 * button, icon, or spacing). Fields marked  ⟵ REQUIRED  need a real production
 * value from OTG before this page can go live — a blank href on a live tip or
 * CTA button is a production defect (dead link / mis-routed money), so those are
 * intentionally left empty rather than guessed.
 * ========================================================================== */

window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v2", templateName: "Social Curiosity" },

  /* Name / tab title — lowercase to match the platform's visual language. */
  pageTitle: "brandy",
  name: "brandy",

  /* Funnel: exclusive (age-gated) — matches Template V2. */
  pageType: "exclusive",

  /* Google Tag Manager container id (omit / "" to disable analytics). */
  gtmId: "",

  /* Branding: no overrides — inherits the base Midnight design language exactly
     (same as Kendel's live site and Template V2). */
  // theme: { ... }

  /* Background — same treatment as the base (video). Swap in Brandy's asset
     (drop it in brandy/ and point here). Omit the whole block to fall back to
     the default color. */
  background: {
    type: "video",
    video: "background.mp4",   // ⟵ REQUIRED  (Brandy's background asset)
    color: "#f3ebe7",
    position: "65% 15%",
    filter: "brightness(1.08) contrast(1.16) saturate(1.22) sepia(0.04)",
    overlay: true,
  },

  /* Avatar (omit to hide). */
  avatar: "avatar.jpg",          // ⟵ REQUIRED  (Brandy's photo)
  avatarAlt: "brandy",

  /* --- HERO HEADLINE (locked V2 revision — do not change) --- */
  bio: "what i can't post on other socials 😏",

  /* Socials — blank URL hides that platform. Fill in Brandy's real handles. */
  socials: {
    instagram: "",   // ⟵ REQUIRED?  (Brandy's Instagram URL, or leave blank to hide)
    x:         "",   // ⟵ optional
    tiktok:    "",   // ⟵ optional
    snapchat:  "",   // ⟵ optional
  },

  /* Main CTAs — `ageGate: true` routes through the 18+ modal. Blank href hides
     the button. Fill in Brandy's real destinations. */
  links: [
    { text: "free exclusive content 💖", href: "", ageGate: true },  // ⟵ REQUIRED  (OnlyFans URL)
    { text: "fansly 🎀",                 href: "", ageGate: true },  // ⟵ optional  (Fansly URL)
  ],

  /* --- SUPPORT SECTION (locked V2 revision) ---
     "spoil me a little ☕️" with Cash App + Venmo via the plug-and-play
     `payments` map (built-in "cash app" / "venmo" labels, identical styling to
     Kendel's tip card). A blank URL hides that method. */
  tipCard: {
    title: "spoil me a little ☕️",
    payments: {
      cashapp: "",   // ⟵ REQUIRED  e.g. "https://cash.app/$brandyhandle"
      venmo:   "",   // ⟵ REQUIRED  e.g. "https://venmo.com/u/brandyhandle"
    },
    // referral line optional — omit to hide.
  },

  /* Footer links (omit to hide the footer). */
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
