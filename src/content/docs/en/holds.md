---
title: Holds
description: Title-level hold queue, shelf pick, pickup, and expiry.
navTitle: Holds
order: 35
section: features
draft: false
locale: en
---

There is one kind of hold. The queue belongs to the **biblio**. A concrete item is chosen later. Moving it to another site is a transit, not a second hold type.

<figure>
<picture>
<source srcset="/screens/en/dark/holds.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/holds.webp" alt="Holds list, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: holds (`holds`).

## Place a hold

`POST /api/v1/holds` accepts:

- `biblioId`: a title hold (OPAC or desk);
- `itemId`: staff pin a specific item.

Both create the same row, on the same biblio. A patron whose `holds_rights` is `own` can hold only for themselves. Staff (`write`) can name another user. `read` alone cannot create a hold.

One active hold (`pending`, `to_pick`, or `ready`) per patron per biblio. Each active hold counts as one toward `maxActiveHolds` (default 20, editable, with an optional public-type override).

The pickup site (`pickupSiteId`) is a site. See [Multiple sites](/en/docs/sites/). Two notes coexist: `patronNote` (visible to the patron) and `internalNote` (staff only). The `hold_ready` email includes the title, the barcode, the deadline, and the pickup site (`pickup_site`), in the library time zone. It does not substitute the copy’s home site for the pickup site.

## Shelf pick

As soon as a title hold finds a shelf item that is borrowable, not withdrawn, not on loan, not already held, and not in transit, it takes that item. An item already at the pickup site is preferred. The row becomes `to_pick` and the item stays on the shelf: the patron is not notified yet.

With no free item, the row stays `pending`, in arrival order.

`/pick-list` (`GET /api/v1/holds/pick-list`) lists `to_pick` rows. A site filter limits the list to the item’s current site. `pickDelayDays` (default 2, in the hold policy) flags overdue pick-list rows. It does not cancel the hold.

“Not on shelf” (`POST /api/v1/holds/{id}/pick-not-found`) marks the item `toSearch` and reassigns the hold, or returns it to `pending`. A later scan of that barcode clears `toSearch` and follows the normal return path.

## When the item comes back

On return, at the desk scan:

- same site, or no pickup site: status `ready`, notification, pickup window;
- other site: transit `requested`, the hold stays allocated. Receipt at the pickup site sets that same hold to `ready`.

The default pickup window is `ELIDUNE_HOLDS__READY_EXPIRY_DAYS` = 7. After that the hold expires and the item is offered to the next one.

Cancelling a hold whose item is in transit frees the place and opens a return transit to the origin.

## Screens

| Screen | Who |
| --- | --- |
| `/holds` | Staff: every queue |
| `/my-holds` | Patron: their own, and cancellation of their own |
| Biblio page | That biblio’s queue, arrival order |
| `/transits` | Item transits |

`DELETE /api/v1/holds/{id}` cancels. Staff with `write` cancel any row. A patron with `own` cancels only their own.
