import {globSync} from 'node:fs';
import {execSync} from 'node:child_process';

// usage: node ./scripts/oneach.mjs npm run ci
const TOP = process.cwd();
const command = process.argv.slice(2).join(' ');
const packages = globSync([
  'examples/*/package.json',
  'packages/*/package.json',
]).map(p => `${TOP}/${p.replace('/package.json', '')}`);

for (const folder of packages) {
  execSync(command, {cwd: folder, encoding: 'utf-8'});
}