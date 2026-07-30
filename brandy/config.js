/* ============================================================================
 * BRANDI BURR — canonical creator config (Template V2 "Social Curiosity").
 *
 * Migration #001 (Creator Deployment Standard): Brandy now lives on the ONE
 * canonical repo/engine. Served by the root engine (../index.html, which carries
 * the Link Runtime) at the slug path `/brandy/`; the engine loads THIS file as
 * `/brandy/config.js` (relative to the path). Her custom domain(s) are attached to
 * the canonical Vercel project and resolve to this creator. No fork, no manual
 * deploy, no engine change — she inherits the runtime automatically.
 *
 * Locked V2 revisions preserved verbatim (Hero / Support). Values are the final,
 * validated production set (release "brandi-production-v2").
 *
 * ASSET: `/brandy/hero.jpg` (the supplied photo) must be committed for the hero
 * background to render; until then the engine falls back to the color background.
 * ========================================================================== */

window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v2", templateName: "Social Curiosity", release: "brandi-production-v2", build: "2026-07-16T04:52:57Z", migration: "001" },

  pageTitle: "Brandi Burr",
  name: "Brandi Burr",

  /* Funnel: exclusive (age-gated) — matches Template V2. */
  pageType: "exclusive",

  /* Google Tag Manager (optional; "" = analytics off). */
  gtmId: "",

  /* ART DIRECTION — Brandi-only editorial theme (config tokens only; the engine
     and Template V2 are unchanged). Lighter type, airier rhythm, frosted-glass
     controls that float over the photography. */
  theme: {
    font: { display: "Playfair Display", displayWeights: "500;600;700" },
    colors: {
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.86)",
      buttonBg: "rgba(255,255,255,0.14)",
      buttonBgHover: "rgba(255,255,255,0.26)",
      buttonText: "#ffffff",
      buttonBorder: "rgba(255,255,255,0.42)",
    },
    vars: {
      "--lb-name-size": "clamp(35px, 10vw, 50px)",
      "--lb-name-weight": "600",
      "--lb-name-tracking": "0.08em",
      "--lb-gap-bio": "34px",
      "--lb-gap-tip": "26px",
      "--lb-pay-gap": "16px",
      "--lb-links-gap": "26px",
      "--lb-btn-min-h": "54px",
      "--lb-btn-font": "16px",
      "--lb-btn-weight": "400",
      "--lb-btn-pad-y": "11px",
      "--lb-btn-pad-x": "20px",
      "--lb-glass-blur": "22px",
    },
  },

  /* HERO BACKGROUND — full-bleed photo (path is RELATIVE so it resolves under
     /brandy/). Gentle filter, no brightening; interface moved off her via spacer. */
  background: {
    type: "image",
    image: "hero.jpg?v=2",
    position: "50% 30%",
    filter: "contrast(1.03) saturate(1.04)",
    overlay: {
      color: "linear-gradient(180deg, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0.12) 12%, rgba(0,0,0,0.02) 24%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.5) 88%, rgba(0,0,0,0.66) 100%)"
    },
  },

  layout: {
    order: ["name", "socials", "spacer", "cta", "tipCard", "footer", "custom"],
    vars: {
      "--lb-content-pb": "0.5vh",
      "--lb-footer-mt": "0.5vh",
      "--lb-gap-socials": "16px",
    },
  },

  /* Socials — real handles. X not supplied -> blank -> auto-hidden. */
  socials: {
    instagram: "https://www.instagram.com/brandiburrr",
    x:         "",
    tiktok:    "https://www.tiktok.com/@brandiburrxo",
    snapchat:  "https://www.snapchat.com/@brandiburrx",
  },

  /* HERO CTA — Brandi's line IS the button. ageGate:true routes through the 18+
     modal before OnlyFans (the Link Runtime intercepts the continuation). */
  links: [
    { text: "what i can't post on other socials 😉", href: "https://onlyfans.com/burr_brandi", ageGate: true },
  ],

  /* SUPPORT — experiences, never a payment processor. Cash App + Venmo behind
     her own labels (method kept subtle in data-lb-method). */
  tipCard: {
    title: "spoil me a little 🤍",
    bubbles: [
      { text: "$15 iced latte ☕️", href: "https://cash.app/$brandiburr/15", method: "cashapp" },
      { text: "make me blush 🥺",  href: "https://venmo.com/u/Brandi-Burr-51", method: "venmo" },
    ],
  },

  /* Brandi-scoped optical polish via the engine's customSections (config-only;
     NOT an engine change — no other creator is affected). */
  customSections: [
    {
      id: "brandi-polish",
      html:
        "<style>" +
        "[data-lb-id='brandi-polish']{display:none !important}" +
        ".matcha-bubble{transition:transform var(--lb-anim) ease, background var(--lb-anim) ease, box-shadow var(--lb-anim) ease}" +
        ".matcha-bubble:hover{transform:translateY(-2px);background:var(--lb-btn-bg-hover);box-shadow:0 18px 40px rgba(0,0,0,0.10)}" +
        ".socials{margin-top:14px}" +
        ".lb-refsig{margin-top:2px}" +
        "</style>",
    },
  ],

  /* Footer — reuses /brandy/terms.html + /brandy/privacy.html (name read from config). */
  footerLinks: [
    { text: "terms",          href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],

  /* 18+ modal copy — exclusive funnel only. */
  ageGate: {
    icon: "👁️",
    title: "Sensitive Content",
    body: "This destination may contain content intended for adults. Please confirm that you are at least 18 years of age before continuing.",
    confirmText: "I am 18+ • Continue",
    cancelText: "Cancel",
  },
};
