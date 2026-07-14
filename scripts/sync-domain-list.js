import fs from 'node:fs/promises';
import path from 'node:path';

const url =
  'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/disposable_email_blocklist.conf';

const tsFilePath = path.resolve('./src/data/auth.ts');

async function fetchDisposableDomains() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch conf file: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

async function readDomains(filePath) {
  const content = await fs.readFile(filePath, 'utf8');

  const matches = [...content.matchAll(/['"]([^'"]+)['"]/g)];
  const domains = new Set(matches.map((m) => m[1]));

  return { content, domains };
}

function formatEntry(domain, indent = '  ') {
  const escaped = domain.replace(/'/g, "\\'");
  return `${indent}'${escaped}',`;
}

async function main() {
  const confDomains = await fetchDisposableDomains();

  const { content, domains: tsDomains } = await readDomains(tsFilePath);

  const missing = confDomains.filter((d) => !tsDomains.has(d));

  if (missing.length === 0) {
    console.log('Nothing to add file is already up to date.');
    return;
  }

  console.log(`Found ${missing.length} new domain(s) to add.`);

  // Merge existing + new, dedupe, and sort alphabetically.
  const allDomains = [...new Set([...tsDomains, ...missing])].sort((a, b) =>
    a.localeCompare(b)
  );

  const entriesBlock = allDomains.map((d) => formatEntry(d)).join('\n');

  const listPattern = /(\(\[\s*\n)([\s\S]*?)(\n\s*\]\)\s*;?)/;

  const updated = content.replace(listPattern, (_match, open, _body, close) => {
    return `${open}${entriesBlock}${close}`;
  });

  await fs.writeFile(tsFilePath, updated, 'utf8');

  console.log('\nNew domains added:');
  missing.sort((a, b) => a.localeCompare(b)).forEach((d) => console.log(`  + ${d}`));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
