---
title: Authentication and rights
description: JWT, account types, rights letters, the first wizard, and quotas.
navTitle: Authentication
order: 30
section: reference
draft: false
locale: en
---

Paths below are relative to `/api/v1`, unless noted. The generated contract is `GET /api-docs/openapi.json`. The matrix kept next to the code is [`docs/README-api-access-rights.md`](https://github.com/elidune/elidune/blob/dev/docs/README-api-access-rights.md): when they differ, the router in `server/src/api/` wins. One known gap: archiving a copy (`DELETE /items/{id}`) requires archive rights at write, not only document write rights.

## Token

Algorithm HS256. Secret `users.jwt_secret`, lifetime `users.jwt_expiration_hours` (24 hours by default, `server/config/sample.toml`). A production secret is at least 32 characters.

The token carries `sub`, `user_id`, `account_type`, the rights, `exp`, `iat`, `token_version` (it must match the database, or the token is rejected), and sometimes `scope`.

Header: `Authorization: Bearer <jwt>`.

A token whose `scope` is `change_password_only` opens only `POST /auth/change-password`.

Desk mutations accept the `Idempotency-Key` header.

## Sign-in

`POST /auth/login` expects `username` (login or email), `password`, and an optional `deviceId`.

Response (`LoginResponse`, camelCase): `token` (absent when a second factor is required), `tokenType` (`Bearer`), `expiresIn`, `user`, `requires2fa`, `twoFactorMethod` (`totp` or `email`), `deviceId`, `mustChangePassword`.

Email second factor stores the code in Redis for 600 seconds. `POST /auth/verify-2fa` and `POST /auth/verify-recovery` finish sign-in. A trusted device is remembered in Redis.

Other public authentication routes: `POST /auth/request-password-reset`, `POST /auth/reset-password`.

Session routes: `GET /auth/me`, `PUT /auth/profile`, `POST /auth/change-password`, `POST /auth/setup-2fa`, `POST /auth/disable-2fa`, `DELETE /auth/rate-limit/{login}`.

Clearing a login block requires a staff account and write rights on patrons.

## First account

`POST /first_setup` is public and shares the per-address authentication quota. It is accepted only when the database has neither a user nor a settings row. Otherwise the response is 409. The body creates the `admin` account, saves the library, and may save mail when the section is overridable. Response 201, with a token of the same kind as sign-in.

## Rights letters

In the database, one letter. In JSON, a lowercase word: `none`, `own`, `read`, `write`. The order is none < own < read < write. Decoding also accepts the alias `borrowsRights` for holds.

| JSON field | Letters | What it opens |
| --- | --- | --- |
| `itemsRights` | n, r, w | Catalogue read or write |
| `usersRights` | n, r, w | Accounts |
| `loansRights` | n, o, r, w | `o` (self) ranks below read. The desk requires r or w. A patron’s `o` does not pass `require_read_loans` |
| `holdsRights` | n, o, r, w | The patron’s holds (`o`) or staff queues and transits (r, w) |
| `settingsRights` | n, r, w | Library record and configuration sections |
| `eventsRights` | n, r, w | Events |
| `acquisitionsRights` | n, r, w | Vendors, funds, orders |
| `weedingRights` | n, r, w | Weeding |
| `weedingCancelRights` | n, r, w | Cancel a withdrawal (write) |
| `itemsArchiveRights` | n, r, w | `DELETE /items/{id}` requires write |
| `circulationOverrideRights` | n, r, w | Force an expired subscription or a copy held for someone else, with `overrideReason` |

Shipped types (`account_types`, `is_system`): `guest`, `reader`, `librarian`, `admin`, `group`. Only `reader` derives the audience type from the date of birth. `librarian` and `admin` pass the staff extractors. `admin` passes the administrator extractor. Any other lowercase code is a custom type.

The initial set, for the main letters, is in the [Administration](/en/docs/administration/) guide. In the database, the librarian has `items_archive_rights = w`, `circulation_override_rights = n`, `settings_rights = r`. The administrator has `w` everywhere, including the exception.

## Quotas

Defaults from `server/src/app.rs` and `sample.toml`.

| Limiter | Routes | Default |
| --- | --- | --- |
| Address, authentication | sign-in, second factor, password, `first_setup` | 30 per minute, burst 30 |
| Login | failed sign-ins | 5 over 900 seconds |
| Reset | separate counter | 3 over 3600 seconds |
| Session | `/auth/me`, profile, password change, second factor, quota clear | 120 per minute, burst 60 |
| Public | OPAC, covers, `GET /library-info`, `POST /events/unsubscribe` | 600 per minute, burst 120 |

Response 429: `code` = `rate_limited`, field `retryAfter`, header `Retry-After`. Behind a proxy, declare that proxy in `ELIDUNE_SERVER__TRUSTED_PROXIES`, or every visit counts as the proxy address. The per-address authentication ceiling is `ELIDUNE_SERVER__AUTH_IP_PER_MINUTE`.

## Error shape

Usual body:

```json
{ "code": "not_found", "error": "Not Found", "message": "…" }
```

Desk rules often answer 422, with a domain `code`. The central list is the `error_code` module in `server/src/error.rs`. Stable examples: `authentication_failed`, `authorization_failed`, `not_found`, `validation_error`, `conflict`, `database_error`, `feature_disabled`, `rate_limited`, `business_rule_violation`, `card_lost`, `subscription_expired`, `fines_over_threshold`, `max_loans`, `item_held_for_other`, `item_not_loanable`, `override_reason_required`, `payment_exceeds_balance`.

Some refusals add fields (`remainingCents`, a copy identifier). The OpenAPI contract describes them one by one.
