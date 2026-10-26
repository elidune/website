---
title: API reference
description: Endpoints grouped by domain, main shapes, and errors, taken from the Axum routers.
navTitle: API
order: 40
section: reference
draft: false
locale: en
---

Prefix `/api/v1`. JSON is camelCase. Identifiers are strings. Authentication and quotas: [Authentication](/en/dev/authentication/). Disabled modules answer 403 `feature_disabled`.

This list follows the `router()` functions in `server/src/api/` at commit `3e1ca84`. It does not copy every field: the OpenAPI contract remains the exhaustive property list.

## Health

| Methods | Path | Access |
| --- | --- | --- |
| GET | `/health` | Public. Also reports that a first setup is still required |
| GET | `/ready` | Public |

## Public catalogue

| Methods | Path | Access |
| --- | --- | --- |
| GET | `/opac/biblios` | Public. Text, media type, pages of 20 |
| GET | `/opac/biblios/{id}` | Public |
| GET | `/opac/biblios/{id}/availability` | Public. Site (`sourceName`), hold count. Not the patron’s name. `toSearch` is grouped with unavailable |
| GET | `/covers/isbn/{isbn}` | Public |
| GET | `/library-info` | Public. `enabledFeatures` in camelCase |
| PUT | `/library-info` | Token, settings write |

Lost, missing, weeding-candidate, and withdrawn copies are absent from the public catalogue. `publicNote` is visible. `internalNote` is not.

## Records, copies, series

| Methods | Path | Access |
| --- | --- | --- |
| GET, POST | `/biblios` | Document read / write |
| GET, PUT, DELETE | `/biblios/{id}` | Same. Deletion requires zero copies and zero holds (`biblio_has_items`, `biblio_has_holds`). `force` does not lift those refusals |
| GET, POST | `/biblios/{id}/items` | Create a copy. A known ISBN asks for `duplicate_isbn_needs_confirmation`. A known barcode asks for confirmation |
| GET | `/biblios/export.csv` | Read |
| POST | `/biblios/load-marc` | Read. The import module can refuse |
| POST | `/biblios/import-marc-batch` | Write |
| POST | `/biblios/import-marc-batch/scan-deposit-duplicates` | Write. Prepares a deposit import |
| GET | `/biblios/list-marc-batches` | Read |
| GET | `/biblios/marc-batch/{id}` | Read |
| GET | `/items/barcode/{barcode}` | Read. Returns the record, with only that copy |
| GET, PUT, DELETE | `/items/{id}` | `PUT` rejects a `circulationStatus` field. `DELETE` archives (`itemsArchiveRights` at write) |
| POST | `/items/{id}/weeding` | `status` and an optional reason (200 characters) |
| GET, POST | `/series` | Read / write |
| GET, PUT, DELETE | `/series/{id}` | Same |
| GET | `/series/{id}/biblios` | Read |
| GET, POST | `/collections` | Read / write. ISSN on a collection |
| GET, PUT, DELETE | `/collections/{id}` | Same |
| GET | `/collections/{id}/biblios` | Read |
| GET | `/genres` | Read |
| POST | `/genres/reload` | Write |

Media types accepted on write, camelCase: `printedText`, `comics`, `periodic`, `video`, `videoDvd`, `videoTape`, `audio`, `audioMusic`, `audioMusicCd`, `audioMusicTape`, `audioNonMusic`, `audioNonMusicCd`, `audioNonMusicTape`, `cdRom`, `images`, `multimedia`, `unknown`. Old short codes remain readable.

Computed availability, by priority: `onLoan`, `inTransit`, `onHold`, `toSearch`, `unavailable`, `available`.

Archiving an own-stock copy: an open loan, a transit, a hold in `pending`, `to_pick`, or `ready`, an unpaid fine, or a loan history answer 422 (`item_has_history_use_weeding` for history). `force` does not bypass that.

