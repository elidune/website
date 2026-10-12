import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

function resolveFile(root, pathname) {
  const decoded = decodeURIComponent(pathname.split('?')[0]);
  if (decoded.includes('\0') || decoded.split('/').includes('..')) return null;
  const relative = decoded.replace(/^\/+/, '');
  let file = path.join(root, relative);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  if (!fs.existsSync(file)) return null;
  return file;
}

export function startServer(root, port) {
  const server = http.createServer((req, res) => {
    const file = resolveFile(root, req.url ?? '/');
    if (!file) {
      const notFound = path.join(root, '404.html');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
      return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
