---
title: Data model
description: Main tables, statuses, and links between records, copies, loans, holds, and patrons.
navTitle: Data model
order: 50
section: reference
draft: false
locale: en
---

The shipped schema is applied by `server/migrations/`. The three files and the alignment script for older databases are in [Deployment](/en/dev/deployment/). Identifiers are `BIGINT`. This page keeps the links that change behaviour, not the full column catalogue.

## Core

- `biblios` describes the record. `items` are the copies, each attached to a record and to a `sites` row (`site_id`).
- `loans` links a patron and a copy. Closing moves the row to `loans_archives`. `loans_archives.loan_id` keeps the original identifier (migration `003`), with no foreign key: the `loans` row has been deleted.
- `holds` carries `biblio_id`, an optional `item_id`, and `pickup_site_id`. Assignment can create an `item_transits` row.
- `users` points at `account_types.code` and, for a reader, at an audience type. `user_guardians` links a child to their guardian.
- `fines` and `fine_rules` store cents. `circulation_settings` carries durations, ceilings, and the unpaid threshold.

## Statuses that change circulation

| Domain | Values |
| --- | --- |
| Account | `active`, `blocked`, `deleted` |
| Copy, circulation | integers 0 to 5: available, lost, damaged, claimed returned, to search, missing. JSON: `available`, `lost`, `damaged`, `claimedReturned`, `toSearch`, `missing` |
| Weeding | `on_shelf`, `candidate`, `withdrawn` |
| Hold | `pending`, `to_pick`, `ready`, `fulfilled`, `cancelled`, `expired` |
| Transit | `requested`, `in_transit`, `received`, `cancelled` |
| Deposit batch | `active`, `returning`, `closed` |
| Order | `draft`, `ordered`, `partial`, `received`, `cancelled` |
| Fine | `pending`, `partial`, `paid`, `waived`, `cancelled`, `refunded` |
| Inventory | `open`, `closed`, plus `consolidated_at` |

## What anonymisation keeps

`DELETE /users/{id}` clears identity and leaves, on `loans_archives`, the age band at the loan date (`age_band`: `0-17`, `18-29`, `30-49`, `50-64`, `65+`), `loan_year`, the town, the audience type, and the account type. `user_id` becomes null. The column-by-column guide is [`docs/README-patron-erasure.md`](https://github.com/elidune/elidune/blob/dev/docs/README-patron-erasure.md).

## Other graphs

Acquisitions: `acquisition_vendors`, `acquisition_funds`, `purchase_orders`, and their lines. Deposits: lenders, `deposit_batches`, the `items.deposit_batch_id` link, `lender_barcode`, `deposit_returned_at`. Events: the record, audiences, account consent. Inventory: sessions and scans. Audit: `audit_log`. Overridable settings: the `settings` table, next to `library_info`.

An account’s sex is `m`, `f`, or null. A new account’s language is `french` and stays nullable (`VARCHAR(32)`).
