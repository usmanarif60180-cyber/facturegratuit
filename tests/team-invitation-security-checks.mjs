import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const decline = source.slice(
  source.indexOf('exports.declineInvitation ='),
  source.indexOf('exports.updateMemberRole =')
);
const send = source.slice(
  source.indexOf('exports.sendInvitation ='),
  source.indexOf('exports.resendInvitation =')
);

assert.match(decline, /const auth = requireAuth\(request\)/);
assert.match(decline, /callerEmail !== String\(invite\.email \|\| ''\)\.trim\(\)\.toLowerCase\(\)/);
assert.ok(decline.indexOf('callerEmail !==') < decline.indexOf('await inviteRef.update'));
assert.match(send, /const emailLockRef = invitationEmailLock\(companyId, cleanEmail\)/);
assert.match(send, /await db\.runTransaction\(async \(tx\) =>/);
assert.match(send, /tx\.create\(inviteRef/);
assert.match(send, /tx\.set\(emailLockRef/);
console.log('Team invitation security passed: recipient verification and transactional duplicate guard.');
