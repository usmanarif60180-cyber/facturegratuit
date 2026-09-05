// AI Chantier System

window.PAYMENTS = window.PAYMENTS || [];
window.LABOR_ENTRIES = window.LABOR_ENTRIES || [];
window.DOCUMENTS = window.DOCUMENTS || [];
window.AVENANTS = window.AVENANTS || [];

function setupChantierTabs() {
  const tabs = document.querySelectorAll('.tab-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active from all tabs
      document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      
      // Add active to clicked
      tab.classList.add('active');
      const targetId = `pd-tab-${tab.dataset.tab}`;
      const target = document.getElementById(targetId);
      if (target) {
         target.style.display = 'block';
         renderChantierTabContent(tab.dataset.tab, window.pdActiveProjectId);
      }
    });
  });
}

function renderChantierTabContent(tabId, projectId) {
  if (!projectId) return;
  const project = window.PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  if (tabId === 'apercu') {
      // Handled by main renderProjectDetail
      renderChantierApercu(project);
  } else if (tabId === 'devis') {
      renderChantierDevis(project);
  } else if (tabId === 'factures') {
      renderChantierFactures(project);
  } else if (tabId === 'paiements') {
      renderChantierPaiements(project);
  } else if (tabId === 'depenses') {
      renderChantierDepenses(project);
  } else if (tabId === 'main-doeuvre') {
      renderChantierLabor(project);
  } else if (tabId === 'documents') {
      renderChantierDocuments(project);
  } else if (tabId === 'rentabilite') {
      renderChantierRentabilite(project);
  } else if (tabId === 'historique') {
      renderChantierHistorique(project);
  }
}

// Ensure the UI triggers our AI modal
document.addEventListener('DOMContentLoaded', () => {
   setupChantierTabs();
   
   document.getElementById('pd-ai-scan-btn')?.addEventListener('click', openAIScannerModal);
   document.getElementById('pd-ai-ask-btn')?.addEventListener('click', openAIAssistantModal);
   document.getElementById('pd-add-depense-btn')?.addEventListener('click', () => {
      // Just normal expense add
      if(window.openExpenseModal) window.openExpenseModal(window.pdActiveProjectId);
   });
});

// Render logic for each tab
function renderChantierDevis(project) {
  const container = document.getElementById('pd-devis-list');
  const quotes = window.QUOTES.filter(q => q.projectId === project.id || q.clientId === project.clientId);
  container.innerHTML = quotes.length ? quotes.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.id}</strong> - ${q.issue}</div>
        <div>${q.total}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucun devis</p>';
}

function renderChantierFactures(project) {
  const container = document.getElementById('pd-factures-list');
  const invs = window.INVOICES.filter(q => q.projectId === project.id || q.clientId === project.clientId);
  container.innerHTML = invs.length ? invs.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.id}</strong> - ${q.issue}</div>
        <div>${q.total}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucune facture</p>';
}

function renderChantierPaiements(project) {
  const container = document.getElementById('pd-paiements-list');
  const pays = window.PAYMENTS.filter(q => q.projectId === project.id);
  container.innerHTML = pays.length ? pays.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.date}</strong> - ${q.method}</div>
        <div>${q.amount}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucun paiement</p>';
}

function renderChantierDepenses(project) {
  const container = document.getElementById('pd-depenses-list');
  const exps = window.EXPENSES.filter(q => q.projectId === project.id);
  container.innerHTML = exps.length ? exps.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.date}</strong> - ${q.vendor} (${q.category})</div>
        <div>${q.amountTTC || q.amount}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucune dépense</p>';
}

function renderChantierLabor(project) {
  const container = document.getElementById('pd-heures-list');
  const labors = window.LABOR_ENTRIES.filter(q => q.projectId === project.id);
  container.innerHTML = labors.length ? labors.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.employee}</strong> - ${q.date} (${q.hours}h)</div>
        <div>${q.totalCost}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucune main-d\'œuvre</p>';
}

function renderChantierDocuments(project) {
  const container = document.getElementById('pd-docs-list');
  const docs = window.DOCUMENTS.filter(q => q.projectId === project.id);
  container.innerHTML = docs.length ? docs.map(q => `<div class="card card-pad" style="margin-bottom:0.5rem">
     <div style="display:flex;justify-content:space-between">
        <div><strong>${q.name}</strong> - ${q.date}</div>
     </div>
  </div>`).join('') : '<p class="widget-empty">Aucun document</p>';
}

