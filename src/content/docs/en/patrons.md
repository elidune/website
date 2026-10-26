---
title: Patrons
description: Accounts, audience types, subscription, legal guardian, and anonymisation.
navTitle: Patrons
order: 33
section: features
draft: false
locale: en
---

The Patrons menu lists accounts. Search covers family name, given name, and barcode. Opening the screen follows the right to view patrons, not only the title “librarian”.

![Patron record, light theme.](screen:patrons "The record shows the audience type and the legal guardian. The name is not repeated on a slip.")

The name is on the record. It is not repeated on a slip, a shelf label, or a batch report.

## Create an account

Staff who can edit patrons create the account. The screens ask for identity, a login, a password, the account type, the audience type, contact details, date of birth, language, and the card barcode.

| Shipped type | Role at the desk |
| --- | --- |
| Reader | Borrows and reserves for themselves |
| Group | A shared account, with the same circulation rights as a reader |
| Guest | No loans |
| Librarian | Catalogue, patrons, loans. Settings limited to the library |
| Administrator | Every settings tab, including loan exceptions |

Changing someone’s account type, or requiring a new password at the next sign-in, is reserved for the administrator.

The password is at least 8 characters. No other complexity rule is imposed.

## Audience type and subscription

The audience type (child, adult, school, staff, senior, or a type added in Settings) carries the age, the subscription length, the fee, and, optionally, loan ceilings that differ from the global rule.

The record has a subscription end date, or none (a subscription with no end date). The Renew button saves a new date.

Subscription amounts are entered in euros. The software stores them in cents. The shipped fee for an adult is €15.00. See also [Reminders and fines](/en/docs/reminders-fines/).

A child cannot be registered without a legal guardian. The selector is on the record. The guardian cannot themselves be a child or a school audience.

For a reader account, the audience type is derived from the date of birth and the age bounds. If no bound matches, the save is refused. A custom account type is not derived this way.

The Fines tab on the record lists charges when the right to read patrons is present.

A card reported lost blocks checkout. Replacement drops the old number and issues a new one. Neither action has a button in the interface of this version: staff prepare them with an administrator, and the detail is in the [API reference](/en/dev/api/). Returns and fine payment stay possible with a lost card. See [Loans and returns](/en/docs/circulation/).

## What the patron sees

Once signed in, the patron opens:

- My loans: loans in progress, renewal when the window allows it;
- My holds, if the account can manage their own;
- My profile: contact details, language, password, purchase suggestions, history preference.

Loan history is readable by the holder or by staff. The preference that keeps it or not is changed by the holder or an administrator.

## Anonymise

The action “Anonymize for stats” removes the identity and keeps non-identifying dimensions for statistics. What disappears and what remains is in [Administration](/en/docs/administration/). The action is irreversible.
