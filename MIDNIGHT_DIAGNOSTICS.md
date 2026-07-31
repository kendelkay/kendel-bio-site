# Midnight Diagnostics

A small, reusable diagnostics **framework** for the Midnight platform. It is **not**
a Link Runtime debugger — the Link Runtime is its first consumer. Any system
registers a probe and gets a console banner, an aggregated debug badge, live event
recording, and a single `snapshot()` surface, for free.

## Register a probe

```js
var ch = MidnightDiagnostics.register({
  name: "LinkRuntime",          // system name (unique)
  version: 1,                   // optional
  build: "lr-diag-1",           // optional build/version tag
  snapshot: function () {        // called on demand; return any plain object
    return { loaded: true, enabled: true, env: "instagram/ios", embedded: true, intercepted: 2 };
  },
});

ch.event("intercept", { action: "fallback" });  // record a live event (updates the badge)
```

Future systems (content memory, intake, other runtimes) register the same way and
appear as additional rows in the same badge — no new debugger per system.

## Reading diagnostics

- **Console banner (always):** `[Midnight Diagnostics] <name> build <build> registered`.
- **On-page badge (opt-in):** append `?mdebug=1` (or the legacy `?lrdebug=1`) to the
  URL, or set `localStorage.md_debug='1'` / `window.MIDNIGHT_DEBUG=true`. A bottom-left
  badge lists every registered system, its live state, and its last event. Real
  visitors never see it.
- **Programmatic:** `MidnightDiagnostics.snapshot()` → `{ [system]: { meta, state, events } }`.

## Guarantees

- **Multi-tenant** — many systems, one badge, stable registration order.
- **Isolated** — a probe that throws is surfaced as `{ error }`, never crashes the
  snapshot or another system.
- **On-demand** — `snapshot()` re-invokes each probe (never stale).
- **Self-contained** — no build, no third-party deps; frozen public surface;
  node-loadable for self-checks.

## Consumer example (Link Runtime)

The Link Runtime registers a probe answering: did it load, which build, did detection
classify the environment as embedded, and did interception execute (a live
`intercept` event increments its counter). See `link-runtime.js` → `registerDiagnostics`.

Load order: `midnight-diagnostics.js` **before** any system that registers
(`link-runtime.js`).
