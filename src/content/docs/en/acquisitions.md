---
title: Acquisitions and suggestions
description: Vendors, funds, purchase orders, receiving, and purchase suggestions.
navTitle: Acquisitions and suggestions
order: 37
section: features
draft: false
locale: en
---

The Acquisitions menu appears only when the module is on and the account can at least view acquisitions. Creating a vendor, a fund, or an order requires the right to edit them. The shipped librarian and administrator types have it. The others do not. This right is separate from cataloguing.

![Acquisitions screen, light theme.](screen:acquisitions "Orders, vendors, and funds.")

Four tabs: orders (and an order’s own screen), vendors, funds, suggestions.

## Working order

Save a vendor and a fund first, then open an order and add lines. The order screen is a separate page.

### Order states

| State | Meaning |
| --- | --- |
| Draft | Still editable |
| Ordered | Sent to the vendor |
| Partial | Part has been received |
| Received | Everything that was ordered has arrived |
| Cancelled | The order is abandoned |

Only a draft can be edited and submitted. Submission requires a vendor and at least one line. A fund’s committed amount adds, for orders that are sent or partial, the quantity not yet received multiplied by the unit price.

Cancellation applies to a draft, or to a sent order of which no line has been received yet. A receiving already saved blocks cancellation.

Receiving applies to a sent or partial order. It increases the quantity received on each line that is processed and creates the physical copies. If every line is complete, the order becomes received. Otherwise it becomes partial.

Each line carries a quantity ordered, a quantity received, a unit price, a currency, and what is to be ordered. The currency is a three-letter code. If it is omitted on entry, it is the euro. The line requires at least a record that is already known, an ISBN, or a title.

A copy created at receiving is loanable when the barcode, the site, and the price are filled in. The price can be deferred: the barcode and the site are then enough. Without those conditions, the copy is not loanable.

## Purchase suggestions

A patron files a suggestion from their profile. Staff handle them on the Suggestions tab.

The default filter shows proposed suggestions. Accepting can attach the suggestion to an order. Refusing files it as refused.

The patron’s home page reminds them of this form when they are signed in.
