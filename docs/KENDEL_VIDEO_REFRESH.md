# Kendel landing refresh — video candidate

Status: **candidate, not released.** Founder approval required for the
replacement video and the final presentation before anything reaches production.

## What changed

| File | Change |
|---|---|
| `config.js` | `background.poster`; name size keeps one line on 320px phones (unchanged ≥394px). **No link, route, profile, age-gate or GTM value changed.** |
| `index.html` (engine, additive) | `poster` support on the background video; `prefers-reduced-motion` → still poster image, no video download; `disablepictureinpicture` / `disableremoteplayback` / `aria-hidden`; resume playback when returning to the tab (iOS pauses backgrounded video); video backdrop = page colour (no black flash); `viewport-fit=cover` + safe-area padding; `100svh` (no jump when mobile browser chrome collapses); two-layer text shadow for small text over the video; tip bubbles don't wrap; CTA labels don't wrap at 320px; `config.js?v=10` cache-bust. |
| `background.mp4` | **Replaced** with the Founder's clip `kk_link_vid_new_-_2.mov` (see below). |
| `poster.jpg` | New. First frame of the new `background.mp4` (720×1280, 29 KB). |

`deploy/brandi-burr/` is untouched.

## Link inventory (preserved — verified identical before/after in the rendered DOM)

| Position | Label | Destination | Behaviour |
|---|---|---|---|
| socials 1–4 | ig · 𝕏 · tt · sc | instagram.com/Kendelkay · x.com/kendelkay · tiktok.com/@Kendelkay · snapchat.com/@kendel_kay | new tab |
| CTA 1 | my private world 💖 | https://onlyfans.com/kendelkay | 18+ modal → Link Runtime (in-app-browser escape) |
| CTA 2 | come say hi 🎀 | https://fansly.com/KendelKayxo/ | 18+ modal → Link Runtime |
| CTA 3 | vlogs 🎥 | https://www.youtube.com/@kendelkay | new tab |
| CTA 4 | my amazon wishlist 💝 | amazon.com/registries/gl/guest-view/15Q7J6COMX8AT | new tab |
| tip | $15 matcha 🤍 · make me blush ☺️ | cash.app/$kendelkay/15 · cash.app/$kendelkay | new tab |
| tip | new to cash app? start here ✨ | cash.app/app/3ZGKCKCW | new tab |
| footer | terms · privacy policy · Powered by Midnight | terms.html · privacy.html · themidnightcreator.com?ref=kendel-kay&utm_* | — |

Analytics: GTM `GTM-M6PJ9FJC` unchanged. 26 vanity routes (`/xo`…`/watch`) → `/?src=…` unchanged.
`/yt` YouTube Bridge profile unchanged.

### Editorial pass (Founder visual audit)
- **Name:** Poppins **300 (Light)** instead of the ExtraBold 800 it rendered at. 900 was requested, but only 400–800 were loaded. Font size is unchanged (45.4 / 55.8 / 56 / 90px at 320 / 393 / 412 / 1440px). Tracking eased from −0.06em to −0.02em, so the light name keeps ~98% of its previous width.
- **Lower group, phones (≤700px):** new token `--lb-spacer-min-mobile`: `38svh − 146px`. The first button starts ~38–40% down the screen. A tall phone like the Pixel 7 still fits with no scroll. On shorter phones the tip card and footer continue below the fold.
- **Footer:** top padding cut from 34 to 18px (`--lb-footer-pt`), on all viewports.
- **Desktop:** already bottom-anchored. It changes only through the footer padding (+16px).
- Both tokens default to the previous values, so other sites on the engine are unaffected.

### Micro-polish (Founder)
- **Social labels** (`ig` / `𝕏` / `tt` / `sc` are text glyphs, not SVGs): 14px → 14.7px (+5%).
- **Tap targets:** each link is a ≥44×44px target (glyph + 33px wide). The boxes touch but never overlap, and the visible glyph gap is a uniform 33px (was 14px on phones, 20px on desktop). A literal +10% gap (15.4px) can't hold 44px targets without overlap, so the targets took priority.
- **Header unchanged:** the 44px boxes overhang the 21px row (−11.5px block margins), so the header and everything below it stay put.
- **Tip heading** is now "can you make my day a little sweeter? 💗". On phones it may span the card's side gutters (`--lb-tip-title-bleed`), so it stays on one line at 320px at the same font size.
- **New engine tokens:** `--lb-social-font`, `--lb-social-gap`, `--lb-social-pad-x`, `--lb-social-hit`, `--lb-social-mb`, `--lb-tip-title-bleed`. All default to the previous values.
- **Button fill:** all six white buttons (4 main CTAs + 2 tip bubbles) share one 70% opaque fill (`theme.colors.buttonBg`), Founder choice. Hover stays solid white. Only the fill changes: text, emoji, size and blur stay the same. Worst-case text contrast is 10.6:1 on the darkest video frame and 15.4:1 on the brightest (WCAG AAA is 7:1).
- **Legal text:** terms, privacy and the "|" separator are 60% white (`--lb-legal-color`), Founder choice made knowing the trade-off below. "Powered by Midnight" is unchanged.
  - Measured against the footage behind it: 6.0:1 on dark frames, ~2:1 on mid and bright frames (was 2.6–2.9:1 at 92%).
  - WCAG AA's 4.5:1 isn't reached on mid or bright frames at any opacity, even 100%. The existing text shadow carries readability there.
