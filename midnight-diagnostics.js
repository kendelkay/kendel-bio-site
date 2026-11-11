/* ============================================================================
 * midnight-diagnostics.js — Midnight Diagnostics.
 *
 * A small, reusable diagnostics FRAMEWORK for the Midnight platform. It is NOT a
 * Link Runtime debugger — the Link Runtime is merely its first consumer. Any
 * system (future runtimes, content memory, intake, etc.) registers a probe and
 * gets, for free: a console banner on registration, an aggregated debug badge,
 * live event recording, and a single `MidnightDiagnostics.snapshot()` surface.
 *
 * A system registers a probe:
 *     var ch = MidnightDiagnostics.register({
 *       name: "LinkRuntime", version: 1, build: "…",
 *       snapshot: function () { return { loaded: true, … }; }   // called on demand
 *     });
 *     ch.event("intercept", { … });   // record a live event (updates the badge)
 *
 * Debug-gated: the on-page badge shows ONLY when opted in
 * (?mdebug=1 — or the legacy ?lrdebug=1 — or localStorage md_debug=1 /
 * window.MIDNIGHT_DEBUG=true). Real visitors never see it. The console banner is
 * always emitted (harmless, invisible to users).
 *
 * Self-contained: no build, no third-party deps. Node-loadable for self-checks.
 * ========================================================================== */
(function (root) {
  "use strict";

  var VERSION = 1;
  var doc = root.document;
  var systems = {}; // name -> { meta, snapshot, events: [] }
  var order = [];   // registration order for stable badge output

  function debugOn() {
    try {
      if (root.MIDNIGHT_DEBUG === true) return true;
      if (root.location && /[?&](mdebug|lrdebug)=1(&|$)/.test(root.location.search)) return true;
      if (root.localStorage &&
          (root.localStorage.getItem("md_debug") === "1" || root.localStorage.getItem("lr_debug") === "1")) return true;
    } catch (e) {}
    return false;
  }

  function banner(rec) {
    try {
      if (root.console && root.console.info) {
        root.console.info("[Midnight Diagnostics] " + rec.meta.name +
          (rec.meta.build ? (" build " + rec.meta.build) : "") + " registered");
      }
    } catch (e) {}
  }

  /**
   * Register a system's diagnostic probe. Returns a channel:
   *   channel.event(type, data) — record a live event (bounded ring buffer)
   *   channel.refresh()         — re-render the badge
   */
  function register(system) {
    var name = (system && system.name) || ("system-" + (order.length + 1));
    var rec = {
      meta: { name: name, version: system && system.version, build: system && system.build },
      snapshot: (system && typeof system.snapshot === "function") ? system.snapshot : function () { return {}; },
      events: [],
    };
    if (!systems[name]) order.push(name);
    systems[name] = rec;
    banner(rec);
    render();
    return {
      event: function (type, data) {
        rec.events.push({ type: type, data: data });
        if (rec.events.length > 25) rec.events.shift();
        render();
      },
      refresh: render,
    };
  }

  /** Aggregate snapshot across every registered system. */
  function snapshot() {
    var out = {};
    for (var i = 0; i < order.length; i++) {
      var name = order[i], rec = systems[name], state;
      try { state = rec.snapshot() || {}; } catch (e) { state = { error: String(e) }; }
      out[name] = { meta: rec.meta, state: state, events: rec.events.slice(-5) };
    }
    return out;
  }

  /* ---- Aggregated debug badge (one surface for every system) -------------- */
  var BADGE_ID = "md-diagnostics";

  function fmt(v) {
    if (v && typeof v === "object") { try { return JSON.stringify(v); } catch (e) { return "[obj]"; } }
    return String(v);
  }

  function render() {
    if (!doc || !doc.body || !debugOn()) return;
    var el = doc.getElementById(BADGE_ID);
    if (!el) {
      el = doc.createElement("div");
      el.id = BADGE_ID;
      el.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:2147483001;max-width:92vw;max-height:42vh;overflow:auto;" +
        "padding:8px 10px;border-radius:8px;background:rgba(0,0,0,.85);color:#7CFFB2;" +
        "font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all;";
      doc.body.appendChild(el);
    }
    var snap = snapshot();
    var lines = ["Midnight Diagnostics v" + VERSION];
    for (var i = 0; i < order.length; i++) {
      var name = order[i], sys = snap[name];
      if (!sys) continue;
      lines.push("• " + name + (sys.meta.build ? ("  " + sys.meta.build) : ""));
      var st = sys.state || {}, parts = [];
      for (var k in st) if (Object.prototype.hasOwnProperty.call(st, k)) parts.push(k + "=" + fmt(st[k]));
      if (parts.length) lines.push("   " + parts.join("  "));
      var last = sys.events[sys.events.length - 1];
      if (last) lines.push("   last: " + last.type);
    }
    el.textContent = lines.join("\n");
  }

  function bindRender() {
    if (!doc) return;
    if (doc.body) render();
    else if (doc.addEventListener) doc.addEventListener("DOMContentLoaded", render);
  }

  var MidnightDiagnostics = Object.freeze({
    version: VERSION,
    register: register,
    snapshot: snapshot,
    debugOn: debugOn,
    _render: render,
  });

  if (typeof root !== "undefined" && root.document) {
    root.MidnightDiagnostics = MidnightDiagnostics;
    bindRender();
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MidnightDiagnostics; // node-loadable for self-checks
  }
})(typeof window !== "undefined" ? window : this);
