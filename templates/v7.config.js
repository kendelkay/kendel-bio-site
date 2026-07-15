/* ============================================================================
 * TEMPLATE V7 — "Gaming"
 * Dark, neon. Built-in dark theme with a cyan neon accent + glow (config vars),
 * creator layout, SFW funnel. One engine — content only.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v7", templateName: "Gaming" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "clean",
  gtmId: "",

  /* Built-in dark theme, then a neon accent override (config-driven). */
  theme: {
    preset: "dark",
    colors: {
      buttonBgHover: "rgba(34,211,238,0.16)", buttonBorder: "rgba(34,211,238,0.55)",
      accent: "#22d3ee", accentText: "#04121a",
    },
  },
  layout: { preset: "creator" },
  background: { type: "color", gradient: "linear-gradient(180deg,#05070d 0%,#0b1220 100%)" },

  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  bio: "let's play 🎮",

  socials: { youtube: "", telegram: "", x: "" },

  links: [
    { text: "twitch — live now 🔴", href: "" },
    { text: "youtube 🎥", href: "" },
    { text: "discord 💬", href: "" },
    { text: "merch 🧢", href: "" },
  ],

  tipCard: {
    title: "gg — buy me a snack 🍕",
    payments: { cashapp: "", venmo: "" },
  },

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],
};
