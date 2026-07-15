/* ============================================================================
 * TEMPLATE V4 — "Girlfriend Experience"
 * Warm, intimate, personal. Soft rose palette (config-driven), creator layout,
 * age-gated funnel. One engine — content only.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v4", templateName: "Girlfriend Experience" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "exclusive",
  gtmId: "",

  /* Config-driven warm palette layered on the base design (no engine changes). */
  theme: {
    colors: {
      body: "#fff5f6", text: "#3d2a2e", textMuted: "rgba(61,42,46,0.7)",
      buttonBg: "rgba(255,255,255,0.72)", buttonBgHover: "rgba(255,255,255,0.9)",
      buttonText: "#3d2a2e", buttonBorder: "rgba(214,120,140,0.35)",
      accent: "#d6788c", accentText: "#ffffff",
    },
  },
  layout: { preset: "creator" },
  background: { type: "color", gradient: "linear-gradient(160deg,#ffe9ef 0%,#fff5f6 60%,#fdeef0 100%)" },

  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  bio: "your favorite hello 💌",

  socials: { instagram: "", snapchat: "" },

  links: [
    { text: "come say hi 💗", href: "", ageGate: true },
    { text: "custom messages ✍️", href: "", ageGate: true },
    { text: "video calls 📞", href: "", ageGate: true },
  ],

  tipCard: {
    title: "treat your girl 💗",
    payments: { cashapp: "", venmo: "" },
  },

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],

  ageGate: {
    icon: "👁️", title: "Sensitive Content",
    body: "This destination may contain content intended for adults. Please confirm that you are at least 18 years of age before continuing.",
    confirmText: "I am 18+ • Continue", cancelText: "Cancel",
  },
};
