/* ============================================================================
 * TEMPLATE V1 — "Classic"
 * The original Link-in-Bio design as a reusable, brand-neutral baseline.
 * Soft theme, classic layout, SFW funnel. Copy to a creator's config.js and fill
 * the placeholders. One engine (index.html) — this file only supplies content.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v1", templateName: "Classic" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "clean",
  gtmId: "",

  /* Inherits the base Midnight design language (soft theme, classic layout). */
  background: { type: "color", color: "#f3ebe7" },

  avatar: "avatar.jpg",
  avatarAlt: "creator name",

  bio: "everything in one place ✨",

  socials: { instagram: "", tiktok: "", youtube: "", x: "" },

  links: [
    { text: "latest content 🎬", href: "" },
    { text: "shop 🛍️", href: "" },
    { text: "newsletter 💌", href: "" },
  ],

  tipCard: {
    title: "tip jar 🫶",
    payments: { cashapp: "", venmo: "" },
  },

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],
};