function calculateChantierRentabilite(project) {
   const quotes = window.QUOTES.filter(q => q.projectId === project.id || q.clientId === project.clientId);
   const invs = window.INVOICES.filter(q => q.projectId === project.id || q.clientId === project.clientId);
   const exps = window.EXPENSES.filter(q => q.projectId === project.id);
   const labors = window.LABOR_ENTRIES.filter(q => q.projectId === project.id);
   const pays = window.PAYMENTS.filter(q => q.projectId === project.id);
   
   const totalQuoted = quotes.reduce((s, x) => s + (Number(x.total) || 0), 0);
   const totalInvoiced = invs.reduce((s, x) => s + (Number(x.total) || 0), 0);
   const totalReceived = pays.reduce((s, x) => s + (Number(x.amount) || 0), 0);
   
   const costMaterials = exps.filter(e => e.category === 'Matériaux').reduce((s, x) => s + (Number(x.amountHT) || Number(x.amount) || 0), 0);
   const costFuel = exps.filter(e => e.category === 'Carburant').reduce((s, x) => s + (Number(x.amountHT) || Number(x.amount) || 0), 0);
   const costLabor = labors.reduce((s, x) => s + (Number(x.totalCost) || 0), 0);
   const costOther = exps.filter(e => e.category !== 'Matériaux' && e.category !== 'Carburant').reduce((s, x) => s + (Number(x.amountHT) || Number(x.amount) || 0), 0);
   
   const totalCosts = costMaterials + costFuel + costLabor + costOther;
   const grossMargin = totalInvoiced - totalCosts;
   const marginPercent = totalInvoiced > 0 ? ((grossMargin / totalInvoiced) * 100).toFixed(1) : 0;
   
   return {
      totalQuoted, totalInvoiced, totalReceived,
      costMaterials, costFuel, costLabor, costOther, totalCosts,
      grossMargin, marginPercent
   };
}

function renderChantierRentabilite(project) {
  const container = document.getElementById('pd-rentabilite-view');
  const stats = calculateChantierRentabilite(project);
  
  container.innerHTML = `
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom: 1rem;">
       <div class="card stat-card"><div><div class="lbl">Total Facturé</div><div class="val tnum">${stats.totalInvoiced.toFixed(2)}</div></div></div>
       <div class="card stat-card"><div><div class="lbl">Coûts Directs (HT)</div><div class="val tnum" style="color:var(--danger)">${stats.totalCosts.toFixed(2)}</div></div></div>
       <div class="card stat-card"><div><div class="lbl">Marge Brute</div><div class="val tnum" style="color:var(--success)">${stats.grossMargin.toFixed(2)} (${stats.marginPercent}%)</div></div></div>
    </div>
    
    <div class="card card-pad">
       <div class="card-title">Détail des coûts</div>
       <table style="width:100%; text-align:left;">
          <tr><th>Catégorie</th><th>Montant HT</th></tr>
          <tr><td>Matériaux</td><td>${stats.costMaterials.toFixed(2)}</td></tr>
          <tr><td>Main-d'œuvre</td><td>${stats.costLabor.toFixed(2)}</td></tr>
          <tr><td>Carburant</td><td>${stats.costFuel.toFixed(2)}</td></tr>
          <tr><td>Autres</td><td>${stats.costOther.toFixed(2)}</td></tr>
       </table>
    </div>
  `;
}

function renderChantierApercu(project) {
   const container = document.getElementById('pd-financial-progress');
   const stats = calculateChantierRentabilite(project);
   if(container) {
       container.innerHTML = `
       <p style="display:flex;justify-content:space-between;"><span>Facturé:</span> <strong>${stats.totalInvoiced.toFixed(2)}</strong></p>
       <p style="display:flex;justify-content:space-between;"><span>Encaissé:</span> <strong>${stats.totalReceived.toFixed(2)}</strong></p>
       <p style="display:flex;justify-content:space-between;"><span>Reste à encaisser:</span> <strong>${(stats.totalInvoiced - stats.totalReceived).toFixed(2)}</strong></p>
       `;
   }
}

function renderChantierHistorique(project) {
  const container = document.getElementById('pd-historique-view');
  container.innerHTML = '<p class="widget-empty">Historique en cours de développement...</p>';
}

