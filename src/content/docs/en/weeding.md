---
title: Weeding
description: Weeding candidate, withdrawal, and the effect on loans and holds.
navTitle: Weeding
order: 38
section: features
draft: false
locale: en
---

Weeding is a status of the item, separate from the loan, from loss, and from archival. Three values:

| Status | Effect |
| --- | --- |
| `onShelf` | On the shelf. Circulates as usual |
| `candidate` | Candidate. Stays on the shelf and can still be loaned, renewed, or held |
| `withdrawn` | Withdrawn. No loan, no renewal, no hold |

The UI states it this way: a candidate stays on the shelf. A withdrawn item no longer circulates. The biblio remains.

## Change the status

On the item record, the weeding control sends `POST /api/v1/items/{id}/weeding` with `status` and an optional reason (200 characters at most). It is not a field of `PUT /api/v1/items/{id}`.

Staff who manage items (`librarian` or `admin`) use this control.

When every remaining item is `withdrawn`, the biblio itself is marked `withdrawn`. A title hold is refused when no circulating item remains.

## At the desk

Checkout, renewal, or a hold on a withdrawn item is refused. The messages are `weeding.blockedCheckout`, `weeding.blockedRenew`, and `weeding.blockedHold`.

The public catalogue does not publish the weeding reason.
