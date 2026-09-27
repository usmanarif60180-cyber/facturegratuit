import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const context = {
  automationRules: () => [{id:'overdue', enabled:true}], activeCompanyItems: x => x,
  INVOICES: [], QUOTES: [], PRODUCTS: [], EXPENSES: [], invoiceBalance: x => x.balance,
  aiMoney: (amount, currency) => amount + ' ' + currency
};
vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('    function evaluateAutomationRules('), html.indexOf('    function renderAutomationCenter(')), context);
for (const status of ['Draft', 'Paid', 'Cancelled']) {
  context.INVOICES = [{id:'1',status,due:'2020-01-01',balance:100,currency:'USD'}];
  assert.equal(context.evaluateAutomationRules().length, 0);
}
context.INVOICES = [{id:'1',status:'Sent',due:'2020-01-01',balance:75,currency:'USD'}];
assert(context.evaluateAutomationRules()[0].reason.includes('75 USD'));
context.INVOICES[0].balance = 0;
assert.equal(context.evaluateAutomationRules().length, 0);
const historyContext = {wsActiveId:'one', appendAiMessage(){}, appendAiAction(_chat, action){ assert.equal(action.historyReadOnly,true); }, renderAiActivity(){}};
vm.createContext(historyContext);
vm.runInContext(html.slice(html.indexOf('    function renderAiHistory('),html.indexOf('    function renderAiActivity(')),historyContext);
historyContext.renderAiHistory({},[{role:'assistant',action:{type:'create_invoice'}}]);
historyContext.renderAiHistory({},[{role:'assistant',action:{type:'create_quote'}}]);
console.log('AI follow-up tests passed: issued-only, balance, currency and read-only history.');
