---
title: Items
description: Physical copies, barcodes, call numbers, availability, and inventory.
navTitle: Items
order: 32
section: features
draft: false
locale: en
---

An item is a physical object on loan, attached to a biblio. The retired word “specimen” is not used in new documentation or code.

## Create

From the biblio page, staff add an item (`POST /api/v1/biblios/{id}/items`). Desk fields are the barcode, call number, source (site), and whether the item is borrowable. A barcode that already exists asks for confirmation.

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

The public catalogue shows neither the weeding reason nor the hold patron’s name.

## Edit and delete

`PUT /api/v1/items/{id}` updates the record. Weeding does not travel on that request: it has its own route, described in [Weeding](/en/docs/weeding/). `DELETE /api/v1/items/{id}` deletes the item. An item on loan requires a force confirmation.

## Inventory

`/inventory` is limited to staff (`librarian` or `admin`). Routes live under `/api/v1/inventory`.

A session has two statuses (`InventoryStatus`): `open`, labelled “Open”, and `closed`, labelled “Closed”. The “Consolidated” badge follows `consolidated_at`. The enumeration contains only those two values.

Scope is set at creation: an optional source (`scope_source_id`) and an optional place code (`scope_place`). It is not edited afterwards. With both empty, counts cover active, non-archived copies. The “Location hint” field (`locationFilter`) stays display text. The server does not filter copies with that text.

1. Create a named session. Source and place code are optional.
2. While the session is `open`, record each copy by barcode, or import a list. The server rejects more than 500 codes per request (`INVENTORY_BATCH_MAX_BARCODES`). The UI splits longer lists.
3. Each scan gets a result: `found` (“Active”, in scope), `found_out_of_scope` (“Out of scope”), `found_archived` (“Archived”), `unknown_barcode` (“Unknown”). The same code can be read more than once. The report counts those extra reads as duplicates. The missing list is the active in-scope copies absent from the session log.
4. Closing sets the session to `closed`. A closed session rejects any new scan. The discrepancy report covers expected in-scope counts, out-of-scope hits, archived hits, unknown codes, and duplicates.
5. After closing, consolidation archives the missing in-scope copies. A biblio with no active copy left is archived. With `force` false, copies on an active loan are skipped and the session is not marked consolidated, so staff can retry with `force` true. With `force` true, those loans are closed. The affected patrons receive the `inventory_loan_closed` template, in French or English according to the account language (see [Languages](/en/docs/languages/)).
