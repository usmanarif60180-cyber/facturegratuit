(function () {
  "use strict";

  window.PAYMENTS = window.PAYMENTS || [];
  window.LABOR_ENTRIES = window.LABOR_ENTRIES || [];
  window.DOCUMENTS = window.DOCUMENTS || [];
  window.AVENANTS = window.AVENANTS || [];

  function projectId() {
    return window.profactureGetActiveProjectId ? window.profactureGetActiveProjectId() : "";
  }

  function companyId() {
    return window.profactureGetActiveCompanyId ? window.profactureGetActiveCompanyId() : "";
  }

  function escape(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function formatMoney(value, currencyCode) {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode || "EUR" }).format(Number(value) || 0); }
    catch (error) { return (Number(value) || 0).toFixed(2) + " " + (currencyCode || "EUR"); }
  }

  function scoped(records, project) {
    return (Array.isArray(records) ? records : []).filter(function (record) {
      return record && (record.projectId === project.id || record.project === project.id) && (!companyId() || !record.companyId || record.companyId === companyId());
    });
  }

  function moneyMinor(value, currencyCode) {
    return formatMoney(window.ProFactureFinancial.fromMinor(value), currencyCode);
  }

  function projectData(project) {
    var invoices = scoped(window.INVOICES, project);
    var quotes = scoped(window.QUOTES, project);
    var expenses = scoped(window.EXPENSES, project);
    var payments = scoped(window.PAYMENTS, project);
    var labourEntries = scoped(window.LABOR_ENTRIES, project);
    var amendments = scoped(window.AVENANTS, project);
    var documents = scoped(window.DOCUMENTS, project).concat(scoped(window.FILES, project));
    return {
      invoices: invoices,
      quotes: quotes,
      expenses: expenses,
      payments: payments,
      labourEntries: labourEntries,
      amendments: amendments,
      documents: documents,
      summary: window.ProFactureFinancial.chantierSummary({
        invoices: invoices, quotes: quotes, expenses: expenses, payments: payments,
        labourEntries: labourEntries, amendments: amendments
      })
    };
  }

  function closureIssues(project, data) {
    var issues = [];
    if (data.summary.remainingToInvoiceMinor !== 0) issues.push("Reste à facturer HT : " + data.summary.remainingToInvoiceMinor);
    if (data.summary.outstandingMinor !== 0) issues.push("Solde client TTC : " + data.summary.outstandingMinor);
    if (data.expenses.some(function (item) { return !item.category || item.category === "Other" || item.category === "Autres dépenses"; })) issues.push("Dépenses non classées");
    if (data.expenses.some(function (item) { return item.approval && item.approval !== "Approved" && item.approval !== "Rejected"; })) issues.push("Dépenses fournisseur en attente");
    if (data.summary.contractMinor > 0 && !data.invoices.some(function (item) { return item.invoiceType === "final"; })) issues.push("Facture finale absente");
    return issues;
  }

  function empty(text) {
    return '<p class="widget-empty">' + escape(text) + '</p>';
  }

  function rows(records, renderer, emptyText) {
    return records.length ? records.map(renderer).join("") : empty(emptyText);
  }

  function recordCard(title, detail, amount) {
    return '<div class="card card-pad" style="margin-bottom:0.6rem"><div style="display:flex;gap:1rem;justify-content:space-between;align-items:flex-start"><div><strong>' + escape(title) + '</strong><div class="meta">' + escape(detail || "—") + '</div></div>' + (amount ? '<strong class="tnum">' + escape(amount) + '</strong>' : '') + '</div></div>';
  }

  function renderProjectTab(tabId, id) {
    var project = (window.PROJECTS || []).find(function (item) { return item.id === id; });
    if (!project) return;
    var data = projectData(project);
    var code = project.currency || (window.profactureGetCurrentCurrency ? window.profactureGetCurrentCurrency() : "EUR");
    var target;

    if (tabId === "apercu") {
      target = document.getElementById("pd-financial-progress");
      if (target) target.innerHTML = [
        ["Valeur acceptée HT", data.summary.contractMinor], ["Facturé HT", data.summary.invoicedHtMinor],
        ["Encaissé TTC", data.summary.receivedMinor], ["Reste à facturer HT", data.summary.remainingToInvoiceMinor],
        ["Reste à encaisser TTC", data.summary.outstandingMinor], ["Coûts directs HT", data.summary.directCostsMinor],
        ["Marge brute actuelle HT", data.summary.grossMarginMinor]
      ].map(function (entry) { return '<div class="widget-row"><span>' + entry[0] + '</span><strong>' + moneyMinor(entry[1], code) + '</strong></div>'; }).join("") + '<p class="meta" style="margin-top:0.7rem">Marge basée sur le chiffre d’affaires facturé HT. Paiements suivis séparément en TTC.</p>' + (project.status === "completed" ? '<div class="callout" style="margin-top:0.8rem"><span>✓</span><span>Travaux terminés le ' + escape(project.actualCompletionDate || "date non renseignée") + '. Situation financière : ' + (closureIssues(project, data).length ? escape(closureIssues(project, data).join(" · ")) : "soldée") + '.</span></div>' : '');
      return;
    }
    if (tabId === "devis") {
      target = document.getElementById("pd-devis-list");
      if (target) target.innerHTML = rows(data.quotes.concat(data.amendments), function (item) { return recordCard(item.id || item.number || "Devis", (item.issue || item.date || "") + " · " + (item.status || "Brouillon"), formatMoney(item.total || item.amount || 0, item.currency || code)); }, "Aucun devis ou avenant lié à ce chantier.");
      return;
    }
    if (tabId === "factures") {
      target = document.getElementById("pd-factures-list");
      if (target) target.innerHTML = rows(data.invoices, function (item) { return recordCard(item.id || "Facture", (item.issue || "") + " · " + (item.status || "Brouillon"), formatMoney(item.total || 0, item.currency || code)); }, "Aucune facture liée à ce chantier.");
      return;
    }
    if (tabId === "paiements") {
      target = document.getElementById("pd-paiements-list");
      if (target) target.innerHTML = rows(data.payments, function (item) { return recordCard(item.reference || item.id || "Paiement", (item.date || "") + " · " + (item.method || "Autre"), formatMoney(item.amount || window.ProFactureFinancial.fromMinor(item.amountMinor), item.currency || code)); }, "Aucun paiement séparé et alloué à ce chantier.");
      return;
    }
    if (tabId === "depenses") {
      target = document.getElementById("pd-depenses-list");
      if (target) target.innerHTML = rows(data.expenses, function (item) { return recordCard(item.vendor || item.title || "Dépense", (item.date || "") + " · " + (item.category || "Autres dépenses"), formatMoney(item.amountHT || item.amount || 0, item.currency || code)); }, "Aucune dépense liée à ce chantier.");
      return;
    }
    if (tabId === "main-doeuvre") {
      target = document.getElementById("pd-heures-list");
      if (target) target.innerHTML = rows(data.labourEntries, function (item) { return recordCard(item.employee || "Main-d’œuvre", (item.date || "") + " · " + (item.hours || 0) + " h", moneyMinor(window.ProFactureFinancial.labourCostMinor([item]), code)); }, "Aucune entrée de main-d’œuvre liée à ce chantier.");
      return;
    }
    if (tabId === "documents") {
      target = document.getElementById("pd-docs-list");
      if (target) target.innerHTML = rows(data.documents, function (item) { return recordCard(item.name || "Document", item.date || item.updatedAt || item.type || "", ""); }, "Aucun document lié à ce chantier.");
      return;
    }
    if (tabId === "rentabilite") {
      target = document.getElementById("pd-rentabilite-view");
      if (target) {
        var margin = data.summary.marginBasisPoints == null ? "Non applicable" : (data.summary.marginBasisPoints / 100).toFixed(2) + " %";
        target.innerHTML = '<div class="stat-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="card stat-card"><div><div class="lbl">Facturé HT</div><div class="val tnum">' + moneyMinor(data.summary.invoicedHtMinor, code) + '</div></div></div><div class="card stat-card"><div><div class="lbl">Coûts directs HT</div><div class="val tnum">' + moneyMinor(data.summary.directCostsMinor, code) + '</div></div></div><div class="card stat-card"><div><div class="lbl">Marge brute actuelle</div><div class="val tnum">' + moneyMinor(data.summary.grossMarginMinor, code) + '</div><div class="meta">' + margin + ' du facturé HT</div></div></div></div>' +
          (data.summary.overInvoicedMinor ? '<div class="callout" style="margin-top:1rem"><span>⚠️</span><span>Dépassement du contrat accepté : ' + moneyMinor(data.summary.overInvoicedMinor, code) + ' HT.</span></div>' : '') +
          (data.summary.overpaidMinor ? '<div class="callout" style="margin-top:1rem"><span>⚠️</span><span>Trop-perçu ou paiement non rapproché : ' + moneyMinor(data.summary.overpaidMinor, code) + ' TTC.</span></div>' : '') +
          '<p class="meta" style="margin-top:1rem">Cette marge brute chantier n’est pas un bénéfice net final. Les frais généraux et impôts ne sont pas inclus.</p>';
      }
      return;
    }
    if (tabId === "historique") {
      target = document.getElementById("pd-historique-view");
      var timeline = [];
      data.quotes.forEach(function (item) { timeline.push({ date: item.acceptedAt || item.issue, label: (item.id || "Devis") + " · " + (item.status || "") }); });
      data.invoices.forEach(function (item) { timeline.push({ date: item.issue, label: (item.id || "Facture") + " · " + (item.status || "") }); });
      data.payments.forEach(function (item) { timeline.push({ date: item.date, label: (item.reference || "Paiement") + " · " + (item.method || "") }); });
      data.expenses.forEach(function (item) { timeline.push({ date: item.date, label: (item.vendor || item.title || "Dépense") + " · " + (item.category || "") }); });
      timeline.sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
      if (target) target.innerHTML = rows(timeline, function (item) { return recordCard(item.label, item.date, ""); }, "Aucune activité enregistrée pour ce chantier.");
    }
  }

  function openProjectAssistant() {
    var id = projectId();
    var project = (window.PROJECTS || []).find(function (item) { return item.id === id; });
    if (!project || !window.profactureShowView) return;
    window.profactureShowView("ai");
    var input = document.getElementById("ai-input");
    if (input) {
      input.value = "Analyse le chantier " + (project.name || project.id) + ". Indique clairement le périmètre, la période, la base HT/TTC et les données manquantes.";
      input.focus();
    }
  }

  function reportRows(entries, code) {
    return entries.map(function (entry) {
      return '<div class="widget-row"><span>' + escape(entry[0]) + '</span><strong>' + moneyMinor(entry[1] || 0, code) + '</strong></div>';
    }).join("");
  }

  async function loadProjectReport(monthly) {
    var id = projectId();
    var project = (window.PROJECTS || []).find(function (item) {
      return item.id === id && (!companyId() || !item.companyId || item.companyId === companyId());
    });
    var result = document.getElementById("pd-report-result");
    if (!project || !result) return;
    if (!window.profactureChantierFinancialSummary) {
      result.textContent = "Le rapport serveur n'est pas disponible.";
      return;
    }
    var month = document.getElementById("pd-report-month").value;
    if (monthly && !/^\d{4}-\d{2}$/.test(month)) {
      result.textContent = "Choisissez d'abord un mois.";
      return;
    }
    var range = monthly ? { start: month + "-01", end: new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10) } : {};
    result.textContent = "Calcul du rapport en cours…";
    try {
      var report = await window.profactureChantierFinancialSummary({ companyId: companyId(), projectId: id, range: range });
      if (id !== projectId()) return;
      var code = report.currency || project.currency || "EUR";
      var summary = report.summary || {};
      var activity = report.activity || {};
      var categories = monthly ? report.periodCostCategoriesMinor : report.costCategoriesMinor;
      var categoryRows = Object.keys(categories || {}).sort().map(function (category) {
        return [category + " HT", categories[category]];
      });
      var headline = monthly ? "Activité de " + month : "Depuis le début du chantier";
      var financialRows = monthly
        ? [["Facturé pendant la période HT", activity.invoicedHtMinor], ["Encaissé pendant la période TTC", activity.receivedMinor],
           ["Coûts directs pendant la période HT", activity.directCostsMinor], ["Marge brute de la période HT", activity.grossMarginMinor]]
        : [["Devis initiaux acceptés HT", report.acceptedInitialHtMinor], ["Avenants acceptés HT", report.acceptedAmendmentsHtMinor],
           ["Contrat accepté HT", summary.contractMinor], ["Facturé net HT", summary.invoicedHtMinor],
           ["Encaissé TTC", summary.receivedMinor], ["Reste à facturer HT", summary.remainingToInvoiceMinor],
           ["Reste à encaisser TTC", summary.outstandingMinor], ["Coûts directs HT", summary.directCostsMinor],
           ["Marge brute actuelle HT", summary.grossMarginMinor]];
      var margin = summary.marginBasisPoints == null ? "Non applicable" : (summary.marginBasisPoints / 100).toFixed(2) + " %";
      var warningText = (report.warnings || []).map(function (warning) {
        return warning.code === "OVER_INVOICED" ? "Facturation supérieure au contrat accepté : " + moneyMinor(warning.amountMinor, code) + " HT"
          : warning.code === "OVERPAID" ? "Trop-perçu : " + moneyMinor(warning.amountMinor, code) + " TTC"
          : warning.code === "MISSING_ACCEPTED_CONTRACT" ? "Aucun devis accepté lié au chantier" : warning.code;
      });
      result.innerHTML = '<div class="callout"><span>✓</span><span>Rapport calculé sur les données autorisées de la société.</span></div>' +
        '<h4 style="margin:0.85rem 0 0.35rem">' + escape(report.projectName || project.name) + ' · ' + escape(headline) + '</h4>' +
        '<p class="meta">' + escape(report.projectReference || id) + (report.startDate ? " · Début : " + escape(report.startDate) : "") +
        (report.completionDate ? " · Travaux terminés : " + escape(report.completionDate) : "") + '</p>' +
        reportRows(financialRows, code) +
        (categoryRows.length ? '<h4 style="margin:0.9rem 0 0.3rem">Coûts directs par catégorie</h4>' + reportRows(categoryRows, code) : '<p class="meta" style="margin-top:0.7rem">Aucun coût direct enregistré.</p>') +
        (monthly ? '<p class="meta" style="margin-top:0.7rem">Activité datée du mois; les soldes cumulés ne sont pas additionnés à cette période.</p>' : '<p class="meta" style="margin-top:0.7rem">Marge brute : ' + escape(margin) + ' du facturé net HT. Ce n’est pas un bénéfice net après frais généraux et impôts.</p>') +
        (warningText.length ? '<div class="callout" style="margin-top:0.7rem"><span>!</span><span>' + escape(warningText.join(" · ")) + '</span></div>' : '');
    } catch (error) {
      result.textContent = "Rapport indisponible. Vérifiez votre connexion, les droits de la société et le déploiement des fonctions Firebase.";
    }
  }

  function setup() {
    var reportMonth = document.getElementById("pd-report-month");
    if (reportMonth) reportMonth.value = new Date().toISOString().slice(0, 7);
    var monthlyReport = document.getElementById("pd-report-monthly");
    if (monthlyReport) monthlyReport.addEventListener("click", function () { loadProjectReport(true); });
    var finalReport = document.getElementById("pd-report-final");
    if (finalReport) finalReport.addEventListener("click", function () { loadProjectReport(false); });
    document.querySelectorAll("#view-project-detail .tab-link").forEach(function (tab) {
      tab.addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelectorAll("#view-project-detail .tab-link").forEach(function (item) { item.classList.toggle("active", item === tab); });
        document.querySelectorAll("#view-project-detail .tab-content").forEach(function (panel) { panel.style.display = "none"; });
        var target = document.getElementById("pd-tab-" + tab.dataset.tab);
        if (target) target.style.display = "block";
        renderProjectTab(tab.dataset.tab, projectId());
      });
    });
    var scan = document.getElementById("pd-ai-scan-btn");
    if (scan) scan.addEventListener("click", function () { if (window.profactureOpenExpenseModal) window.profactureOpenExpenseModal(projectId()); });
    var expense = document.getElementById("pd-add-depense-btn");
    if (expense) expense.addEventListener("click", function () { if (window.profactureOpenExpenseModal) window.profactureOpenExpenseModal(projectId()); });
    var quote = document.getElementById("pd-add-devis-btn");
    if (quote) quote.addEventListener("click", function () {
      if (window.profactureStartProjectDocument) window.profactureStartProjectDocument("quote", projectId());
    });
    var invoice = document.getElementById("pd-add-facture-btn");
    if (invoice) invoice.addEventListener("click", function () {
      if (window.profactureStartProjectDocument) window.profactureStartProjectDocument("invoice", projectId());
    });
    var payment = document.getElementById("pd-add-paiement-btn");
    if (payment) payment.addEventListener("click", function () {
      var id = projectId();
      var openInvoice = (window.INVOICES || []).filter(function (item) {
        return item && (item.projectId === id || item.project === id) &&
          (!companyId() || !item.companyId || item.companyId === companyId()) &&
          (!window.profactureInvoiceBalance || window.profactureInvoiceBalance(item) > 0);
      }).sort(function (a, b) { return String(a.due || a.issue || "").localeCompare(String(b.due || b.issue || "")); })[0];
      if (openInvoice && window.profactureOpenPaymentModal) {
        window.profactureOpenPaymentModal(openInvoice.id);
      } else {
        window.alert("Aucune facture avec un solde à encaisser n'est liée à ce chantier.");
      }
    });
    var labour = document.getElementById("pd-add-heure-btn");
    if (labour) labour.addEventListener("click", function () {
      if (window.profactureOpenLabourModal) window.profactureOpenLabourModal(projectId());
    });
    var documentUpload = document.getElementById("pd-add-doc-btn");
    if (documentUpload) documentUpload.addEventListener("click", function () {
      if (window.profactureOpenProjectFileUpload) window.profactureOpenProjectFileUpload(projectId());
    });
    var assistant = document.getElementById("pd-ai-ask-btn");
    if (assistant) assistant.addEventListener("click", openProjectAssistant);
    var closeProject = document.getElementById("pd-close-project-btn");
    if (closeProject) closeProject.addEventListener("click", function () {
      var project = (window.PROJECTS || []).find(function (item) { return item.id === projectId(); });
      if (!project) return;
      var data = projectData(project);
      var code = project.currency || (window.profactureGetCurrentCurrency ? window.profactureGetCurrentCurrency() : "EUR");
      var issues = closureIssues(project, data).map(function (issue) {
        var parts = issue.split(": ");
        return parts.length === 2 && /^-?\d+$/.test(parts[1]) ? parts[0] + ": " + moneyMinor(Number(parts[1]), code) : issue;
      });
      var message = "Marquer les travaux comme terminés ?" + (issues.length ? "\n\nPoints financiers non résolus :\n- " + issues.join("\n- ") : "\n\nAucun point financier bloquant détecté.");
      if (!window.confirm(message)) return;
      project.status = "completed";
      project.actualCompletionDate = new Date().toISOString().slice(0, 10);
      project.closureIssues = issues;
      project.updatedAt = new Date().toISOString();
      project.notes = Array.isArray(project.notes) ? project.notes : [];
      project.notes.unshift({ text: "Clôture travaux" + (issues.length ? " avec " + issues.length + " point(s) financier(s) à suivre" : " · situation soldée"), date: project.actualCompletionDate, type: "closure" });
      if (window.profacturePersistWorkspaceLocal) window.profacturePersistWorkspaceLocal();
      if (window.profactureSyncWorkspaceCloud) window.profactureSyncWorkspaceCloud(250);
      if (window.profactureRenderProjectDetail) window.profactureRenderProjectDetail(project.id);
      renderProjectTab("apercu", project.id);
    });
  }

  window.renderChantierTabContent = renderProjectTab;
  window.calculateChantierRentabilite = function (project) { return projectData(project).summary; };
  window.renderClientFinancials = function (client) {
    var target = document.getElementById("cd-ai-summary");
    if (!target) return;
    var projects = (window.PROJECTS || []).filter(function (project) { return project.clientId === client.id && (!companyId() || !project.companyId || project.companyId === companyId()); });
    if (!projects.length) { target.innerHTML = empty("Aucun chantier lié à ce client."); return; }
    var total = { contractMinor: 0, invoicedHtMinor: 0, receivedMinor: 0, outstandingMinor: 0, directCostsMinor: 0, grossMarginMinor: 0 };
    projects.forEach(function (project) { var summary = projectData(project).summary; Object.keys(total).forEach(function (key) { total[key] += summary[key] || 0; }); });
    var code = projects[0].currency || (window.profactureGetCurrentCurrency ? window.profactureGetCurrentCurrency() : "EUR");
    target.innerHTML = [["Travaux acceptés HT", total.contractMinor], ["Facturé HT", total.invoicedHtMinor], ["Encaissé TTC", total.receivedMinor], ["Reste à encaisser TTC", total.outstandingMinor], ["Coûts directs HT", total.directCostsMinor], ["Marge brute HT", total.grossMarginMinor]].map(function (entry) { return '<div class="widget-row"><span>' + entry[0] + '</span><strong>' + moneyMinor(entry[1], code) + '</strong></div>'; }).join("");
  };
  document.addEventListener("DOMContentLoaded", setup);
})();
