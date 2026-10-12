import { startServer } from './static-server.mjs';

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const root = new URL(import.meta.url);
const dist = new URL('../dist/', root);
const server = await startServer(dist.pathname, port);

const siteOrigin = 'https://elidune.fr';
const queue = ['/', '/fr/', '/en/', '/robots.txt', '/sitemap-index.xml'].map((path) => origin + path);
const seen = new Set();
const failures = [];

function localize(href) {
  if (href.startsWith(siteOrigin)) return origin + href.slice(siteOrigin.length);
  return href;
}

function extract(html, pageUrl) {
  const found = new Set();
  const attr = /(?:href|src|srcset)=["']([^"']+)["']/gi;
  let match;
  while ((match = attr.exec(html))) {
    for (const part of match[1].split(',')) {
      const value = part.trim().split(/\s+/)[0];
      if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('data:')) continue;
      try {
        found.add(localize(new URL(value, pageUrl).href));
      } catch {
        failures.push(`${pageUrl} has unparseable link ${value}`);
      }
    }
  }
  const locs = html.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const loc of locs) found.add(localize(loc[1].trim()));
  return found;
}

/** Blob HTML pages answer 503 from GitHub-hosted runners. The raw file is the existence check. */
function probeUrl(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.hostname !== 'github.com') return href;
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 5 || parts[2] !== 'blob') return href;
  const [owner, repo, , ref, ...rest] = parts;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${rest.join('/')}`;
}

async function checkExternal(url) {
  const target = probeUrl(url);
  const attempts = 3;
  let last = 'error';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(target, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EliduneLinkCheck/1.0)' },
      });
      if (response.status < 400) return;
      last = String(response.status);
      const retry = response.status === 429 || response.status >= 500;
      if (!retry) break;
    } catch (error) {
      last = error instanceof Error ? error.message : 'error';
    } finally {
      clearTimeout(timer);
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }
  const where = target === url ? url : `${url} (${target})`;
  failures.push(`${where} -> ${last}`);
}

while (queue.length) {
  const next = queue.shift();
  if (!next || seen.has(next)) continue;
  seen.add(next);
  const response = await fetch(next);
  if (!response.ok) {
    failures.push(`${next} -> ${response.status}`);
    continue;
  }
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('html') && !type.includes('xml') && !type.includes('css') && !type.includes('text')) continue;
  const body = await response.text();
  if (type.includes('css')) {
    for (const match of body.matchAll(/url\(([^)]+)\)/g)) {
      const value = match[1].replace(/["']/g, '').trim();
      if (!value || value.startsWith('data:')) continue;
      const cssUrl = localize(new URL(value, next).href);
      if (!seen.has(cssUrl)) queue.push(cssUrl);
    }
  }
  for (const link of extract(body, next)) {
    const url = new URL(link);
    if (url.origin === origin) {
      url.hash = '';
      const local = url.href;
      if (!seen.has(local)) queue.push(local);
    } else if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (!seen.has(url.href)) {
        seen.add(url.href);
        await checkExternal(url.href);
      }
    }
  }
}

server.close();
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`checked ${seen.size} urls`);
