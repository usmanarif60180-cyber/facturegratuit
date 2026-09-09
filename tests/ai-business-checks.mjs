import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.slice(html.indexOf('    function aiBusinessFacts('), html.indexOf('    function aiWorkspaceContext('));
const sandbox = { invoiceBalance: inv => Number(inv.total || 0) - Number(inv.paid || 0) };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const facts = sandbox.aiBusinessFacts([
  { id: '1', client: 'A', issue: '2026-09-01', due: '2026-09-20', currency: 'EUR', total: 120, paid: 20, status: 'Sent' },
  { id: '2', client: 'B', issue: '2026-09-01', due: '2026-10-20', currency: 'USD', total: 90, status: 'Sent' },
  { id: '3', client: 'A', issue: '2026-08-01', due: '2026-08-20', currency: 'EUR', total: 50, status: 'Sent' },
  { id: '4', currency: 'EUR', total: 999, status: 'Draft' },
  { id: '5', currency: 'EUR', total: 999, status: 'Cancelled' }
], [{ id: 'Q1', status: 'Sent' }, { id: 'Q2', status: 'Draft' }], [{ currency: 'USD', amount: 25 }], [
  { name: 'Service', stock: null, minStock: null }, { name: 'Paint', stock: 2, minStock: 3 }
], '2026-09-08');
const eur = facts.byCurrency.find(x => x.currency === 'EUR');
const usd = facts.byCurrency.find(x => x.currency === 'USD');
assert.equal(eur.outstanding, 150);
assert.equal(eur.expectedReceipts30, 100);
assert.equal(usd.expectedReceipts30, 0);
assert.equal(usd.expectedReceipts60, 90);
assert.equal(usd.expenses, 25);
assert.equal(facts.unpaidCount, 3);
assert.equal(facts.unpaidInvoices[0].id, '3');
assert.equal(facts.pendingQuoteCount, 1);
assert.equal(facts.stockAlerts.length, 1);
assert(facts.documentIssues.some(x => x.problems.includes('missing client')));
const empty = sandbox.aiBusinessFacts([], [], [], [], '2026-09-08');
assert.equal(empty.byCurrency.length, 0);
console.log('AI business checks passed: currencies, partial payments, forecast horizons, exclusions, empty state.');
