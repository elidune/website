---
title: Multiple sites
description: Holding sites, pickup site, and copy transits.
navTitle: Multiple sites
order: 41
section: features
draft: false
locale: en
---

A place (shelf area, branch, library in the network) is a row in the `sites` table. The API is `/api/v1/sites`.

<figure>
<picture>
<source srcset="/screens/en/dark/transits.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/transits.webp" alt="Transit list, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot: transits (`transits`).

## Register places

Settings, Sites tab (`/settings?tab=sites`), `admin` account:

- create a site (name, and optionally the default site). On a fresh database, the first row after the `MyLibrary` site fails once (sequence not aligned; see [Installation](/en/docs/installation/));
- rename;
- archive (`POST /api/v1/sites/{id}/archive`);
- merge at least two sites (`POST /api/v1/sites/merge`): copies are reassigned, the old sites are archived.

The copy keeps `siteId`: the place where it is shelved. The public catalogue shows that name. A loan also stores the desk site (`loans.site_id`). When that is empty, statistics and the calendar use the default site, not the copy’s site.

## Hold and pickup

The hold stores `pickupSiteId`, the identifier of a site. When a copy is assigned:

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
| Receive | “Receive” | Status `in_transit`. The copy takes the destination site. When the transit is linked to a `pending` hold, that hold becomes `ready` |
| Cancel transit | “Cancel transit” | Status `requested` or `in_transit`. The linked hold stays. For a transit already `in_transit`, the UI sends `reverse: true`: the server opens a `requested` transit from the destination back to the origin, with no hold attached |

The pick list filters by the item’s current site.

## Shared rules

Loan caps, public types, and fines belong to the installation, not to a per-site scale. A copy `in_transit` cannot be checked out. A `requested` transit also blocks checkout: `force` does not lift that block (`business_rule_violation`).
