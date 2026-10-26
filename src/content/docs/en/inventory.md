---
title: Inventory
description: Inventory session, barcode scan, close, and consolidation.
navTitle: Inventory
order: 34
section: features
draft: false
locale: en
---

`/inventory` is limited to staff with write rights on copies, and to the `inventory` module. Routes live under `/api/v1/inventory`.

<figure>
<picture>
<source srcset="/screens/en/dark/inventory.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/inventory.webp" alt="Inventory session, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: inventory (`inventory`).

A session has two statuses (`InventoryStatus`): `open` (“Open”) and `closed` (“Closed”). The “Consolidated” badge follows `consolidated_at`. The enumeration contains only those two values.

Scope is fixed at creation: an optional site (`scope_site_id`, that is `items.site_id`) and an optional place code (`scope_place`). It cannot be changed afterwards. With both empty, the count covers active, non-archived copies. The “Place hint” field (`locationFilter`) stays display text. The server does not filter copies with that text.

1. Create a session with a label. The site and the place code are optional.
2. While the session is `open`, record each copy by barcode, or import a list. The server refuses more than 500 codes per request (`INVENTORY_BATCH_MAX_BARCODES`). The interface splits longer lists. A batch scan runs as a background task (`inventoryBatchScan`).
3. Each scan gets a result: `found` (“Active”, in scope), `found_out_of_scope` (“Out of scope”), `found_archived` (“Archived”), `unknown_barcode` (“Unknown”). The same code can be read more than once. The report counts those extra reads as duplicates. The missing list is the active in-scope copies absent from the session log.
4. Closing moves the session to `closed`. A closed session refuses any new scan. The discrepancy report lists expected in-scope copies, out of scope, archived, unknown codes, and duplicates.
5. After close, consolidation archives the missing in-scope copies. A record with no remaining active copy is archived. With `force` false, copies on an active loan are left aside and the session is not marked consolidated, so the same step can be run again with `force` true. With `force` true, those loans are closed. The patrons concerned receive the `inventory_loan_closed` template, in French or English according to `language_chain` (see [Languages](/en/docs/languages/)).

Consolidation is also a background task (`inventoryConsolidation`).
