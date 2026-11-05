import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const functions = readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');

const teamSync = html.slice(html.indexOf('async function syncSharedCompanyCollection'), html.indexOf('function teamRoleKey'));
const fileManager = html.slice(html.indexOf('function renderFilesInit'), html.indexOf('// ---- Notification Center'));
const invitationClient = html.slice(html.indexOf('async function processTeamInvitationUrl'), html.indexOf('function identityForItem'));
const authReset = html.slice(html.indexOf('function resetWorkspaceForAuth'), html.indexOf('function persistWorkspaceLocally'));
const storageManager = functions.slice(functions.indexOf('exports.storageManager ='), functions.indexOf('// Company-scoped AI history'));
const acceptInvitation = functions.slice(functions.indexOf('exports.acceptInvitation ='), functions.indexOf('exports.declineInvitation ='));

assert.match(fileManager, /path: fileToRemove\.storagePath/);
assert.match(fileManager, /companyId: fileToRemove\._sharedCompanyId/);
assert.ok(fileManager.indexOf('await window.profactureStorageManager') < fileManager.indexOf('window.profactureMarkCloudDeleted'));
assert.match(storageManager, /await requireMinRole\(sharedCompanyId, auth\.uid, 'manager'\)/);
assert.match(storageManager, /sharedFile\.data\(\)\?\.storagePath !== requestedPath/);
assert.match(storageManager, /operation === 'delete' \? \/\^users/);
assert.match(storageManager, /users\/\$\{storageOwnerUid\}\/\$\{relativePath\}/);

assert.match(acceptInvitation, /invite\.status === 'accepted' && invite\.acceptedBy === auth\.uid/);
assert.match(acceptInvitation, /memberSnap\.exists && memberSnap\.data\(\)\.status === 'active'/);
assert.ok(invitationClient.indexOf('await refreshTeamWorkspace()') < invitationClient.indexOf('history.replaceState'));

assert.match(authReset, /sharedCompanyRoles\.clear\(\)/);
assert.match(authReset, /sharedRecordBaselines\.clear\(\)/);
assert.match(authReset, /sharedCompanyUnsubscribers\.splice\(0\)/);

assert.match(teamSync, /config\.collection === "products" \? "employee" : "manager"/);
assert.match(rules, /match \/products\/\{productId\}[\s\S]*?allow create, update, delete: if hasMinRole\(companyId, 'employee'\)/);
console.log('Team regression checks passed: shared file cleanup authorization, retry-safe invitations, account cache isolation and product deletion roles.');
