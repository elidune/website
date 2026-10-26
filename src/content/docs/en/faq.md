---
title: Help and frequently asked questions
description: Frequent questions on installation, sign-in, loans, and data.
navTitle: Help and questions
order: 60
section: help
draft: false
locale: en
---

Startup failures are in [Troubleshooting](/en/docs/troubleshooting/). Bug reports go to the issues of [elidune/elidune](https://github.com/elidune/elidune/issues).

## Installation

**Is an administrator required at first start?**  
No. While the database has neither a user nor a saved setting, the UI opens `/first-setup`. No password is shipped.

**Which image?**  
`elidune-all-in-one` for a single container. `elidune-server` and `elidune-ui` to split the API, the UI, PostgreSQL, Redis, and Meilisearch. Default ports differ. See [Installation](/en/docs/installation/).

**Where is the demo?**  
The software README gives `https://elidune.b-612.fr/`. This presentation site also points at `https://elidune-demo.b-612.fr`.

## Sign-in

**`/login` has no form.**  
It redirects to `/`.

**Forgotten password does nothing.**  
Without `ELIDUNE_SERVER__PUBLIC_BASE_URL`, the server does not send the message. Past three requests per hour for the same login, the response stays a generic success and no message is sent.

**Too many attempts.**  
Five failures in 15 minutes on the same login block further attempts. This is not a permanent account lock. Staff clear the block on the user record.

## Loans and holds

**The loan button is not in the menu.**  
`/loans` follows `loans_rights` (read to open the screen, write to check out). A patron renews in `/my-loans`.

**A hold does not notify immediately.**  
While the item is still on the shelf (`to_pick`), the patron is not notified. The notification is sent when the status becomes `ready`.

**Renewal is refused before the due date.**  
The default window is 7 days before the due date. Outside it, the server refuses, unless the loan is already overdue.

## Data

**Does deleting a patron erase statistics?**  
“Anonymize for stats” removes the identity and keeps non-identifying dimensions on loan archives. See [Administration](/en/docs/administration/).

**Are the screenshots on this site the software?**  
Yes. They come from an instance started from the `dev` branch, with fictional patrons and public-domain titles. None shows a patron name on a slip, a label, or a batch report.
