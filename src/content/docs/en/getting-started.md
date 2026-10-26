---
title: Getting started
description: Sign-in, library, sites, loan rules, first record, first patron, first loan and return.
navTitle: Getting started
order: 20
section: start
draft: false
locale: en
---

This path assumes [Elidune is installed](/en/docs/installation/) and the initial wizard is finished. The sign-in address is `/`. The route `/login` redirects to `/`.

## Sign-in

The signed-out home page shows the sign-in form and, on the same screen, the public catalogue search. After a successful sign-in the UI opens `/home`.

The body of `POST /api/v1/auth/login` uses the login or the email, and the password. If the account has a second factor, the next step calls `POST /api/v1/auth/verify-2fa` or `POST /api/v1/auth/verify-recovery`.

Forgotten password: `/forgot-password`, then the link received (`/reset-password`). No email is sent when `ELIDUNE_SERVER__PUBLIC_BASE_URL` is empty. Five failures on the same login within 15 minutes block further attempts for that window. Staff with write access on users clear the block from the patron record (`DELETE /api/v1/auth/rate-limit/{login}`).

A token scoped to password change only sends the browser to `/change-password`.

## Library

The Settings menu (account type `admin`) opens `/settings`. A `librarian` account sees only the Library tab, also linked as “My library”.

The Library tab stores the name, address, country, time zone, email, phones, and opening hours. The country is required in the wizard. Opening hours are used to push a due date to the next open day when `[circulation] skip_closed_days` is true (the `sample.toml` default).

## Sites

A holding or pickup place is a **site** (`sites` table). Settings, Sites tab: create a name, choose the default site, rename, archive, merge. A merge reassigns copies and archives the old sites. On a fresh database, the first site added after `MyLibrary` fails once (sequence; see [Installation](/en/docs/installation/)).

Each item stores the site where it sits (`siteId`). A hold can name a pickup site (`pickupSiteId`). Movement between sites is described in [Multiple sites](/en/docs/sites/).

## Loan rules

Settings, loan-rules tab (account type `admin`):

- one default row (all media) and, when needed, one row per media type;
- duration in days, maximum number of loans, maximum number of renewals;
- renewal anchor: `at_due_date` (current due date plus the duration; database default) or `now` (renewal day plus the duration);
- renewal window, in days before the due date (0 to 366, default 7). An overdue loan can still be renewed. The value 0 allows renewal only from the due date onward.

Migrations insert a global row: 5 loans, 2 renewals, 21 days. A public type can carry an override (duration, caps). The effective cap is resolved by the server: first the public type’s maximum, then that type’s default override row, then the global row.

The same tab sets hold policy, reminders, and fines. See [Holds](/en/docs/holds/) and [Reminders and fines](/en/docs/reminders-fines/).

Seeded public types are `child`, `adult`, `school`, `staff`, and `senior`, with age bounds and subscription lengths edited on the Public types tab.

## First record

Cataloguing menu, “Catalogue” (`/biblios`), then create (`/biblios/new`). The account must be `librarian` or `admin`.

The biblio carries the title, authors, ISBN, media type, series, or collection. An ISBN that already exists asks for confirmation before replacement.

Two imports avoid typing:

- Z39.50 search (`/z3950`), after at least one server is saved in Settings;
- MARC import (`/import-iso`).

Staff search uses Meilisearch (index `items`) when it answers, otherwise PostgreSQL.

## First item

From the biblio, add an item: barcode, call number, site, and a borrowable flag. The code name for the physical copy is **item**. Details are in [Items](/en/docs/copies/).

## First patron

Circulation menu, Readers (`/users`). Creation asks for identity, a login, and an account type.

Account types shipped by migrations are `guest`, `reader`, `librarian`, `admin`, and `group`. For a patron, choose `reader`. A `reader` public type is computed from the birth date. Public type `child` requires a legal guardian. The subscription has an end date, or none (unlimited). The card barcode is what the desk scans.

The patron signs in with that login at `/`, then opens “My Loans” (`/my-loans`).

## First loan and first return

Circulation menu (`/loans`). Four tabs: loan, return, overdue, claims.

**Loan.** Identify the patron, then type or scan the item barcode. The server refuses the loan when the cap is reached, when the item is withdrawn, already held for someone else, in transit, or when the unpaid fine balance is over the threshold. Staff can force some of these cases. The barcode field takes focus again for a scanner.

**Return.** Return tab, scan the barcode (`POST /api/v1/loans/items/{barcode}/return`). If a hold is waiting for this item, the return marks it ready for pickup or opens a transit to the pickup site. See [Holds](/en/docs/holds/).

<figure>
<picture>
<source srcset="/screens/en/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/desk.webp" alt="Loan desk, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: desk (`desk`). The same screen tightens on a tablet. See [Loans and returns](/en/docs/circulation/).

## Next

- [Catalogue](/en/docs/catalogue/)
- [Patrons](/en/docs/patrons/)
- [Administration](/en/docs/administration/)
