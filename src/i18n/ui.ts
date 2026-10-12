import { en } from './messages/en';
import { fr } from './messages/fr';
import type { Locale } from './locales';
import { frenchTypography } from './typography';

export type MessageKey = keyof typeof fr;

const dictionaries: Record<Locale, Partial<Record<MessageKey, string>>> = {
  fr,
  en,
  de: {},
  es: {},
};

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string>): string {
  const own = dictionaries[locale][key];
  const source = own ?? fr[key];
  const withVars = vars
    ? Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), source)
    : source;
  return own && locale !== 'fr' ? withVars : frenchTypography(withVars);
}

export function isUiComplete(locale: Locale): boolean {
  if (locale === 'fr') return true;
  const dict = dictionaries[locale];
  return (Object.keys(fr) as MessageKey[]).every((key) => Boolean(dict[key]));
}
