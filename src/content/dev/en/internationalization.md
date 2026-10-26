---
title: Languages and messages
description: Interface files, the account language on the API, and how an email picks its language.
navTitle: Languages
order: 60
section: reference
draft: false
locale: en
---

The guide for staff is [Languages](/en/docs/languages/). This page names the files and the functions.

## Interface

Files: `ui/src/locales/{en,fr,de,es}/translation.json`. The registry is `ui/src/locales/languages.ts` and `ui/src/locales/index.ts`.

Interface codes: `en`, `fr`, `de`, `es`. Product default when nothing is chosen: French (`UI_LANGUAGE_FALLBACK`). Stored choice: `i18nextLng`. Anonymous public choice: `elidune_public_language`.

A visible string goes through `t('key')`. Add a key in all four files at once. Displayed dates use `Intl.DateTimeFormat` and `i18n.language` (`ui/src/utils/localeDate.ts`).

## API

The `Language` enum in `server/src/models/mod.rs` is long (`Unknown`, `French`, `English`, through `Malay`). The JSON value is camelCase. The database value, through `as_db_str()`, is a word (`french`, `english`, …).

`library_info.language` accepts only `fr`, `en`, `de`, `es`. NULL: clients fall back to French (`ui/src/utils/uiLanguage.ts`). Time zones are IANA names. Refusals: `invalid_timezone`, `timezone_country_mismatch`, `timezone_required`.

## Email

`SUPPORTED_LANGUAGES` accepts `english`, `french`, `german`, `spanish`. Two functions in `server/src/email_templates.rs` choose the file. Neither reads the language shown in the interface.

`notice_language_order`: reminders, `hold_ready`, password reset. The account language when it is one of the four, then the library language, then French, then English.

`language_chain`: second factor, recovery code, event announcement, loan closed by inventory. French then English, or the reverse. German and Spanish start with French. Those templates are shipped only as `.french.json` and `.english.json`, under `server/data/email_templates/`.

For each language tried, a row already in the database comes before the file `{id}.{language}.json`.

This presentation site has its own collection, `src/content/docs/` and `src/content/dev/` in [elidune/website](https://github.com/elidune/website). That is not the software’s `docs/` directory.
