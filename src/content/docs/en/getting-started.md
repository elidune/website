---
title: Getting started
description: Sign-in, the library, sites, loan rules, a first record, a first patron, a first loan, and a return.
navTitle: Getting started
order: 20
section: start
draft: false
locale: en
---

This path assumes [Elidune is installed](/en/docs/installation/) and the initial wizard is finished.

## Sign-in

The home page, without a session, shows the sign-in form and, on the same screen, public catalogue search. After a successful sign-in, the staff home opens.

The login or the email address, and the password, are enough. If the account has a second factor, a second step asks for the code or a recovery code.

Forgotten password: the “forgotten password” link, then the message received. No message is sent if the library’s public address is empty. Five failures on the same login within fifteen minutes block further attempts for a while. This is not a permanent lock of the account. A staff member who can edit patrons clears the block from the patron record.

An account that must change its password is sent to that screen before anything else.

## The library

The Settings menu, for an administrator, opens every tab. A librarian sees only the Library tab, also reached from “My library”.

That tab records the name, address, country, time zone, email, phone numbers, and opening hours. The country is required in the wizard. Opening hours are used, among other things, to push a due date to the next open day when that shift is enabled (it is, in the shipped settings).

## Sites

A place where copies are kept, or where a hold is picked up, is a **site**. In Settings, Sites: create a name, choose the default site, rename, archive, or merge. A merge moves the copies and archives the old sites.

Each copy carries the site where it sits. A hold can name a pickup site. Movement between sites is described in [Multiple sites](/en/docs/sites/).

On a current installation, place numbers are aligned at startup. On an older database that has not received that correction, the first place added after the original site can fail once: save again.

## Loan rules

Settings, loan settings, administrator account:

- one row for every medium, and if needed a row per document type;
- duration in days, maximum number of loans, maximum number of renewals;
- where a renewal starts: the current due date plus the duration, or the day of the renewal plus the duration;
- renewal window, in days before the due date (0 to 366, 7 by default). A loan that is already overdue can still be renewed. A value of 0 allows renewal only from the due date onward.

The shipped set allows 5 loans, 2 renewals, and 21 days. An audience type can carry an exception (duration, ceilings). The ceiling that applies is computed by the software: first the audience maximum, then that audience’s default exception row, then the global row.

The same tab sets holds, reminders, and fines. See [Holds](/en/docs/holds/) and [Reminders and fines](/en/docs/reminders-fines/).

Shipped audience types are child, adult, school, staff, and senior, with ages and subscription lengths that can be changed on the Audience types tab.

## First record

Cataloguing menu, then create a record. The account must be allowed to edit the catalogue. A librarian or an administrator can, in the shipped set.

The record carries the title, authors, ISBN, document type, series, or collection. An ISBN that is already present asks for confirmation before the existing record is replaced.

Two imports avoid typing:

- Z39.50 search, after at least one server has been saved in Settings;
- import of a MARC file.

Staff search uses the search engine when it answers, otherwise the database.

## First copy

From the record, add a copy: barcode, call number, site, and whether it can be loaned. Detail is in [Copies](/en/docs/copies/).

## First patron

Circulation menu, Patrons. Creation asks for identity, a login, and an account type.

Shipped types are guest, reader, librarian, administrator, and group. For a person who borrows, choose reader. A reader’s audience type is computed from the date of birth. A child requires a legal guardian. The subscription has an end date, or none (no date limit). The card barcode is what the desk scans.

The patron signs in with the login, then opens “My loans”.

## First loan and first return

Circulation menu. Four tabs: loan, return, overdue, claims.

**Loan.** Identify the patron, then type or scan the copy barcode. The software refuses the loan if the ceiling is reached, if the copy has left the collection, is already held for someone else, is in transit, or if the unpaid fine balance is over the threshold. Staff can force some of these cases. The barcode field takes focus again for a scanner.

**Return.** Return tab, scan the barcode. If a hold is waiting for this copy, the return marks it ready for pickup, or opens a transit to the pickup site. See [Holds](/en/docs/holds/).

![Loan desk, light theme.](screen:desk "The desk shows the selected patron and the loans in progress.")

The same screen tightens on a tablet. See [Loans and returns](/en/docs/circulation/).

## See also

- [Catalogue](/en/docs/catalogue/)
- [Patrons](/en/docs/patrons/)
- [Administration](/en/docs/administration/)
