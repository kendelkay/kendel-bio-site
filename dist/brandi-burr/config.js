/* ============================================================================
 * BRANDI BURR — production config (Template V2 "Social Curiosity").
 * Deploys as the ROOT config.js of the brandi-burr Vercel project, so the page
 * serves at https://brandi-burr.com/ (domain root — no path).
 *
 * Reuses the one rendering engine (index.html, unchanged) + Template V2. Locked
 * V2 revisions preserved verbatim:
 *   - Hero    : "what i can't post on other socials 😏"
 *   - Support : "spoil me a little ☕️"  (Cash App + Venmo)
 *
 * ART DIRECTION (Brandi-only, config-only — NOT a template/engine change):
 * Editorial / luxury-cover treatment. The creator is the artwork; the interface
 * is the frame. Photo dominates; the UI floats as frosted glass over it.
 *   - HERO BACKGROUND photo (`hero.jpg`), no avatar. Face fully unobstructed.
 *   - Content pushed low (engine hero `spacer`); airy spacing (restraint).
 *   - Thin, wide-tracked name (light weight) — editorial, not a landing-page slab.
 *   - CTAs/tips are translucent frosted glass (float over the photo, don't sit on it).
 *   - Whisper-light scrim ONLY behind the lower text — photo reads at full
 *     brightness up top.
 *   - Eye order: Creator(photo) → Brand(name) → Headline → CTA → Support.
 *
 * ASSET: drop the supplied photo into this folder as `hero.jpg`.
 * ========================================================================== */

window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v2", templateName: "Social Curiosity", release: "brandi-production-v2", build: "2026-07-16T04:52:57Z" },

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
    /* Masthead display font only (body/buttons stay Poppins for readability).
       Playfair Display — the fashion-magazine masthead serif: high-contrast,
       elegant, commanding. Selected as the strongest editorial choice. */
    font: { display: "Playfair Display", displayWeights: "500;600;700" },
    colors: {
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.86)",
      /* frosted-glass controls — translucent, so the photo shows through */
      buttonBg: "rgba(255,255,255,0.14)",
      buttonBgHover: "rgba(255,255,255,0.26)",
      buttonText: "#ffffff",
      buttonBorder: "rgba(255,255,255,0.42)",
    },
    vars: {
      /* masthead — ~18% larger, soft feminine serif, elegant wide tracking */
      "--lb-name-size": "clamp(35px, 10vw, 50px)",
      "--lb-name-weight": "600",
      "--lb-name-tracking": "0.08em",
      /* breathing room — luxury negative space between sections */
      "--lb-gap-bio": "34px",
      "--lb-gap-tip": "26px",   /* CTA + "spoil me" read as one emotional beat (#5) */
      "--lb-pay-gap": "16px",   /* air between the two experience buttons */
      "--lb-links-gap": "26px",
      /* lighter, softer controls + more frost */
      "--lb-btn-min-h": "54px",
      "--lb-btn-font": "16px",        /* hero CTA text ~5% smaller — secondary to the masthead */
      "--lb-btn-weight": "400",
      "--lb-btn-pad-y": "11px",       /* CTA padding ~10% tighter */
      "--lb-btn-pad-x": "20px",
      "--lb-glass-blur": "22px",
    },
  },

  /* HERO BACKGROUND — full-bleed photo, centered on the figure. Gentle filter,
     no brightening. The interface is moved off her (spacer) rather than cropping
     her out, so the photography leads the first impression. */
  background: {
    type: "image",
    image: "/hero.jpg?v=2",
    position: "50% 30%",
    filter: "contrast(1.03) saturate(1.04)",
    /* Editorial double-scrim: a soft top veil so the brand name reads over the
       sky, a fully-clear middle so her face/body stay at full brightness, and a
       deeper foot for the lower interface. Photography still dominates. */
    overlay: {
      color: "linear-gradient(180deg, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0.12) 12%, rgba(0,0,0,0.02) 24%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.5) 88%, rgba(0,0,0,0.66) 100%)"
    },
  },

  /* LAYOUT — editorial masthead composition (variant B). The BRAND anchors the
     very top; a `spacer` then lets the photograph own the upper frame; the whole
     interface (CTA + support) collects as one floating cluster in the lower third.
     Photography first, interface second. */
  layout: {
    /* name + curiosity line form one editorial header at the very top; a spacer
       drops the support cluster into the lower third (kept where it was); a
       second spacer pushes the footer to the very bottom (~98%). */
    /* Header = masthead + socials only. The `spacer` then drops the whole SUPPORT
       cluster (CTA + spoil-me + bubbles) into the lower third as one cohesive
       unit; footer + Midnight sit at the very bottom. */
    order: ["name", "socials", "spacer", "cta", "tipCard", "footer", "custom"],
    vars: {
      "--lb-content-pb": "0.5vh",
      "--lb-footer-mt": "0.5vh",     /* whole support cluster ~3.5% lower (#1) */
      "--lb-gap-socials": "16px",    /* space under the social row (header) */
    },
  },

  /* Platform signature ON — restored exactly as the other creator sites (engine
     default): small, elegant, clickable "Powered by Midnight" pinned at the very
     bottom, isolated from the creator's own links. Never competes with her. */

  /* No avatar — the hero photo is the identity. No separate headline line: her
     line now lives inside the CTA below (one strong touch, in her voice). */

  /* Socials — real handles (canonical URLs; share/tracking params stripped).
     X not supplied by OTG -> blank -> auto-hidden (add later if she has one). */
  socials: {
    instagram: "https://www.instagram.com/brandiburrr",
    x:         "",
    tiktok:    "https://www.tiktok.com/@brandiburrxo",
    snapchat:  "https://www.snapchat.com/@brandiburrx",
  },

  /* HERO CTA — Brandi's line IS the button. ageGate:true routes through the 18+
     modal before OnlyFans. Reads like her talking, not like software. */
  links: [
    { text: "what i can't post on other socials 😉", href: "https://onlyfans.com/burr_brandi", ageGate: true },
  ],

  /* SUPPORT — experiences, never a payment processor. Same luxury system as
     Kendel's tip card; Brandi's own personality (latte / spoil-me, not matcha).
     Custom `bubbles` so the labels are HERS; the rails stay Cash App + Venmo
     behind them (method kept subtle in data-lb-method — no "cash app"/"venmo"
     wording on the button face). */
  tipCard: {
    title: "spoil me a little 🤍",
    bubbles: [
      { text: "$15 iced latte ☕️", href: "https://cash.app/$brandiburr/15", method: "cashapp" },
      { text: "make me blush 🥺",  href: "https://venmo.com/u/Brandi-Burr-51", method: "venmo" },
    ],
  },

  /* Brandi-scoped optical polish via the engine's own customSections mechanism
     (config-only; NOT an engine change — nothing here touches the shared engine,
     so no other creator is affected). The injected <style> hides its own wrapper
     and applies refinements that aren't exposed as tokens:
       - tip bubbles inherit the EXACT hero-CTA hover (values copied verbatim
         from `.button:hover` — same lift, glow, timing, easing; not a new anim);
       - terms | privacy sit tighter to the Powered-by-Midnight capsule;
       - a little air below the social row. */
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

  /* Footer. */
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
