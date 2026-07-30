/* ============================================================================
 * escape.js — In-App Browser Escape Layer (centralized outbound-link handler)
 *
 * ONE reusable module owning ALL outbound-link behavior for the link engine:
 *   environment detection · destination preservation · attribution preservation ·
 *   external-browser attempt · fallback UI · analytics hooks.
 *
 * WHY: inside Instagram / Facebook / TikTok embedded webviews, a normal
 * target="_blank" just opens ANOTHER trapped in-app tab. This routes every
 * outbound CTA through one handler that, ONLY inside an embedded webview,
 * attempts a platform-safe escape (Android intent) and otherwise shows a clear
 * fallback (open-in-browser instruction · copy link · continue here). Outside
 * embedded webviews it does nothing — native behavior is preserved exactly.
 *
 * ISOLATION / ROLLBACK: self-contained, no third-party deps, no build step.
 * Remove the layer with either (a) delete this file + its <script> tag, or
 * (b) set `window.LB_ESCAPE_ENABLED = false`. The renderer keeps working: the
 * engine's outbound opens fall back to window.open when LBEscape is absent.
 *
 * The engine is never forked and no creator-specific (Kendel/Brandy) logic
 * exists here — behavior is uniform for every config.
 * ========================================================================== */
(function (root) {
  "use strict";

  /* ---- Pure helpers (no globals touched at eval time; node-loadable) ------ */

  /**
   * Validates and normalizes an outbound destination. Allows ONLY http/https,
   * rejecting javascript:, data:, intent:, mailto:, malformed, and empty URLs.
   * Returns the absolute URL string, or null when unsafe/unsupported. `base` is
   * used to resolve relative inputs (only http/https results are accepted).
   */
  function isValidHttpUrl(url, base) {
    if (typeof url !== "string" || !url.trim()) return null;
    var u;
    try {
      u = base ? new URL(url, base) : new URL(url);
    } catch (e) {
      return null;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  }

  /**
   * Conservative embedded-webview detection from a user-agent string. Keys off
   * explicit in-app-browser tokens ONLY, so real Safari / Chrome / Firefox never
   * trigger it (avoids false positives — normal browsers must behave normally).
   * Returns { embedded, source, platform }.
   */
  function detectFromUA(ua) {
    ua = String(ua || "");
    var platform = /iPhone|iPad|iPod/i.test(ua)
      ? "ios"
      : /Android/i.test(ua)
      ? "android"
      : "other";

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
   * Builds an Android `intent://` URL that hands the destination to Chrome, with
   * the destination itself as the browser_fallback_url (so if Chrome is absent,
   * the destination still loads — never our own page, so no redirect loop).
   * Preserves the full path + query + hash (attribution intact). Returns null
   * when the destination is not a valid http/https URL.
   */
  function buildIntentUrl(url) {
    var abs = isValidHttpUrl(url);
    if (!abs) return null;
    var u = new URL(abs);
    var scheme = u.protocol.replace(":", "");
    // Everything after the scheme://, i.e. host + path + query + hash.
    var rest = abs.slice((u.protocol + "//").length);
    return (
      "intent://" +
      rest +
      "#Intent;scheme=" +
      scheme +
      ";package=com.android.chrome;S.browser_fallback_url=" +
      encodeURIComponent(abs) +
      ";end"
    );
  }

  /* ---- Runtime (browser-only below) --------------------------------------- */

  var doc = root.document;
  var nav = root.navigator;

  function enabled() {
    return root.LB_ESCAPE_ENABLED !== false; // default ON; feature-flag OFF to disable
  }

  /** Current environment; a test/QA override via window.__LB_FORCE_ENV wins. */
  function detect() {
    if (root.__LB_FORCE_ENV) return root.__LB_FORCE_ENV;
    return detectFromUA(nav && nav.userAgent);
  }

  /** Analytics hook — pushes to GTM dataLayer (if present) and an optional callback. */
  function track(event, url, env) {
    try {
      root.dataLayer = root.dataLayer || [];
      root.dataLayer.push({ event: event, lb_destination: url, lb_source: env.source, lb_platform: env.platform });
    } catch (e) {}
    try {
      if (typeof root.LB_ESCAPE_ON_EVENT === "function") root.LB_ESCAPE_ON_EVENT(event, url, env);
    } catch (e) {}
  }

  function openNative(url) {
    // Preserve normal behavior: new tab, with noopener for safety.
    var w = root.open(url, "_blank", "noopener");
    if (!w) {
      try { root.location.href = url; } catch (e) {} // popup blocked → same-tab, never lose the destination
    }
  }

  /* ---- Fallback UI (built with DOM APIs; destination via textContent) ------ */

  var STYLE_ID = "lb-escape-style";
  var OVERLAY_ID = "lb-escape-overlay";

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;
    var css =
      "#" + OVERLAY_ID + "{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;" +
      "justify-content:center;padding:24px;background:rgba(10,8,12,.72);backdrop-filter:blur(6px);" +
      "-webkit-backdrop-filter:blur(6px);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}" +
      "#" + OVERLAY_ID + " .lb-esc-card{width:100%;max-width:380px;background:#17141b;color:#f4f1f6;border:1px solid rgba(255,255,255,.12);" +
      "border-radius:18px;padding:22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.5);}" +
      "#" + OVERLAY_ID + " h2{margin:0 0 6px;font-size:17px;font-weight:600;}" +
      "#" + OVERLAY_ID + " p{margin:0 0 14px;font-size:13.5px;line-height:1.5;color:#c9c3d1;}" +
      "#" + OVERLAY_ID + " .lb-esc-host{display:block;margin:0 0 16px;font-size:12px;word-break:break-all;color:#8f8a99;}" +
      "#" + OVERLAY_ID + " button{display:block;width:100%;margin:8px 0 0;padding:13px 14px;border-radius:12px;" +
      "font-size:14.5px;font-weight:600;border:1px solid transparent;cursor:pointer;}" +
      "#" + OVERLAY_ID + " .lb-esc-primary{background:#f4f1f6;color:#17141b;}" +
      "#" + OVERLAY_ID + " .lb-esc-secondary{background:transparent;color:#f4f1f6;border-color:rgba(255,255,255,.22);}" +
      "#" + OVERLAY_ID + " .lb-esc-ghost{background:transparent;color:#9a94a4;border:0;font-weight:500;margin-top:4px;}";
    var el = doc.createElement("style");
    el.id = STYLE_ID;
    el.textContent = css;
    doc.head.appendChild(el);
  }

  function closeFallback() {
    var o = doc && doc.getElementById(OVERLAY_ID);
    if (o && o.parentNode) o.parentNode.removeChild(o);
  }

  function copyLink(url, btn) {
    var done = function () { btn.textContent = "Link copied ✓"; };
    try {
      if (nav && nav.clipboard && nav.clipboard.writeText) {
        nav.clipboard.writeText(url).then(done, function () { legacyCopy(url); done(); });
        return;
      }
    } catch (e) {}
    legacyCopy(url);
    done();
  }

  function legacyCopy(url) {
    try {
      var t = doc.createElement("textarea");
      t.value = url;
      t.setAttribute("readonly", "");
      t.style.position = "absolute";
      t.style.left = "-9999px";
      doc.body.appendChild(t);
      t.select();
      doc.execCommand("copy");
      doc.body.removeChild(t);
    } catch (e) {}
  }

  function showFallback(url, env) {
    if (!doc) return;
    ensureStyle();
    closeFallback(); // idempotent — never stack overlays, never loop
    track("lb_escape_fallback", url, env);

    var host;
    try { host = new URL(url).host; } catch (e) { host = url; }

    var overlay = doc.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var card = doc.createElement("div");
    card.className = "lb-esc-card";

    var h = doc.createElement("h2");
    h.textContent = "Open in your browser";
    var p = doc.createElement("p");
    p.textContent =
      "You're in an in-app browser. To keep your account safe, tap the ⋯ menu " +
      "(top corner) and choose “Open in browser” — or use an option below.";
    var hostEl = doc.createElement("span");
    hostEl.className = "lb-esc-host";
    hostEl.textContent = host; // destination rendered as TEXT, never HTML

    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(hostEl);

    // Android: a reliable one-tap escape to Chrome (evidence-supported).
    if (env.platform === "android") {
      var openBtn = doc.createElement("button");
      openBtn.className = "lb-esc-primary";
      openBtn.type = "button";
      openBtn.textContent = "Open in Chrome";
      openBtn.addEventListener("click", function () { tryAndroidIntent(url, env); });
      card.appendChild(openBtn);
    }

    var copyBtn = doc.createElement("button");
    copyBtn.className = env.platform === "android" ? "lb-esc-secondary" : "lb-esc-primary";
    copyBtn.type = "button";
    copyBtn.textContent = "Copy link";
    copyBtn.addEventListener("click", function () { copyLink(url, copyBtn); track("lb_escape_copy", url, env); });
    card.appendChild(copyBtn);

    var contBtn = doc.createElement("button");
    contBtn.className = "lb-esc-secondary";
    contBtn.type = "button";
    contBtn.textContent = "Continue here";
    contBtn.addEventListener("click", function () {
      track("lb_escape_continue", url, env);
      closeFallback();
      openNative(url); // proceed inside the in-app browser — destination never lost
    });
    card.appendChild(contBtn);

    var dismiss = doc.createElement("button");
    dismiss.className = "lb-esc-ghost";
    dismiss.type = "button";
    dismiss.textContent = "Cancel";
    dismiss.addEventListener("click", closeFallback);
    card.appendChild(dismiss);

    overlay.appendChild(card);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeFallback(); });
    doc.body.appendChild(overlay);
  }

  var androidIntentTried = false;
  function tryAndroidIntent(url, env) {
    var intent = buildIntentUrl(url);
    if (!intent) { showFallback(url, env); return; }
    androidIntentTried = true;
    track("lb_escape_intent", url, env);
    try {
      root.location.href = intent; // hands off to Chrome; falls back to the destination itself
    } catch (e) {
      showFallback(url, env);
    }
  }

  /* ---- Public entry point ------------------------------------------------- */

  /**
   * The single outbound entry point. Validates the URL, and:
   *   - outside an embedded webview (or when disabled): opens natively (unchanged).
   *   - inside an embedded webview: attempts a platform-safe escape and/or shows
   *     the fallback. Never loops, never loses the destination.
   * Returns true when handled by the escape layer, false when passed through.
   */
  function open(url) {
    var abs = isValidHttpUrl(url);
    if (!abs) return false; // reject malformed / unsupported protocols

    if (!enabled()) { openNative(abs); return false; }

    var env = detect();
    if (!env.embedded) { openNative(abs); return false; } // normal browser — no prompt

    track("lb_escape_embedded", abs, env);
    if (env.platform === "android" && !androidIntentTried) {
      // Automatic evidence-supported escape first; fallback stays available beneath it.
      tryAndroidIntent(abs, env);
      showFallback(abs, env);
    } else {
      // iOS / other embedded: no reliable programmatic escape → clear fallback.
      showFallback(abs, env);
    }
    return true;
  }

  /* ---- Delegated click interception (centralizes every outbound CTA) ------ */

  function onClick(e) {
    if (!enabled()) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    // Only OUTBOUND CTAs: an explicit new-tab anchor with an http/https href.
    // Internal links (terms/privacy, no target) and the age-gate anchor
    // (href="#", handled via LB.continueToDestination) are left untouched.
    if (a.target !== "_blank") return;
    var abs = isValidHttpUrl(a.getAttribute("href"), root.location ? root.location.href : undefined);
    if (!abs) return;
    var env = detect();
    if (!env.embedded) return; // normal browser → native behavior, no interception
    e.preventDefault();
    open(abs);
  }

  function install() {
    if (!doc || !doc.addEventListener) return;
    doc.addEventListener("click", onClick, true); // capture phase → beats native nav
  }

  var LBEscape = {
    open: open,
    detect: detect,
    detectFromUA: detectFromUA,
    isValidHttpUrl: isValidHttpUrl,
    buildIntentUrl: buildIntentUrl,
    showFallback: showFallback,
    closeFallback: closeFallback,
    _install: install,
  };

  if (typeof root !== "undefined" && root.document) {
    root.LBEscape = LBEscape;
    install();
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = LBEscape; // node-loadable for deterministic self-checks
  }
})(typeof window !== "undefined" ? window : this);
