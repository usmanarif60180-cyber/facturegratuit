import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [
  ['--check', 'app.js'],
  ['--check', 'ai-chantier.js'],
  ['--check', 'functions/index.js']
];

for (const args of checks) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const tests = readdirSync('tests')
  .filter((name) => name.endsWith('.mjs'))
  .sort()
  .map((name) => `tests/${name}`);

if (tests.length === 0) {
  console.error('Build check failed: no test files found.');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
process.exit(result.status || 0);
