---
title: Holds
description: A hold queue per record, shelf picking, pickup, and expiry.
navTitle: Holds
order: 35
section: features
draft: false
locale: en
---

There is only one kind of hold. The queue belongs to the **record**. A precise copy is chosen only afterwards. Moving a copy to another site is a transit, not a second kind of hold.

![Holds list, light theme.](screen:holds "The list shows the state of each hold and the pickup.")

## Place a hold

Two gestures land in the same queue:

- reserve a title, from the patron area or the desk;
- pin a copy, a gesture reserved for staff.

A patron whose hold right is limited to themselves can reserve only for their own account. Staff allowed to edit holds can name another patron. Read-only access does not create a hold.

One active hold (waiting, to pick, or ready) per patron and per record. Each active hold counts as one toward the ceiling (20 by default, adjustable, with a possible exception on the audience type).

The pickup site is a site. See [Multiple sites](/en/docs/sites/). Two notes coexist: a note the patron can see, and a note internal to staff. The “hold ready” message repeats the title, the barcode, the deadline, and the pickup site, in the library’s time zone. It does not replace the pickup site with the site the copy leaves from.

## Picking

As soon as a title hold finds a copy on the shelf, loanable, not withdrawn, not on loan, not already held, and not in transit, it takes that copy. A copy already at the pickup site is preferred. The row becomes “to pick” and the copy stays on the shelf: the patron is not notified yet.

With no free copy, the row stays waiting, in arrival order.

The pick list shows the rows to pick. A site filter limits it to the copy’s current site. The pick delay (2 days by default, in the hold policy) flags late rows. It does not cancel the hold.

“Not on the shelf” marks the copy to search and reassigns the hold, or puts it back to waiting. A later scan of that barcode leaves the “to search” state and follows the normal return path.

## When the copy comes back

At check-in, when the desk scans:

- same site, or no pickup site: the hold becomes ready, a message is sent, and the pickup delay starts;
- another site: a transit is requested, and the hold stays assigned. Receiving at the pickup site moves that hold to “ready”.

The default pickup delay is 7 days. After that delay, the hold expires and the copy is offered to the next patron.

Cancelling a hold whose copy is in transit frees the place and opens a return transit toward the origin.

## Screens

| Screen | Who |
| --- | --- |
| Holds list | Staff: every queue |
| My holds | The patron: their own, and cancelling their own |
| Record screen | The record’s queue, in arrival order |
| Transits | Copy movements |

Staff allowed to edit holds cancel any row. A patron cancels only their own.
