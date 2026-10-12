import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';

const port = 4174;
const origin = `http://127.0.0.1:${port}`;
const dist = path.resolve('dist');

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind') continue;
      files.push(...walk(full));
    } else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const paths = walk(dist).map((file) => {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
});

const server = await startServer(dist, port);
const browser = await chromium.launch();
const context = await browser.newContext();
const failures = [];

try {
  for (const pathname of paths) {
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 390, height: 844 },
    ]) {
      for (const scheme of ['light', 'dark']) {
        const page = await context.newPage();
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(origin + pathname, { waitUntil: 'domcontentloaded' });
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        for (const violation of results.violations) {
          const nodes = violation.nodes.map((node) => node.target.join(' ')).join('; ');
          failures.push(`${pathname} [${viewport.width}/${scheme}] ${violation.id}: ${violation.help} (${nodes})`);
        }
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`axe checked ${paths.length} pages in light and dark`);
