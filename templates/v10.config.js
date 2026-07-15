/* ============================================================================
 * TEMPLATE V10 — "Custom Enterprise"
 * The full-capability showcase: every engine feature turned on as a starting
 * point for bespoke builds — socials, CTAs with A/B variants, full payments map,
 * newsletter, and a custom section. Trim what a client doesn't need. SFW default.
 * One engine — content only; nothing here requires an engine change.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v10", templateName: "Custom Enterprise" },

  pageTitle: "brand name",
  name: "brand name",
  pageType: "clean",
  gtmId: "",

  /* Config-driven theme — override any subset; unset values inherit the base. */
  theme: {
    colors: {
      body: "#0f1226", text: "#eef0ff", textMuted: "rgba(238,240,255,0.72)",
      buttonBg: "rgba(255,255,255,0.06)", buttonBgHover: "rgba(129,140,248,0.18)",
      buttonText: "#eef0ff", buttonBorder: "rgba(129,140,248,0.5)",
      accent: "#818cf8", accentText: "#0f1226",
    },
  },
  layout: { preset: "business" },
  background: { type: "color", gradient: "linear-gradient(160deg,#0f1226 0%,#141a3a 100%)" },

  avatar: "avatar.jpg",
  avatarAlt: "brand name",
  bio: "one link. every destination.",

  socials: { instagram: "", youtube: "", x: "", tiktok: "", threads: "", website: "" },

  /* CTAs may declare A/B `variants`; ?variant=b or abTest.active picks one. */
  abTest: { active: "a" },
  links: [
    {
      text: "primary offer",
      variants: {
        a: { text: "get started →", href: "" },
        b: { text: "book a demo →", href: "" },
      },
    },
    { text: "shop 🛍️", href: "" },
    { text: "case studies 📈", href: "" },
  ],

  /* Full plug-and-play payments map — trim to what the client uses. */
  tipCard: {
    title: "support the work",
    payments: { cashapp: "", venmo: "", paypal: "", coinbase: "", wishlist: "" },
  },

  /* Email capture (omit the block to hide). `action` = your form endpoint. */
  newsletter: { title: "join the list", placeholder: "your email", buttonText: "subscribe", action: "" },

  /* Free-form custom section(s) — raw HTML rendered as-is inside a card. */
  custom: { html: "<p style='text-align:center;margin:0'>Announcement bar or embed goes here.</p>" },

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],
};
