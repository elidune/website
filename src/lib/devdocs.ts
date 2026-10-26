import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import type { MessageKey } from '../i18n/ui';
import { devSlugs, type DevSlug } from '../i18n/routes';

export const devSectionOrder = ['overview', 'reference', 'practice'] as const;
export type DevSection = (typeof devSectionOrder)[number];

export const devSectionLabel: Record<DevSection, MessageKey> = {
  overview: 'dev.section.overview',
  reference: 'dev.section.reference',
  practice: 'dev.section.practice',
};

export type DevHit = {
  slug: DevSlug;
  entry: CollectionEntry<'devdocs'>;
  translated: boolean;
};

export function groupDevDocs(docs: DevHit[]): { section: DevSection; docs: DevHit[] }[] {
  return devSectionOrder
    .map((section) => ({
      section,
      docs: docs.filter((doc) => doc.entry.data.section === section),
    }))
    .filter((group) => group.docs.length > 0);
}

function docId(entry: CollectionEntry<'devdocs'>): { locale: string; slug: string } {
  const [locale, slug] = entry.id.split('/');
  return { locale, slug };
}

export async function listDevDocs(locale: Locale): Promise<DevHit[]> {
  const all = await getCollection('devdocs');
  return devSlugs.flatMap((slug) => {
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

export async function getDevDoc(locale: Locale, slug: string): Promise<DevHit | null> {
  if (!(devSlugs as readonly string[]).includes(slug)) return null;
  const docs = await listDevDocs(locale);
  return docs.find((doc) => doc.slug === slug) ?? null;
}
