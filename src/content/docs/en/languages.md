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

Shipped files exist as `.french.json` and `.english.json`: reminders, hold ready, password reset, second-factor code, recovery code, event announcement, loan closed by inventory. The Email templates tab edits those texts.

> **TODO.** The rule that picks the `.french` or `.english` file at send time (account language, interface language, fallback) was not checked in the email service for this page.
