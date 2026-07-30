/* ============================================================================
 * midnight-diagnostics.selfcheck.mjs — deterministic checks for the framework.
 *   node midnight-diagnostics.selfcheck.mjs
 * ========================================================================== */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const MD = require("./midnight-diagnostics.js");

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log("  ok  " + n); } else { fail++; console.log("  FAIL " + n); } };

console.log("framework surface:");
ok(MD.version === 1 && typeof MD.register === "function" && typeof MD.snapshot === "function", "exposes version + register + snapshot");
ok(Object.isFrozen(MD), "public surface is frozen");

console.log("registration + snapshot aggregation:");
let counter = 0;
const ch = MD.register({ name: "SystemA", version: 2, build: "a-1", snapshot: () => ({ ready: true, n: counter }) });
ok(typeof ch.event === "function" && typeof ch.refresh === "function", "register returns a channel { event, refresh }");
let snap = MD.snapshot();
ok(snap.SystemA && snap.SystemA.meta.build === "a-1" && snap.SystemA.state.ready === true, "snapshot carries meta + live state");

console.log("live state is pulled on demand:");
counter = 5;
ok(MD.snapshot().SystemA.state.n === 5, "snapshot re-invokes the probe (not cached)");

console.log("event ring buffer:");
ch.event("tick", { a: 1 });
ch.event("tick", { a: 2 });
snap = MD.snapshot();
ok(snap.SystemA.events.length === 2 && snap.SystemA.events[1].data.a === 2, "events recorded and returned");

console.log("multiple systems + probe isolation:");
MD.register({ name: "SystemB", snapshot: () => { throw new Error("boom"); } });
snap = MD.snapshot();
ok(snap.SystemB && snap.SystemB.state.error && /boom/.test(snap.SystemB.state.error), "a throwing probe is isolated (surfaced as error, never crashes snapshot)");
ok(snap.SystemA && snap.SystemB, "both systems present — framework is multi-tenant");

console.log("\nSELF-CHECK: " + pass + " passed, " + fail + " failed");
process.exit(fail === 0 ? 0 : 1);
