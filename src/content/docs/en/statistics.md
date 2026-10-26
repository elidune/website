---
title: Statistics
description: Catalogue, patron, and loan screens, the advanced query, and visitor counts.
navTitle: Statistics
order: 40
section: features
draft: false
locale: en
---

The statistics screen follows the matching module and the right to read the catalogue. Four tabs: catalogue, patrons, loan trend, advanced query. The advanced query is reserved for a librarian or an administrator.

Visitor counts have a switch in Modules. The interface has no screen for them. The technical detail is in the [API reference](/en/dev/api/).

## Catalogue, patrons, loans

The catalogue tab can break figures down by year, by site, and by document or audience type.

The patrons tab shows rankings and totals, by year. The loans tab shows how loans change over time. An account that is not an administrator is limited to its own rows on loan statistics. The administrator sees the whole set, or filters by patron.

## Advanced query

The advanced tab combines conditions.

- Conditions in one list all combine together (and).
- Groups of conditions combine with each other by “or”. Inside a group, it is still “and”. At most 16 groups, 32 conditions per group, 128 conditions in total.
- Crossing current loans with archived loans is possible only for those two sets.
- Computed fields are for choosing columns, groupings, and filters. They are not for a total or for a split over time.

Examples of computed fields on patrons: a fine age band (0-17, 18-29, 30-49, 50-64, 65 and over), a broad band (0-14, 15-64, 65 and over), and the sex label. The stored sex is male, female, or not set.

After [anonymisation](/en/docs/administration/), loans that are still open no longer follow the person. Archives keep the age band, the loan year, the audience type, the town, and the account type, not the identity.

The software repository’s technical guide describes the query body. This page does not replace it. See the [API reference](/en/dev/api/).
