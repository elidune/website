---
title: Features
description: "Guide map: catalogue, deposits, circulation, acquisitions, OPAC, statistics, sites, and languages."
navTitle: Overview
order: 30
section: features
draft: false
locale: en
---

Each area has its own page. Paths are those of the React interface, served on the same origin as the `/api/v1` API. The version described is branch `dev` of [elidune/elidune](https://github.com/elidune/elidune) (commit `c902e67`, single schema file `001_initial_schema.sql`).

## At the desk and on the shelves

- [Catalogue](/en/docs/catalogue/): records, Z39.50, MARC import, search.
- [Copies](/en/docs/copies/): barcodes, call numbers, circulation states, public and internal notes.
- [Deposits](/en/docs/deposits/): lenders, batches, MARC import in deposit mode, return to the lender, losses.
- [Inventory](/en/docs/inventory/): session, scan, close, consolidation.
- [Patrons](/en/docs/patrons/): accounts, audience type derived from the date of birth, legal guardian, anonymisation.
- [Loans and returns](/en/docs/circulation/): desk, forced checkout with a reason, exceptions, tablet desk.
- [Holds](/en/docs/holds/): queue per record, pick list, pickup site.
- [Reminders and fines](/en/docs/reminders-fines/): three email levels, amounts in cents, payment capped at the balance still due.
- [Weeding](/en/docs/weeding/): candidate, withdrawal, destination.

## Around the catalogue

- [Acquisitions and suggestions](/en/docs/acquisitions/): vendors, funds, orders, receiving, suggestions.
- [OPAC](/en/docs/opac/): public catalogue without an account, and the patron area.
- [Events](/en/docs/events/): announcements, audiences, consent, unsubscribe.
- [Statistics](/en/docs/statistics/): catalogue, patrons, loans, advanced query, visitor counts.
- [Multiple sites](/en/docs/sites/): sites, pickup, transits.
- [Languages](/en/docs/languages/): interface and message language.

Optional modules (acquisitions, purchase suggestions, weeding, transits, deposits, events, inventory, Z39.50, MARC import, statistics, visitor counts) are switched in Settings, Modules, or with `ELIDUNE_FEATURES__PROFILE=essential`. The `essential` profile turns off acquisitions, purchase suggestions, weeding, transits, deposits, and visitor counts. See [Administration](/en/docs/administration/).
