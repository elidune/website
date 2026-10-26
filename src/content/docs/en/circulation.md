---
title: Loans and returns
description: The loan and return desk, forcing with a reason, copy states, and the desk on a tablet.
navTitle: Loans and returns
order: 36
section: features
draft: false
locale: en
---

The screen opens with the right to view loans. Checking out, checking in, renewing, and recording an exception require the right to edit loans. The menu is named **Circulation**. The hold right alone is not enough.

Four tabs: loan, return, overdue, claims.

![Loan desk, light theme.](screen:desk "The desk, with the patron and the actions renew, return, lost, or damaged.")

## The desk on a tablet

Below 1024 pixels wide, the base text size goes from 16 to 14 pixels. Below 1024 pixels wide or 768 pixels tall, the side menu folds. Below 768 pixels, the list of current loans shows as cards rather than a table. Barcode fields accept a scanner and, on the device, the camera.

## Check out

1. Choose the patron, by name or by the card barcode. An exact card scan shows the account state. Name search requires the right to read patrons.
2. Scan the copy barcode. One active loan per copy.

The software computes the due date from the document-type duration and the audience type (see [Getting started](/en/docs/getting-started/)). If closed days are skipped, the date falls on the next open day. The loan records the site where it was made. A deposited copy can cap that date: see [Deposits](/en/docs/deposits/).

### Refusals and forcing

A refusal shows its reason. Some can be forced, others cannot.

| Situation | Can be forced | Reason required |
| --- | --- | --- |
| Expired subscription | Yes, with the exception right | Yes |
| Copy held for another patron | Yes, with the exception right | Yes |
| Fines over the threshold | Yes, with the right to edit loans | No |
| Loan ceiling, ceiling per medium, copy not loanable | Yes, by forcing | No |
| Card reported lost, copy already set aside for someone else, deposit due back, copy already sent back to the lender | No | — |

Without a reason when one is required, forcing is refused. The **Force loan** button appears only when the refusal can be forced and the account can edit loans. The shipped librarian does not have the exception right: only the shipped administrator can force an expired subscription or a copy held for another patron, until that right is granted in Settings.

When a copy is held for someone else, the desk also offers **Set aside**, without leaving the loan. If the copy is already set aside, the loan cannot be forced.

A card reported lost blocks checkout and renewal. Returns and fine payment stay possible. The desk banner says so. Reporting the loss and replacing the card have no button in the interface of this version. See [Patrons](/en/docs/patrons/).

Checking out several copies at once exists for tools that connect to Elidune. The desk screen scans one copy at a time.

## Copy states

The circulation state is independent of the loan row alone.

| State | Effect |
| --- | --- |
| Available | Loanable, if the other rules allow it |
| Lost | Absent from the public catalogue |
| Damaged | Not loanable |
| Claimed returned | The patron says they returned it |
| To search | Still listed, unavailable to the public |
| Missing | Absent from the public catalogue |

These states change through desk actions, not by editing the copy form.

An archived loan closes as a return (check-in, damaged return, or a “claimed returned” case that was found) or as a loss (declared lost, or a claim that was not found). If the lost copy is accepted back later, the screen shows “Lost, found on …”.

## Check in

Return tab: the barcode field keeps focus for a scanner. Scanning closes the loan. A code that is not on loan can answer with a notice (already returned, lost, to search, and so on) rather than a plain failure.

When a hold on the same record is waiting for a copy, check-in does not simply shelve it. It becomes ready for pickup, or it opens a transit. See [Holds](/en/docs/holds/).

Returning several codes at once exists for connected tools. The desk scans one code at a time.

## Renew

The patron renews their own loan in My loans. Staff renew from the desk.

Conditions read from the rules:

- renewals remain; otherwise the refusal can be forced with the right to edit loans;
- today is inside the window (seven days before the due date, by default), or the loan is already overdue; too early can be forced the same way;
- the chosen starting point (current due date, or the day of the renewal) sets the new due date;
- a blocked account can be forced with the right to edit loans;
- an expired subscription is forced as at checkout, with the exception right and a reason.

The date shown after renewal is the one computed by the software.

## Overdues and exceptions

The Overdue tab lists loans past their due date. Each row can be returned or renewed.

Exceptions, with the right to edit loans:

| Action | Effect |
| --- | --- |
| Lost | The loan closes as lost. A replacement fine can follow |
| Damaged | Returning closes the loan. Keeping it leaves it open, marked damaged |
| Claimed returned by the patron | Opens a claim |
| Close that claim | Found, or not found |

The list of open claims is the Claims tab. Closing and the log are written together.

Sending overdue reminders by hand is reserved for the administrator. The automatic schedule is in [Reminders and fines](/en/docs/reminders-fines/).
