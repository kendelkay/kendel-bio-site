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
  /* Branding: colors and Poppins unchanged. Name = editorial treatment:
     same size, Poppins Light (300) instead of the ExtraBold it rendered at
     (900 was requested but only 400–800 were loaded). Tracking eased from
     -0.06em to -0.02em so the lighter name keeps ~98% of its previous width.
     `weights` adds 300 to the default Google Fonts request. */
  theme: {
    font: { weights: "300;400;500;600;700;800" },
    /* All six white buttons (4 main CTAs + 2 tip bubbles) share one 70%
       opaque fill (engine default 94%), Founder choice. Fill only: text,
       emoji, size, blur unchanged; hover still goes solid white. */
    colors: {
      buttonBg: "rgba(255,255,255,0.70)",
      buttonBgHover: "#ffffff",
    },
    vars: {
      "--lb-name-size": "min(90px, max(56px, 11vw), 14.2vw)", /* = old clamp, but keeps one line on 320px phones */
      "--lb-name-weight": "300",
      "--lb-name-tracking": "-0.02em",
      /* Social row: labels +5% (14 -> 14.7px). Each link is a >=44x44px tap
         target (glyph + 33px wide, boxes touching, never overlapping), so the
         visible glyph-to-glyph gap is a uniform 33px. The 44px-tall box
         overhangs the 21px row (-11.5px block margins): header layout and
         everything below it stay exactly where they were. */
      "--lb-social-font": "14.7px",
      "--lb-social-gap": "0px",
      "--lb-social-pad-x": "16.5px",
      "--lb-social-hit": "44px",
      "--lb-social-mb": "-11.5px",
      /* Tip heading may span the full content column (the card is 86% wide on
         phones; 7% gutters each side = 8.14% of the card), so "make my day a
         little sweeter?" stays on one line at 320px. Same font size. */
      "--lb-tip-title-bleed": "-8.14%",
    },
  },

  /* Background: type is "video" | "image" | "color".
     video -> set `video`; image -> set `image`; color -> `color`/`gradient`. */
  background: {
    type: "video",
    video: "background.mp4?v=11",
    /* First frame of the video: shown while it buffers (no blank/black flash),
       and used as a still for visitors with prefers-reduced-motion. Regenerate
       together with the video (same ?v=). */
    poster: "poster.jpg?v=11",
    color: "#f3ebe7",
    position: "65% 15%",
    /* "none": the replacement clip is a finished B&W grade — the old
       brightness/contrast/saturate/sepia boost (tuned for the previous warm
       footage) blew out its highlights and tinted it. Shown as delivered. */
    filter: "none",
    overlay: true,
  },

  /* Avatar intentionally omitted — the hero video is the primary visual
     (parity with the Brandi hero). Restoring `avatar: "avatar.jpg"` re-adds
     the square profile image. */

  /* Hero layout: video-primary, no avatar. Name + handles sit at the top; a
     flexible spacer drops the CTA / tip card into the lower third so nothing
     covers Kendel's face in the video. Mirrors the Brandi hero exactly. */
  /* Bottom-weighted (phones, <=700px wide): the space above the buttons is at
     least 38svh - 146px, so the first button starts ~38-40% down the screen
     (svh = stable under iOS Safari's collapsing address bar). Tall phones
     still fit exactly; on shorter phones the tip card / footer continue below
     the fold and scroll. Desktop keeps its natural bottom-anchored spacing.
     Footer top padding trimmed (34 -> 18px) to pull terms/privacy down. */
  layout: {
    vars: {
      "--lb-spacer-min-mobile": "max(0px, calc(38svh - 146px))",
      /* Footer group: space moved from BELOW terms/Midnight to ABOVE terms
         (zero-sum: 18+8+10+8 = 33+4+7+0 = 44px), so the legal group sits
         lower with ~34px of air above it, page height and every element
         above it unchanged. Midnight's bottom clearance = page padding
         (>= device safe area). */
      "--lb-footer-pt": "33px",
      "--lb-footer-pb": "4px",
      "--lb-refsig-mt": "7px",
      "--lb-refsig-pb": "0px",
      /* Terms | privacy text + separator at 60% white (was the 92% muted
         text), Founder choice: quieter than the buttons. Same size, spacing
         and shadow; Powered by Midnight unchanged. Readability over the
         bright footage relies on the existing text shadow. */
      "--lb-legal-color": "rgba(255,255,255,0.60)",
    },
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
    title: "make my day a little sweeter?",
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
      /* Clean-profile composition (this profile only; layout.vars are applied
         after the base theme, and the full page never sees them):
         signature-scale name, a slimmer single CTA, a discreet footer.
         All values are fluid (vw / svh), not tuned to one device. */
      layout: {
        order: ["name", "spacer", "cta", "footer"],
        vars: {
          /* Name: Poppins Light kept; ~49px on a 440px phone, 36px at 320px. */
          "--lb-name-size": "clamp(36px, 11.2vw, 50px)",
          "--lb-name-tracking": "0.01em",
          "--lb-name-mt": "clamp(14px, 3.5svh, 32px)",
          /* CTA: intrinsic width (label + fluid side padding, ~240px on a
             440px phone) instead of a % of the screen; 54px tall, 17px. */
          "--lb-btn-width": "auto",
          "--lb-btn-pad-x": "clamp(40px, 11.5vw, 52px)",
          "--lb-btn-min-h": "54px",
          "--lb-btn-pad-y": "10px",
          "--lb-btn-font": "17px",
          /* Footer rhythm: air above terms scales with height; Midnight
             credit smaller and quieter; extra clearance above the toolbar. */
          "--lb-footer-pt": "clamp(28px, 6svh, 56px)",
          "--lb-footer-pb": "4px",
          "--lb-refsig-mt": "8px",
          "--lb-refsig-pb": "0px",
          "--lb-refsig-font": "8px",
          "--lb-refsig-pad": "4px 10px 3px",
          "--lb-refsig-gap": "4px",
          "--lb-refsig-spark": "8px",
          /* Midnight link fills the whole (smaller) capsule as its tap area. */
          "--lb-refsig-hit-y": "4px",
          "--lb-refsig-hit-x": "10px",
          "--lb-content-pb": "clamp(8px, 2svh, 20px)",
        },
      },
    },
  },
};
