import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import { docSlugs, type DocSlug } from '../i18n/routes';
import { websiteRepoUrl } from './site';

export type DocHit = {
  slug: DocSlug;
  entry: CollectionEntry<'docs'>;
  translated: boolean;
};

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