Deposit copy, batch `active`: the first `DELETE` is 409 `deposit_item_delete_needs_confirmation`. `force=true` confirms, without recording a return to the lender. Open loan: `deposit_item_on_loan`. Unpaid fine: `deposit_item_delete_unpaid_fine`. Batch `returning` or `closed`: `deposit_item_delete_use_batch_return`.

## Z39.50

Module required.

| Methods | Path | Access |
| --- | --- | --- |
| GET | `/z3950/search` | Document read |
| POST | `/z3950/import` | Write. Does not set `deposit_batch_id` |
| GET, PUT | `/z3950/servers` | Settings |

Redis cache: `ELIDUNE_REDIS__Z3950_CACHE_TTL_SECONDS`, default 604800.

## Loans

`POST /loans` creates a loan. Useful body: patron identifier, copy barcode or identifier, `force`, `overrideReason`. One active loan per copy. The due date comes from the rules, the audience type, `skip_closed_days`, and a deposit’s `return_due_on` cap.

| Methods | Path | Notes |
| --- | --- | --- |
| GET | `/me/loans` | The holder’s loans. `expectedReturnDate` while the due date has not passed |
| GET | `/users/{id}/loans` | Staff |
| GET | `/users/{id}/loans/export` | MARC export of loans |
| GET, PUT | `/loans/settings` | Rules. Anchor `at_due_date` or `now`. Window `renewWindowDays` from 0 to 366, default 7 |
| GET | `/loans/overdue` | Overdues |
| POST | `/loans/send-overdue-reminders` | Administrator |
| GET | `/loans/claims-returned` | Open claims |
| GET | `/loans/{id}/user` | The loan’s patron, reduced shape |
| POST | `/loans/{id}/return` | Closes |
| POST | `/loans/{id}/renew` | `force`, `overrideReason` |
| POST | `/loans/{id}/lost` | Lost. Closure reason `lost` |
| POST | `/loans/{id}/damaged` | `return` closes, `keep` leaves it open |
| POST | `/loans/{id}/claimed-returned` | Claim |
| POST | `/loans/{id}/claims-returned/resolve` | `found` or `notFound`, in the same transaction as the audit |
| POST | `/loans/items/{barcode}/return` | A code that is not on loan can answer 200 with a notice |
| POST | `/loans/items/{itemId}/lost-found` | A lost copy found again. `foundAt` is set |
| POST | `/loans/items/{itemId}/renew` | Renewal by copy |
| POST | `/loans/batch-create` | Batch |
| POST | `/loans/batch-return` | Batch |

Frequent checkout refusals, HTTP 422: `subscription_expired` and `item_held_for_other` can be forced with the exception right and a reason (`override_reason_required` otherwise). `fines_over_threshold`, `max_loans`, `max_media_loans`, `item_not_loanable`, `max_renewals`, `renewal_too_early`, `account_blocked` can be forced with loan write, with no required reason for fines. `card_lost`, `item_to_pick_for_other`, `deposit_return_due`, `deposit_item_returned_to_lender` cannot be forced.

Archived closure reason: `returned` or `lost`.

## Holds and transits

`POST /holds`: `biblioId` or `itemId` (the second pins a copy). Same row, same record. `pickupSiteId`, `patronNote`, `internalNote`. One active hold (`pending`, `to_pick`, `ready`) per patron and per record. Ceiling `maxActiveHolds`, default 20.

| Methods | Path | Notes |
| --- | --- | --- |
| GET | `/me/holds` | Holder |
| GET, POST | `/holds` | List / create |
| GET | `/holds/pick-list` | `to_pick` rows. Filter by the copy’s current site |
| POST | `/holds/{id}/pick-not-found` | Moves the copy to `toSearch` and reassigns |
| GET, PUT | `/holds/policy` | `pickDelayDays` default 2. Does not cancel the hold |
| GET | `/holds/quota` | The account’s ceiling |
| DELETE | `/holds/{id}` | Cancellation. Write: any row. `own`: their own |
| GET | `/items/{id}/holds` | |
| GET | `/biblios/{id}/holds` | The record’s queue |
| GET | `/users/{id}/holds` | |
| GET, POST | `/holds/{id}/transits` | Start. `ship: true` creates `in_transit` directly |
| GET | `/transits` | |
| GET | `/transits/{id}` | |
| POST | `/transits/{id}/ship` | `requested` to `in_transit` |
| POST | `/transits/{id}/receive` | The copy takes the destination site. A linked `pending` hold becomes `ready` |
| POST | `/transits/{id}/cancel` | `reverse: true` opens a return transit with no hold |
| GET | `/items/{id}/transit` | Active transit |

