import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const backend = fs.readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const records = new Map();
let queue = Promise.resolve();
const context = {
  Date, Math, Number,
  HttpsError: class extends Error { constructor(code, text) { super(text); this.code = code; } },
  AI_FEATURE_CREDITS: { assistant: 1, document_scan: 3 },
  AI_LIMITS: { perMinute: 100, perDay: 100, ocrPerDay: 100, globalPerMonth: 1000, globalTokensPerMonth: 1000000, duplicateWindowMs: 30000 },
  aiMonthKey: () => 'test', aiRequestHash: (uid, company, text) => uid + company + text,
  readAiRuntimeConfig: async () => ({ enabled: true, monthlyCostUsd: 0.5 }),
  admin: { firestore: { FieldValue: { delete: () => undefined, serverTimestamp: () => 1 } } },
  db: {
    doc: path => path,
    runTransaction: fn => {
      const result = queue.then(() => fn({
        get: async path => ({ exists: records.has(path), data: () => records.get(path) }),
        set: (path, data) => records.set(path, { ...records.get(path), ...data })
      }));
      queue = result.catch(() => {});
      return result;
    }
  }
};
vm.createContext(context);
vm.runInContext(backend.slice(backend.indexOf('async function enforceAiBudget('), backend.indexOf('async function finishAiRequest(')), context);
const results = await Promise.allSettled(Array.from({ length: 40 }, (_, i) => context.enforceAiBudget('u' + i, 'company', 'request')));
assert(results.some(result => result.status === 'fulfilled'));
assert(results.some(result => result.status === 'rejected' && result.reason.code === 'resource-exhausted'));
assert(records.get('systemAiUsage/test').allocatedCostUsd <= 0.5);
const previous = records.get('systemAiUsage/test').allocatedCostUsd;
records.get('users/u0/private/aiUsage').lastResult = { answer: 'cached' };
assert.equal((await context.enforceAiBudget('u0', 'company', 'request')).duplicateResult.answer, 'cached');
assert.equal(records.get('systemAiUsage/test').allocatedCostUsd, previous);

let configWrites = 0;
Object.assign(context, {
  exports: {}, onCall: (_, fn) => fn, requireAuth: request => request.auth,
  OWNER_EMAILS: new Set(['owner@example.test'])
});
context.db.doc = () => ({ set: async () => { configWrites++; } });
vm.runInContext(backend.slice(backend.indexOf('exports.aiConfigureBudget ='), backend.indexOf('// Each account has one active review')), context);
for (const auth of [{ uid: 'u', token: { email: 'other@example.test', email_verified: true } }, { uid: 'u', token: { email: 'owner@example.test', email_verified: false } }]) {
  await assert.rejects(context.exports.aiConfigureBudget({ auth, data: { monthlyCostUsd: 5, enabled: true } }), error => error.code === 'permission-denied');
}
const auth = { uid: 'owner', token: { email: 'owner@example.test', email_verified: true } };
await assert.rejects(context.exports.aiConfigureBudget({ auth, data: { monthlyCostUsd: 101, enabled: true } }));
assert.equal(configWrites, 0);
await context.exports.aiConfigureBudget({ auth, data: { monthlyCostUsd: 5, enabled: false } });
assert.equal(configWrites, 1);

assert(html.includes('original.status !== \'Draft\''));
assert(html.includes('JSON.stringify(original) !== source.snapshot'));
assert(html.includes('if (applyAiAction(action) === false) return;'));
assert(html.includes('(isInvoice ? editingInvoiceId : editingQuoteId) !== source.id'));
assert(html.includes("frame.setAttribute('sandbox','')"));
console.log('AI checks passed: concurrent admission cap, cached requests, owner budget authorization, draft/undo guards.');
