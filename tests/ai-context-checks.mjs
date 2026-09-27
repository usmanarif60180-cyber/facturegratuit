import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
let resolve;
let rendered = false;
const context = {
  wsActiveId: 'one', aiHistoryLoadedCompanyId: '', aiConversation: [], aiChatRequestRevision: 0,
  window: { profactureAiHistory: () => new Promise(r => { resolve = r; }) },
  renderAiHistory() { rendered = true; },
  CLIENTS: [{ id: 'c1', name: 'Client', company: '' }],
  activeCompanyItems: items => items, clientDisplayName: c => c.name
};
vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('    async function loadAiHistory('), html.indexOf('    function safeAiItems(')), context);
assert.equal(context.findAiDraftClient({}), null);
assert.equal(context.findAiDraftClient({ clientId: 'c1' }).name, 'Client');
const pending = context.loadAiHistory({});
context.wsActiveId = 'two';
resolve({ messages: [{ text: 'Company one' }] });
await pending;
assert.equal(rendered, false);
assert.equal(context.aiConversation.length, 0);
context.aiHistoryLoadedCompanyId = '';
const sameCompany = context.loadAiHistory({});
context.aiChatRequestRevision++;
context.aiConversation.push({text: 'new message'});
resolve({messages: [{text: 'old message'}]});
await sameCompany;
assert.equal(context.aiConversation[0].text, 'new message');
const scan = html.slice(html.indexOf('    var aeScanReceiptBtn'), html.indexOf('    var aeSubmitBtn'));
assert(scan.indexOf('scanCompanyId !== wsActiveId || scanDataUrl !== aeReceiptDataUrl') < scan.indexOf('aeExtraction = value'));
console.log('AI context checks passed: client matching, late history and OCR guard.');
