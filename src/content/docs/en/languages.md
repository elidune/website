---
title: Languages
description: Interface language, account language, and record language.
navTitle: Languages
order: 42
section: features
draft: false
locale: en
---

Two language families coexist. They are not set in the same place.

## Interface

The React UI is translated into English, French, German, and Spanish (`ui/src/locales/{en,fr,de,es}/translation.json`). The four files carry the same keys.

Without a session, the language follows the browser. With a session, it follows the language stored on the account, then the remembered choice. The selector is in the application bar (light, dark, or system is a separate setting, not a language).

During first setup, the administrator account chooses among these four languages. The profile (`/profile`) changes it later. The server stores a long name (`french`, `english`, `german`, `spanish`), not the short code.

## Records and accounts

The language of a biblio or a user uses the server list: `unknown`, `french`, `english`, `german`, `spanish`, `italian`, `portuguese`, `japanese`, `chinese`, `russian`, `arabic`, `dutch`, `swedish`, `norwegian`, `danish`, `finnish`, `polish`, `czech`, `hungarian`, `romanian`, `turkish`, `korean`, `latin`, `greek`, `croatian`, `hindi`, `hebrew`, `persian`, `catalan`, `thai`, `vietnamese`, `indonesian`, `malay`.

Only the four spoken languages above have a translated interface. The others remain record values.

## Email templates

`SUPPORTED_LANGUAGES` accepts `english`, `french`, `german`, and `spanish`. The Email templates tab edits French and English only.

Two chains coexist in `server/src/email_templates.rs`. Neither reads the language shown in the interface.

**Patron notices** (`notice_language_order`): reminders, hold ready (`hold_ready`), password reset. Order: the account language when it is French, English, German, or Spanish, then the library language, then French, then English. Italian, `unknown`, and a missing value are skipped. Shipped files for these templates exist in all four languages.

**Other messages** (`language_chain`): second-factor code, recovery code, event announcement, loan closed by inventory. French then English, or English then French. Any other language, including German and Spanish, starts with French. Those templates ship only as `.french.json` and `.english.json`.

For each language, a row already stored in the database is tried first, then the file `{id}.{language}.json`. The column `users.language` is `VARCHAR(32) DEFAULT 'french'` and stays nullable.
