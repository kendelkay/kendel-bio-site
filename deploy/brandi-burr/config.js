/* ============================================================================
 * BRANDI BURR — production config (Template V2 "Social Curiosity").
 * TEMPORARY SAFETY BUNDLE: deploys as the ROOT config.js of the existing
 * `brandi-burr` Vercel project → serves at https://brandiburr.com/ (domain root).
 * This bundle now INCLUDES the Link Runtime (../link-runtime.js) so outbound links
 * escape Instagram's in-app browser. Bridge only — retired by the canonical
 * migration once the Founder selects the creator URL model.
 * ASSET: drop the supplied photo into this folder as `hero.jpg`.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v2", templateName: "Social Curiosity", release: "brandi-production-v2", build: "2026-07-16T04:52:57Z", runtimeBundle: true },

  pageTitle: "Brandi Burr",
  name: "Brandi Burr",
  pageType: "exclusive",
  gtmId: "",

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
    vars: { "--lb-content-pb": "0.5vh", "--lb-footer-mt": "0.5vh", "--lb-gap-socials": "16px" },
  },

  socials: {
    instagram: "https://www.instagram.com/brandiburrr",
    x:         "",
    tiktok:    "https://www.tiktok.com/@brandiburrxo",
    snapchat:  "https://www.snapchat.com/@brandiburrx",
  },

  links: [
    { text: "what i can't post on other socials 😉", href: "https://onlyfans.com/burr_brandi", ageGate: true },
  ],

  tipCard: {
    title: "spoil me a little 🤍",
    bubbles: [
      { text: "$15 iced latte ☕️", href: "https://cash.app/$brandiburr/15", method: "cashapp" },
      { text: "make me blush 🥺",  href: "https://venmo.com/u/Brandi-Burr-51", method: "venmo" },
    ],
  },

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

  footerLinks: [
    { text: "terms",          href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],

  ageGate: {
    icon: "👁️",
    title: "Sensitive Content",
    body: "This destination may contain content intended for adults. Please confirm that you are at least 18 years of age before continuing.",
    confirmText: "I am 18+ • Continue",
    cancelText: "Cancel",
  },
};
