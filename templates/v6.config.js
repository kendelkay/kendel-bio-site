/* ============================================================================
 * TEMPLATE V6 — "Cosplay"
 * Playful, vibrant. Deep-violet + magenta accent (config-driven), creator
 * layout, SFW funnel. One engine — content only.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v6", templateName: "Cosplay" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "clean",
  gtmId: "",

  theme: {
    colors: {
      body: "#160a26", text: "#f3e9ff", textMuted: "rgba(243,233,255,0.72)",
      buttonBg: "rgba(255,255,255,0.07)", buttonBgHover: "rgba(232,121,249,0.18)",
      buttonText: "#f3e9ff", buttonBorder: "rgba(232,121,249,0.5)",
      accent: "#e879f9", accentText: "#160a26",
    },
  },
  layout: { preset: "creator" },
  background: { type: "color", gradient: "linear-gradient(160deg,#1f0d38 0%,#160a26 55%,#241042 100%)" },

  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  bio: "new cosplay every month 🎭",

  socials: { instagram: "", tiktok: "", x: "" },

  links: [
    { text: "print shop 🖼️", href: "" },
    { text: "patreon ✨", href: "" },
    { text: "con schedule 📅", href: "" },
    { text: "wip & tutorials 🧵", href: "" },
  ],

  tipCard: {
    title: "support my next build 🧵",
    payments: { cashapp: "", venmo: "", wishlist: "" },
  },

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],
};
