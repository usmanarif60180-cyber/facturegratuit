import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const statusStart = source.indexOf('function getHistoryAmount(');
const statusEnd = source.indexOf('const HISTORY_STATUS_OPTIONS', statusStart);
const analyticsStart = source.indexOf('function buildAccountAnalytics(', statusEnd);
const analyticsEnd = source.indexOf('function computeBusinessHealthScore(', analyticsStart);
assert.ok(statusStart >= 0 && statusEnd > statusStart && analyticsStart > statusEnd && analyticsEnd > analyticsStart);

const sandbox = {
  S: { currency: 'EUR' },
  getCountryProfile: () => ({ currency: 'EUR' }),
  fmtCurrencyAmount: (amount, currency) => `${currency} ${amount}`
};
vm.createContext(sandbox);
vm.runInContext(source.slice(statusStart, statusEnd) + source.slice(analyticsStart, analyticsEnd), sandbox);

const now = new Date('2026-11-06T12:00:00.000Z');
const history = [
  { id:'i-paid-partial', docType:'facture', status:'Partiellement payée', date:'2026-10-01', dueDate:'2026-10-15', currency:'EUR', subtotal:100, tva:20, total:120, payments:[{ amount:30 }] },
  { id:'i-sent', docType:'facture', status:'Envoyée', date:'2026-10-02', dueDate:'2026-10-25', currency:'EUR', subtotal:50, tva:10, total:60 },
  { id:'i-draft', docType:'facture', status:'Brouillon', date:'2026-11-01', currency:'EUR', subtotal:900, tva:180, total:1080 },
  { id:'q-expired', docType:'devis', status:'Envoyé', date:'2026-10-01', expiryDate:'2026-10-05', currency:'EUR', total:500 },
  { id:'q-converted', docType:'devis', status:'Converti', convertedToId:'i-converted', date:'2026-10-02', currency:'EUR', total:75 },
  { id:'i-usd', docType:'facture', status:'Envoyée', date:'2026-10-03', currency:'USD', subtotal:20, tva:0, total:20 }
];

const analytics = sandbox.buildAccountAnalytics(history, { now });
assert.equal(analytics.invoices, 3, 'quotes and drafts must not count as issued invoices');
assert.equal(analytics.draft, 1);
assert.equal(analytics.quotes, 2);
assert.equal(analytics.conversionRate, 50, 'conversion counts converted quotes, not invoice-to-document ratio');
assert.equal(analytics.mixedCurrencies, true);
assert.equal(analytics.total, null, 'mixed currencies must never be silently added');
assert.equal(analytics.paid, null);
assert.deepEqual(Array.from(analytics.currencyBreakdown, item => item.code).sort(), ['EUR', 'USD']);
assert.equal(analytics.monthly.length, 2, 'monthly values stay split by currency');
assert.equal(analytics.topClients.length, 0, 'avoid ranking clients across unlike currencies');
assert.equal(sandbox.getHistoryStatus(history[3], now), 'sent', 'quote expiry is not invoice delinquency');
assert.equal(sandbox.getHistoryStatus(history[0], now), 'overdue', 'partial payment status must not hide a passed invoice due date');

const euroOnly = sandbox.buildAccountAnalytics(history.filter(item => item.currency === 'EUR'), { now });
assert.equal(euroOnly.total, 180);
assert.equal(euroOnly.paid, 30);
assert.equal(euroOnly.unpaid, 150);
assert.equal(euroOnly.overdue, 150, 'overdue amount is the unpaid balance, not full invoice value');
assert.equal(euroOnly.month, 0);
assert.equal(euroOnly.year, 180);
assert.equal(sandbox.formatAnalyticsMoney(null, analytics), 'Plusieurs devises');
console.log('Account analytics checks passed: invoice-only revenue, partial balances, overdue dates, quote conversion, and currency isolation.');
