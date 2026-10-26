---
title: Loans and returns
description: Loan and return desk, forced checkout with a reason, copy states, and the tablet desk.
navTitle: Loans and returns
order: 36
section: features
draft: false
locale: en
---

The screen is `/loans`. It opens with `loans_rights` read. Checkout, check-in, renewal, and exceptions need write. The menu label is **Circulation**. The hold right is not enough.

Four tabs: checkout, return, overdue, claims.

<figure>
<picture>
<source srcset="/screens/en/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/desk.webp" alt="Loan desk, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: desk (`desk`).

## Tablet desk

Below 1024 px of width, the root font size goes from 16 px to 14 px. Below 1024 px of width or 768 px of height, the sidebar folds into sections. Below 768 px, the active-loan list is cards rather than a table. Desk barcode fields accept a scanner and, through `BarcodeScanField`, the device camera.

## Check out

1. Choose the patron (search or card barcode). An exact card scan uses `GET /api/v1/users/barcode/{code}` and shows the account state. Name search stays `GET /api/v1/users` and needs read rights on patrons.
2. Scan the copy barcode. `POST /api/v1/loans` creates the loan. One active loan per copy. The body may carry `force` and `overrideReason`.

The server computes the due date from the media-type duration and the audience type (see [Getting started](/en/docs/getting-started/)). When `skip_closed_days` is true, the date falls on the next open day. The loan stores the site where it was made (`loans.site_id`). A deposited copy can cap that date: see [Deposits](/en/docs/deposits/).

### Refusals and forcing

A checkout refusal is HTTP 422 with a `code`. The desk shows the matching message.

| Code | Forceable | Reason required |
| --- | --- | --- |
| `subscription_expired` | Yes, when `circulation_override_rights` is write | Yes |
| `item_held_for_other` | Same | Yes |
| `fines_over_threshold` | Yes, when `loans_rights` is write | No |
| `max_loans`, `max_media_loans`, `item_not_loanable` | Yes for any caller who sends `force` | No |
| `card_lost`, `item_to_pick_for_other`, `deposit_return_due` | No | — |

A missing reason when one is required returns `override_reason_required`. The **Force checkout** button appears only when the server marks the refusal `forceable` and the account has loan write. The shipped `librarian` type does not have `circulation_override_rights` write: only the shipped `admin` type can force an expired subscription or a copy held for someone else, until that right is granted in Settings.

`item_held_for_other` also offers **Set aside**, without leaving checkout. `item_to_pick_for_other` says the copy is already set aside and cannot be forced.

A card reported lost blocks checkout and renewal (`card_lost`). Returns and fine payment stay possible. The desk banner says so. Recording the loss is `POST /api/v1/users/{id}/card-lost` (patron write or loan write). Replacement, which does not reuse the old number, is `POST /api/v1/users/{id}/replace-card` (patron write). Neither action has a button in the interface of this version.

A batch checkout exists: `POST /api/v1/loans/batch-create`.

## Copy states

Circulation state is `items.circulation_status`, independent of the loan row.

| Value | API code | Effect |
| --- | --- | --- |
| 0 or empty | `available` | Loanable, when the other rules allow it |
| 1 | `lost` | Lost. Omitted from the public catalogue |
| 2 | `damaged` | Damaged. Not loanable |
| 3 | `claimedReturned` | Claimed returned |
| 4 | `toSearch` | To search. Still listed, unavailable to the public |
| 5 | `missing` | Missing. Omitted from the public catalogue |

`PUT /api/v1/items/{id}` rejects a `circulationStatus` field. Changes go through desk actions.

The closure reason of an archived loan is `returned` (check-in, damaged return, or a claims-returned case found) or `lost` (declared lost, or a claim not found). When a lost copy is accepted back later, `foundAt` is set. The interface shows “Lost, found on {date}”.

## Check in

Return tab: the barcode field keeps focus for a scanner. `POST /api/v1/loans/items/{barcode}/return` closes the loan. A barcode that is not on loan can return 200 with an informational notice (already returned, lost, to search, and so on) instead of a plain failure.

When a hold on the same record is waiting for a copy, check-in does not simply shelve it. It becomes ready for pickup, or it opens a transit. See [Holds](/en/docs/holds/).

Batch return: `POST /api/v1/loans/batch-return`.

## Renew

The patron renews their own loan in `/my-loans`. Staff renew from the desk. `POST /api/v1/loans/{id}/renew` accepts `force` and `overrideReason`.

Conditions read from the rules:

- remaining renewals are not used up (`max_renewals`, forceable with loan write);
- today is inside the window (`renew_window_days` before the due date, default 7), or the loan is already overdue (`renewal_too_early`, forceable the same way);
- the anchor `at_due_date` or `now` sets the new due date;
- a blocked account (`account_blocked`) is forceable with loan write;
- an expired subscription is forceable as at checkout, with the override right and a reason.

The date shown after renewal is the one the server returns.

## Overdues and exceptions

The overdue tab lists `GET /api/v1/loans/overdue`. Each row can be returned or renewed.

Exceptions on a loan, with write rights:

| Action | Route |
| --- | --- |
| Lost | `POST /api/v1/loans/{id}/lost` |
| Damaged | `POST /api/v1/loans/{id}/damaged` (`return` closes the loan, `keep` leaves it open) |
| Claimed returned by the patron | `POST /api/v1/loans/{id}/claimed-returned` |
| Close that claim | `POST /api/v1/loans/{id}/claims-returned/resolve` (`found` or `notFound`) |

The open-claim list is `GET /api/v1/loans/claims-returned`. Resolution and the audit row are written in the same transaction.

Sending overdue reminders by hand is limited to an administrator: `POST /api/v1/loans/send-overdue-reminders`. The automatic schedule is in [Reminders and fines](/en/docs/reminders-fines/).