// AI Scanner
function openAIScannerModal() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*,application/pdf';
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show loading
    const aiLoading = document.createElement('div');
    aiLoading.className = 'cw-overlay';
    aiLoading.innerHTML = '<div class="glass-panel" style="padding: 2rem;text-align:center;"><h2>AI Scanning...</h2><p>Extraction des données en cours...</p></div>';
    document.body.appendChild(aiLoading);
    
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
         const dataUrl = ev.target.result;
         
         const firebaseFn = window.profactureHttpsCallable ? window.profactureHttpsCallable('aiDocumentScan') : null;
         if(!firebaseFn) throw new Error("Firebase non initialisé");
         
         const response = await firebaseFn({ companyId: window.wsActiveId || 'default', dataUrl: dataUrl });
         document.body.removeChild(aiLoading);
         
         const ext = response.data.extraction;
         showAIExtractionPreview(ext, file, window.pdActiveProjectId);
      };
      reader.readAsDataURL(file);
    } catch(err) {
      document.body.removeChild(aiLoading);
      alert('Erreur: ' + err.message);
    }
  };
  fileInput.click();
}

function showAIExtractionPreview(ext, file, defaultProjectId) {
  const preview = document.createElement('div');
  preview.className = 'cw-overlay';
  preview.style.zIndex = 9999;
  
  const projects = window.activeCompanyItems ? window.activeCompanyItems(window.PROJECTS) : (window.PROJECTS || []);
  const projectOptions = projects.map(p => `<option value="${p.id}" ${p.id === defaultProjectId ? 'selected' : ''}>${p.name}</option>`).join('');

  preview.innerHTML = `
    <div class="ob-backdrop"></div>
    <div class="card glass-panel cw-panel">
      <div class="cw-head">
         <h3 style="font-size:1rem;font-weight:800;">Confirmation AI</h3>
         <button class="ob-skip" onclick="this.closest('.cw-overlay').remove()">Annuler</button>
      </div>
      <div class="cw-body" style="overflow-y:auto;max-height:80vh;">
         <div class="ob-fields">
           <div class="field-wrap">
             <label>Fournisseur</label>
             <input type="text" class="field" id="ai-vendor" value="${ext.vendor || ''}">
           </div>
           <div class="field-wrap">
             <label>Date</label>
             <input type="date" class="field" id="ai-date" value="${ext.date || ''}">
           </div>
           <div class="field-wrap">
             <label>Catégorie (Suggérée: ${ext.category})</label>
             <select class="field" id="ai-category">
               ${['Matériaux', 'Carburant', 'Main-d’œuvre', 'Salaires', 'Outils', 'Location matériel', 'Sous-traitance', 'Péage', 'Parking', 'Transport', 'Fournitures', 'Pièces automobile', 'Restaurant / Repas', 'Hébergement', 'Assurance', 'Autres dépenses']
                 .map(c => `<option value="${c}" ${c === ext.category ? 'selected' : ''}>${c}</option>`).join('')}
             </select>
           </div>
           <div class="field-wrap">
             <label>Montant HT</label>
             <input type="number" class="field" id="ai-ht" value="${ext.amountHT || 0}">
           </div>
           <div class="field-wrap">
             <label>TVA</label>
             <input type="number" class="field" id="ai-tva" value="${ext.taxAmount || 0}">
           </div>
           <div class="field-wrap">
             <label>Montant TTC</label>
             <input type="number" class="field" id="ai-ttc" value="${ext.amountTTC || ext.amount || 0}">
           </div>
           <div class="field-wrap">
             <label>Chantier suggéré</label>
             <select class="field" id="ai-chantier">
                <option value="">-- Aucun Chantier --</option>
                ${projectOptions}
             </select>
           </div>
         </div>
      </div>
      <div class="cw-foot">
         <button class="btn btn-primary" id="ai-confirm-btn" style="width:100%">Confirmer et Enregistrer</button>
      </div>
    </div>
  `;
  document.body.appendChild(preview);
  
  document.getElementById('ai-confirm-btn').addEventListener('click', () => {
     const savedExpense = {
       id: 'EXP-' + Date.now(),
       vendor: document.getElementById('ai-vendor').value,
       date: document.getElementById('ai-date').value,
       category: document.getElementById('ai-category').value,
       amountHT: parseFloat(document.getElementById('ai-ht').value),
       taxAmount: parseFloat(document.getElementById('ai-tva').value),
       amountTTC: parseFloat(document.getElementById('ai-ttc').value),
       projectId: document.getElementById('ai-chantier').value,
       companyId: window.wsActiveId
     };
     
     window.EXPENSES.push(savedExpense);
     if(window.profactureSaveToCloud) window.profactureSaveToCloud('expenses', savedExpense);
     
     preview.remove();
     if(window.showToast) window.showToast('Dépense enregistrée');
     
     // Refresh current view if we are on project detail
     if(window.pdActiveProjectId) {
         renderChantierTabContent('depenses', window.pdActiveProjectId);
         renderChantierRentabilite(window.PROJECTS.find(p => p.id === window.pdActiveProjectId));
     }
  });
}

