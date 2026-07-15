/* ============================================================================
 * TEMPLATE V8 — "Minimal"
 * Stripped-back and typographic. Built-in minimal theme + minimal layout
 * (name + links + footer only). SFW. One engine — content only.
 * ========================================================================== */
window.SITE_CONFIG = {
  meta: { module: "link-in-bio", schemaVersion: "1.0.0", template: "v8", templateName: "Minimal" },

  pageTitle: "creator name",
  name: "creator name",
  pageType: "clean",
  gtmId: "",

  /* Built-in minimal theme (flat white buttons, no blur, tight radius) + the
     minimal layout order — deliberately no avatar, bio, socials, or tip card. */
  theme: { preset: "minimal" },
  layout: { preset: "minimal" },
  background: { type: "color", color: "#faf9f7" },

  links: [
    { text: "work", href: "" },
    { text: "shop", href: "" },
    { text: "contact", href: "" },
  ],

  footerLinks: [
    { text: "terms", href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],
};
