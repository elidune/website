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

> **TODO.** List the order and line statuses actually offered by `AcquisitionsOrdersPage.tsx` and the acquisitions service, after reading those files. They are not repeated here, to avoid an inaccurate label.

## Purchase suggestions

A patron files a suggestion from their profile (`/profile#suggestions`). Staff handle them in `/acquisitions/suggestions`.

The screen’s default filter shows status `proposed`. Accept (`POST /api/v1/suggestions/{id}/accept`) can attach the suggestion to an order. Refuse calls `POST /api/v1/suggestions/{id}/refuse`.

The signed-in patron home page points at that form.