Stored statuses: `requested`, `in_transit`, `received`, `cancelled`. JSON writes `inTransit`. A `requested` or `in_transit` transit blocks checkout. `force` does not lift that block (`business_rule_violation`).

Ready-for-pickup expiry: `ELIDUNE_HOLDS__READY_EXPIRY_DAYS`, default 7.

Transits module: when it is off, these routes answer `feature_disabled`.

## Patrons

| Methods | Path | Notes |
| --- | --- | --- |
| GET, POST | `/users` | Creation: identity, login, password (at least 8 characters), account type, language |
| GET | `/users/by-card/{cardNumber}` | Card scan at the desk |
| GET, PUT, DELETE | `/users/{id}` | `DELETE` anonymises. `force=true` checks active loans in first |
| POST | `/users/{id}/card-lost` | Patron write or loan write. No button in the interface of this version |
| POST | `/users/{id}/replace-card` | A new number. Patron write |
| PUT | `/users/{id}/account-type` | Administrator |
| PUT | `/users/{id}/force-password-change` | Administrator |
| GET, POST | `/account-types` | |
| GET, PUT, DELETE | `/account-types/{code}` | `is_system` types cannot be deleted |

`DELETE /users/{id}` moves the status to `deleted`, revokes tokens, clears identity, keeps the account type, the audience type, and the dates, cuts the archive link, deletes active holds, detaches fines. The column-by-column guide is [`docs/README-patron-erasure.md`](https://github.com/elidune/elidune/blob/dev/docs/README-patron-erasure.md).

A child (child audience) requires a guardian who is neither a child nor a school audience (`user_guardians`). For a `reader`, the audience type follows age. No bound: `no_public_type_for_age`.

## Fines

Amounts are cents in the database. The API speaks decimal strings (`"0.20"`). More than two significant decimals is refused.

| Methods | Path | Notes |
| --- | --- | --- |
| GET | `/users/{id}/fines` | Patron read |
| POST | `/users/{id}/fines/accrue` | Recalculate |
| POST | `/loans/{id}/fines/accrue` | Recalculate one loan |
| POST | `/fines/accrue` | Global pass |
| GET, PUT | `/fines/rules` | Daily rate, ceiling, grace |
| GET, PUT | `/fines/policy` | Threshold. Mode `none` or `amount`. An audience type: `inherit`, `none`, `amount` |
| POST | `/fines/{id}/pay` | `amount` in euros. Above the balance: 422 `payment_exceeds_balance`, `remainingCents` |
| POST | `/fines/{id}/waive` | Waiver |

`chargeType`: `overdue`, `replacement`, `damage`. `status`: `pending`, `partial`, `paid`, `waived`, `cancelled`, `refunded`.

The `fines_over_threshold` block happens only when `accrue_fines` is true, and the balance is strictly above the threshold.

## Deposits

Module required. Write: copy write rights.

| Methods | Path | Notes |
| --- | --- | --- |
| GET, POST | `/lenders` | Unique name, 200 characters. `replacementRateCents` strictly positive or absent |
| PATCH, DELETE | `/lenders/{id}` | Archive refused: `lender_has_active_batches` |
| GET, POST | `/deposit-batches` | Created as `active`. `returnDueOn` optional, at least the arrival date |
| GET, PATCH | `/deposit-batches/{id}` | Changing the site does not move copies already linked |
| GET | `/deposit-batches/{id}/items` | |
| POST | `/deposit-batches/{id}/start-return` | `active` to `returning`. Detaches holds, without restoring them if the return is cancelled |
| POST | `/deposit-batches/{id}/cancel-return` | |
| POST | `/deposit-batches/{id}/scan-out` | Requires `returning`. Still on loan: 422 `deposit_item_on_loan` |
| POST | `/deposit-batches/scan-out` | Global scan |
| POST | `/deposit-batches/{id}/close` | Requires `returning` and zero open loans (`deposit_batch_has_active_loans`). Report `{ returned, missing }` |
| GET | `/deposit-losses` | Default: not yet reported |
| POST | `/items/{id}/deposit-loss-notified` | Second call: `deposit_loss_already_notified` |

Other codes: `deposit_return_due`, `deposit_renewal_no_extension`, `deposit_batch_returning`, `deposit_item_not_owned`, `deposit_item_returned_to_lender`, `deposit_item_was_lost`, `deposit_replacement_amount_required`.

The “losses to report” list has no screen in this version.

## Acquisitions and suggestions

Separate modules.

| Methods | Path |
| --- | --- |
| GET, POST | `/acquisitions/vendors` |
| GET, PUT, DELETE | `/acquisitions/vendors/{id}` |
| GET, POST | `/acquisitions/funds` |
| GET, PUT | `/acquisitions/funds/{id}` |
| GET, POST | `/acquisitions/orders` |
| GET, PUT | `/acquisitions/orders/{id}` |
| POST | `/acquisitions/orders/{id}/lines` |
| PUT, DELETE | `/acquisitions/orders/{id}/lines/{lineId}` |
| POST | `/acquisitions/orders/{id}/submit` |
| POST | `/acquisitions/orders/{id}/cancel` |
| POST | `/acquisitions/orders/{id}/receive` |
| GET | `/acquisitions/orders/{id}/audit` |
| GET, POST | `/suggestions` |
| GET | `/suggestions/{id}` |
| POST | `/suggestions/{id}/accept` |
| POST | `/suggestions/{id}/refuse` |

Order statuses: `draft`, `ordered`, `partial`, `received`, `cancelled`. Receiving creates the copies. Missing currency: `EUR`. Intent: at least `biblioId`, an ISBN, or a title. Suggestions: `proposed`, then accepted or refused.

## Weeding

`items.weeding_status`: `on_shelf`, `candidate`, `withdrawn`. A candidate still circulates. `withdrawn` blocks checkout, renewal, and holds.

| Methods | Path | Notes |
| --- | --- | --- |
| POST | `/items/{id}/weeding` | State change |
| POST | `/items/withdrawals` | Batch withdrawal |
| POST, GET | `/items/{id}/withdrawals` | One withdrawal, active withdrawal |
| GET | `/weeding-candidates` | |
| GET | `/item-withdrawals` | |
| GET | `/item-withdrawals/export.csv` | |
| POST | `/item-withdrawals/dispose` | |
| POST | `/item-withdrawals/{id}/cancel` | Cancellation right |
| GET, PATCH | `/item-withdrawals/{id}` | |

## Inventory

Statuses `open` and `closed`. `consolidatedAt` is a timestamp, not a third status.

| Methods | Path | Notes |
| --- | --- | --- |
| GET, POST | `/inventory/sessions` | Scope: `scopeSiteId`, `scopePlace`. The place-hint text is not a filter |
| GET | `/inventory/sessions/{id}` | |
| POST | `/inventory/sessions/{id}/close` | Refuses later scans |
| POST | `/inventory/sessions/{id}/scan` | |
| POST | `/inventory/sessions/{id}/scans/batch` | Ceiling of 500 codes |
| GET | `/inventory/sessions/{id}/scans` | |
| GET | `/inventory/sessions/{id}/missing` | |
| GET | `/inventory/sessions/{id}/report` | |
| GET | `/inventory/sessions/{id}/consolidate/preview` | |
| POST | `/inventory/sessions/{id}/consolidate` | `force` false leaves active loans and does not mark the session consolidated |

Scan results: `found`, `found_out_of_scope`, `found_archived`, `unknown_barcode`.

## Events

| Methods | Path | Notes |
| --- | --- | --- |
| GET, POST | `/events` | Staff, events right. `allAudiences` or a list of types |
| GET, PUT, DELETE | `/events/{id}` | |
| POST | `/events/{id}/send-announcement` | Account consent. A child follows the guardian |
| GET | `/events/{id}/announcement-recipients/count` | |
| GET | `/events/stream` | SSE stream |
| POST | `/events/unsubscribe` | Public, body with a token. The page is in the interface. A message preview does not withdraw consent |

## Statistics

Document read for the totals. The advanced query is reserved for staff (`librarian` or `admin`).

| Methods | Path |
| --- | --- |
| GET | `/stats` |
| GET | `/stats/catalog` |
| GET | `/stats/users` |
| GET | `/stats/loans` |
| GET | `/stats/schema` |
| POST | `/stats/query` |
| GET, POST | `/stats/saved` |
| PUT, DELETE | `/stats/saved/{id}` |
| GET | `/stats/saved/{id}/run` |
| GET, POST | `/visitor-counts` |
| DELETE | `/visitor-counts/{id}` |

`POST /stats/query`: `filters` (AND), `filterGroups` (OR of groups, AND inside; 16 groups, 32 filters, 128 clauses), `unionWith` limited to `loans` with `loans_archives`. Computed fields are not aggregates. Detail: [`docs/README-stats-frontend.md`](https://github.com/elidune/elidune/blob/dev/docs/README-stats-frontend.md).

Visitor counts require settings read. The interface has no screen for them.

## Places, hours, audiences, equipment

| Methods | Path |
| --- | --- |
| GET, POST | `/sites` |
| POST | `/sites/merge` |
| GET, PUT | `/sites/{id}` |
| POST | `/sites/{id}/archive` |
| GET, POST | `/schedules/periods` |
| PUT, DELETE | `/schedules/periods/{id}` |
| GET, POST | `/schedules/periods/{id}/slots` |
| DELETE | `/schedules/slots/{id}` |
| GET, POST | `/schedules/closures` |
| DELETE | `/schedules/closures/{id}` |
| GET, POST | `/public-types` |
| GET, PUT, DELETE | `/public-types/{id}` |
| PUT | `/public-types/{id}/loan-settings` |
| GET, POST | `/equipment` |
| GET, PUT, DELETE | `/equipment/{id}` |

`subscriptionPrice` is an integer number of cents. The screen enters euros.

## Administration

`admin` account, unless noted.

| Methods | Path | Notes |
| --- | --- | --- |
| GET | `/admin/config` | |
| PUT, DELETE | `/admin/config/{section}` | `DELETE` returns to the file |
| POST | `/admin/config/email/test` | |
| POST | `/admin/reindex-search` | Meilisearch, index `items` |
| GET | `/settings/email-templates` | |
| GET, PUT | `/settings/email-templates/{templateId}/{language}` | The tab edits only French and English |
| GET | `/audit` | |
| GET | `/audit/export` | Retention 365 days by default |
| GET | `/tasks` | Background tasks |
| GET | `/tasks/{id}` | |
| POST | `/maintenance` | |
| GET | `/maintenance/database/dump` | `pg_dump --clean` |
| POST | `/maintenance/database/restore` | 512 MiB. Destructive |

## Reminders

When `ELIDUNE_REMINDERS__ENABLED` is true (the default): 7, 14, and 21 days, templates `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`. Time `ELIDUNE_REMINDERS__SEND_TIME` (09:00). Gap `ELIDUNE_REMINDERS__SMTP_THROTTLE_MS` (100). Turning off the first level turns off the later ones. `receive_reminders` must be true and an address must be present. Turning off `accrue_fines` does not stop the messages.
