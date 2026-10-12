---
title: Reminders and fines
description: Overdue emails, the fine scale, and the threshold that blocks checkout.
navTitle: Reminders and fines
order: 36
section: features
draft: false
locale: en
---

Reminders and fine calculation are set in Settings, on the loan-rules tab, and in Settings, Server (send time, on/off switches). An `admin` account is required for these screens.

## Three reminders

The scheduler sends mail when `ELIDUNE_REMINDERS__ENABLED` is true (the default):

| Level | Delay after the due date (default) | Template |
| --- | --- | --- |
| First reminder | 7 days | `overdue_reminder` |
| Second reminder | 14 days | `overdue_second_reminder` |
| Formal notice | 21 days | `overdue_formal_notice` |

Each level can be turned off on its own. The default send time is 09:00 (`ELIDUNE_REMINDERS__SEND_TIME`). A 100 ms gap separates two messages (`ELIDUNE_REMINDERS__SMTP_THROTTLE_MS`). `frequency_days` (default 7) remains in the configuration for older screens. The delays above are the ones the graduated-reminder code uses.

Templates ship in French and English under `server/data/email_templates/`. The Email templates tab edits them. With no SMTP configured, nothing is sent. See [Administration](/en/docs/administration/).

A message is sent only when the recipient has an email and `receive_reminders` is true (the default at creation). An immediate send, outside the schedule, is `POST /api/v1/loans/send-overdue-reminders` (administrator).

## Fines

The scale is one rule per media type, plus a default rule with no type. Each rule has:

- a daily rate (`daily_rate`);
- an optional cap (`max_amount`);
- grace days (`grace_days`, default 0).

The amount is `rate × max(0, overdue days − grace)`, then capped when a maximum is set. One open fine per loan. The nightly pass recomputes that fine when `accrue_fines` is true (the `sample.toml` default). Staff can also run accrual, record a payment (`POST /api/v1/fines/{id}/pay`), or waive (`POST /api/v1/fines/{id}/waive`).

## Blocking threshold

`circulation_settings.unpaid_fine_threshold` defaults to 0. An unpaid balance **strictly above** the threshold blocks checkout and renewal. With 0, any positive balance blocks. Paid or waived fines do not count. Staff can force the loan. The threshold is edited on the loan-rules tab, and a public type can carry an override.

Fine amounts are euros. The UI takes and shows them in euros, with two decimal places. `daily_rate`, `max_amount`, `amount`, `paid_amount`, and `unpaid_fine_threshold` are `NUMERIC(12, 2)` values carrying that amount: `15.00` means 15.00 €. The shipped rule is a daily rate of `0.20` and a cap of `15.00`. The screen sends the entered value to the API unchanged (`PUT /api/v1/fines/policy`, field `unpaidFineThreshold`). An API call or an `INSERT` therefore sends euros (`15.00` for 15.00 €). The subscription price is described in [Patrons](/en/docs/patrons/).
