import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const backend = fs.readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const models = vm.runInNewContext(backend.slice(backend.indexOf('const AI_MODELS ='), backend.indexOf('const AI_LIMITS =')) + '; AI_MODELS');
const prices = vm.runInNewContext(backend.slice(backend.indexOf('const AI_PRICING_PER_MILLION ='), backend.indexOf('const AI_NAV_DESTINATIONS =')) + '; AI_PRICING_PER_MILLION');
assert.deepEqual(Array.from(models), ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']);
assert(prices['gemini-3.1-flash-lite'].output > 0);
assert(!html.slice(html.indexOf('async function sendAiMessage('), html.indexOf('var AI_AUTOMATION_DEFAULTS')).includes('fallback ? fallback.replace'));

const calls = [];
let failed = 0;
let upstreamStatuses = [404, 200];
const sandbox = {
  exports: {}, onCall: (_, handler) => handler,
  AI_API_KEY: { value: () => 'test-key' }, AI_MODELS: models,
  AI_LIMITS: { messageChars: 4000, historyTurns: 6, historyTurnChars: 900, outputTokens: 2048, perDay: 30 },
  AI_CURRENCIES: new Set(['EUR']), AI_RESPONSE_SCHEMA: {},
  requireAuth: request => request.auth,
  cleanAiText: (value, max) => String(value || '').slice(0, max), cleanAiContext: value => value || {},
  loadAuthorizedAiContext: async () => ({ company: {}, clients: [] }),
  enforceAiBudget: async () => ({ runtime: { model: models[0] }, requestHash: 'hash', dayCount: 1 }),
  normalizeAiAction: action => action,
  finishAiRequest: async () => {}, saveAiConversation: async () => {},
  failAiRequest: async () => { failed++; },
  HttpsError: class extends Error { constructor(code, message) { super(message); this.code = code; } },
  fetch: async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    const status = upstreamStatuses.shift();
    return status === 200
      ? { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"reply":"Bonjour","action":{"type":"none","label":""}}' }] } }], usageMetadata: {} }) }
      : { ok: false, status };
  },
  console: { error() {} }
};
vm.createContext(sandbox);
vm.runInContext(backend.slice(backend.indexOf('exports.aiAssistant ='), backend.indexOf('// Receipt/supplier-invoice OCR.')), sandbox);
const request = { auth: { uid: 'user-1' }, data: { message: 'Bonjour', context: { company: { id: 'company-1' } } } };
const result = await sandbox.exports.aiAssistant(request);
assert.equal(result.reply, 'Bonjour');
assert.equal(calls.length, 2);
assert(calls[1].url.includes('gemini-3.1-flash-lite'));
assert.equal(calls[0].body.generationConfig.maxOutputTokens, 2048);
assert.equal(failed, 0);

upstreamStatuses = [429];
await assert.rejects(sandbox.exports.aiAssistant(request), error => error.code === 'resource-exhausted');
assert.equal(failed, 1);
console.log('AI service fallback passed: model 404 fallback, larger draft budget, clear 429 status.');
