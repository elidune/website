import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const errors = [];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const emoji = /\p{Extended_Pictographic}/u;
const files = walk(root);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
    errors.push(`${rel}: remote font`);
  }
  if (/google-analytics|googletagmanager|plausible|umami|gtag\(/.test(html)) {
    errors.push(`${rel}: tracker`);
  }
  if (emoji.test(html.replace(/[\u00A9\u00AE]/g, ''))) errors.push(`${rel}: emoji`);
  if (!html.includes('href="#content"')) errors.push(`${rel}: missing skip link`);
  if (!html.includes('id="content"')) errors.push(`${rel}: missing main target`);
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/);
  if (!lang) errors.push(`${rel}: missing html lang`);
  if (!rel.startsWith('404') && rel !== 'index.html') {
    if (!html.includes('rel="alternate"')) errors.push(`${rel}: missing hreflang`);
    if (!html.includes('rel="canonical"')) errors.push(`${rel}: missing canonical`);
    if (!html.includes('name="description"')) errors.push(`${rel}: missing description`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`checked ${files.length} html files`);