- **Footer group:** space moved from below the terms row and the Midnight credit to above it. This is zero-sum, so page height and everything above stay the same.
  - Cash App text → terms: 19 → 34px.
  - Terms → Midnight: 19 → 12px.
  - Midnight → bottom: page padding only, never less than the safe area.
  - New tokens: `--lb-footer-pb`, `--lb-refsig-mt`, `--lb-refsig-pb`.
- **Safe-area fix:** the phone padding rule had overridden the safe-area padding. It now uses `max(original, env(safe-area-inset-*))`, so nothing changes without insets.

Header: name, then socials directly underneath. A proposed bio was tried and then removed at the Founder's request. The layout order and spacing match `main`.

## Replacement video — installed

| | Source (`kk_link_vid_new_-_2.mov`) | Shipped (`background.mp4?v=11`) |
|---|---|---|
| Codec | HEVC Main + AAC audio | H.264 High@4.0, yuv420p, bt709, **no audio** |
| Size / rate | 720×1280, 23.976 fps, 8.28 s, 2.5 MB | 720×1280, 23.976 fps, 8.26 s, 2.8 MB (~2.7 Mbps) |
| Container | QuickTime | MP4, `+faststart` (moov first) |

- Re-encoded because HEVC doesn't play reliably in Android Chrome or Firefox. CRF 22, SSIM 0.988 against the source. Not trimmed, scaled or cropped.
- Clip is ~8.3 s, not the 3–4 s in the brief. Shipped at full length; trimming is a Founder decision.
- Black-and-white montage with hard cuts. The loop seam is one more cut. No black frames (minimum mean luma 89/255).
- `background.filter` set to `"none"`: the old warm-footage boost blew out this grade's highlights and tinted it sepia.

## Future video swap procedure (≈2 minutes)

Drop the Founder's file in as `new.mp4`, then:

```bash
# 1. inspect
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,width,height,pix_fmt -of compact new.mp4

# 2a. already H.264 / yuv420p / ≤ ~4 MB: lossless — strip audio, move moov to front
ffmpeg -i new.mp4 -an -c:v copy -movflags +faststart background.mp4

# 2b. otherwise (HEVC/ProRes, 10-bit, 4K, or large): one high-quality encode
ffmpeg -i new.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow \
  -vf "scale='min(1080,iw)':-2" -movflags +faststart background.mp4

# 3. poster = first frame (so loop start and poster match)
ffmpeg -y -i background.mp4 -frames:v 1 -q:v 4 poster.jpg

# 4. cache-bust: config.js -> video/poster ?v=11 -> ?v=12 ; index.html config.js?v=N -> ?v=N+1
```

Then check framing at 320 / 393 / 412 px wide; if the face sits under the name or
buttons, tune only `background.position` in `config.js` (currently `"65% 15%"`, and keep `filter` matched to the footage).

Seamless loop note: `loop` restarts at frame 0. A visible jump at the loop point
comes from the footage itself (last frame ≠ first frame), not the page. If the
clip doesn't loop cleanly, that is a footage edit for the Founder to decide on.
Don't crossfade it in code.

## Release checklist

- [x] Replacement video supplied, encoded, swapped; framing checked headless
- [ ] Video approved: full 8.3 s length and B&W grade as shipped
- [ ] Visual appearance approved
- [x] All existing links, routes, age gate and profiles preserved (DOM diff identical)
- [x] Mobile layout verified headless: iPhone SE, iPhone 15 Pro, Pixel 7, Galaxy S9+, desktop 1440
- [x] Analytics preserved (GTM id unchanged)
- [x] Link Runtime self-check 23/23
- [ ] Real-device check: iOS Safari + Instagram in-app + Android Chrome (autoplay, loop, escape)
- [ ] Production release authorization

## Rollback

Production is built by Vercel, presumably from `main`: every recent production hotfix was merged there, and `kendel-prod` is stale. Confirm this in the Vercel project before releasing. To roll back after a merge, revert the
merge commit on `main` (`git revert -m 1 <merge-sha>`). Or, in Vercel, "Promote to
Production" on the previous deployment. Either way, nothing outside this repo changes.
