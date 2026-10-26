---
title: Reminders and fines
description: Three reminder levels, fines in euro cents, and payment capped at the balance still due.
navTitle: Reminders and fines
order: 38
section: features
draft: false
locale: en
---

Reminders and fine calculation are set in Settings, on the loan-rules tab, and in Settings, Server (send time, on/off switches). An `admin` account is required for these screens. The interface enters amounts in euros, with two decimal places. Storage is an integer number of cents.

## Three reminders

The scheduler sends, when `ELIDUNE_REMINDERS__ENABLED` is true (the default):

| Level | Delay after the due date (default) | Template | Label |
| --- | --- | --- | --- |
| First reminder | 7 days | `overdue_reminder` | 1st reminder |
| Second reminder | 14 days | `overdue_second_reminder` | 2nd reminder |
| Formal notice | 21 days | `overdue_formal_notice` | Formal notice |

Turning off the first level turns off the next two. Turning off the second turns off the formal notice. The default send time is 09:00 (`ELIDUNE_REMINDERS__SEND_TIME`). A 100 ms gap separates two messages (`ELIDUNE_REMINDERS__SMTP_THROTTLE_MS`). `frequency_days` (default 7) remains in the configuration. The next level follows `loans.reminder_count`: 0, then 1, then 2, then none.

Reminder templates ship in French, English, German, and Spanish under `server/data/email_templates/`. The email-template tab edits French and English. Message language follows the patron preference, then the library language, then French, then English. See [Languages](/en/docs/languages/). With no SMTP configured, nothing is sent.

Sending happens only when the recipient has an email address and `receive_reminders` is true (the default at creation). Immediate sending, outside the schedule, is `POST /api/v1/loans/send-overdue-reminders` (administrator). Turning off `accrue_fines` does not stop reminder email.

## Fines in cents

Columns `fines.amount`, `paid_amount`, `refunded_amount`, `fine_rules.daily_rate`, and `fine_rules.max_amount` are integers in euro cents. The schema comment says so: `20` is €0.20, `1500` is €15.00. The API exposes these amounts as decimal strings (`"0.20"`, `"15.00"`) through `euro_string`. A call that sends `"12.50"` is stored as 1250 cents. More than two significant decimal places is rejected.

The shipped rule, with no media type, has a daily rate of 20 cents, a cap of 1500 cents, and 3 grace days. The amount is `rate × max(0, overdue days − grace)`, then capped when a maximum is set. One open fine per loan and charge type.

| `charge_type` | Label |
| --- | --- |
| `overdue` | Overdue |
| `replacement` | Lost copy |
| `damage` | Damaged copy |

| `status` | Label |
| --- | --- |
| `pending` | Unpaid |
| `partial` | Partly paid |
| `paid` | Paid |
| `waived` | Waived |
| `cancelled` | Cancelled (nothing had been collected) |
| `refunded` | Refunded |

The nightly job recomputes the overdue fine when `accrue_fines` is true (the `sample.toml` default). Staff can run the calculation for one loan (`POST /api/v1/loans/{id}/fines/accrue`). The patron record, Fines tab, lists the rows for anyone with read rights on patrons. Pay and waive buttons on that list are not wired in the interface: the API remains `POST /api/v1/fines/{id}/pay` and `POST /api/v1/fines/{id}/waive`.

### Payment capped at the balance still due

`POST /api/v1/fines/{id}/pay` takes `amount` as decimal euros. The server rejects an amount above `amount − paid_amount`. The response is HTTP 422, code `payment_exceeds_balance`, with `remainingCents` (the balance still due, in cents). A zero or negative amount is rejected. `paid_amount` never exceeds `amount`. A refund (`refunded_amount`) never exceeds what was collected. It is produced when a lost copy is found, not by a separate payment route.

## Blocking threshold

An unpaid-balance block happens only when `accrue_fines` is true. Otherwise the stored thresholds are ignored for checkout. Lost and damage bills stay visible.

The global mode (`circulation_settings.unpaid_threshold_mode`) is `none` or `amount`. A fresh install starts at `none`: no amount-based block. In `amount` mode, an unpaid balance **strictly above** `unpaid_fine_threshold` (cents) blocks checkout and renewal. With 0, any positive balance blocks. The refusal code is `fines_over_threshold`. It is forceable with loan write, without a required reason. See [Loans and returns](/en/docs/circulation/).

An audience type has its own mode: `inherit` (follow the global mode), `none` (never block on amount), or `amount` (its own cents). Shipped types default to `inherit`.

The interface sends cents already converted (`unpaidThresholdCents`) for the policy, and decimal euros for the daily rate. The subscription price, also in cents, is described in [Patrons](/en/docs/patrons/).
