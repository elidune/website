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

`/transits` follows these movements. Cancelling the hold during transit opens a return transit to the place of origin.

### Statuses and actions

`TransitStatus` is stored in lowercase. JSON and the interface use camelCase for `inTransit`.

| Stored | Interface | Label |
| --- | --- | --- |
| `requested` | `requested` | Requested |
| `in_transit` | `inTransit` | In transit |
| `received` | `received` | Received |
| `cancelled` | `cancelled` | Cancelled |

The `/transits` screen filters by In progress, Requested, In transit, or All. An `in_transit` item cannot be loaned.

| Action | Label | Condition |
| --- | --- | --- |
| Start transit | “Start transit” | The button appears for a `pending` hold that has a pickup site and no active transit. It is hidden when the chosen copy is already at that site. The server also accepts a `to_pick` hold: it then sets that hold back to `pending` |
| Ship immediately | “Ship immediately (in transit)” | Checkbox at start (`ship: true`). The transit is created directly as `in_transit`, skipping `requested` |
| Ship | “Ship” | Stored status `requested`. The transit becomes `in_transit` |
| Receive | “Receive” | Status `in_transit`. The copy takes the destination source. When the transit is linked to a `pending` hold, that hold becomes `ready` |
| Cancel transit | “Cancel transit” | Status `requested` or `in_transit`. The linked hold stays. For a transit already `in_transit`, the UI sends `reverse: true`: the server opens a `requested` transit from the destination back to the origin, with no hold attached |

The pick list filters by the item’s current site.

## Shared rules

Loan caps, public types, and fines belong to the installation, not to a per-source scale.
