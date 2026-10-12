export const localeMeta = {
  fr: {
    label: 'Français',
    short: 'FR',
    htmlLang: 'fr',
    intl: 'fr-FR',
    og: 'fr_FR',
    enabled: true,
  },
  en: {
    label: 'English',
    short: 'EN',
    htmlLang: 'en',
    intl: 'en-GB',
    og: 'en_GB',
    enabled: true,
  },
  de: {
    label: 'Deutsch',
    short: 'DE',
    htmlLang: 'de',
    intl: 'de-DE',
    og: 'de_DE',
    enabled: false,
  },
  es: {
    label: 'Español',
    short: 'ES',
    htmlLang: 'es',
    intl: 'es-ES',
    og: 'es_ES',
    enabled: false,
  },
} as const;

export type Locale = keyof typeof localeMeta;

export const locales = Object.keys(localeMeta) as Locale[];

export const enabledLocales = locales.filter((locale) => localeMeta[locale].enabled);

export function isLocale(value: string | undefined): value is Locale {
  return !!value && Object.prototype.hasOwnProperty.call(localeMeta, value);
}

export function isEnabledLocale(value: string | undefined): value is Locale {
  return isLocale(value) && localeMeta[value].enabled;
}
