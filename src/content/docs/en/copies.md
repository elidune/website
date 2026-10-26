---
title: Items
description: Physical copies, barcodes, call numbers, availability, and inventory.
navTitle: Items
order: 32
section: features
draft: false
locale: en
---

An item is a physical object on loan, attached to a biblio.

## Create

From the biblio page, staff add an item (`POST /api/v1/biblios/{id}/items`). Desk fields are the barcode, call number, site, and whether the item is borrowable. A barcode that already exists asks for confirmation.

Receipt can be left incomplete: until it is complete, the item cannot be loaned and cannot be assigned to a hold.

## Availability

The server computes a status. The UI does not infer it from the borrowed flag alone. Precedence: on loan, in transit, on hold, to search, unavailable, available.

| Status | Meaning |
| --- | --- |
| `available` | On the shelf, borrowable |
| `onLoan` | Out on loan |
| `inTransit` | Moving to another site |
| `onHold` | Assigned to a hold (`to_pick` or `ready`) |
| `toSearch` | Not found during shelf pick. The public catalogue groups this with `unavailable` |
| `unavailable` | Incomplete receipt, lost, damaged, claimed returned, or withdrawn |

The public catalogue omits lost, missing, weeding-candidate, and withdrawn copies. It shows neither the weeding reason, nor the hold patron’s name, nor the internal note. A shelf label does not carry the patron’s name: the interface reads `holdFor` and does not print it on the label.

`public_note` is visible in the public catalogue. `internal_note` stays with staff. Both are entered on the copy form. `PUT /api/v1/items/{id}` rejects `circulationStatus`: lost, damaged, claimed returned, to search, and missing go through the desk. See [Loans and returns](/en/docs/circulation/).

## Edit and delete

`PUT /api/v1/items/{id}` updates the record. Weeding does not travel on that request: it has its own route, described in [Weeding](/en/docs/weeding/). `DELETE /api/v1/items/{id}` archives the copy (`archived_at`).

On own stock, `force` changes nothing. An open loan, a requested or in-transit move, a `pending`, `to_pick`, or `ready` hold, an unpaid fine, or a row in `loans_archives` returns 422. Withdrawal then goes through weeding.

On a deposit copy whose batch is `active`, the first call returns 409 `deposit_item_delete_needs_confirmation`. `force=true` confirms the archive. That does not record a return to the lender. An open loan (`deposit_item_on_loan`) or an unpaid fine (`deposit_item_delete_unpaid_fine`) blocks it. A `returning` or `closed` batch returns `deposit_item_delete_use_batch_return`: scan-out on the batch is the intended path. Archived loan history does not block that copy.

## Inventory

The session flow (create, scan, close, consolidate) is in [Inventory](/en/docs/inventory/).
