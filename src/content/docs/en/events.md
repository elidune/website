---
title: Events
description: Event announcements, audiences, sending consent, and unsubscribe.
navTitle: Events
order: 42
section: features
draft: false
locale: en
---

The `events` module is enabled by default. The single address is `/events`. The same screen serves the public and staff: an account whose `events_rights` is write creates, edits, and deletes. `EventsPage.tsx` is not wired into the router. `/events/manage` redirects to `/events`.

The public catalogue, on the sign-in page, also lists public events next to search.

## Audiences

An event targets every audience type (`allAudiences`) or a list of audience-type names (`event_audiences`). The staff form offers an “all audiences” switch and the type list.

## Consent

Sending follows the account consent (`eventsConsent`), changed in the profile. A child account follows the legal guardian’s consent. The wording on screen is in the interface (`events.childNotice` and the neighbouring keys). This page does not copy email bodies.

The shipped template is `event_announcement`, in French and English, under `server/data/email_templates/`. The email-template tab edits those two languages. Sending uses `language_chain`: the account’s French or English, otherwise French then English. A German or Spanish account falls back to French for this template. See [Languages](/en/docs/languages/).

Unsubscribe links in messages point at `{public origin}/events/unsubscribe?token=…`. The List-Unsubscribe header uses `{origin}/api/v1/events/unsubscribe?token=…`.

## Unsubscribe

`/events/unsubscribe?token=` shows the public page. It sends `POST /api/v1/events/unsubscribe`. The same token is used for the one-click mailbox action, on the API URL.
