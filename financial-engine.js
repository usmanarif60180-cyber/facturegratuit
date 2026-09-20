(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ProFactureFinancial = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function toMinor(value) {
    if (value == null || value === "") return 0;
    var raw = typeof value === "number" ? value.toFixed(6) : String(value).trim().replace(/\s/g, "").replace(",", ".");
    var match = raw.match(/^(-?)(\d+)(?:\.(\d+))?$/);
    if (!match) return 0;
    var sign = match[1] ? -1 : 1;
    var fraction = (match[3] || "") + "000";
    var minor = Number(match[2]) * 100 + Number(fraction.slice(0, 2));
    if (Number(fraction.charAt(2) || 0) >= 5) minor += 1;
    return sign * minor;
  }

  function fromMinor(value) {
    return (Number(value) || 0) / 100;
  }

  function recordMinor(record, minorKey, majorKey) {
    if (record && Number.isSafeInteger(record[minorKey])) return record[minorKey];
    return toMinor(record && record[majorKey]);
  }

  function roundRatio(numerator, denominator) {
    if (!denominator) return 0;
    var sign = numerator < 0 ? -1 : 1;
    var absolute = Math.abs(numerator);
    return sign * Math.floor((absolute + Math.floor(denominator / 2)) / denominator);
  }

  function vatMinor(htMinor, rateBasisPoints) {
    return roundRatio(htMinor * (Number(rateBasisPoints) || 0), 10000);
  }

  function lineMinor(quantity, unitPrice) {
    var quantityUnits = Math.round((Number(quantity) || 0) * 10000);
    return roundRatio(quantityUnits * toMinor(unitPrice), 10000);
  }

  function documentTotals(items, taxRates) {
    var grouped = Object.create(null);
    var subtotalMinor = 0;
    var taxMinor = 0;
    (items || []).forEach(function (item) {
      var baseMinor = lineMinor(item.qty != null ? item.qty : item.quantity, item.price != null ? item.price : item.unitPrice);
      var code = Object.prototype.hasOwnProperty.call(taxRates || {}, item.tax) ? item.tax : "none";
      var rateBasisPoints = Math.round((Number((taxRates || {})[code]) || 0) * 100);
      var itemTaxMinor = vatMinor(baseMinor, rateBasisPoints);
      subtotalMinor += baseMinor;
      taxMinor += itemTaxMinor;
      if (rateBasisPoints > 0) {
        if (!grouped[code]) grouped[code] = { code: code, rateBasisPoints: rateBasisPoints, baseMinor: 0, amountMinor: 0 };
        grouped[code].baseMinor += baseMinor;
        grouped[code].amountMinor += itemTaxMinor;
      }
    });
    return { subtotalMinor: subtotalMinor, taxMinor: taxMinor, totalMinor: subtotalMinor + taxMinor, breakdown: Object.keys(grouped).map(function (code) { return grouped[code]; }) };
  }

  function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function isAccepted(record) {
    return ["accepted", "accepte", "converted"].indexOf(normalizeStatus(record && record.status)) !== -1 && !(record && record.supersededBy);
  }

  function signedInvoiceHt(record) {
    var amount = recordMinor(record, "htMinor", "subtotal");
    if (!amount) amount = recordMinor(record, "netHtMinor", "netHt");
    if (!amount) amount = recordMinor(record, "totalMinor", "total");
    var type = normalizeStatus(record && (record.invoiceType || record.type));
    return type === "avoir" || type === "credit note" || type === "credit_note" ? -Math.abs(amount) : amount;
  }

  function signedInvoiceTtc(record) {
    var amount = recordMinor(record, "payableMinor", "total");
    if (!amount) amount = recordMinor(record, "totalMinor", "total");
    var type = normalizeStatus(record && (record.invoiceType || record.type));
    return type === "avoir" || type === "credit note" || type === "credit_note" ? -Math.abs(amount) : amount;
  }

  function acceptedContractMinor(quotes, amendments) {
    var records = (quotes || []).concat(amendments || []);
    var seen = Object.create(null);
    return records.reduce(function (sum, record) {
      if (!isAccepted(record)) return sum;
      var versionKey = record.acceptedVersionId || record.versionGroupId || record.revisionOf || record.id;
      if (versionKey && seen[versionKey]) return sum;
      if (versionKey) seen[versionKey] = true;
      var accepted = recordMinor(record, "acceptedHtMinor", "acceptedValue");
      if (!accepted) accepted = recordMinor(record, "htMinor", "subtotal");
      if (!accepted) accepted = recordMinor(record, "totalMinor", "total");
      return sum + accepted;
    }, 0);
  }

  function allocatedPaymentsMinor(invoices, payments) {
    var invoiceIds = Object.create(null);
    var allocationKeys = new Set();
    (invoices || []).forEach(function (invoice) { if (invoice.id) invoiceIds[invoice.id] = true; });
    var total = (payments || []).reduce(function (sum, payment) {
      if (payment.voided || normalizeStatus(payment.status) === "cancelled") return sum;
      var allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      return sum + allocations.reduce(function (allocationSum, allocation) {
        if (!invoiceIds[allocation.invoiceId]) return allocationSum;
        if (payment.id) allocationKeys.add(String(allocation.invoiceId) + "\0" + String(payment.id));
        return allocationSum + recordMinor(allocation, "amountMinor", "amount");
      }, 0);
    }, 0);
    (invoices || []).forEach(function (invoice) {
      (Array.isArray(invoice.payments) ? invoice.payments : []).forEach(function (payment) {
        if (!payment.voided && normalizeStatus(payment.status) !== "cancelled" && (!payment.id || !allocationKeys.has(String(invoice.id) + "\0" + String(payment.id)))) total += recordMinor(payment, "amountMinor", "amount");
      });
    });
    return total;
  }

  function labourCostMinor(entries) {
    return (entries || []).reduce(function (sum, entry) {
      if (entry.voided || entry.expenseId) return sum;
      if (Number.isSafeInteger(entry.totalCostMinor)) return sum + entry.totalCostMinor;
      if (entry.totalCost != null) return sum + toMinor(entry.totalCost);
      var hoursHundredths = Math.round((Number(entry.hours) || 0) * 100);
      var hourlyMinor = recordMinor(entry, "hourlyCostMinor", "hourlyCost");
      return sum + roundRatio(hoursHundredths * hourlyMinor, 100);
    }, 0);
  }

  function directCostsMinor(expenses, labourEntries) {
    var expensesMinor = (expenses || []).reduce(function (sum, expense) {
      if (expense.voided || normalizeStatus(expense.approval) === "rejected") return sum;
      var hasHt = Number.isSafeInteger(expense.htMinor) || expense.amountHT != null;
      var amount = hasHt ? recordMinor(expense, "htMinor", "amountHT") : recordMinor(expense, "amountMinor", "amount");
      return sum + amount;
    }, 0);
    return expensesMinor + labourCostMinor(labourEntries);
  }

  function costCategoriesMinor(expenses, labourEntries) {
    var categories = Object.create(null);
    (expenses || []).forEach(function (expense) {
      if (expense.voided || normalizeStatus(expense.approval) === "rejected") return;
      var category = String(expense.category || "Autres dépenses").trim() || "Autres dépenses";
      var hasHt = Number.isSafeInteger(expense.htMinor) || expense.amountHT != null;
      var amount = hasHt ? recordMinor(expense, "htMinor", "amountHT") : recordMinor(expense, "amountMinor", "amount");
      categories[category] = (categories[category] || 0) + amount;
    });
    var labour = labourCostMinor(labourEntries);
    if (labour) categories["Main-d’œuvre"] = (categories["Main-d’œuvre"] || 0) + labour;
    return categories;
  }

  function inRange(dateValue, range) {
    if (!range) return true;
    if (!dateValue) return false;
    var date = String(dateValue).slice(0, 10);
    return (!range.start || date >= range.start) && (!range.end || date <= range.end);
  }

  function filterByRange(records, range, dateKeys) {
    return (records || []).filter(function (record) {
      var date = "";
      (dateKeys || ["date"]).some(function (key) { if (record && record[key]) { date = record[key]; return true; } return false; });
      return inRange(date, range);
    });
  }

  function periodActivity(input) {
    input = input || {};
    var range = input.range || { mode: "since_start" };
    var allInvoices = (input.invoices || []).filter(function (record) { return normalizeStatus(record.status) !== "cancelled"; });
    var periodInvoices = filterByRange(allInvoices, range, ["issue"]);
    var periodPayments = filterByRange(input.payments || [], range, ["date"]);
    var periodExpenses = filterByRange(input.expenses || [], range, ["date"]);
    var periodLabour = filterByRange(input.labourEntries || [], range, ["date"]);
    var ids = Object.create(null);
    var allocationKeys = new Set();
    allInvoices.forEach(function (invoice) { if (invoice.id) ids[invoice.id] = true; });
    var receivedMinor = periodPayments.reduce(function (sum, payment) {
      if (payment.voided || normalizeStatus(payment.status) === "cancelled") return sum;
      return sum + (payment.allocations || []).reduce(function (allocated, item) {
        if (!ids[item.invoiceId]) return allocated;
        if (payment.id) allocationKeys.add(String(item.invoiceId) + "\0" + String(payment.id));
        return allocated + recordMinor(item, "amountMinor", "amount");
      }, 0);
    }, 0);
    allInvoices.forEach(function (invoice) {
      filterByRange(invoice.payments || [], range, ["date"]).forEach(function (payment) {
        if (!payment.voided && normalizeStatus(payment.status) !== "cancelled" && (!payment.id || !allocationKeys.has(String(invoice.id) + "\0" + String(payment.id)))) receivedMinor += recordMinor(payment, "amountMinor", "amount");
      });
    });
    var invoicedHtMinor = periodInvoices.reduce(function (sum, invoice) { return sum + signedInvoiceHt(invoice); }, 0);
    var directCosts = directCostsMinor(periodExpenses, periodLabour);
    return {
      invoicedHtMinor: invoicedHtMinor,
      receivedMinor: receivedMinor,
      directCostsMinor: directCosts,
      grossMarginMinor: invoicedHtMinor - directCosts,
      grossMarginBasis: "period net invoiced revenue HT"
    };
  }

  function chantierSummary(input) {
    input = input || {};
    var quotes = input.quotes || [];
    var amendments = input.amendments || [];
    var invoices = (input.invoices || []).filter(function (record) { return normalizeStatus(record.status) !== "cancelled"; });
    var payments = input.payments || [];
    var expenses = input.expenses || [];
    var labourEntries = input.labourEntries || [];
    var contractMinor = acceptedContractMinor(quotes, amendments);
    var invoicedHtMinor = invoices.reduce(function (sum, invoice) { return sum + signedInvoiceHt(invoice); }, 0);
    var invoicePayableMinor = invoices.reduce(function (sum, invoice) { return sum + signedInvoiceTtc(invoice); }, 0);
    var receivedMinor = allocatedPaymentsMinor(invoices, payments);
    var costsMinor = directCostsMinor(expenses, labourEntries);
    var marginMinor = invoicedHtMinor - costsMinor;
    return {
      contractMinor: contractMinor,
      invoicedHtMinor: invoicedHtMinor,
      invoicePayableMinor: invoicePayableMinor,
      receivedMinor: receivedMinor,
      remainingToInvoiceMinor: contractMinor - invoicedHtMinor,
      outstandingMinor: invoicePayableMinor - receivedMinor,
      directCostsMinor: costsMinor,
      grossMarginMinor: marginMinor,
      grossMarginBasis: "net invoiced revenue HT",
      marginBasisPoints: invoicedHtMinor === 0 ? null : roundRatio(marginMinor * 10000, invoicedHtMinor),
      overInvoicedMinor: Math.max(0, invoicedHtMinor - contractMinor),
      overpaidMinor: Math.max(0, receivedMinor - invoicePayableMinor)
    };
  }

  return {
    toMinor: toMinor,
    fromMinor: fromMinor,
    vatMinor: vatMinor,
    lineMinor: lineMinor,
    documentTotals: documentTotals,
    acceptedContractMinor: acceptedContractMinor,
    allocatedPaymentsMinor: allocatedPaymentsMinor,
    labourCostMinor: labourCostMinor,
    directCostsMinor: directCostsMinor,
    costCategoriesMinor: costCategoriesMinor,
    filterByRange: filterByRange,
    periodActivity: periodActivity,
    chantierSummary: chantierSummary
  };
});
