---
title: Acquisitions and suggestions
description: Vendors, funds, purchase orders, and purchase suggestions.
navTitle: Acquisitions and suggestions
order: 37
section: features
draft: false
locale: en
---

The Acquisitions menu appears only when `acquisitions_rights` is `r` or `w` and the module is on. Writing (vendors, funds, orders) requires `w`. Shipped `librarian` and `admin` types have `w`; the others have `n`. This right is separate from cataloguing.

<figure>
<picture>
<source srcset="/screens/en/dark/acquisitions.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/acquisitions.webp" alt="Acquisitions screen, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: acquisitions (`acquisitions`).

| Screen | Path |
| --- | --- |
| Orders | `/acquisitions?tab=orders` and the record `/acquisitions/orders/{id}` |
| Vendors | `/acquisitions?tab=vendors` |
| Funds | `/acquisitions?tab=funds` |
| Suggestions | `/acquisitions?tab=suggestions` |

`/acquisitions/orders`, `/acquisitions/vendors`, `/acquisitions/funds`, and `/acquisitions/suggestions` redirect to those tabs.

## Vendors, funds, orders

The order of work the screens imply: save a vendor and a fund, then open an order and add lines. The order record is a separate page.

Tables `acquisition_vendors`, `acquisition_funds`, and `purchase_orders` live in `001_initial_schema.sql`. This page does not copy the schema. Receiving (`POST /api/v1/acquisitions/orders/{id}/receive`) increases `quantity_received` and creates the physical copies.

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
