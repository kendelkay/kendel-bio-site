BRANDI BURR — deploy bundle for the existing "brandi-burr" Vercel project
=========================================================================
Serves at the domain root:  https://brandi-burr.com/

PRESENTATION: HERO BACKGROUND (no avatar).
  Brandi's photo is the full-bleed background; there is NO profile thumbnail.
  A top+bottom dark scrim (config `overlay`) keeps the white text readable.
  Config-only choice — engine, Template V2, and Template Library are unchanged.

STATUS: config.js is FINAL and validated. Voice: Brandi talking, never software.
  name       : brandi burr  (lowercase, editorial)
  hero CTA   : "what i can't post on other socials 😉"  -> OnlyFans (age-gated)
  support    : "spoil me a little ☕️"
                 "$15 iced latte ☕️" -> Cash App ($brandiburr, pre-fills $15)
                 "make me blush 🥺"  -> Venmo (Brandi-Burr-51)
               (experiences only; NO payment-platform words anywhere on the page)
  OnlyFans   : https://onlyfans.com/burr_brandi
  Cash App   : https://cash.app/$brandiburr/15
  Venmo      : https://venmo.com/u/Brandi-Burr-51
  Fansly/socials: not supplied -> auto-hidden

FILES IN THIS FOLDER
  index.html    the ONE rendering engine (unchanged, byte-identical to platform)
  config.js     Brandi's Template-V2 config (FINAL — no edits needed)
  terms.html    reused verbatim
  privacy.html  reused verbatim
  vercel.json   SPA rewrite  /(.*) -> /index.html

ADD ONE FILE before deploy — drop into THIS folder:
  hero.jpg      REQUIRED — the beach photo supplied by OTG, saved as hero.jpg.
                (No avatar file is used. config.js already points background ->
                hero.jpg.) The preview shipped alongside this bundle used a plain
                stand-in shape ONLY to prove text readability/cropping; replace
                it with the real photo.

DEPLOY (manual, into the EXISTING project so the domain stays attached)
  Vercel CLI (recommended):
    1) npm i -g vercel
    2) cd into this folder  (after adding hero.jpg)
    3) vercel link        (select the existing "brandi-burr" project)
    4) vercel --prod      (uploads these static files, keeps brandi-burr.com)

DEPLOYMENT PROTECTION (do this before launch)
  brandi-burr.com / *.vercel.app returned 403 -> Deployment Protection likely ON.
    Vercel -> brandi-burr -> Settings -> Deployment Protection ->
    Vercel Authentication / Password Protection -> Disabled (Production).

TEST AFTER DEPLOY
  https://brandi-burr.com/   (incognito / hard-refresh)
  Mobile: photo fills the screen; "Brandi Burr" + hero line legible at top;
  "free exclusive content" opens the 18+ modal FIRST, then OnlyFans; Cash App +
  Venmo open the correct handles; "spoil me a little" support row shows.
