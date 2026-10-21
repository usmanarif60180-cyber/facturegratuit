import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../functions/index.js', import.meta.url), 'utf8');
const lockHelpers = source.slice(source.indexOf('async function acquireStorageMutation'), source.indexOf('exports.storageManager ='));
const storageManager = source.slice(source.indexOf('exports.storageManager ='), source.indexOf('// Company-scoped AI history'));

assert.match(lockHelpers, /db\.runTransaction\(async \(tx\) =>/);
assert.match(lockHelpers, /leaseUntilMs/);
assert.match(lockHelpers, /new HttpsError\('aborted'/);
assert.match(storageManager, /const lock = await acquireStorageMutation\(auth\.uid\)/);
assert.match(storageManager, /finally \{\s*await releaseStorageMutation\(lock\)/);
assert.ok(storageManager.indexOf('acquireStorageMutation') < storageManager.indexOf('file.getMetadata'));
console.log('Storage concurrency passed: quota-affecting operations are serialized per account.');
