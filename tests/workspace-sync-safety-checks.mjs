import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const writes = [], deletes = [], storage = new Map();
let tombstones = ['explicit-delete'];
const context = {
  currentUser: { uid: 'account-A' }, cloudHydratedUid: 'account-A',
  cloudRecordBaselines: new Map(), recordFingerprint: value => JSON.stringify(value, Object.keys(value).filter(key => key !== 'updatedAtClient').sort()),
  readGlobalArray: () => [{ id: 'kept' }],
  readCloudTombstones: () => tombstones,
  cloudDocId: item => item.id, cleanCloudValue: item => item,
  cloudTombstoneKey: (uid, name) => `${uid}/${name}`,
  db: {}, doc: (...parts) => parts.slice(1).join('/'),
  setDoc: async path => {
    writes.push(path);
    context.currentUser = { uid: 'account-B' };
    tombstones = ['explicit-delete', 'new-delete-during-sync'];
  },
  deleteDoc: async path => deletes.push(path),
  runTransaction: async (db, action) => action({
    get: async () => ({ exists: () => false }),
    set: (path, payload) => context.setDoc(path, payload),
    delete: path => context.deleteDoc(path)
  }),
  localStorage: { setItem: (key, value) => storage.set(key, value) }
};
vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('async function syncCollectionSnapshot('), html.indexOf('let workspaceCloudSyncTimer')), context);
await context.syncCollectionSnapshot('history', 'INVOICES');
assert.deepEqual(writes, ['users/account-A/history/kept']);
assert.deepEqual(deletes, ['users/account-A/history/explicit-delete']);
assert.deepEqual(JSON.parse(storage.get('account-A/history')), ['new-delete-during-sync']);
context.currentUser = { uid: 'account-A' };
context.cloudRecordBaselines.clear();
context.runTransaction = async (db, action) => action({
  get: async () => ({ exists: () => true, data: () => ({ id: 'kept', client: 'edited elsewhere' }) }),
  set() { throw new Error('Conflict must not overwrite remote data'); }
});
await assert.rejects(context.syncCollectionSnapshot('history', 'INVOICES'), /Another device changed/);
assert.equal(writes.length, 1);

const callbacks = [];
const draftContext = {
  editingInvoiceId: null, editingQuoteId: null,
  invoiceDraftTimer: null, quoteDraftTimer: null, wsActiveId: 'company-A',
  invoiceDraftData: () => ({ clientId: 'client-A' }),
  quoteDraftData: () => ({ clientId: 'client-A' }),
  clearTimeout() {}, setTimeout: fn => callbacks.push(fn),
  localStorage: { setItem: (key, value) => storage.set(key, value) }
};
vm.createContext(draftContext);
for (const type of ['Invoice', 'Quote']) {
  vm.runInContext(html.slice(html.indexOf(`function schedule${type}DraftSave()`), html.indexOf(`function restore${type}BuilderDraft()`)), draftContext);
  draftContext[`schedule${type}DraftSave`]();
}
draftContext.wsActiveId = 'company-B';
callbacks.forEach(fn => fn());
assert(storage.has('profacture_invoice_builder_draft_company-A'));
assert(storage.has('profacture_quote_builder_draft_company-A'));
assert(!storage.has('profacture_invoice_builder_draft_company-B'));

const companyContext = {
  COMPANIES: [{ id: 'placeholder', name: 'Your Business', isPlaceholder: true }],
  wsActiveId: 'saved-company',
  localStorage: { setItem: (key, value) => storage.set(key, value) },
  wsRenderAll() {}, populateDocumentCompanySelects() {}, renderCompaniesTable() {}, renderCompanyScopedViews() {},
  window: { CUSTOMER_COMPANIES: [] }
};
vm.createContext(companyContext);
vm.runInContext(html.slice(html.indexOf('function managedCompanyWorkspaces()'), html.indexOf('function wsInitials(')), companyContext);
companyContext.normalizeCompanyWorkspaces();
assert.equal(companyContext.wsActiveId, 'saved-company', 'A placeholder must not replace the selected company before hydration');
companyContext.COMPANIES.push({ id: 'saved-company', name: 'Saved company', sourceCompanyId: 'company-1' });
companyContext.ensureActiveCompany();
assert.equal(companyContext.wsActiveId, 'saved-company', 'The restored company should remain selected');
console.log('Sync safety passed: explicit deletions only, account snapshot, concurrent tombstones, company draft snapshots, saved company hydration.');
