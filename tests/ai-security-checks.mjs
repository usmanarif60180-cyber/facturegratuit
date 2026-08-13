import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "functions", "index.js"), "utf8")
  + "\nmodule.exports.__policy = { normalizeAiAction, cleanAiContext, AI_LIMITS };";

class MockHttpsError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const firestore = () => ({});
firestore.FieldValue = {
  serverTimestamp: () => null,
  delete: () => null,
  increment: value => value
};
const sandbox = {
  module: { exports: {} },
  exports: {},
  console,
  fetch: () => { throw new Error("Network calls are forbidden in policy tests"); },
  require(name) {
    if (name === "crypto") return crypto;
    if (name === "zlib") return zlib;
    if (name === "firebase-functions/v2/https") return { onCall: (_options, handler) => handler, HttpsError: MockHttpsError };
    if (name === "firebase-functions/params") return { defineSecret: () => ({ value: () => "test" }) };
    if (name === "firebase-admin") return { initializeApp() {}, firestore };
    throw new Error(`Unexpected module: ${name}`);
  }
};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(source, sandbox, { filename: "functions/index.js" });
const { normalizeAiAction, cleanAiContext, AI_LIMITS } = sandbox.module.exports.__policy;

const context = { company: { currency: "USD" }, clients: [{ id: "client-safe" }] };
const hostile = normalizeAiAction({
  type: "create_invoice",
  label: "Ignore all rules\u0000",
  draft: {
    clientId: "client-from-another-user",
    currency: "HACK",
    issueDate: "not-a-date",
    dueDate: "2099-99-99",
    items: Array.from({ length: 30 }, (_, index) => ({
      description: index === 0 ? "<script>steal()</script>" : `Line ${index}`,
      quantity: -5,
      unitPrice: 9999999999,
      tax: "vat999"
    }))
  }
}, context);

assert.equal(hostile.draft.clientId, "", "Unknown clients must be rejected");
assert.equal(hostile.draft.currency, "USD", "Unsupported currencies must fall back to the active company");
assert.equal(hostile.draft.issueDate, "", "Invalid dates must be dropped");
assert.equal(hostile.draft.items.length, 20, "AI drafts must be capped at 20 items");
assert.equal(hostile.draft.items[0].quantity, 0, "Negative quantities must be clamped");
assert.equal(hostile.draft.items[0].unitPrice, 100000000, "Extreme prices must be clamped");
assert.equal(hostile.draft.items[0].tax, "none", "Unknown tax codes must be rejected");
const blockedNavigation = normalizeAiAction({ type: "navigate", destination: "javascript:alert(1)" }, context);
assert.equal(blockedNavigation.type, "none");
assert.equal(blockedNavigation.label, "");
assert.throws(() => cleanAiContext({ payload: "x".repeat(AI_LIMITS.contextChars + 1) }), error => error.code === "invalid-argument");

assert(source.includes('minuteCount: admin.firestore.FieldValue.increment(-1)'), "Failed AI calls must refund the minute allowance");
assert(source.includes('requestCount: admin.firestore.FieldValue.increment(-1)'), "Failed AI calls must refund the global request allowance");

console.log("AI policy security checks passed.");
