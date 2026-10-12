---
title: Loans and returns
description: Loan and return desk, renewals, overdue loans, and circulation exceptions.
navTitle: Loans and returns
order: 34
section: features
draft: false
locale: en
---

The screen is `/loans`. It is limited to `librarian` and `admin` accounts (`loans_rights` write). The hold right is not enough to check out or check in.

Four tabs: loan, return, overdue, claims.

<figure>
<picture>
<source srcset="/screens/en/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/desk.webp" alt="Placeholder image of the loan desk, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot slot: loan desk (`desk`).

## Check out

1. Choose the patron (search or card barcode).
2. Scan the item barcode. `POST /api/v1/loans` creates the loan. One active loan per item.

The server computes the due date from the media-type duration and the public type (see [Getting started](/en/docs/getting-started/)). When `skip_closed_days` is true, the date falls on the next open day.

Usual refusals, HTTP 422:

- loan cap reached;
- item not borrowable, in transit, lost, damaged, or withdrawn;
- item already picked or set aside for another hold (`item_to_pick_for_other`);
- unpaid fine balance above the threshold.

`force=true`, staff only, overrides some of these blocks. Forcing an item assigned to a `to_pick` hold releases that assignment instead of cancelling the patron’s place in the queue.

A batch checkout exists: `POST /api/v1/loans/batch-create`.

## Check in

Return tab: the barcode field keeps focus for a scanner. `POST /api/v1/loans/items/{barcode}/return` closes the loan.

If a hold on the same biblio is waiting for an item, the return does not simply put it back on the shelf. It marks the hold ready, or it opens a transit. See [Holds](/en/docs/holds/).

Batch return: `POST /api/v1/loans/batch-return`.

## Renew

The patron renews their own loan in `/my-loans`. Staff renew from the desk. `POST /api/v1/loans/{id}/renew`.

Conditions read from the rules:

- renewals remaining are not used up;
- today is inside the window (`renew_window_days` before the due date), or the loan is already overdue;
- the anchor `at_due_date` or `now` sets the new due date;
- the same blocks as checkout apply (fines, weeding). `force` requires the loan write right.

The date shown after renewal is the date the server returns.

## Overdue loans and exceptions

The overdue tab lists `GET /api/v1/loans/overdue`. Each row can be returned or renewed.

Exceptions on a loan, all with the write right:

| Action | Route |
| --- | --- |
| Lost | `POST /api/v1/loans/{id}/lost` |
| Damaged | `POST /api/v1/loans/{id}/damaged` |
| Claimed returned by the patron | `POST /api/v1/loans/{id}/claimed-returned` |
| Resolve that claim | `POST /api/v1/loans/{id}/claims-returned/resolve` |

The list of open claims is `GET /api/v1/loans/claims-returned`.

Sending overdue reminders by hand is administrator-only: `POST /api/v1/loans/send-overdue-reminders`. The schedule is in [Reminders and fines](/en/docs/reminders-fines/).
