---
title: Copies
description: Physical copies, barcodes, call numbers, availability, archiving, and the link with inventory.
navTitle: Copies
order: 32
section: features
draft: false
locale: en
---

A copy is the object that is loaned. It is always attached to a record.

## Create

From the record screen, staff add a copy. The fields the desk uses are the barcode, the call number, the site, and whether the copy can be loaned. A barcode that is already present asks for confirmation.

Receiving can be marked incomplete. Until it is complete, the copy cannot be loaned and cannot be assigned to a hold.

## Availability

The software computes a state. It does not stop at whether the copy is out. The order is: on loan, in transit, on hold, to search, unavailable, available.

| State shown | Meaning |
| --- | --- |
| Available | On the shelf, loanable if the other rules allow it |
| On loan | Out |
| In transit | On the way to another site |
| On hold | Assigned to a hold that is being picked or is ready for pickup |
| To search | Not found while picking. The public catalogue groups this with “unavailable” |
| Unavailable | Incomplete receiving, lost, damaged, claimed returned, or withdrawn from the collection |

The public catalogue omits lost, missing, weeding-candidate, and withdrawn copies. It shows neither the weeding reason, nor the name of the patron who reserved, nor the internal note. A shelf label does not carry the patron’s name.

The public note is visible in the public catalogue. The internal note stays with staff. Both are entered on the copy form.

Lost, damaged, claimed returned, to search, and missing are changed from the desk, not from the copy form. See [Loans and returns](/en/docs/circulation/).

## Edit and remove from the catalogue

Editing the form updates the barcode, call number, site, and notes. Weeding does not go through that form: see [Weeding](/en/docs/weeding/).

Removing the copy from the catalogue archives it. The right required is the right to archive copies. It is separate from the right to edit them, even though the shipped set grants both to the librarian and the administrator. A patron cannot archive a copy.

On the library’s own stock, forcing changes nothing. An open loan, a requested or ongoing transit, a hold that is waiting, being picked, or ready, an unpaid fine, or a loan history blocks archiving. Removal then goes through weeding.

On a deposit copy whose batch is still circulating, the first attempt asks for confirmation. Confirming archives the copy. That does not record a return to the lender. An open loan or an unpaid fine blocks it. A batch already being returned or closed refuses this archive: scan-out on the batch is the intended path. Loan history does not block that deposit copy.

## Inventory

How a session runs is in [Inventory](/en/docs/inventory/).
