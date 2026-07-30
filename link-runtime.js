/* ============================================================================
 * link-runtime.js — the canonical Link Runtime.
 *
 * This is the ONE system that owns every outbound-navigation concern for the
 * link engine. Instagram in-app-browser escape is just ONE capability of the
 * runtime — not its identity. The runtime owns:
 *
 *   destination validation · attribution preservation · age-gate continuation ·
 *   browser behavior · embedded-browser handling · platform-specific routing ·
 *   analytics hooks · (reserved) link health · (reserved) provider behavior.
 *
 * PERMANENT PLATFORM CONTRACT
 * ---------------------------
 * No template, page, button, or future feature may perform outbound navigation
 * directly. Everything routes through the runtime. NEVER call window.open(...),
 * NEVER use target="_blank" as the actual navigator, NEVER assign location.href
 * for an outbound link — EXCEPT inside this runtime. In markup, an outbound link
 * is a declarative anchor and the runtime intercepts the click (capture phase);
 * in code, call LinkRuntime.navigate(destination). See LINK_RUNTIME.md.
 *
 * ABSTRACTIONS
 * ------------
 *  - Destination: the canonical object the runtime receives (never raw strings
 *    at the boundary — a string is accepted only as a convenience and is
 *    immediately normalized into a Destination).
 *  - Environment Provider: consumers ask "what environment am I in?" — never
 *    "does the UA contain Instagram?". UA detection is today's provider; a better
 *    signal source can replace it with no change to consumers.
 *
 * NON-GOALS (owned elsewhere): creator configuration · template rendering ·
 * destination ownership · launch policy · creator eligibility.
 *
 * ISOLATION / ROLLBACK: self-contained, no build, no third-party deps. Remove by
 * deleting this file + its <script> tag, or set window.LINK_RUNTIME_ENABLED=false;
 * the renderer keeps working (its guarded opener falls back to window.open).
 * No creator-specific (Kendel/Brandy) logic — behavior is uniform for every config.
 * ========================================================================== */
