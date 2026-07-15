/* ============================================================================
 * TEMPLATE V9 — "VIP"
 * Exclusive inner-circle. Black + gold (built-in luxury theme), age-gated
 * funnel, every CTA behind the 18+ gate. One engine — content only.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v9", templateName: "VIP" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "exclusive",
  gtmId: "",

  theme: { preset: "luxury" },
  layout: { preset: "exclusive" },
  background: { type: "color", gradient: "linear-gradient(180deg,#0b0b0d 0%,#141210 100%)" },

  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  socials: { instagram: "", telegram: "" },

  links: [
    { text: "join the vip list ✨", href: "", ageGate: true },
    { text: "exclusive content 🔑", href: "", ageGate: true },
    { text: "priority dms 💬", href: "", ageGate: true },
  ],

  tipCard: {
    title: "unlock the inner circle 🥂",
    payments: { cashapp: "", venmo: "" },
    referral: { text: "new to cash app? start here ✨", href: "" },
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
