# Link Runtime — QA

In-app browser escape is one capability of the Link Runtime (see `LINK_RUNTIME.md`).
Two classes of verification, kept honestly separate.

## Class A — Deterministic (auto-verified in this environment)

Runs with no build and no third-party deps:

```
node link-runtime.selfcheck.mjs   # pure logic + Destination + Environment Provider (21 checks)
```

DOM behavior was verified headless (Playwright/Chromium) against a local server
that mirrors `vercel.json`'s rewrite. Result at implementation time: **17/17**.
Covered: normal env opens natively with no overlay; embedded env shows the
fallback; Copy link; Continue here (closes, no loop); age gate resolves to the
correct destination in both envs; vanity `?src=` attribution intact; invalid
protocol rejected with no overlay.

## Class B — Device Validation (manual QA, NOT auto-verifiable)

Real in-app-browser rendering and OS-level browser handoff **cannot be truthfully
verified off-device**. These must be run by a human before production launch. Use
a debug build or append `?lbforce=` via `window.__LB_FORCE_ENV` only for staging;
real devices need no override.

Expected outcome legend: **Native** = destination opens normally, no fallback ·
**Escape/Fallback** = Chrome handoff (Android) or the fallback screen (iOS/other).

| # | Environment | Age gate | Destination | Attribution | Expected |
|---|-------------|----------|-------------|-------------|----------|
| 1 | iOS Safari | off | valid | absent | Native |
| 2 | Android Chrome | off | valid | present | Native |
| 3 | Desktop Chrome | off | valid | absent | Native |
| 4 | Instagram iOS webview | off | valid | present | Fallback screen; Copy + Continue work; attribution preserved |
| 5 | Instagram Android webview | off | valid | present | Auto Chrome handoff (intent); fallback beneath if it fails |
| 6 | Instagram iOS webview | **on** | valid | present | 18+ modal → confirm → fallback to the correct age-gated destination |
| 7 | Instagram Android webview | **on** | valid | present | 18+ modal → confirm → Chrome handoff to the age-gated destination |
| 8 | Facebook iOS webview | off | valid | absent | Fallback screen |
| 9 | Facebook Android webview | off | valid | absent | Chrome handoff |
| 10 | TikTok webview | off | valid | absent | Fallback (iOS) / handoff (Android) |
| 11 | Any embedded | off | **invalid protocol** | — | No open, no overlay (rejected) |
| 12 | Any embedded | off | valid | — | No redirect loop under repeated taps |
| 13 | Desktop Safari/Chrome | on | valid | present | Native, no fallback prompt |

### Per-run checklist
- [ ] Normal browsers (1–3, 13) never show the fallback.
- [ ] Embedded envs escape or fall back; the intended destination is never lost.
- [ ] Age-gated destinations resolve to the correct URL after 18+ confirm.
- [ ] `?src=` / vanity attribution survives the whole path.
- [ ] Copy link copies the exact destination; Continue here proceeds in-app.
- [ ] No loop: repeated taps never bounce between page and destination.

## Known platform limitations (honest)

- **iOS has no reliable programmatic escape** from an in-app webview. The fallback
  screen (with the ⋯-menu instruction + Copy link) is the supported path; there is
  no silent iOS auto-escape, by design.
- **Android intent handoff** requires Chrome (`com.android.chrome`). If absent, the
  intent's `browser_fallback_url` loads the destination directly (no loop), which
  may be in-app depending on the webview.
- Detection is UA-based and conservative: exotic or spoofed embedded browsers not
  on the token list fall through to Native (safe default — never a false prompt in
  a real browser).

## Production diagnostic — via Midnight Diagnostics

Diagnostics now run through the reusable **Midnight Diagnostics** framework
(`MIDNIGHT_DIAGNOSTICS.md`); the Link Runtime is one consumer. Purpose here: prove
the Link Runtime executes on production and answer four questions on a real device
without a console.

- **Console banner (always):** `[Midnight Diagnostics] LinkRuntime build lr-diag-1 registered`.
- **On-page badge (opt-in):** append `?mdebug=1` (or the legacy `?lrdebug=1`) to the
  URL — or set `localStorage.md_debug='1'` / `window.MIDNIGHT_DEBUG=true`. A bottom-left
  badge lists every registered system; LinkRuntime shows loaded, enabled, env,
  embedded, and a live interception counter.
- **Programmatic:** `MidnightDiagnostics.snapshot()` (all systems) or
  `window.LinkRuntime.diagnostics()` (LinkRuntime only).

Answers: (1) loaded? badge/console present. (2) which build? `build` tag (maps to a
commit/PR; authoritative SHA in Vercel's deployment). (3) detection embedded?
`embedded=true`. (4) interception executed? the counter increments (`last: intercept`)
after tapping a protected CTA.

**Temporary:** remove the LinkRuntime diagnostic probe once production execution is
confirmed. The Midnight Diagnostics framework itself is permanent (future systems use it).