(function (root) {
  "use strict";

  /* ======================================================================== *
   * PURE CORE (no globals touched at eval time; node-loadable for self-check)
   * ======================================================================== */

  /**
   * Validates and normalizes an outbound URL. Allows ONLY http/https — rejecting
   * javascript:, data:, intent:, mailto:, malformed, and empty. Returns the
   * absolute URL string, or null. `base` resolves relative inputs.
   */
  function isValidHttpUrl(url, base) {
    if (typeof url !== "string" || !url.trim()) return null;
    var u;
    try { u = base ? new URL(url, base) : new URL(url); } catch (e) { return null; }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  }

  /** Extracts query params (attribution: src, utm_*, ref, …) as a plain object. */
  function attributionOf(absUrl) {
    var out = {};
    try {
      var u = new URL(absUrl);
      u.searchParams.forEach(function (v, k) { out[k] = v; });
    } catch (e) {}
    return out;
  }

  /**
   * Conservative embedded-webview detection from a UA string. Keys off explicit
   * in-app-browser tokens ONLY, so real Safari/Chrome/Firefox never match.
   * Returns { embedded, source, platform }. This is the DEFAULT provider's signal
   * source — not a contract consumers depend on directly.
   */
  function detectFromUA(ua) {
    ua = String(ua || "");
    var platform = /iPhone|iPad|iPod/i.test(ua) ? "ios"
      : /Android/i.test(ua) ? "android" : "other";
    var source = null;
    if (/Instagram/i.test(ua)) source = "instagram";
    else if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua)) source = "facebook";
    else if (/musical_ly|BytedanceWebview|TikTok|Bytedance|trill/i.test(ua)) source = "tiktok";
    else if (/Line\//i.test(ua)) source = "line";
    else if (/Snapchat/i.test(ua)) source = "snapchat";
    else if (/Twitter/i.test(ua)) source = "twitter";
    else if (/Pinterest/i.test(ua)) source = "pinterest";
    else if (/\bGSA\b/.test(ua)) source = "google_app";
    return { embedded: source !== null, source: source, platform: platform };
  }

  /**
   * Builds an Android intent:// URL handing the destination to Chrome, with the
   * destination itself as browser_fallback_url (so no redirect loop — it never
   * points back at our page). Preserves path + query + hash (attribution intact).
   */
  function buildIntentUrl(url) {
    var abs = isValidHttpUrl(url);
    if (!abs) return null;
    var u = new URL(abs);
    var scheme = u.protocol.replace(":", "");
    var rest = abs.slice((u.protocol + "//").length);
    return "intent://" + rest + "#Intent;scheme=" + scheme +
      ";package=com.android.chrome;S.browser_fallback_url=" +
      encodeURIComponent(abs) + ";end";
  }

  /* ======================================================================== *
   * DESTINATION — the one canonical object the runtime receives.
   * ======================================================================== */

  /**
   * Destination.from(input): input may be a raw URL string (convenience) or a
   * partial Destination object. Returns a frozen canonical Destination, or null
   * when the URL is invalid. The runtime stays provider-neutral: `provider` is
   * optional and free-form; unknown providers are allowed.
   *
   * Shape: { url, provider|null, ageRestricted:bool, attribution:{}, meta:{} }
   */
  var Destination = {
    from: function (input) {
      if (input && typeof input === "object") {
        var url = isValidHttpUrl(input.url);
        if (!url) return null;
        return Object.freeze({
          url: url,
          provider: input.provider || null,
          ageRestricted: !!input.ageRestricted,
          attribution: input.attribution || attributionOf(url),
          meta: input.meta || {},
        });
      }
      var abs = isValidHttpUrl(input);
      if (!abs) return null;
      return Object.freeze({
        url: abs, provider: null, ageRestricted: false,
        attribution: attributionOf(abs), meta: {},
      });
    },
  };

  /* ======================================================================== *
   * ENVIRONMENT PROVIDER — consumers ask "what environment am I in?".
   * The signal source (UA today, better signals tomorrow) is swappable with no
   * change to any consumer.
   * ======================================================================== */

  var nav = root.navigator;

  /** Default provider: derives the environment from the user-agent string. */
  function uaEnvironmentProvider() {
    return { name: "ua", current: function () { return detectFromUA(nav && nav.userAgent); } };
  }

  var envProvider = null;
  function setEnvironmentProvider(p) { envProvider = p; }
  function environment() {
    // A staging/QA override wins (a StaticEnvironmentProvider by another name).
    if (root.__LB_FORCE_ENV) return root.__LB_FORCE_ENV;
    if (!envProvider) envProvider = uaEnvironmentProvider();
    return envProvider.current();
  }

  /* ======================================================================== *
   * RUNTIME INTERNALS (browser-only below)
   * ======================================================================== */

  var doc = root.document;

  function enabled() { return root.LINK_RUNTIME_ENABLED !== false; }

  /** Analytics hook — GTM dataLayer (if present) + optional callback. */
  function track(event, dest, env) {
    try {
      root.dataLayer = root.dataLayer || [];
      root.dataLayer.push({ event: event, lb_destination: dest && dest.url, lb_provider: dest && dest.provider, lb_source: env.source, lb_platform: env.platform });
    } catch (e) {}
    try { if (typeof root.LINK_RUNTIME_ON_EVENT === "function") root.LINK_RUNTIME_ON_EVENT(event, dest, env); } catch (e) {}
  }

  function openNative(url) {
    var w = root.open(url, "_blank", "noopener");
    if (!w) { try { root.location.href = url; } catch (e) {} } // popup blocked → same tab, never lose the destination
  }

  /* ---- Fallback UI (DOM APIs; destination via textContent) ---------------- */
  var STYLE_ID = "lb-runtime-style";
  var OVERLAY_ID = "lb-runtime-overlay";

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;
    var css =
      "#" + OVERLAY_ID + "{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;" +
      "justify-content:center;padding:24px;background:rgba(10,8,12,.72);backdrop-filter:blur(6px);" +
      "-webkit-backdrop-filter:blur(6px);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}" +
      "#" + OVERLAY_ID + " .lb-rt-card{width:100%;max-width:380px;background:#17141b;color:#f4f1f6;border:1px solid rgba(255,255,255,.12);" +
      "border-radius:18px;padding:22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.5);}" +
      "#" + OVERLAY_ID + " h2{margin:0 0 6px;font-size:17px;font-weight:600;}" +
      "#" + OVERLAY_ID + " p{margin:0 0 14px;font-size:13.5px;line-height:1.5;color:#c9c3d1;}" +
      "#" + OVERLAY_ID + " .lb-rt-host{display:block;margin:0 0 16px;font-size:12px;word-break:break-all;color:#8f8a99;}" +
      "#" + OVERLAY_ID + " button{display:block;width:100%;margin:8px 0 0;padding:13px 14px;border-radius:12px;" +
      "font-size:14.5px;font-weight:600;border:1px solid transparent;cursor:pointer;}" +
      "#" + OVERLAY_ID + " .lb-rt-primary{background:#f4f1f6;color:#17141b;}" +
      "#" + OVERLAY_ID + " .lb-rt-secondary{background:transparent;color:#f4f1f6;border-color:rgba(255,255,255,.22);}" +
      "#" + OVERLAY_ID + " .lb-rt-ghost{background:transparent;color:#9a94a4;border:0;font-weight:500;margin-top:4px;}";
    var el = doc.createElement("style");
    el.id = STYLE_ID; el.textContent = css; doc.head.appendChild(el);
  }

  function closeFallback() {
    var o = doc && doc.getElementById(OVERLAY_ID);
    if (o && o.parentNode) o.parentNode.removeChild(o);
  }

  function legacyCopy(url) {
    try {
      var t = doc.createElement("textarea");
      t.value = url; t.setAttribute("readonly", "");
      t.style.position = "absolute"; t.style.left = "-9999px";
      doc.body.appendChild(t); t.select(); doc.execCommand("copy"); doc.body.removeChild(t);
    } catch (e) {}
  }
  function copyLink(url, btn) {
    var done = function () { btn.textContent = "Link copied ✓"; };
    try {
      if (nav && nav.clipboard && nav.clipboard.writeText) {
        nav.clipboard.writeText(url).then(done, function () { legacyCopy(url); done(); });
        return;
      }
    } catch (e) {}
    legacyCopy(url); done();
  }

  function showFallback(dest, env) {
    if (!doc) return;
    ensureStyle();
    closeFallback(); // idempotent — never stack, never loop
    track("link_runtime.fallback", dest, env);

    var host; try { host = new URL(dest.url).host; } catch (e) { host = dest.url; }

    var overlay = doc.createElement("div");
    overlay.id = OVERLAY_ID; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
    var card = doc.createElement("div"); card.className = "lb-rt-card";

    var h = doc.createElement("h2"); h.textContent = "Open in your browser";
    var p = doc.createElement("p");
    p.textContent = "You're in an in-app browser. To keep your account safe, tap the ⋯ menu " +
      "(top corner) and choose “Open in browser” — or use an option below.";
    var hostEl = doc.createElement("span"); hostEl.className = "lb-rt-host"; hostEl.textContent = host; // TEXT, never HTML
    card.appendChild(h); card.appendChild(p); card.appendChild(hostEl);

    if (env.platform === "android") {
      var openBtn = doc.createElement("button");
      openBtn.className = "lb-rt-primary"; openBtn.type = "button"; openBtn.textContent = "Open in Chrome";
      openBtn.addEventListener("click", function () { tryAndroidIntent(dest, env); });
      card.appendChild(openBtn);
    }
    var copyBtn = doc.createElement("button");
    copyBtn.className = env.platform === "android" ? "lb-rt-secondary" : "lb-rt-primary";
    copyBtn.type = "button"; copyBtn.textContent = "Copy link";
    copyBtn.addEventListener("click", function () { copyLink(dest.url, copyBtn); track("link_runtime.copy", dest, env); });
    card.appendChild(copyBtn);

    var contBtn = doc.createElement("button");
    contBtn.className = "lb-rt-secondary"; contBtn.type = "button"; contBtn.textContent = "Continue here";
    contBtn.addEventListener("click", function () {
      track("link_runtime.continue", dest, env); closeFallback(); openNative(dest.url); // destination never lost
    });
    card.appendChild(contBtn);

    var dismiss = doc.createElement("button");
    dismiss.className = "lb-rt-ghost"; dismiss.type = "button"; dismiss.textContent = "Cancel";
    dismiss.addEventListener("click", closeFallback);
    card.appendChild(dismiss);

    overlay.appendChild(card);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeFallback(); });
    doc.body.appendChild(overlay);
  }

  var androidIntentTried = false;
  function tryAndroidIntent(dest, env) {
    var intent = buildIntentUrl(dest.url);
    if (!intent) { showFallback(dest, env); return; }
    androidIntentTried = true;
    track("link_runtime.intent", dest, env);
    try { root.location.href = intent; } catch (e) { showFallback(dest, env); }
  }

  /* ======================================================================== *
   * PUBLIC API — the permanent interface. navigate() is the ONE outbound entry.
   * ======================================================================== */

  /**
   * navigate(destination): the single outbound entry point. Accepts a Destination
   * or (as a convenience) a raw URL string, which is normalized into a Destination.
   *   - invalid destination → no-op, returns false.
   *   - normal browser (or runtime disabled) → opens natively, unchanged.
   *   - embedded webview → platform-specific routing (Android intent handoff and/or
   *     the fallback screen). Never loops, never loses the destination.
   * Returns true when the runtime handled it via escape/fallback, false when it
   * passed through to native.
   */
  function navigate(input) {
    var dest = Destination.from(input);
    if (!dest) return false; // rejects malformed / unsupported protocols
    if (!enabled()) { openNative(dest.url); return false; }
    var env = environment();
    if (!env.embedded) { openNative(dest.url); return false; } // normal browser — no prompt
    track("link_runtime.embedded", dest, env);
    if (env.platform === "android" && !androidIntentTried) {
      tryAndroidIntent(dest, env); // evidence-supported escape first…
      showFallback(dest, env);      // …fallback stays available beneath it
    } else {
      showFallback(dest, env);      // iOS/other embedded: no reliable auto-escape
    }
    return true;
  }

  /* ---- Declarative interception: outbound anchors route through navigate() -- */
  function onClick(e) {
    if (!enabled()) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a || a.target !== "_blank") return; // internal + age-gate (href="#") anchors untouched
    var dest = Destination.from({ url: isValidHttpUrl(a.getAttribute("href"), root.location ? root.location.href : undefined), provider: a.getAttribute("data-lb-platform") || null });
    if (!dest) return;
    if (!environment().embedded) return; // normal browser → native behavior, no interception
    e.preventDefault();
    navigate(dest);
  }
  function bind() {
    if (!doc || !doc.addEventListener) return;
    doc.addEventListener("click", onClick, true); // capture phase → the runtime owns the navigation
  }

  var LinkRuntime = Object.freeze({
    version: 1,
    // The permanent interface:
    navigate: navigate,
    Destination: Destination,
    environment: environment,
    setEnvironmentProvider: setEnvironmentProvider,
    // Introspection / testing / UI control:
    detectFromUA: detectFromUA,
    isValidHttpUrl: isValidHttpUrl,
    buildIntentUrl: buildIntentUrl,
    closeFallback: closeFallback,
    _bind: bind,
  });

  if (typeof root !== "undefined" && root.document) {
    root.LinkRuntime = LinkRuntime;
    bind();
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = LinkRuntime; // node-loadable for deterministic self-checks
  }
})(typeof window !== "undefined" ? window : this);
