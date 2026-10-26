---
title: Reminders and fines
description: Three reminder levels, amounts in euros, and payment capped at the balance due.
navTitle: Reminders and fines
order: 38
section: features
draft: false
locale: en
---

Reminders and fine calculation are set in Settings, on the loan tab, and in Settings, Server (send time, on or off). An administrator account is required for these screens. The interface enters amounts in euros, with two decimals. The software stores them in cents: €0.20 is stored as 20, and €15.00 as 1500.

## Three reminders

If sending is on (it is, in the shipped settings):

| Level | Delay after the due date | Message |
| --- | --- | --- |
| First reminder | 7 days | 1st reminder |
| Second reminder | 14 days | 2nd reminder |
| Formal notice | 21 days | Formal notice |

Turning off the first level turns off the next two. Turning off the second turns off the formal notice. The default send time is 09:00. A short gap separates two messages, so the mail server is not flooded. The next level depends on how many reminders have already gone out: none, then one, then two, then nothing more.

The texts are shipped in French, English, German, and Spanish. The Email templates tab edits only French and English. The message language follows the patron’s preference, then the library language, then French, then English. See [Languages](/en/docs/languages/). With no mail server configured, nothing is sent.

A message is sent only if the recipient has an email address and has accepted reminders (they have, when the account is created). Sending at once, outside the schedule, is reserved for the administrator. Turning off fine calculation does not stop reminder emails.

## Fines

The shipped rule, with no particular document type, has a daily rate of €0.20, a ceiling of €15.00, and 3 days of grace. The amount is the rate multiplied by the overdue days beyond the grace, then capped when a maximum exists. One open fine per loan and per charge type.

| Charge | Meaning |
| --- | --- |
| Overdue | Days past the due date |
| Replacement | Lost copy |
| Damage | Damaged copy |

| Situation | Meaning |
| --- | --- |
| Unpaid | Nothing has been taken |
| Partly paid | A part has been taken |
| Paid | The balance due is zero |
| Waived | Staff cancelled the debt |
| Cancelled | Nothing had been taken, and the row is closed |
| Refunded | What had been taken was given back |

The night run recalculates the overdue fine when calculation is on (it is, in the shipped settings). Staff can also run the calculation for one loan. The patron record, Fines tab, lists the rows for anyone who can read patrons.

The payment and waiver buttons on that list are not wired in the interface of this version. Payment and waiver exist for connected tools. The detail is in the [API reference](/en/dev/api/).

### Payment capped at the balance due

A payment above the balance due is refused. A zero or negative amount is refused. The sum taken never exceeds the fine amount. A refund never exceeds what was taken. It is produced when a lost copy is found, not by a second payment.

## Blocking threshold

Blocking for unpaid fines happens only when fine calculation is on. Otherwise the saved thresholds are ignored for checkout. Loss and damage bills stay visible.

The global mode is “none” or “an amount”. A fresh installation starts at “none”: no block on the amount. In amount mode, an unpaid balance **strictly above** the threshold blocks checkout and renewal. With a threshold of 0, any positive balance blocks. That refusal can be forced with the right to edit loans, with no required reason. See [Loans and returns](/en/docs/circulation/).

An audience type has its own mode: follow the global setting, never block on the amount, or apply its own cents. The default of the shipped types is to follow the global setting.
