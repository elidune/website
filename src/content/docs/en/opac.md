---
title: OPAC
description: Public catalogue without an account, availability, and the signed-in patron area.
navTitle: OPAC
order: 39
section: features
draft: false
locale: en
---

The public catalogue is on the sign-in page `/`, with no token. Search calls `GET /api/v1/opac/biblios` (free text, media type, pages of 20 biblios). The record calls `GET /api/v1/opac/biblios/{id}` and `GET /api/v1/opac/biblios/{id}/availability`.

Filters on that screen: all media, book (`printedText`), DVD (`videoDvd`), magazine (`periodic`), comic (`comics`).

Public availability shows the site (`sourceName`) and the number of waiting holds. It does not show the hold patron’s name, nor the internal status `toSearch` (grouped with “unavailable”). Covers go through `GET /api/v1/covers/isbn/{isbn}`, a public route.

The same screen lists public events next to the catalogue. Hours and address come from `GET /api/v1/library-info`, also public.

These public routes are limited to 600 requests per minute per IP address, burst 120, by default (`ELIDUNE_SERVER__PUBLIC_PER_MINUTE`).

<figure>
<picture>
<source srcset="/screens/en/dark/opac-loans.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/opac-loans.webp" alt="Placeholder image of the patron loan area, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot slot: patron loans (`opac-loans`).

## Once signed in

`/catalog` repeats search for a signed-in account. The patron then opens:

- `/my-loans` to renew a loan inside the allowed window;
- `/my-holds` to follow or cancel their holds;
- `/profile` for the password, language, history, and purchase suggestions.

Placing a hold from the catalogue requires an account whose hold right is at least `own`. Staff do not use this OPAC for checkout: the desk is [Loans and returns](/en/docs/circulation/).
