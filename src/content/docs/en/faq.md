---
title: Help and frequently asked questions
description: Frequent questions about installation, sign-in, loans, and data.
navTitle: Help and questions
order: 60
section: help
draft: false
locale: en
---

Startup failures are in [Troubleshooting](/en/docs/troubleshooting/). A bug is reported in the software repository’s issues, the “GitHub” link on this site.

## Installation

**Is an administrator required at the first launch?**
No. While the database has neither an account nor saved settings, the interface opens the wizard. No password is shipped.

**Which installation to choose?**
One image to keep everything together. Several services to separate the interface, the server, the database, the cache, and search. The default ports are not the same. See [Installation](/en/docs/installation/) and [Deployment](/en/dev/deployment/).

**Where to try without installing?**
The Demo button in the header opens a demonstration instance, separate from this site.

## Sign-in

**The sign-in form is not on a separate page.**
It is on the home page, next to the public catalogue.

**Forgotten password does nothing.**
Without the library’s public address, the message is not sent. Beyond three requests an hour for the same login, the answer stays a general success and no message is sent.

**Too many attempts.**
Five failures in fifteen minutes on the same login block the next attempts. This is not a permanent lock of the account. Staff clear the block on the patron record.

## Loans and holds

**The loan button is not in the menu.**
The desk follows the loan right: read to open the screen, write to check out. A patron renews in My loans.

**A hold does not notify at once.**
While the copy is still on the shelf, waiting to be picked, the patron is not notified. The message goes out when the hold is ready.

**Renewal is refused before the due date.**
The default window is seven days before the return date. Outside it, the software refuses, unless the loan is already overdue.

## Data

**Does deleting a patron erase the statistics?**
The action “Anonymize for stats” removes the identity and keeps non-identifying dimensions on loan archives. See [Administration](/en/docs/administration/).

**Are the screenshots on this site the software?**
Yes. They come from an instance started from the development branch, with fictional patrons and public-domain titles. None shows a patron’s name on a slip, a label, or a batch report.
