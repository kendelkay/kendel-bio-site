/* ============================================================================
 * link-runtime.selfcheck.mjs — deterministic verification of the Link Runtime's
 * pure logic + canonical abstractions. No deps, no build:
 *   node link-runtime.selfcheck.mjs
 *
 * Verifies ONLY what is deterministically checkable off-device. Real in-app-browser
 * rendering / OS browser handoff is manual QA — see QA.md.
 * ========================================================================== */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const LR = require("./link-runtime.js");

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log("  ok  " + n); } else { fail++; console.log("  FAIL " + n); } };

const UA = {
  iosSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  androidChrome: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  desktopChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  igIos: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 331.0.0.0",
  igAndroid: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 Instagram 331.0.0.0 Android",
  fb: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 [FBAN/FBIOS;FBAV/460.0.0]",
  tiktok: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 musical_ly_2023 BytedanceWebview/d8a21c",
};

console.log("detection (default UA provider signal):");
ok(LR.detectFromUA(UA.iosSafari).embedded === false, "iOS Safari not embedded");
ok(LR.detectFromUA(UA.androidChrome).embedded === false, "Android Chrome not embedded");
ok(LR.detectFromUA(UA.desktopChrome).embedded === false, "Desktop Chrome not embedded");
ok(LR.detectFromUA(UA.igIos).source === "instagram" && LR.detectFromUA(UA.igIos).platform === "ios", "Instagram iOS → instagram/ios");
ok(LR.detectFromUA(UA.igAndroid).platform === "android" && LR.detectFromUA(UA.igAndroid).embedded, "Instagram Android → embedded/android");
ok(LR.detectFromUA(UA.fb).source === "facebook", "Facebook → facebook");
ok(LR.detectFromUA(UA.tiktok).source === "tiktok", "TikTok → tiktok");

console.log("Environment Provider (swappable; consumers ask, never sniff UA):");
LR.setEnvironmentProvider({ name: "static", current: () => ({ embedded: true, source: "custom", platform: "ios" }) });
ok(LR.environment().source === "custom", "custom provider replaces UA detection with no consumer change");
LR.setEnvironmentProvider({ name: "ua", current: () => LR.detectFromUA(UA.desktopChrome) });
ok(LR.environment().embedded === false, "provider swapped back to a UA signal");

console.log("Destination (canonical object; provider-neutral):");
const d1 = LR.Destination.from("https://onlyfans.com/kendelkay?src=instagram_kendelkay");
ok(d1 && d1.url === "https://onlyfans.com/kendelkay?src=instagram_kendelkay", "from(string) yields canonical Destination");
ok(d1.attribution.src === "instagram_kendelkay", "attribution preserved on the Destination");
ok(Object.isFrozen(d1), "Destination is immutable (frozen)");
const d2 = LR.Destination.from({ url: "https://fansly.com/x", provider: "fansly", ageRestricted: true });
ok(d2 && d2.provider === "fansly" && d2.ageRestricted === true, "from(object) carries provider + ageRestricted");
ok(LR.Destination.from("javascript:alert(1)") === null, "invalid protocol → null Destination");
ok(LR.Destination.from({ url: "data:text/html,x" }) === null, "invalid object url → null Destination");

console.log("URL validation + intent (attribution + loop-safety):");
ok(!!LR.isValidHttpUrl("http://x.com") && LR.isValidHttpUrl("mailto:a@b.com") === null, "http allowed; mailto rejected");
ok(!!LR.isValidHttpUrl("terms.html", "https://s/") && LR.isValidHttpUrl("terms.html", "file:///x/") === null, "relative resolves only against http base");
const intent = LR.buildIntentUrl("https://onlyfans.com/k?src=ig#top");
ok(intent.startsWith("intent://onlyfans.com/k?src=ig") && intent.indexOf("#top") !== -1, "intent preserves path+query+hash");
ok(intent.indexOf("package=com.android.chrome") !== -1, "intent targets Chrome");
ok(intent.indexOf("S.browser_fallback_url=" + encodeURIComponent("https://onlyfans.com/k?src=ig#top")) !== -1, "fallback_url = destination (no loop)");

console.log("navigate() boundary:");
ok(LR.navigate("javascript:alert(1)") === false, "navigate rejects invalid destination");

console.log("diagnostics (temporary production probe):");
const d = LR.diagnostics();
ok(d.version === 1 && typeof d.build === "string" && d.build.length > 0, "diagnostics exposes version + build tag");
ok("environment" in d && "intercepted" in d && "loaded" in d, "diagnostics exposes environment + intercepted + loaded");

console.log("\nSELF-CHECK: " + pass + " passed, " + fail + " failed");
process.exit(fail === 0 ? 0 : 1);
