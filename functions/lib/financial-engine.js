'use strict';

function toMinor(value) {
  if (value == null || value === '') return 0;
  const raw = typeof value === 'number' ? value.toFixed(6) : String(value).trim().replace(/\s/g, '').replace(',', '.');
  const match = raw.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match) return 0;
  const fraction = (match[3] || '') + '000';
  let minor = Number(match[2]) * 100 + Number(fraction.slice(0, 2));
  if (Number(fraction.charAt(2) || 0) >= 5) minor += 1;
  return (match[1] ? -1 : 1) * minor;
}

function recordMinor(record, minorKey, majorKey) {
  if (record && Number.isSafeInteger(record[minorKey])) return record[minorKey];
  return toMinor(record && record[majorKey]);
}

function roundRatio(numerator, denominator) {
  if (!denominator) return 0;
  const sign = numerator < 0 ? -1 : 1;
  return sign * Math.floor((Math.abs(numerator) + Math.floor(denominator / 2)) / denominator);
}

function status(value) {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function signedInvoice(record, basis) {
  let value = basis === 'ht'
    ? recordMinor(record, 'htMinor', 'subtotal') || recordMinor(record, 'netHtMinor', 'netHt')
    : recordMinor(record, 'payableMinor', 'total') || recordMinor(record, 'totalMinor', 'total');
  const type = status(record && (record.invoiceType || record.type));
  if (['avoir', 'credit note', 'credit_note'].includes(type)) value = -Math.abs(value);
  return value;
}

function acceptedContractMinor(quotes, amendments) {
  const seen = new Set();
  return [...(quotes || []), ...(amendments || [])].reduce((sum, record) => {
    if (!['accepted', 'accepte', 'converted'].includes(status(record.status)) || record.supersededBy) return sum;
    const key = record.acceptedVersionId || record.versionGroupId || record.revisionOf || record.id;
    if (key && seen.has(key)) return sum;
    if (key) seen.add(key);
    return sum + (recordMinor(record, 'acceptedHtMinor', 'acceptedValue') || recordMinor(record, 'htMinor', 'subtotal') || recordMinor(record, 'totalMinor', 'total'));
  }, 0);
}

function vatMinor(htMinor, rateBasisPoints) {
  return roundRatio(htMinor * (Number(rateBasisPoints) || 0), 10000);
}

function lineMinor(quantity, unitPrice) {
  return roundRatio(Math.round((Number(quantity) || 0) * 10000) * toMinor(unitPrice), 10000);
}

function documentTotals(items, taxRates) {
  let subtotalMinor = 0;
  let taxMinor = 0;
  (items || []).forEach((item) => {
    const baseMinor = lineMinor(item.qty != null ? item.qty : item.quantity, item.price != null ? item.price : item.unitPrice);
    const rate = Object.prototype.hasOwnProperty.call(taxRates || {}, item.tax) ? Number(taxRates[item.tax]) || 0 : 0;
    subtotalMinor += baseMinor;
    taxMinor += vatMinor(baseMinor, Math.round(rate * 100));
  });
  return { subtotalMinor, taxMinor, totalMinor: subtotalMinor + taxMinor };
}

function allocatedPaymentsMinor(invoices, payments) {
  const ids = new Set((invoices || []).map((invoice) => invoice.id).filter(Boolean));
  const allocationKeys = new Set();
  let total = (payments || []).reduce((sum, payment) => sum + (payment.voided || status(payment.status) === 'cancelled' ? 0 : (payment.allocations || []).reduce((allocated, item) => {
    if (!ids.has(item.invoiceId)) return allocated;
    if (payment.id) allocationKeys.add(String(item.invoiceId) + '\0' + String(payment.id));
    return allocated + recordMinor(item, 'amountMinor', 'amount');
  }, 0)), 0);
  (invoices || []).forEach((invoice) => (invoice.payments || []).forEach((payment) => { if (!payment.voided && status(payment.status) !== 'cancelled' && (!payment.id || !allocationKeys.has(String(invoice.id) + '\0' + String(payment.id)))) total += recordMinor(payment, 'amountMinor', 'amount'); }));
  return total;
}

function labourCostMinor(entries) {
  return (entries || []).reduce((sum, entry) => {
    if (entry.voided || entry.expenseId) return sum;
    if (Number.isSafeInteger(entry.totalCostMinor)) return sum + entry.totalCostMinor;
    if (entry.totalCost != null) return sum + toMinor(entry.totalCost);
    return sum + roundRatio(Math.round((Number(entry.hours) || 0) * 100) * recordMinor(entry, 'hourlyCostMinor', 'hourlyCost'), 100);
  }, 0);
}

function costCategoriesMinor(expenses, labourEntries) {
  const categories = Object.create(null);
  (expenses || []).forEach((record) => {
    if (record.voided || status(record.approval) === 'rejected') return;
    const category = String(record.category || 'Autres dépenses').trim() || 'Autres dépenses';
    const hasHt = Number.isSafeInteger(record.htMinor) || record.amountHT != null;
    const amount = hasHt ? recordMinor(record, 'htMinor', 'amountHT') : recordMinor(record, 'amountMinor', 'amount');
    categories[category] = (categories[category] || 0) + amount;
  });
  const labour = labourCostMinor(labourEntries);
  if (labour) categories['Main-d’œuvre'] = (categories['Main-d’œuvre'] || 0) + labour;
  return categories;
}

function inRange(value, range = {}) {
  if (!value) return false;
  const date = String(value).slice(0, 10);
  return (!range.start || date >= range.start) && (!range.end || date <= range.end);
}

function filterByRange(records, range, keys = ['date']) {
  return (records || []).filter((record) => keys.some((key) => record && record[key] && inRange(record[key], range)));
}

function periodActivity(input = {}) {
  const range = input.range || {};
  const invoices = (input.invoices || []).filter((record) => status(record.status) !== 'cancelled');
  const periodInvoices = filterByRange(invoices, range, ['issue']);
  const periodPayments = filterByRange(input.payments, range, ['date']);
  const periodExpenses = filterByRange(input.expenses, range, ['date']);
  const periodLabour = filterByRange(input.labourEntries, range, ['date']);
  const ids = new Set(invoices.map((invoice) => invoice.id).filter(Boolean));
  const allocationKeys = new Set();
  let receivedMinor = periodPayments.reduce((sum, payment) => sum + (payment.voided || status(payment.status) === 'cancelled' ? 0 : (payment.allocations || []).reduce((allocated, item) => {
    if (!ids.has(item.invoiceId)) return allocated;
    if (payment.id) allocationKeys.add(String(item.invoiceId) + '\0' + String(payment.id));
    return allocated + recordMinor(item, 'amountMinor', 'amount');
  }, 0)), 0);
  invoices.forEach((invoice) => filterByRange(invoice.payments, range, ['date']).forEach((payment) => { if (!payment.voided && status(payment.status) !== 'cancelled' && (!payment.id || !allocationKeys.has(String(invoice.id) + '\0' + String(payment.id)))) receivedMinor += recordMinor(payment, 'amountMinor', 'amount'); }));
  const invoicedHtMinor = periodInvoices.reduce((sum, invoice) => sum + signedInvoice(invoice, 'ht'), 0);
  const expenseMinor = periodExpenses.reduce((sum, record) => {
    if (record.voided || status(record.approval) === 'rejected') return sum;
    const hasHt = Number.isSafeInteger(record.htMinor) || record.amountHT != null;
    return sum + (hasHt ? recordMinor(record, 'htMinor', 'amountHT') : recordMinor(record, 'amountMinor', 'amount'));
  }, 0);
  const directCostsMinor = expenseMinor + labourCostMinor(periodLabour);
  return { invoicedHtMinor, receivedMinor, directCostsMinor, grossMarginMinor: invoicedHtMinor - directCostsMinor, grossMarginBasis: 'period net invoiced revenue HT' };
}

function summary(input = {}) {
  const invoices = (input.invoices || []).filter((record) => status(record.status) !== 'cancelled');
  const contractMinor = acceptedContractMinor(input.quotes, input.amendments);
  const invoicedHtMinor = invoices.reduce((sum, record) => sum + signedInvoice(record, 'ht'), 0);
  const invoicePayableMinor = invoices.reduce((sum, record) => sum + signedInvoice(record, 'ttc'), 0);
  const receivedMinor = allocatedPaymentsMinor(invoices, input.payments);
  const expenseMinor = (input.expenses || []).reduce((sum, record) => {
    if (record.voided || status(record.approval) === 'rejected') return sum;
    const hasHt = Number.isSafeInteger(record.htMinor) || record.amountHT != null;
    return sum + (hasHt ? recordMinor(record, 'htMinor', 'amountHT') : recordMinor(record, 'amountMinor', 'amount'));
  }, 0);
  const directCostsMinor = expenseMinor + labourCostMinor(input.labourEntries);
  const grossMarginMinor = invoicedHtMinor - directCostsMinor;
  return {
    contractMinor, invoicedHtMinor, invoicePayableMinor, receivedMinor, directCostsMinor, grossMarginMinor,
    remainingToInvoiceMinor: contractMinor - invoicedHtMinor,
    outstandingMinor: invoicePayableMinor - receivedMinor,
    marginBasisPoints: invoicedHtMinor === 0 ? null : roundRatio(grossMarginMinor * 10000, invoicedHtMinor),
    grossMarginBasis: 'net invoiced revenue HT',
    overInvoicedMinor: Math.max(0, invoicedHtMinor - contractMinor),
    overpaidMinor: Math.max(0, receivedMinor - invoicePayableMinor)
  };
}

module.exports = { toMinor, vatMinor, lineMinor, documentTotals, acceptedContractMinor, allocatedPaymentsMinor, labourCostMinor, costCategoriesMinor, filterByRange, periodActivity, summary };
