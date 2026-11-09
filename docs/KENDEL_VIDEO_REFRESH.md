# Kendel landing refresh — video + bio candidate

Status: **candidate, not released.** Founder approval required for the bio, the
replacement video and the final presentation before anything reaches production.

## What changed

| File | Change |
|---|---|
| `config.js` | Proposed bio (2 lines) rendered under the name; `background.poster`; layout order adds `bio`; tighter bio→socials spacing; name size keeps one line on 320px phones (unchanged ≥394px). **No link, route, profile, age-gate or GTM value changed.** |
| `index.html` (engine, additive) | `poster` support on the background video; `prefers-reduced-motion` → still poster image, no video download; `disablepictureinpicture` / `disableremoteplayback` / `aria-hidden`; resume playback when returning to the tab (iOS pauses backgrounded video); video backdrop = page colour (no black flash); `viewport-fit=cover` + safe-area padding; `100svh` (no jump when mobile browser chrome collapses); two-layer text shadow for small text over the video; tip bubbles don't wrap; CTA labels don't wrap at 320px; `config.js?v=4` cache-bust. |
| `poster.jpg` | New. First frame of the current `background.mp4` (720×1280, 46 KB). |

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
`/yt` YouTube Bridge profile unchanged (it has its own layout order, so the bio does not appear there).

## Replacement video — swap procedure (≈2 minutes)

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

# 4. cache-bust: config.js -> video/poster ?v=10 -> ?v=11 ; index.html config.js?v=4 -> ?v=5
```

Then check framing at 320 / 393 / 412 px wide; if the face sits under the name or
buttons, tune only `background.position` in `config.js` (currently `"65% 15%"`).

Seamless loop note: `loop` restarts at frame 0. A visible jump at the loop point
comes from the footage itself (last frame ≠ first frame), not the page. If the
clip doesn't loop cleanly, that is a footage edit for the Founder to decide on.
Don't crossfade it in code.

## Release checklist

- [ ] Replacement video supplied, swapped, framing checked on phone
- [ ] Visual appearance approved
- [ ] Bio approved: "just a little glimpse into my world 🎀 / come get to know me ♡"
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
