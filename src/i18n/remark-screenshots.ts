import { frenchTypography } from './typography';

type MdNode = {
  type: string;
  url?: string;
  alt?: string;
  title?: string | null;
  value?: string;
  children?: MdNode[];
};

const shots = new Set([
  'desk',
  'record',
  'catalogue',
  'holds',
  'settings',
  'opac-loans',
  'deposits',
  'acquisitions',
  'weeding',
  'inventory',
  'patrons',
  'transits',
]);

function escapeAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function figure(locale: 'fr' | 'en', name: string, alt: string, caption: string): string {
  const text = locale === 'fr' ? frenchTypography : (value: string) => value;
  const safeAlt = escapeAttr(text(alt));
  const safeCaption = escapeAttr(text(caption || alt));
  const light = `/screens/${locale}/light/${name}.webp`;
  const dark = `/screens/${locale}/dark/${name}.webp`;
  const lightMobile = `/screens/${locale}/light/${name}-mobile.webp`;
  const darkMobile = `/screens/${locale}/dark/${name}-mobile.webp`;
  return `<figure class="shot">
<a class="shot-open" href="${light}" data-shot data-alt="${safeAlt}" data-caption="${safeCaption}" data-light="${light}" data-dark="${dark}" data-light-mobile="${lightMobile}" data-dark-mobile="${darkMobile}">
<picture>
<source srcset="${darkMobile}" media="(max-width: 600px) and (prefers-color-scheme: dark)" type="image/webp" width="780" height="1688" />
<source srcset="${lightMobile}" media="(max-width: 600px)" type="image/webp" width="780" height="1688" />
<source srcset="${dark}" media="(prefers-color-scheme: dark)" type="image/webp" />
<img src="${light}" alt="${safeAlt}" width="1440" height="900" loading="lazy" decoding="async" />
</picture>
</a>
<figcaption>${safeCaption}</figcaption>
</figure>`;
}

function localeFrom(source: string): 'fr' | 'en' | null {
  if (source.includes('/docs/fr/') || source.includes('/dev/fr/') || source.includes('\\docs\\fr\\') || source.includes('\\dev\\fr\\')) {
    return 'fr';
  }
  if (source.includes('/docs/en/') || source.includes('/dev/en/') || source.includes('\\docs\\en\\') || source.includes('\\dev\\en\\')) {
    return 'en';
  }
  return null;
}

/** Turn `![alt](screen:desk "caption")` into the existing lightbox screenshot. */
export function remarkScreenshots() {
  return (tree: MdNode, file: { path?: string; history?: string[] }) => {
    const source = String(file.path ?? file.history?.[0] ?? '');
    const locale = localeFrom(source);
    if (!locale) return;
    if (!source.includes('/content/docs/') && !source.includes('/content/dev/') && !source.includes('\\content\\docs\\') && !source.includes('\\content\\dev\\')) {
      return;
    }
    const visit = (node: MdNode) => {
      const children = node.children;
      if (!children) return;
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        if (child.type === 'paragraph' && child.children?.length === 1 && child.children[0].type === 'image') {
          const image = child.children[0];
          const url = image.url ?? '';
          if (url.startsWith('screen:')) {
            const name = url.slice('screen:'.length);
            if (shots.has(name)) {
              children[index] = {
                type: 'html',
                value: figure(locale, name, image.alt ?? '', image.title ?? ''),
              };
              continue;
            }
          }
        }
        visit(child);
      }
    };
    visit(tree);
  };
}
