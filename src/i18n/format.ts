import { localeMeta, type Locale } from './locales';

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: 'long' }).format(new Date(iso));
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].intl).format(value);
}
