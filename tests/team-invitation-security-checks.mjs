import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const decline = source.slice(
  source.indexOf('exports.declineInvitation ='),
  source.indexOf('exports.updateMemberRole =')
);

assert.match(decline, /const auth = requireAuth\(request\)/);
assert.match(decline, /callerEmail !== String\(invite\.email \|\| ''\)\.trim\(\)\.toLowerCase\(\)/);
assert.ok(decline.indexOf('callerEmail !==') < decline.indexOf('await inviteRef.update'));
console.log('Team invitation security passed: only the invited email can decline.');
