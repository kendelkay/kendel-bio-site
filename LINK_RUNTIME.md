# The Link Runtime — canonical outbound-navigation platform

**Identity:** this is the **Link Runtime**, the single system that owns every
outbound-navigation concern for the link engine. Instagram in-app-browser escape
is **one capability**, not the identity of the system. Instagram is a *consumer*,
never the name.

## Capabilities the runtime owns

- destination validation
- attribution preservation
- age-gate continuation (the navigation after an 18+ confirm)
- browser behavior (native new-tab handling)
- embedded-browser handling (Instagram / Facebook / TikTok / others)
- platform-specific routing (Android intent handoff; iOS/other fallback)
- analytics hooks
- link health *(reserved capability — owned by the runtime, not yet implemented)*
- future provider behavior *(reserved — Destination carries an optional `provider`)*

## The permanent platform contract (frozen)

> **No template, page, button, or future feature may perform outbound navigation
> directly. Everything routes through the Link Runtime.**

- **Never** `window.open(...)` for an outbound link — except inside the runtime.
- **Never** `target="_blank"` as the actual navigator — in markup an outbound link
  is a declarative anchor; the runtime intercepts the click (capture phase) and
  performs the navigation. The `target="_blank"` remains only as graceful
  degradation if the runtime is absent.
- **Never** `location.href = <outbound>` — except inside the runtime.

In imperative code, the only sanctioned call is:

```js
LinkRuntime.navigate(destination);   // destination = a Destination or a URL string
```

`window.LinkRuntime` is `Object.freeze`-d: the public interface is permanent.

## Abstraction 1 — Destination (the canonical object)

The runtime receives a **Destination**, never a raw URL string at its conceptual
boundary (a string is accepted only as a convenience and is immediately normalized).
This keeps the runtime provider-neutral and future-proof even though it currently
resolves to a URL internally.

```
Destination = {
  url,            // resolved http/https (validated; the only hard requirement)
  provider,       // optional, free-form ("onlyfans" | "fansly" | … | null) — provider-neutral
  ageRestricted,  // optional boolean
  attribution,    // preserved query params ({ src, utm_*, ref, … })
  meta,           // open map for future attributes — no migration to extend
}
```

`LinkRuntime.Destination.from(input)` → a frozen Destination, or `null` if the URL
is invalid. Accepts a string or a partial object.

## Abstraction 2 — Environment Provider

Consumers ask **"what environment am I in?"** — never "does the UA contain
Instagram?". Detection lives behind a provider so a better signal source can replace
UA sniffing with zero change to any consumer.

```js
LinkRuntime.environment();                 // → { embedded, source, platform }
LinkRuntime.setEnvironmentProvider(p);      // p.current() returns the same shape
```

- **Today:** the default provider derives the environment from the user-agent
  (conservative token match; real browsers never flagged).
- **Tomorrow:** a client-hints / native-bridge / server-signal provider can be
  swapped in — consumers are untouched.

## Non-goals (owned elsewhere, explicitly not the runtime's job)

- creator configuration
- template rendering
- destination ownership
- launch policy
- creator eligibility

The runtime performs navigation; it does not decide *what* a creator links to,
*whether* they may launch, or *how* a page is rendered.

## Behavior summary

| Environment | Behavior |
|---|---|
| Normal browser | Opens natively (new tab), attribution + target intact, no prompt. |
| Embedded — Android | Automatic `intent://` handoff to Chrome; fallback screen beneath if it fails. |
| Embedded — iOS / other | Fallback screen: open-in-browser instruction · Copy link · Continue here. |

Never loops (the intent `browser_fallback_url` is the destination itself, never our
page). Never loses the destination.

## Security

http/https only (rejects `javascript:`/`data:`/`intent:`/malformed) · no
open-redirect (only page-owned config URLs are ever navigated) · destination
rendered via `textContent` · no third-party dependencies · no creator-specific
branching.

## Rollback

One isolated change: delete `link-runtime.js` + its `<script>` tag, **or** set
`window.LINK_RUNTIME_ENABLED = false`. The renderer keeps working — its single
guarded call site (`lbOpen`) falls back to `window.open`.

## Relationship to the OTG validation layer

`kendelkay/OTGAgency.io` PR #77 is the **validation / specification** layer (the
deterministic + device two-class Launch-Ready model). **This** repo is the
**runtime**. The separation is permanent: spec lives in OTG, runtime lives here.
