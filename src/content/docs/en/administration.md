---
title: Administration
description: Settings, rights, SMTP, GDPR anonymisation, and the audit log.
navTitle: Administration
order: 50
section: admin
draft: false
locale: en
---

Settings live at `/settings`. An `admin` account sees every tab. A `librarian` account sees only Library.

<figure>
<picture>
<source srcset="/screens/en/dark/settings.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/en/light/settings.webp" alt="Placeholder image of the settings screen, light theme." width="1440" height="900" />
</picture>
</figure>

Screenshot slot: settings (`settings`).

## Tabs

| Tab | Contents |
| --- | --- |
| Library | Name, address, country, time zone, contact, opening hours |
| Loan rules | Durations, caps, renewal, holds, reminders, fines, unpaid threshold |
| Public types | Audiences, ages, subscription, loan overrides |
| Account types | Rights per account type |
| Email templates | Texts that are sent |
| Sources | Holding and pickup places |
| Z39.50 servers | Import targets |
| Server | Reminders, hold expiry, logs, audit retention, SMTP, reindex, SQL dump |
| Audit | Log of sensitive operations |

The Server tab has three sub-tabs: General, Catalog, Database. A section marked not overridable stays as in the configuration file. “Reset to file” deletes the database override (`DELETE /api/v1/admin/config/{section}`).

Overridable sections in `sample.toml` include logging, email, reminders, audit, and holds (`overridable = true`).

## Roles and rights

The account type (`guest`, `reader`, `group`, `librarian`, `admin`) carries levels. For documents, users, settings, and events: none, read, write. For loans: none, read, write. For holds: none, self (`own`), read, write.

Seeded set after migrations:

| Type | Documents | Users | Loans | Holds | Settings |
| --- | --- | --- | --- | --- | --- |
| `guest` | read | none | none | none | read |
| `reader`, `group` | read | self | self (does not open the desk) | self | read |
| `librarian` | write | write | write | write | read |
| `admin` | write | write | write | write | write |

`own` on loans does not open `/loans`. It lets the patron see and renew their own loans. `own` on holds lets them create and cancel their own. Acquisitions have a separate right, `acquisitions_rights` (`n`, `r`, `w`), set to `w` for `librarian` and `admin` by migration `032`.

The Account types tab edits these letters. Changing a user’s type remains an administrator action.

Administration routes (`/api/v1/admin/config`, SMTP test, reindex, audit, maintenance) require an `admin` account.

## Email and SMTP

Variables, also editable on the Server tab when the email section is overridable:

| Variable | Compose default |
| --- | --- |
| `ELIDUNE_EMAIL__SMTP_HOST` | empty |
| `ELIDUNE_EMAIL__SMTP_PORT` | 587 |
| `ELIDUNE_EMAIL__SMTP_USERNAME` | empty |
| `ELIDUNE_EMAIL__SMTP_PASSWORD` | empty |
| `ELIDUNE_EMAIL__SMTP_FROM` | empty |
| `ELIDUNE_EMAIL__SMTP_FROM_NAME` | empty in Compose, “Elidune” in `sample.toml` |
| `ELIDUNE_EMAIL__SMTP_USE_TLS` | true |

Do not write an empty string for an optional value: omit the variable. The SMTP password is not returned in clear text by the screen. A test send exists: `POST /api/v1/admin/config/email/test`.

`ELIDUNE_SERVER__PUBLIC_BASE_URL` (no trailing slash) is the origin of links inside messages. When it is empty, password reset sends nothing. Event announcements point at `{origin}/events/unsubscribe?token=…`.

Shipped templates: `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`, `hold_ready`, `password_reset`, `2fa_code`, `recovery_code`, `event_announcement`, `inventory_loan_closed`.

## Anonymisation (GDPR)

The desk action is named “Anonymize for stats”. The API is still `DELETE /api/v1/users/{id}`. `force=true` returns active loans first, then erases.

The internal identifier is not rewritten. Status becomes `deleted`, tokens are revoked, and identity fields (login, password, name, email, address, phone, barcode, date of birth, notes, second factor) become null. Account type, public type, creation date, and subscription end date remain. Loan archives keep dimensions (age band at the loan date, year, city, public type, account type) and lose the link to the person. Active holds are deleted. Fines lose the user. Pending emails to that address are deleted. The audit log does not store the erased data.

The automatic job is `[privacy] auto_anonymize_years_after_expiry` (`ELIDUNE_PRIVACY__AUTO_ANONYMIZE_YEARS_AFTER_EXPIRY`). Default 0: job off. A typical value cited in the repository for a municipal library is 3, in years after `expiry_at`. The job runs at 04:00. It skips patrons who still have an active loan. Each anonymisation writes `user.deleted` with `trigger` equal to `retention_job`, and a counter event `system.privacy_auto_erasure`.

Column-by-column detail is `docs/README-patron-erasure.md` in the software repository.

## Logs

Two separate logs:

- **Application.** `ELIDUNE_LOGGING__LEVEL` (`info` in Compose), format `pretty`, `plain`, or `json`, output `stdout`, `stderr`, `file`, or `syslog`. `RUST_LOG` additionally filters the Rust tracer (Compose default `elidune_server=info,tower_http=info`). For file output, the path and the rotation (`daily` by default) are required.
- **Audit.** `GET /api/v1/audit` and export `GET /api/v1/audit/export`, administrator. Retention `ELIDUNE_AUDIT__RETENTION_DAYS` = 365. Older rows are deleted. The Audit tab in Settings reads them.

First setup writes `system.first_setup_completed` (library name, whether SMTP was provided), without the password.
