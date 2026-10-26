---
title: Deposits
description: Batches received from another institution, lenders, MARC import, return, and losses.
navTitle: Deposits
order: 33
section: features
draft: false
locale: en
---

A deposit is a set of copies that remain the property of a lender. The module follows the `deposits` feature (enabled by default). The **Deposits** menu (`/deposits`) requires the internal catalogue and read rights on copies. Writing (create, return, close) requires write rights on copies.

<figure>
<picture>
<source srcset="/screens/en/dark/deposits.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/deposits.webp" alt="Deposit batch list, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: deposit batches (`deposits`).

## Lenders

The Lenders tab is `/deposits?tab=lenders`. A lender has a name (unique, at most 200 characters), a contact, notes, and an optional replacement rate in euro cents (`replacementRateCents`, strictly positive, or absent). Archiving is refused while any batch of that lender is not closed (`lender_has_active_batches`).

## Batches

A batch (`deposit_batches`) has a reference unique for that lender, a host site, an arrival date, and an optional return date. With no return date, the deposit is permanent. A return date, when set, is on or after the arrival date.

| Status | Meaning |
| --- | --- |
| `active` | The batch circulates |
| `returning` | Return to the lender has started |
| `closed` | The batch is closed and the copies are archived |

Creating a batch stores it as `active`. Changing the batch site does not move copies already attached.

## MARC import in deposit mode

ISO 2709 or MARCXML import is at `/biblios?tab=import` (`/import-iso` redirects there). **Deposit** mode requires an `active` batch and the `importIso` feature. **Own stock** mode requires a site.

When the ISBN already exists, the import attaches copies and does not rewrite the record. The lender barcode is kept in `lender_barcode`. If it collides with an active desk barcode, the server can relabel (a new local barcode), overwrite, or ignore. The default, with no instruction, is relabel. A copy already billed as lost (`wasLost`) refuses the import (`deposit_item_was_lost`).

Z39.50 search does not create a deposit copy: it leaves `deposit_batch_id` empty.

## Circulating a deposited copy

A deposited copy has `deposit_batch_id` set. The others are own stock.

- A loan or renewal due date is capped at the batch `return_due_on`. The interface shows that cap.
- If that date is today or already past, a new checkout returns 422 `deposit_return_due`. That refusal cannot be forced.
- A renewal that would not extend the due date returns `deposit_renewal_no_extension` or `deposit_return_due`.
- A `returning` or `closed` batch, or one whose return date has passed, does not take a new hold (`deposit_batch_returning`).
- Weeding a deposited copy returns `deposit_item_not_owned`.

## Return to the lender

1. **Start the return** moves the batch from `active` to `returning` and detaches holds on the batch copies. Cancelling the return does not restore those holds.
2. Scan-out (`POST /api/v1/deposit-batches/{id}/scan-out`, or the global scan) requires a `returning` batch. It stores `deposit_returned_at`. A copy still on loan returns 422 `deposit_item_on_loan`: check it in at the desk first. A desk check-in while the batch is `returning` also marks the copy as sent back, unless it is lost.
3. **Close** is possible only from `returning`, and only when no loan is still open (`deposit_batch_has_active_loans`). Scanned copies count as returned. The others, including a lost copy that was not scanned, count as missing. Closing archives the batch copies.

The close report counts copies. It does not include a patron name.

## Losses to report

Marking a deposited copy lost or damaged creates a replacement or damage fine and an audit event `deposit_item_lost`. The amount follows, in order, the lender rate, the copy price when it is positive, then an amount entered by staff. With none of those, the response is `deposit_replacement_amount_required`.

`GET /api/v1/deposit-losses` lists those copies. By default, only the ones not yet reported to the lender (`notified=false`). `POST /api/v1/items/{id}/deposit-loss-notified` stores the report date. A second call returns `deposit_loss_already_notified`.

The desk declares the loss. The “losses to report” list and the notification action are not in the interface of this version: those two routes stay an API call.

## The `reclassify-deposits` command

The server binary reclassifies copies whose lender had been stored as a site.

```bash
elidune-server reclassify-deposits \
  --config config/default.toml \
  --lender 12 \
  --batch-reference "CITYLIB-2027-SPRING" \
  --received-on 2027-03-01 \
  --return-due-on 2027-09-01 \
  --site 3 \
  --from-site 41
```

Without `--apply`, the transaction is rolled back after the report. `--from-site` and `--barcodes` are mutually exclusive, and `--from-site` must differ from `--site`. `--return-due-on` is optional when the batch is created (permanent deposit). An existing `active` batch for that reference is reused. Any other status is refused.

Per-copy refusals, with nothing written: `barcode_unknown`, `item_archived`, `item_in_other_batch`, `item_in_transit`. `already_reclassified` is a skip, without a second audit row.

`docs/README-deposit-reclassify.md` in the software repository still names `--from-source` and `items.source_id`. The binary in this version expects `--from-site` and updates `items.site_id`. The JSON report uses `remaining_on_old_site`.
