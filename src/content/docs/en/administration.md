---
title: Administration
description: Settings, rights, email sending, anonymisation, and the audit log.
navTitle: Administration
order: 50
section: admin
draft: false
locale: en
---

Settings open from the menu of the same name. An administrator sees every tab. A librarian sees only Library.

![Library settings, light theme.](screen:settings "The Library tab: name, address, and contact.")

## Tabs

| Tab | Contents |
| --- | --- |
| Library | Name, address, country, time zone, contact, opening hours |
| Loan settings | Durations, ceilings, renewal, holds, reminders, fines, unpaid threshold |
| Audience types | Audiences, ages, subscription, loan exceptions |
| Account types | Rights per account type |
| Email templates | Texts that are sent |
| Sites | Places where copies are kept and picked up |
| Z39.50 servers | Import targets, when the module is on |
| Modules | Optional features, including the essential profile |
| Server | Reminders, hold expiry, logs, audit retention, email sending, reindex, database backup |
| Audit | Log of sensitive operations |

The Server tab has three sub-tabs: General, Catalog, Database. A section marked as not editable from the interface stays as in the configuration file. “Back to the file” deletes the override saved in the database.

The sections the template allows to override include logging, email, reminders, audit, and holds.

## Roles and rights

The account type carries levels. For documents, patrons, settings, and events: none, read, write. For loans and holds: none, self, read, write.

| Type | Documents | Patrons | Loans | Holds | Settings |
| --- | --- | --- | --- | --- | --- |
| Guest | read | none | none | none | read |
| Reader, group | read | self | self, without the desk | self | read |
| Librarian | write | write | write | write | read |
| Administrator | write | write | write | write | write |

The “self” level on loans does not open the desk. It lets the patron see and renew their own loans. The “self” level on holds lets them create and cancel their own.

Other rights exist on the account type: acquisitions, weeding, cancelling a weeding, archiving a copy, circulation exception, events. The shipped librarian has write everywhere except settings (read) and the circulation exception (none). The shipped administrator has write, including that exception. Custom types are created on the Account types tab. Types shipped with the software cannot be deleted.

The Modules tab turns optional features on or off, including the essential profile. That profile turns off acquisitions, purchase suggestions, weeding, transits, deposits, and visitor counts, even when the matching boxes are ticked. Events, inventory, Z39.50, MARC import, and statistics stay on. A feature that is off answers with a refusal. Visitor counts have no screen, only the switch.

Changing a user’s type remains an administrator action.

Server operations (configuration, a test send, reindex, audit, backup) require an administrator account.

## Email

When the email section can be overridden, the Server tab records the host, the port (587 by default), the login, the password, the sender address, the sender name, and encryption. The password is not returned in clear text by the screen. A test send exists for the administrator.

Do not save an empty value in place of an optional setting: leave the field aside.

The library’s public address, with no trailing slash, is the origin of links in messages. Empty, password reset sends nothing. Event announcements point to the unsubscribe page.

Shipped templates: three overdue reminders, hold ready, forgotten password, second-factor code, recovery code, event announcement, loan closed by an inventory.

## Anonymisation

The desk action is named “Anonymize for stats”. If the patron still has active loans, the action can check them in first, then erase, when it is confirmed.

The internal identifier is not rewritten. The account moves to the deleted state, sessions are revoked, and the identity fields (login, password, name, email, address, phone, barcode, date of birth, notes, second factor) are cleared. The account type, the audience type, the creation date, and the subscription end date remain. Loan archives keep dimensions (age band at the loan date, year, town, audience type, account type) and lose the link to the person. Active holds are deleted. Fines lose the patron. Messages waiting for that address are deleted. The audit log does not store the erased data.

The automatic pass, in years after the subscription end, is off by default (zero years). A value often kept for a municipal library is three years after the end date. The task runs at 04:00. It ignores patrons who still have an active loan. Each anonymisation is logged.

The action is irreversible. The column-by-column detail is in the software repository’s technical documentation, recalled in the [data model](/en/dev/data-model/).

## Logs

Two separate logs:

- **Application.** Level, format, and output are set in the file or, when the section can be overridden, on the Server tab. This log is for diagnosis. It is not the audit log.
- **Audit.** Readable by an administrator, with an export. The default retention is 365 days. Older rows are deleted. The Audit tab shows them.

First setup writes an event when the wizard finishes (library name, whether email sending is present), without the password.
