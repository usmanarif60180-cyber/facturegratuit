import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sandbox = {
  safeAiItems: draft => draft.items,
  calculateDocumentTotals: items => {
    assert.equal(items[0].description, 'Painting');
    return { subtotal: 100, taxTotal: 20, total: 120, breakdown: [{ rate: 20, amount: 20 }] };
  }
};
vm.createContext(sandbox);
vm.runInContext(html.slice(html.indexOf('    function aiDraftTotals('), html.indexOf('    function aiMoney(')), sandbox);
const totals = sandbox.aiDraftTotals({ items: [{ description: 'Painting' }] });
assert.equal(totals.total, 120);
assert.equal(totals.breakdown[0].rate, 20);
const send = html.slice(html.indexOf('    async function sendAiMessage('), html.indexOf('    var AI_AUTOMATION_DEFAULTS'));
assert(send.indexOf('requestCompanyId !== wsActiveId') < send.indexOf('aiConversation.push'));
assert(html.includes('if (submit.disabled || send.disabled) return;'));
assert(html.includes('Do not assume zero tax when unspecified.'));
assert(html.includes('if (form.dataset.company !== wsActiveId) form.reset();'));
console.log('AI composer checks passed: shared totals, company isolation, duplicate-submit guard and tax clarification.');
