---
title: Languages
description: Interface language, account language, record language, and message language.
navTitle: Languages
order: 42
section: features
draft: false
locale: en
---

Two families of languages coexist. They are not set in the same place.

## Interface

The interface is translated into English, French, German, and Spanish. The four languages carry the same labels.

Without a session, the language follows the browser. With a session, it follows the language saved on the account, then the remembered choice. The selector is in the application bar. Light, dark, or system is a separate setting, not a language.

At first setup, the administrator account chooses among these four languages. The profile changes it afterwards.

## Records and accounts

The language of a record or a patron uses a longer list: unknown, French, English, German, Spanish, Italian, Portuguese, Japanese, Chinese, Russian, Arabic, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Czech, Hungarian, Romanian, Turkish, Korean, Latin, Greek, Croatian, Hindi, Hebrew, Persian, Catalan, Thai, Vietnamese, Indonesian, Malay.

Only the first four spoken languages have a translated interface. The others stay as values on the record.

## Email templates

The Email templates tab edits only French and English. The language shown in the interface does not, by itself, choose the language of a message.

**Notices to the patron**: reminders, hold ready, password reset. Order: the account language when it is French, English, German, or Spanish, then the library language, then French, then English. Italian, “unknown”, and a missing value are skipped. These templates are shipped in the four languages.

**Other messages**: second-factor code, recovery code, event announcement, loan closed by an inventory. French then English, or English then French. Any other language, including German and Spanish, starts with French. These templates are shipped only in French and English.

For each language, a text already saved in settings is tried first, then the text shipped with the software. The language of a new account is French, and it can stay empty.
