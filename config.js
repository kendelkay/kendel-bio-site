/* ============================================================================
 * SITE CONFIG — the ONLY file you edit per client.
 *
 * The template (index.html) is a rendering engine: every field below is
 * OPTIONAL. If a value is blank, null, missing, or hidden, that feature is
 * simply not rendered — no empty button, icon, text, or spacing.
 *
 * To spin up a new client: copy a folder under clients/, edit this file, and
 * replace the avatar / background asset. See README.md for the full schema.
 *
 * This is Kendel Kay's live site: video background, exclusive funnel.
 * ========================================================================== */

window.SITE_CONFIG = {
  /* Platform metadata (reserved; ignored by the renderer). Anchors this config
     to a schema version so future migrations are safe. See config.schema.json. */
  meta: { module: "link-in-bio", schemaVersion: "1.0.0" },

  /* Browser tab title + <h1> name (omit either to hide it) */
  pageTitle: "kendel kay",
  name: "kendel kay",

  /* Funnel type: "exclusive" (NSFW, age-gated) or "clean" (SFW).
     "clean" structurally disables the age gate no matter what links request. */
  pageType: "exclusive",

  /* Google Tag Manager container id (omit / "" to disable analytics) */
  gtmId: "GTM-M6PJ9FJC",

  /* Branding — all optional; omitted values fall back to the original design.
     colors: body, text, textMuted, buttonBg, buttonBgHover, buttonText,
             buttonBorder, accent, accentText
     font:   { family, weights }   (loaded from Google Fonts)
     emojiSet: name of the emoji personality used below (metadata for tooling) */
  /* Branding preserved — colors and typeface are unchanged. The ONLY override
     is the name's visual prominence for the video-hero layout: a single
     responsive clamp (bigger + heavier, same font) so it still scales down on
     phones. */
  theme: {
    vars: {
      "--lb-name-size": "clamp(56px, 11vw, 90px)",
      "--lb-name-weight": "900",
    },
  },

  /* Background: type is "video" | "image" | "color".
     video -> set `video`; image -> set `image`; color -> `color`/`gradient`. */
  background: {
    type: "video",
    video: "background.mp4?v=10",
    color: "#f3ebe7",
    position: "65% 15%",
    filter: "brightness(1.08) contrast(1.16) saturate(1.22) sepia(0.04)",
    overlay: true,
  },

  /* Avatar intentionally omitted — the hero video is the primary visual
     (parity with the Brandi hero). Restoring `avatar: "avatar.jpg"` re-adds
     the square profile image. */

  /* Hero layout: video-primary, no avatar. Name + handles sit at the top; a
     flexible spacer drops the CTA / tip card into the lower third so nothing
     covers Kendel's face in the video. Mirrors the Brandi hero exactly. */
  layout: {
    order: ["name", "socials", "spacer", "cta", "tipCard", "custom", "footer"],
  },

  /* Socials — plug-and-play. Map form: platform key -> URL (uses the built-in
     label/aria defaults). Known keys: instagram, tiktok, youtube, x, threads,
     snapchat, reddit, telegram, onlyfans, fansly, website. A blank URL hides
     that platform. Provide `{ href, label, emoji, ariaLabel }` to customize. */
  socials: {
    instagram: "https://www.instagram.com/Kendelkay/",
    x:         "https://x.com/kendelkay",
    tiktok:    "https://www.tiktok.com/@Kendelkay",
    snapchat:  "https://www.snapchat.com/@kendel_kay",
  },

  /* Main call-to-action buttons. `ageGate: true` routes through the 18+ modal
     (only on exclusive pages). All wording is config-driven. `emoji` is
     optional and appended to the label. Omit href or text to hide a button. */
  links: [
    { text: "my private world 💖",       href: "https://onlyfans.com/kendelkay",  ageGate: true },
    { text: "come say hi 🎀",            href: "https://fansly.com/KendelKayxo/", ageGate: true },
    { text: "vlogs 🎥",                   href: "https://www.youtube.com/@kendelkay" },
    { text: "my amazon wishlist 💝",      href: "https://www.amazon.com/registries/gl/guest-view/15Q7J6COMX8AT" },
  ],

  /* Tip card. Omit / null to hide. `bubbles` are fully custom; `payments` is
     the plug-and-play map (cashapp, venmo, paypal, coinbase, crypto, wishlist).
     Kendel uses custom bubbles to keep the original "matcha" wording. */
  tipCard: {
    title: "make my day a little sweeter with matcha 💗",
    bubbles: [
      { text: "$15 matcha 🤍",  href: "https://cash.app/$kendelkay/15" },
      { text: "make me blush ☺️", href: "https://cash.app/$kendelkay" },
    ],
    referral: { text: "new to cash app? start here ✨", href: "https://cash.app/app/3ZGKCKCW" },
  },

  /* Footer links (omit to hide the footer) */
  footerLinks: [
    { text: "terms",          href: "terms.html" },
    { text: "privacy policy", href: "privacy.html" },
  ],

  /* Vanity path -> attribution src. Visiting /xo redirects to /?src=... */
  routeMap: {
    "/xo":       "instagram_kendelkay",
    "/official": "instagram_kendelkayofficial",
    "/kk":       "instagram_bykendelkay",
    "/kendel":   "instagram_kendelkayy",
    "/ringtoss": "instagram_ringtossgirl",
    "/diary":    "instagram_kendelkaydiary",
    "/archives": "instagram_kendelkayarchives",
    "/closet":   "instagram_kendelkaycloset",
    "/model":    "instagram_kendelkay_ai",
    "/x":        "x_kendelkay",
    "/xx":       "x_bykendelkay",
    "/tt":       "tiktok_kendelkay",
    "/yt":       "youtube_kendelkay",

    /* Rotation set — new public aliases (same attribution src preserved).
       Additive: the originals above stay live during the grace window. */
    "/hey":      "instagram_kendelkay",
    "/hello":    "instagram_kendelkayofficial",
    "/hi":       "instagram_bykendelkay",
    "/me":       "instagram_kendelkayy",
    "/play":     "instagram_ringtossgirl",
    "/pages":    "instagram_kendelkaydiary",
    "/saved":    "instagram_kendelkayarchives",
    "/fits":     "instagram_kendelkaycloset",
    "/muse":     "instagram_kendelkay_ai",
    "/more":     "x_kendelkay",
    "/extra":    "x_bykendelkay",
    "/clips":    "tiktok_kendelkay",
    "/watch":    "youtube_kendelkay",
  },

  /* 18+ modal copy — only used by exclusive funnels. All wording is config. */
  ageGate: {
    icon: "👁️",
    title: "Sensitive Content",
    body: "This destination may contain content intended for adults. Please confirm that you are at least 18 years of age before continuing.",
    confirmText: "I am 18+ • Continue",
    cancelText: "Cancel",
  },

  /* Attribution-scoped profiles — override presentation for a given ?src, for
     that render only (not routing, not analytics). The base config (video,
     name, branding, runtime) is preserved; only the listed keys change.

     YouTube Bridge — /yt redirects to ?src=youtube_kendelkay: a clean bridge
     that moves YouTube visitors to Instagram through one CTA. No socials row,
     no tip card, no monetization links, no age gate. */
  profiles: {
    youtube_kendelkay: {
      socials: {},
      links: [
        { text: "Follow the trail 🩰", href: "https://www.instagram.com/Kendelkay/" },
      ],
      tipCard: null,
      layout: { order: ["name", "spacer", "cta", "footer"] },
    },
  },
};
