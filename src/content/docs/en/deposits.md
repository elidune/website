---
title: Deposits
description: Batches received from another institution, lenders, import, return, and losses.
navTitle: Deposits
order: 33
section: features
draft: false
locale: en
---

A deposit is a set of copies that remain the property of a lender. The **Deposits** menu appears when the module is on and the account can read the catalogue. Creating a batch, starting a return, or closing it requires the right to edit copies.

![Deposit batch list, light theme.](screen:deposits "Each batch shows the lender and the state of the deposit.")

## Lenders

The Lenders tab records a unique name (200 characters at most), a contact, notes, and, optionally, a replacement rate that must be strictly positive. Archiving a lender is refused while one of their batches is not closed.

## Batches

A batch carries a reference that is unique for that lender, a host site, an arrival date, and an optional return date. With no return date, the deposit is permanent. If a return date is entered, it is at least the arrival date.

| State | Meaning |
| --- | --- |
| Circulating | The batch can be loaned |
| Return in progress | The return to the lender has started |
| Closed | The batch is finished, and the copies are archived |

Creating a batch places it in circulation. Changing the batch site does not move copies already attached.

## Import in deposit mode

A MARC file is imported from the catalogue, on the import tab. **Deposit** mode requires a batch that is still circulating and the import module. **Own stock** mode requires a site.

When the ISBN is already present, the import adds copies without rewriting the record. The lender’s barcode is kept. If it collides with a desk barcode that is already active, the software can relabel (a new local code), overwrite, or ignore. With no instruction, it relabels. A copy already billed as lost refuses the import.

Z39.50 search does not create a deposit copy.

## Circulating a deposited copy

- The due date of a loan or a renewal does not pass the batch return date. The screen says so.
- If that date is today or already past, a new loan is refused. The refusal cannot be forced.
- A renewal that would not move the due date forward is refused.
- A batch being returned, closed, or past its return date does not accept a new hold.
- A deposited copy cannot be weeded.
- A copy already marked as sent back to the lender refuses a new loan. The refusal cannot be forced.
- Removing the copy from the catalogue does not record a return to the lender. See [Copies](/en/docs/copies/).

## Return to the lender

1. **Start the return** moves the batch from “circulating” to “return in progress” and detaches holds on the batch’s copies. Those holds are not restored if the return is cancelled.
2. Scan-out requires a batch whose return is in progress. It marks the copy as sent back. A copy still on loan is refused: check it in at the desk first. A desk return while the batch is being returned also marks the copy as sent back, unless it is lost.
3. **Close** is possible only during the return, and only when no loan is still open. Scanned copies count as sent back. The others, including a lost copy that was not scanned, count as missing. Closing archives the copies in the batch. It ends circulation for those copies.

The closing report counts copies. It does not include a patron’s name.

## Losses to report

Declaring a deposited copy lost or damaged creates a replacement or damage fine. The amount follows, in order, the lender’s rate, the copy price when it is positive, then an amount that was typed. With none of those amounts, the save is refused.

The desk can declare the loss. The list of losses still to report to the lender, and the button that records that report, are not in the interface of this version. Staff therefore keep their own note until that screen exists. The technical detail is in the [API reference](/en/dev/api/).

## Copies filed in the wrong place

If copies were shelved under a place that was really the lender, an administrator can reclassify them into a batch. The command and its safeguards are in [Deployment](/en/dev/deployment/). Without an explicit confirmation, the operation only prints a report and writes nothing.
