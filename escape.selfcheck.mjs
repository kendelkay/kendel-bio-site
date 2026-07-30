/* ============================================================================
 * escape.selfcheck.mjs — deterministic verification of the escape layer's PURE
 * logic (detection + URL validation + intent construction). No deps, no build:
 *   node escape.selfcheck.mjs
 *
 * This verifies ONLY what is deterministically checkable off-device. Real
 * in-app-browser rendering/escape on physical devices is manual QA — see QA.md.
 * ========================================================================== */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const LB = require("./escape.js");

let pass = 0;
let fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  ok  " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

const UA = {
  iosSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  androidChrome: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  desktopChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  igIos: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 331.0.0.0",
  igAndroid: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 Instagram 331.0.0.0 Android",
  fb: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 [FBAN/FBIOS;FBAV/460.0.0]",
  tiktok: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 musical_ly_2023 BytedanceWebview/d8a21c",
};

console.log("detectFromUA:");
ok(LB.detectFromUA(UA.iosSafari).embedded === false, "iOS Safari is NOT embedded");
ok(LB.detectFromUA(UA.androidChrome).embedded === false, "Android Chrome is NOT embedded");
ok(LB.detectFromUA(UA.desktopChrome).embedded === false, "Desktop Chrome is NOT embedded");
ok(LB.detectFromUA(UA.igIos).embedded === true && LB.detectFromUA(UA.igIos).source === "instagram" && LB.detectFromUA(UA.igIos).platform === "ios", "Instagram iOS → embedded/instagram/ios");
ok(LB.detectFromUA(UA.igAndroid).embedded === true && LB.detectFromUA(UA.igAndroid).platform === "android", "Instagram Android → embedded/android");
ok(LB.detectFromUA(UA.fb).source === "facebook", "Facebook webview → facebook");
ok(LB.detectFromUA(UA.tiktok).source === "tiktok", "TikTok webview → tiktok");

console.log("isValidHttpUrl:");
ok(LB.isValidHttpUrl("https://onlyfans.com/kendelkay") === "https://onlyfans.com/kendelkay", "https allowed");
ok(!!LB.isValidHttpUrl("http://x.com"), "http allowed");
ok(LB.isValidHttpUrl("javascript:alert(1)") === null, "javascript: rejected");
ok(LB.isValidHttpUrl("data:text/html,x") === null, "data: rejected");
ok(LB.isValidHttpUrl("intent://x#Intent;end") === null, "intent: rejected");
ok(LB.isValidHttpUrl("mailto:a@b.com") === null, "mailto: rejected");
ok(LB.isValidHttpUrl("") === null, "empty rejected");
ok(!!LB.isValidHttpUrl("terms.html", "https://site.example/"), "relative resolves against https base");
ok(LB.isValidHttpUrl("terms.html", "file:///x/") === null, "relative against non-http base rejected");

console.log("buildIntentUrl (attribution + fallback preserved, loop-safe):");
const intent = LB.buildIntentUrl("https://onlyfans.com/kendelkay?src=instagram_kendelkay#top");
ok(intent.startsWith("intent://onlyfans.com/kendelkay?src=instagram_kendelkay"), "preserves host+path+query (attribution)");
ok(intent.indexOf("#top") !== -1, "preserves hash");
ok(intent.indexOf("scheme=https") !== -1, "scheme=https");
ok(intent.indexOf("package=com.android.chrome") !== -1, "targets Chrome");
ok(intent.indexOf("S.browser_fallback_url=" + encodeURIComponent("https://onlyfans.com/kendelkay?src=instagram_kendelkay#top")) !== -1, "fallback_url = destination (never our page → no loop)");
ok(LB.buildIntentUrl("javascript:alert(1)") === null, "intent rejects non-http");

console.log("");
console.log("SELF-CHECK: " + pass + " passed, " + fail + " failed");
process.exit(fail === 0 ? 0 : 1);
