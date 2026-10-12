---
title: Features
description: "Guide map by area: catalogue, circulation, acquisitions, OPAC, statistics, sites, and languages."
navTitle: Overview
order: 30
section: features
draft: false
locale: en
---

Each area has its own page. Paths below are those of the React UI, served on the same origin as the `/api/v1` API.

## At the desk and on the shelves

- [Catalogue](/en/docs/catalogue/): records, Z39.50, MARC import, search.
- [Items](/en/docs/copies/): barcodes, call numbers, availability, inventory.
- [Patrons](/en/docs/patrons/): accounts, subscription, legal guardian.
- [Loans and returns](/en/docs/circulation/): desk, renewals, exceptions.
- [Holds](/en/docs/holds/): title queue, shelf pick, pickup.
- [Reminders and fines](/en/docs/reminders-fines/): overdue email and the fine scale.
- [Weeding](/en/docs/weeding/): candidate, withdrawn.

## Around the catalogue

- [Acquisitions and suggestions](/en/docs/acquisitions/): vendors, funds, orders, suggestions.
- [OPAC](/en/docs/opac/): public catalogue without an account, and the patron area.
- [Statistics](/en/docs/statistics/): catalogue, patrons, loans, advanced query.
- [Multiple sites](/en/docs/sites/): sources, pickup, transits.
- [Languages](/en/docs/languages/): interface language and record language.

The sidebar also has **Events** (`/events`, staff management at `/events/manage`): announcements, audiences, and sending consent. These screens are not described here yet.

> **TODO.** Describe events (audiences, consent, unsubscribe at `/events/unsubscribe`) from `docs/` and the `EventsPage` / `PublicEventsPage` screens, without guessing email-template contents.
