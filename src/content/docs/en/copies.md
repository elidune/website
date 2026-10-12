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

`/inventory` (staff) opens an inventory session. The scope can target a source. Routes under `/api/v1/inventory` require a `librarian` or `admin` account.

During inventory, an open loan can be closed. An `inventory_loan_closed` email template exists in French and English for that case.

> **TODO.** Describe the exact session flow (create, scan, close) from `InventoryPage.tsx` and `server/src/api/inventory.rs`, screen by screen. This page does not do that yet.
