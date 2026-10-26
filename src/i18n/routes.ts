import { enabledLocales, isEnabledLocale, localeMeta, type Locale } from './locales';

export const docSlugs = [
  'installation',
  'getting-started',
  'features',
  'catalogue',
  'copies',
  'deposits',
  'inventory',
  'patrons',
  'circulation',
  'holds',
  'reminders-fines',
  'acquisitions',
  'weeding',
  'opac',
  'events',
  'statistics',
  'sites',
  'languages',
  'administration',
  'faq',
  'troubleshooting',
  'developers',
] as const;

export type DocSlug = (typeof docSlugs)[number];

export const routes = {
  features: { fr: 'fonctionnalites', en: 'features', de: 'funktionen', es: 'funciones' },
  docs: { fr: 'documentation', en: 'docs', de: 'dokumentation', es: 'documentacion' },
  contribute: { fr: 'contribuer', en: 'contribute', de: 'mitwirken', es: 'contribuir' },
  changelog: { fr: 'journal', en: 'changelog', de: 'aenderungen', es: 'novedades' },
  legal: { fr: 'mentions-legales', en: 'legal', de: 'impressum', es: 'aviso-legal' },
} as const;

export type PageKind = 'home' | 'features' | 'docs-index' | 'doc' | 'contribute' | 'changelog' | 'legal';

export function pathFor(locale: Locale, kind: PageKind, docSlug?: string): string {
  const base = `/${locale}/`;
  switch (kind) {
    case 'home':
      return base;
    case 'features':
      return `${base}${routes.features[locale]}/`;
    case 'docs-index':
      return `${base}${routes.docs[locale]}/`;
    case 'doc':
      return `${base}${routes.docs[locale]}/${docSlug}/`;
    case 'contribute':
      return `${base}${routes.contribute[locale]}/`;
    case 'changelog':
      return `${base}${routes.changelog[locale]}/`;
    case 'legal':
      return `${base}${routes.legal[locale]}/`;
    default: {
      const unreachable: never = kind;
      return unreachable;
    }
  }
}

export function contentPaths(locale: Locale): { slug: string; kind: PageKind; docSlug?: DocSlug }[] {
  return [
    { slug: routes.features[locale], kind: 'features' },
    { slug: routes.docs[locale], kind: 'docs-index' },
    { slug: routes.contribute[locale], kind: 'contribute' },
    { slug: routes.changelog[locale], kind: 'changelog' },
    { slug: routes.legal[locale], kind: 'legal' },
    ...docSlugs.map((docSlug) => ({
      slug: `${routes.docs[locale]}/${docSlug}`,
      kind: 'doc' as const,
      docSlug,
    })),
  ];
}

export function pageFromPath(pathname: string): { locale: Locale; kind: PageKind; docSlug?: string } | null {
  const parts = pathname.split('/').filter(Boolean);
  const locale = parts[0];
  if (!isEnabledLocale(locale)) return null;
  const rest = parts.slice(1).join('/');
  if (rest === '') return { locale, kind: 'home' };
  if (rest === routes.features[locale]) return { locale, kind: 'features' };
  if (rest === routes.docs[locale]) return { locale, kind: 'docs-index' };
  if (rest === routes.contribute[locale]) return { locale, kind: 'contribute' };
  if (rest === routes.changelog[locale]) return { locale, kind: 'changelog' };
  if (rest === routes.legal[locale]) return { locale, kind: 'legal' };
  const prefix = `${routes.docs[locale]}/`;
  if (rest.startsWith(prefix)) {
    const docSlug = rest.slice(prefix.length);
    if ((docSlugs as readonly string[]).includes(docSlug)) return { locale, kind: 'doc', docSlug };
  }
  return null;
}

export function alternatesForUrl(url: string): { lang: string; url: string }[] {
  const parsed = new URL(url);
  const page = pageFromPath(parsed.pathname);
  if (!page) return [];
  const links: { lang: string; url: string }[] = enabledLocales.map((locale) => ({
    lang: localeMeta[locale].htmlLang,
    url: `${parsed.origin}${pathFor(locale, page.kind, page.docSlug)}`,
  }));
  links.push({
    lang: 'x-default',
    url: `${parsed.origin}${pathFor('fr', page.kind, page.docSlug)}`,
  });
  return links;
}