function openAIAssistantModal() {
  const modal = document.createElement('div');
  modal.className = 'cw-overlay';
  modal.style.zIndex = 9999;
  
  modal.innerHTML = `
    <div class="ob-backdrop"></div>
    <div class="card glass-panel cw-panel" style="max-width: 500px">
      <div class="cw-head">
         <h3 style="font-size:1rem;font-weight:800;">Assistant AI Chantier</h3>
         <button class="ob-skip" onclick="this.closest('.cw-overlay').remove()">Fermer</button>
      </div>
      <div class="cw-body" style="height: 400px; display:flex; flex-direction:column;">
         <div id="ai-chat-history" style="flex:1; overflow-y:auto; padding:1rem; background:hsl(var(--bg)); border-radius:8px; margin-bottom:1rem;">
            <p style="color:hsl(var(--muted-fg));font-size:0.9rem">Demandez-moi n'importe quoi sur ce chantier. Par exemple: "Quel est la marge actuelle ?" ou "Combien ai-je dépensé en matériaux ?"</p>
         </div>
         <div style="display:flex; gap:0.5rem;">
            <input type="text" id="ai-chat-input" class="field" placeholder="Posez votre question..." style="flex:1">
            <button class="btn btn-primary" id="ai-chat-send">Envoyer</button>
         </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  const sendBtn = document.getElementById('ai-chat-send');
  const input = document.getElementById('ai-chat-input');
  const history = document.getElementById('ai-chat-history');
  
  sendBtn.addEventListener('click', async () => {
      const text = input.value.trim();
      if(!text) return;
      
      input.value = '';
      history.innerHTML += `<div style="text-align:right; margin-bottom:0.8rem;"><span style="background:hsl(var(--primary)); color:white; padding:0.5rem 0.8rem; border-radius:12px; display:inline-block;">${text}</span></div>`;
      history.scrollTop = history.scrollHeight;
      
      try {
         const firebaseFn = window.profactureHttpsCallable ? window.profactureHttpsCallable('aiAssistant') : null;
         if(!firebaseFn) throw new Error("Firebase non initialisé");
         
         const project = window.PROJECTS.find(p => p.id === window.pdActiveProjectId);
         const stats = calculateChantierRentabilite(project);
         
         const context = JSON.stringify({
            chantier: project,
            stats: stats
         });
         
         const response = await firebaseFn({ message: text, context: context, companyId: window.wsActiveId || 'default' });
         const reply = response.data.text || "Désolé, je n'ai pas pu répondre.";
         
         history.innerHTML += `<div style="text-align:left; margin-bottom:0.8rem;"><span style="background:hsl(var(--border)); padding:0.5rem 0.8rem; border-radius:12px; display:inline-block;">${reply}</span></div>`;
         history.scrollTop = history.scrollHeight;
      } catch (err) {
         history.innerHTML += `<div style="text-align:left; margin-bottom:0.8rem; color:hsl(var(--danger))">Erreur: ${err.message}</div>`;
      }
  });
}

window.renderClientFinancials = function(client) {
   const container = document.getElementById("cd-ai-summary");
   if (!container) return;
   
   const projects = window.PROJECTS.filter(p => p.clientId === client.id);
   let totalQuoted = 0;
   let totalInvoiced = 0;
   let totalReceived = 0;
   let totalCosts = 0;
   
   projects.forEach(p => {
       const stats = calculateChantierRentabilite(p);
       totalQuoted += stats.totalQuoted;
       totalInvoiced += stats.totalInvoiced;
       totalReceived += stats.totalReceived;
       totalCosts += stats.totalCosts;
   });
   
   const outstanding = totalInvoiced - totalReceived;
   const grossMargin = totalInvoiced - totalCosts;
   const activeProjects = projects.filter(p => p.status !== 'Terminé' && p.status !== 'Annulé').length;
   
   container.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
         <div><strong>Total Devis:</strong> ${totalQuoted.toFixed(2)}</div>
         <div><strong>Total Facturé:</strong> ${totalInvoiced.toFixed(2)}</div>
         <div><strong>Total Encaissé:</strong> ${totalReceived.toFixed(2)}</div>
         <div><strong>Reste à encaisser:</strong> <span style="color:var(--danger)">${outstanding.toFixed(2)}</span></div>
         <div><strong>Total Dépenses (HT):</strong> ${totalCosts.toFixed(2)}</div>
         <div><strong>Marge globale:</strong> <span style="color:var(--success)">${grossMargin.toFixed(2)}</span></div>
         <div><strong>Chantiers Actifs:</strong> ${activeProjects} / ${projects.length}</div>
      </div>
   `;
};
