---
title: Statistics
description: Catalogue, patron, and loan screens, and the advanced query.
navTitle: Statistics
order: 40
section: features
draft: false
locale: en
---

`/stats` is limited to staff (`librarian` or `admin`). Four tabs: catalogue, users, loans, advanced.

## Catalogue, users, loans

The catalogue tab calls `GET /api/v1/stats/catalog` and can break figures down by year, by source, and by media type or public type.

The users tab calls `GET /api/v1/stats/users` (rankings, aggregates, year). The loans tab calls `GET /api/v1/stats/loans`. An account that is not an administrator is limited to its own rows on loan statistics. The administrator sees the whole set, or filters by user.

`GET /api/v1/stats` requires read access on documents.

## Advanced query

The advanced tab sends `POST /api/v1/stats/query`. The body is camelCase.

- `filters`: a list of conditions combined with AND.
- `filterGroups`: arrays combined with OR; each inner array is AND. At most 16 groups, 32 filters per group, 128 clauses in total.
- `unionWith`: today, `loans` together with `loans_archives` only. The computed field `loans.union_source` is used only in that case.
- Fields marked computed in `GET /api/v1/stats/schema` can be selected, grouped, and filtered. They cannot be an aggregation or a time bucket.

Examples of computed fields on `users`: `age_band` (`0-17`, `18-29`, `30-49`, `50-64`, `65+`), `age_band_3` (`0-14`, `15-64`, `65+`), `sex_label`. The `sex` column stores `m`, `f`, or null.

After [anonymisation](/en/docs/administration/), active loan counts no longer follow the person. Archives keep these dimensions (`age_band`, `loan_year`, public type, city, account type), not the identity.

The repository guide `docs/README-stats-frontend.md` describes the query body in detail. This page does not replace it.
