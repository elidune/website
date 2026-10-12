import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const screens = [
  ['fr', 'Capture à venir'],
  ['en', 'Screenshot coming soon'],
];
const themes = {
  light: { bg: '#f9fafb', frame: '#c9a961', title: '#92400e', sub: '#374151' },
  dark: { bg: '#111827', frame: '#c9a961', title: '#fde68a', sub: '#e5e7eb' },
};
const names = ['desk', 'record', 'catalogue', 'holds', 'settings', 'opac-loans'];

function screenSvg(label, name, theme) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
  <rect width="1440" height="900" fill="${theme.bg}"/>
  <rect x="48" y="48" width="1344" height="804" rx="24" fill="none" stroke="${theme.frame}" stroke-width="6"/>
  <text x="720" y="430" text-anchor="middle" font-family="sans-serif" font-size="54" font-weight="700" fill="${theme.title}">${label}</text>
  <text x="720" y="500" text-anchor="middle" font-family="sans-serif" font-size="32" fill="${theme.sub}">${name}</text>
</svg>`;
}

function ogSvg(title, subtitle) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#111827"/>
  <rect x="0" y="0" width="16" height="630" fill="#c9a961"/>
  <text x="96" y="300" font-family="sans-serif" font-size="92" font-weight="700" fill="#f9fafb">${title}</text>
  <text x="96" y="380" font-family="sans-serif" font-size="36" fill="#fde68a">${subtitle}</text>
</svg>`;
}

await rm(path.join(root, 'public/favicon.png'), { force: true });
await mkdir(path.join(root, 'public/og'), { recursive: true });

for (const [locale, label] of screens) {
  for (const [themeName, theme] of Object.entries(themes)) {
    const dir = path.join(root, 'public/screens', locale, themeName);
    await mkdir(dir, { recursive: true });
    for (const name of names) {
      await sharp(Buffer.from(screenSvg(label, name, theme)))
        .webp({ quality: 60 })
        .toFile(path.join(dir, `${name}.webp`));
    }
  }
}

const og = [
  ['fr', 'Elidune', 'Logiciel libre pour les bibliothèques'],
  ['en', 'Elidune', 'Free software for libraries'],
];
for (const [locale, title, subtitle] of og) {
  await sharp(Buffer.from(ogSvg(title, subtitle))).png().toFile(path.join(root, 'public/og', `${locale}.png`));
}

const logo = path.join(root, 'src/assets/logo.png');
await sharp(logo).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32.png'));
await sharp(logo).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));

console.log('placeholders written');
