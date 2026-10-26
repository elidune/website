---
title: Patrons
description: Patron accounts, public types, subscription, legal guardian, and anonymisation.
navTitle: Patrons
order: 33
section: features
draft: false
locale: en
---

The Patrons menu (`/users`) lists accounts. Search covers last name, first name, and barcode. The record is `/users/{id}`. Opening the screen follows `users_rights`, not the `librarian` label alone.

<figure>
<picture>
<source srcset="/screens/en/dark/patrons.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/patrons.webp" alt="Patron record, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: patron record (`patrons`). The name is on the record. It is not repeated on a slip, a label, or a batch report.

## Create an account

Staff (`librarian` or `admin`, write right on users) send `POST /api/v1/users`. Fields the screens ask for: identity, login, password, account type, public type, contact details, date of birth, language, card barcode.

Account types shipped by migrations:

| Code | Desk role |
| --- | --- |
| `reader` | Patron. Borrows and places holds for themselves |
| `group` | Collective account, same circulation rights as `reader` after migrations |
| `guest` | Guest. No loans |
| `librarian` | Staff. Catalogue, users, loans. Settings limited to the library |
| `admin` | Administrator. Every settings tab |

Only an `admin` account changes the account type (`PUT /api/v1/users/{id}/account-type`). Forcing a password change at next sign-in is also administrator-only.

Password: 8 characters minimum. `validate_password_strength` applies no other complexity rule.

## Public type and subscription

The public type (child, adult, school, staff, senior, or a type added in Settings) carries age, subscription length, price, and optionally loan caps that differ from the global rule.

The record has a subscription end date, or none (no end date). Renew stores a new date. The seeded price stored for `adult` is the integer `1500`, that is 15.00 €.

`subscription_price` is an integer in cents (`1500` = 15.00 €). The public-type screen takes and shows euros: the label is “Subscription price (€)”, display divides the stored value by 100, and save multiplies the entered amount by 100. An API call or an `INSERT` into `public_types.subscription_price` must send cents (`1500` for 15.00 €).

Public type `child` cannot be enrolled without a legal guardian (`user_guardians`). The picker is on the patron record. The guardian cannot themselves be `child` or `school`.

For a `reader` account, the public type is derived from the date of birth and the `age_min` / `age_max` bounds. No bound matches: the response is `no_public_type_for_age`. A custom account type is not derived that way.

The Fines tab on the record lists charges when read rights on patrons are present. See [Reminders and fines](/en/docs/reminders-fines/).

A card reported lost (`users.card_lost`) blocks checkout. Replacement retires the old number. The routes are in [Loans and returns](/en/docs/circulation/).

## What the patron sees

Once signed in, the patron opens:

- My loans, `/my-loans`: current loans, renewal when the renewal window allows it;
- My holds, `/my-holds`, when the account’s hold right is `own` or higher;
- My profile, `/profile`: contact details, language, password, purchase suggestions, history preference.

Loan history (`GET /api/v1/users/{id}/history`) is readable by the account holder or by staff. The preference that keeps or drops it is changed by the holder or by an administrator.

## Anonymise

“Anonymize for stats” calls `DELETE /api/v1/users/{id}`. Which columns are cleared, and what remains for statistics, is in [Administration](/en/docs/administration/).
