---
title: Patrons
description: Patron accounts, public types, subscription, legal guardian, and anonymisation.
navTitle: Patrons
order: 33
section: features
draft: false
locale: en
---

The Users menu (`/users`) lists accounts. Search covers last name, first name, and barcode. The record is `/users/{id}`.

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

The record has a subscription end date, or none (no end date). Renew stores a new date. The seeded price stored for `adult` is the integer `1500`.

`subscription_price` is an integer in cents. The server model comments it as “Subscription price in cents (e.g. 1500 = 15.00€)”. The public-type screen divides the value by 100 for display (`toFixed(2)` followed by a euro sign) and, on save, multiplies the entered amount by 100 (`emptyToNullPriceCents`). The field label is “Subscription price (€)”. The seeded value `1500` therefore displays as `15.00€`. That euro sign is written in the interface. No currency-code field converts this price.

Public type `child` cannot be enrolled without a legal guardian (`user_guardians`). The picker is on the patron record.

## What the patron sees

Once signed in, the patron opens:

- My loans, `/my-loans`: current loans, renewal when the renewal window allows it;
- My holds, `/my-holds`, when the account’s hold right is `own` or higher;
- My profile, `/profile`: contact details, language, password, purchase suggestions, history preference.

Loan history (`GET /api/v1/users/{id}/history`) is readable by the account holder or by staff. The preference that keeps or drops it is changed by the holder or by an administrator.

## Anonymise

“Anonymize for stats” calls `DELETE /api/v1/users/{id}`. Which columns are cleared, and what remains for statistics, is in [Administration](/en/docs/administration/).
