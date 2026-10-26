---
title: Acquisitions and suggestions
description: Vendors, funds, purchase orders, and purchase suggestions.
navTitle: Acquisitions and suggestions
order: 37
section: features
draft: false
locale: en
---

The Acquisitions menu appears only when `acquisitions_rights` is `r` or `w` (`canViewAcquisitions`). Writing (vendors, funds, orders) requires `w`. Migrations set `w` for `librarian` and `admin`, and `n` otherwise. This right is separate from cataloguing.

| Screen | Path |
| --- | --- |
| Orders | `/acquisitions/orders` and `/acquisitions/orders/{id}` |
| Vendors | `/acquisitions/vendors` |
| Funds | `/acquisitions/funds` |
| Suggestions | `/acquisitions/suggestions` |

`/acquisitions` redirects to the order list.

## Vendors, funds, orders

The order of work the screens imply: save a vendor and a fund, then open an order and add lines. The order record is a separate page.

Tables come from migration `032_acquisitions.sql`. This page does not copy the schema.

### Order statuses

`PurchaseOrderStatus`, with the interface labels:

| Code | Label |
| --- | --- |
| `draft` | Draft |
| `ordered` | Ordered |
| `partial` | Partial |
| `received` | Received |
| `cancelled` | Cancelled |

Only a draft can be edited and submitted. Submission requires a vendor and at least one line, then stores status `ordered`. A fund’s committed amount (`committed`) sums, for `ordered` and `partial` orders, the quantity not yet received multiplied by the unit price.

Cancellation applies to a draft, or to an `ordered` purchase order whose lines have no quantity received. A receipt already recorded blocks cancellation.

Receiving applies to `ordered` or `partial`. It increases `quantity_received` on each received line. When no line still has `quantity_received` below `quantity_ordered`, the status becomes `received`. Otherwise it becomes `partial`.

Lines have no status enumeration. Each line carries `quantity_ordered`, `quantity_received`, `unit_price`, a currency, and an intent. The currency is a three-letter ISO code. When omitted on input, it is `EUR` (`normalize_currency`). The intent requires at least a biblio (`biblio_id`), an ISBN, or a title.

Physical copies are created at receipt. A copy is borrowable when the barcode, the site, and the price are set. The price can be deferred (`price_deferred`, label “Price deferred”): barcode and site are then enough. Without those conditions, the copy is not borrowable.

## Purchase suggestions

A patron files a suggestion from their profile (`/profile#suggestions`). Staff handle them in `/acquisitions/suggestions`.

The screen’s default filter shows status `proposed` (“Proposed”). Accept (`POST /api/v1/suggestions/{id}/accept`, label “Accepted”) can attach the suggestion to an order. Refuse calls `POST /api/v1/suggestions/{id}/refuse` (label “Refused”).

The signed-in patron home page points at that form.
