import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import type { MessageKey } from '../i18n/ui';
import { docSlugs, type DocSlug } from '../i18n/routes';
import { websiteRepoUrl } from './site';

export const docSectionOrder = ['install', 'start', 'features', 'admin', 'help', 'dev'] as const;
export type DocSection = (typeof docSectionOrder)[number];

export const docSectionLabel: Record<DocSection, MessageKey> = {
  install: 'docs.section.install',
  start: 'docs.section.start',
  features: 'docs.section.features',
  admin: 'docs.section.admin',
  help: 'docs.section.help',
  dev: 'docs.section.dev',
};

export type DocHit = {
  slug: DocSlug;
  entry: CollectionEntry<'docs'>;
  translated: boolean;
};

export function groupDocs(docs: DocHit[]): { section: DocSection; docs: DocHit[] }[] {
  return docSectionOrder
    .map((section) => ({
      section,
      docs: docs.filter((doc) => doc.entry.data.section === section),
    }))
    .filter((group) => group.docs.length > 0);
}

function docId(entry: CollectionEntry<'docs'>): { locale: string; slug: string } {
  const [locale, slug] = entry.id.split('/');
  return { locale, slug };
}

export async function listDocs(locale: Locale): Promise<DocHit[]> {
  const all = await getCollection('docs');
  return docSlugs.flatMap((slug) => {
    const own = all.find((entry) => {
      const id = docId(entry);
      return id.slug === slug && id.locale === locale;
    });
    const french = all.find((entry) => {
      const id = docId(entry);
      return id.slug === slug && id.locale === 'fr';
    });
    const entry = own ?? french;
    if (!entry) return [];
    return [{ slug, entry, translated: Boolean(own) }];
  });
}

export async function getDoc(locale: Locale, slug: string): Promise<DocHit | null> {
  if (!(docSlugs as readonly string[]).includes(slug)) return null;
  const docs = await listDocs(locale);
  return docs.find((doc) => doc.slug === slug) ?? null;
}

export function editDocUrl(locale: Locale, slug: string, translated: boolean): string {
  if (translated) {
    return `${websiteRepoUrl}/edit/main/src/content/docs/${locale}/${slug}.md`;
  }
  return `${websiteRepoUrl}/new/main/src/content/docs/${locale}?filename=${slug}.md`;
}
