---
title: Catalogue
description: Bibliographic records, search, Z39.50, and MARC import in Elidune.
navTitle: Catalogue
order: 31
section: features
draft: false
locale: en
---

A **biblio** describes a work or an edition. An **item** is a physical object attached to that biblio. Staff catalogue in `/biblios`. Signed-in patrons use `/catalog`. The public catalogue on `/` needs no account. See [OPAC](/en/docs/opac/).

<figure>
<picture>
<source srcset="/screens/en/dark/catalogue.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/catalogue.webp" alt="Placeholder image of the catalogue list, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot slot: catalogue list (`catalogue`). The record screen has a separate slot (`record`).

## Create and edit

`/biblios/new` creates a biblio. `/biblios/{id}` shows it, `/biblios/{id}/edit` edits it. Write access on documents (`items_rights` = write) is required. Seeded `librarian` and `admin` accounts have it.

Usual fields: titles, authors, ISBN, collection ISSN, media type, audience, Dewey, series, collection. An ISBN that already exists returns a confirmation request (`duplicate_isbn_needs_confirmation`) before the existing biblio is replaced.

Media types the API accepts, in camelCase: `printedText`, `comics`, `periodic`, `video`, `videoDvd`, `videoTape`, `audio`, `audioMusic`, `audioMusicCd`, `audioMusicTape`, `audioNonMusic`, `audioNonMusicCd`, `audioNonMusicTape`, `cdRom`, `images`, `multimedia`, `unknown`. Short legacy codes (`b`, `vd`, `p`, and the others) are still accepted on read.

Series and collections have their own routes (`/api/v1/series`, `/api/v1/collections`): name, secondary titles, ISSN for a collection.

Deleting a biblio needs the same write right. The delete screen can force removal of items that are still on loan.

CSV export: `GET /api/v1/biblios/export.csv`.

## Search

Staff search in `/biblios`. Meilisearch (default index name `items`) serves search when it is reachable. Otherwise the API falls back to PostgreSQL full text. A full reindex is administrator-only: `POST /api/v1/admin/reindex-search`, also offered in Settings, Server, Catalog tab.

## Z39.50

`/z3950` queries servers saved in Settings. A hit can be imported as a biblio (`POST /api/v1/z3950/import`). Responses are cached in Redis. The default TTL is `ELIDUNE_REDIS__Z3950_CACHE_TTL_SECONDS` = 604800 (7 days).

Each server has a host, a port, a database, and an enabled flag. The form is the “Z39.50 servers” tab.

## MARC import

`/import-iso` uploads a MARC file. Related routes are `POST /api/v1/biblios/load-marc` (read) and `POST /api/v1/biblios/import-marc-batch` (write). Loaded batches are read back with `GET /api/v1/biblios/list-marc-batches` and `GET /api/v1/biblios/marc-batch/{id}`.

The MARC translator lives in `server/src/marc/`. Media type is taken from Leader position 6.

## Record page

The record lists items, their availability, and the biblio hold queue (`GET /api/v1/biblios/{id}/holds`). Adding an item is described in [Items](/en/docs/copies/).
