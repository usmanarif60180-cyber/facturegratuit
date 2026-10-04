import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const storage = new Map();
const localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key)
};
const window = { CLIENTS: [{ id: 'from-account-A' }] };
const context = { window, localStorage, console, Date, WORKSPACE_COLLECTIONS: [{ collection: 'clients', windowName: 'CLIENTS' }] };
vm.createContext(context);
const storageFunctions = html.slice(html.indexOf('function accountStorageKey(name)'), html.indexOf('function cloudDocId(item, index)'));
vm.runInContext(`let currentUser = null; ${storageFunctions}`, context);
storage.set('profacture_account_guest_collection_clients', JSON.stringify([{ id: 'guest-record' }]));
storage.set('profacture_account_account-A_collection_clients', JSON.stringify([{ id: 'account-A-record' }]));
storage.set('profacture_account_account-B_collection_clients', JSON.stringify([{ id: 'account-B-record' }]));
context.resetWorkspaceForAuth('account-B', 'account-A');
context.hydrateWorkspaceFromLocal({ uid: 'account-B', email: '' });
assert.deepEqual(window.CLIENTS.map(item => item.id), ['account-B-record']);
assert.equal(storage.get('profacture_account_account-A_collection_clients'), JSON.stringify([{ id: 'account-A-record' }]));

const many = Array.from({ length: 250 }, (_, id) => ({ id }));
assert.equal(context.cleanCloudValue(many).length, 250);
const image = 'data:image/png;base64,' + 'x'.repeat(300001);
assert.equal(context.cleanCloudValue({ image }).image, image);
assert.deepEqual(Array.from(context.cleanCloudValue([null, 1])), [null, 1]);
let deeplyNested = {};
for (let i = 0; i < 22; i++) deeplyNested = { value: deeplyNested };
assert.throws(() => context.cleanCloudValue(deeplyNested), /too deep/);

const backupContext = {
  window: { CLIENTS: [{ id: 'current', name: 'Current' }] }, localStorage, currentUser: { uid: 'account-B' },
  WORKSPACE_COLLECTIONS: [{ collection: 'clients', windowName: 'CLIENTS' }],
  readGlobalArray: name => backupContext.window[name],
  mergeWorkspaceArrays: context.mergeWorkspaceArrays,
  mergeAccountObject: context.mergeAccountObject,
  collectCompanyProfileBundle: () => ({}), restoreCompanyProfileBundle() {},
  cloudDocId: item => item.id,
  cloudTombstoneKey: (uid, name) => `profacture_account_${uid}_deleted_${name}`,
  readCloudTombstones: () => ['imported', 'unrelated'],
  persistWorkspaceLocally() {}, scheduleWorkspaceCloudSync() {}, refreshActiveWorkspaceView() {}
};
vm.createContext(backupContext);
vm.runInContext(html.slice(html.indexOf('function restoreWorkspaceBackup(payload)'), html.indexOf('async function renderDataUsagePanel()')), backupContext);
backupContext.restoreWorkspaceBackup({ version: 1, collections: { clients: [{ id: 'imported', name: 'Imported' }] } });
assert.deepEqual(backupContext.window.CLIENTS.map(item => item.id).sort(), ['current', 'imported']);
assert.deepEqual(JSON.parse(storage.get('profacture_account_account-B_deleted_clients')), ['unrelated']);
assert.throws(() => backupContext.restoreWorkspaceBackup({ version: 1, collections: { clients: 'invalid' } }), /Invalid backup collection/);
console.log('Workspace recovery passed: account isolation, full cloud values, merge import, targeted tombstones.');
