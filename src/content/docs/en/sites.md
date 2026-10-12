---
title: Multiple sites
description: Sources as sites, pickup site, and item transits.
navTitle: Multiple sites
order: 41
section: features
draft: false
locale: en
---

Elidune does not create a separate “site” table. A place (shelf area, branch, library in the network) is a **source**.

## Register places

Settings, Sources tab (`/settings?tab=sources`), `admin` account:

- create a source (name, and optionally the default source);
- rename;
- archive (`POST /api/v1/sources/{id}/archive`);
- merge at least two sources (`POST /api/v1/sources/merge`): items are reassigned, the old sources are archived.

The item keeps `sourceId`: the place where it is shelved. The public catalogue shows that name.

## Hold and pickup

The hold stores `pickupSiteId`, the identifier of a source. When an item is assigned:

- item already at that site: status `ready`;
- item elsewhere: a transit row toward that site. The hold becomes `ready` only on receipt.

`/transits` follows these movements. Transit statuses used by the queue are `requested`, then `in_transit`. An `in_transit` item cannot be loaned. Cancelling the hold during transit opens a return transit to the place of origin.

The pick list filters by the item’s current site.

## Shared rules

Loan caps, public types, and fines belong to the installation, not to a per-source scale.

> **TODO.** Confirm in `TransitsPage.tsx` the actions offered (ship, receive) and their labels, so they can be described without guessing from the `requested` and `in_transit` statuses alone.
