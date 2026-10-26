---
title: Multiple sites
description: Shelving sites, the pickup site, and copy transits.
navTitle: Multiple sites
order: 41
section: features
draft: false
locale: en
---

A place (a shelf area, a branch, a library in the network) is a site. The transit module can be turned off. Without it, movement between sites is not offered.

![Transit list, light theme.](screen:transits "Copies moving toward a pickup site.")

## Record the places

Settings, Sites, administrator account:

- create a site (a name, and optionally the default site);
- rename;
- archive;
- merge at least two sites: the copies are reassigned, and the old sites are archived.

On a current installation, the first site added after the original site saves on the first try. On an older database that has not received the number correction, that first save can fail once: save again. See [Installation](/en/docs/installation/).

The copy keeps the place where it is shelved. The public catalogue shows that name. A loan also records the desk’s site. If it is empty, statistics and the calendar use the default site, not the copy’s site.

## Hold and pickup

The hold carries a pickup site. When a copy is assigned:

- copy already at that site: the hold becomes ready;
- copy elsewhere: a transit leaves for that site. The hold becomes ready only when it is received.

The transit screen follows these movements. Cancelling the hold during the transit opens a return transit toward the place of origin.

### States and actions

| State | Meaning |
| --- | --- |
| Requested | The move is planned, the copy has not left yet |
| In transit | The copy is on the way. It is not loanable |
| Received | The copy has arrived |
| Cancelled | The move is abandoned |

The screen filters by in progress, requested, in transit, or all.

| Action | Condition |
| --- | --- |
| Start the transit | The button appears for a waiting hold that has a pickup site and no active transit. It is hidden if the chosen copy is already at that site. A hold that is being picked is also accepted: it then goes back to waiting |
| Ship immediately | A box at the start. The transit is created already on the way, without passing through “requested” |
| Ship | The requested state becomes “in transit” |
| Receive | The copy is on the way. It takes the destination site. If the transit is tied to a waiting hold, that hold becomes ready |
| Cancel the transit | Requested or on the way. The linked hold remains. For a transit already on the way, the interface asks for a return: a new transit is opened from the destination toward the origin, with no hold attached |

The pick list filters by the copy’s current site.

## Shared rules

Loan ceilings, audience types, and fines are those of the installation, not a scale per site. A copy in transit is not loanable. A transit that is only requested also blocks checkout. Forcing does not lift that block.
