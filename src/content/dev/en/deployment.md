---
title: Deployment
description: Docker images, variables, the HTTPS proxy, migrations, backups, and deposit reclassification.
navTitle: Deployment
order: 20
section: overview
draft: false
locale: en
---

The guide for staff is [Installation](/en/docs/installation/). This page gives the commands and the exact names, from `docker/` and [`docs/README-docker.md`](https://github.com/elidune/elidune/blob/dev/docs/README-docker.md) on the `dev` branch.

Commands run from the software repository root. Docker Compose reads `.env` in the current directory. An empty variable can break configuration parsing: omit the line to keep the default.

## Two stacks

| | `docker/docker-compose.yml` | `docker/docker-compose.all-in-one.yml` |
| --- | --- | --- |
| Contents | Interface (nginx), API, PostgreSQL 16, Redis 7, Meilisearch 1.12 | One container: PostgreSQL 16, Redis, Meilisearch 1.12.0, API, nginx, via Supervisor |
| Local images | `elidune-ui`, `elidune-server` | `elidune-all-in-one` |
| Default host ports | Interface `80`, API `8080`, PostgreSQL `5432`, Redis `6379`, Meilisearch `7700` | PostgreSQL `5433`, Redis `6379`, Meilisearch `7700`, API `8282`, interface `8181` |

The API listens on HTTP port 8080 inside the container. nginx serves the interface and forwards `/api`. In the split stack, the API service is named `elidnune-server` (image `elidune-server`). The interface has the fixed address `172.30.78.10` on the network `172.30.78.0/24`.

## Published images

A push to `main` or `dev` that touches the server, the interface, or Docker publishes images on GHCR (`.github/workflows/docker-publish.yml`).

| Image | Dockerfile | Tags |
| --- | --- | --- |
| `ghcr.io/elidune/elidune-server` | `docker/Dockerfile` | `:latest` and the SHA, on `main` only |
| `ghcr.io/elidune/elidune-ui` | `docker/Dockerfile.ui` | same |
| `ghcr.io/elidune/elidune-all-in-one` | `docker/Dockerfile.all-in-one` | `:latest` on `main`, `:dev` on `dev`, plus the SHA |

A push to `dev` does not replace `:latest` of the server or of the interface.

## All-in-one image

```bash
cp docker/.env.example .env
```

Replace at least `ELIDUNE_USERS__JWT_SECRET` and `ELIDUNE_MEILISEARCH__API_KEY` (16 characters at least: Meilisearch in production refuses a shorter key). The same value feeds `MEILI_MASTER_KEY`.

```bash
docker login ghcr.io
docker compose -f docker/docker-compose.all-in-one.yml pull
docker compose -f docker/docker-compose.all-in-one.yml up -d
```

To build the image locally: `docker build -f docker/Dockerfile.all-in-one -t elidune-all-in-one:latest .`

Check:

```bash
docker compose -f docker/docker-compose.all-in-one.yml ps
curl -sS "http://127.0.0.1:${API_PORT:-8282}/api/v1/health"
curl -sS -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:${GUI_PORT:-8181}/"
```

PostgreSQL, in this image, listens on `localhost:5432`. `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` default to `elidune` and must stay aligned with `ELIDUNE_DATABASE__URL`. These values are those of the Compose file, not a production password.

`ELIDUNE_SERVER__TRUSTED_PROXIES` defaults to `127.0.0.1/32,::1/128`. Only those addresses can make `X-Forwarded-For` accepted.

## Split stack

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

The shipped database URL is `postgres://elidune:elidune@db:5432/elidune`. PostgreSQL credentials are written in the YAML. For production, change them in that file and align `ELIDUNE_DATABASE__URL`.

`ELIDUNE_SERVER__TRUSTED_PROXIES` defaults to `172.30.78.10/32`, so a direct hit on the published API port cannot forge `X-Forwarded-For`.

```bash
export ELIDUNE_IMAGE=ghcr.io/elidune/elidune-server:latest
docker login ghcr.io
docker compose -f docker/docker-compose.yml pull elidnune-server
docker compose -f docker/docker-compose.yml up -d --no-build
```

Health: `curl -sS "http://127.0.0.1:${API_PORT:-8080}/api/v1/health"`. `GET /api/v1/health` reports a healthy state, a first setup that is still required, or a database that cannot be reached.

Named volumes of both stacks: `elidune-postgres-data`, `elidune-redis-data`, `elidune-meili-data`.

Shipped SQL pool: `ELIDUNE_DATABASE__MAX_CONNECTIONS=10`, `ELIDUNE_DATABASE__MIN_CONNECTIONS=2`.

## Logs and busy ports

```bash
docker compose -f docker/docker-compose.all-in-one.yml logs --tail=200 elidune-all-in-one
docker compose -f docker/docker-compose.yml logs --tail=200 elidnune-server
```

A port already taken is changed with `API_PORT`, `GUI_PORT`, `POSTGRES_PORT`, `REDIS_PORT`, or `MEILI_PORT`, then `down` and `up -d`. Internal ports of the all-in-one image stay 8080 (API), 80 (interface), and 5432 (PostgreSQL).

## Reverse proxy and HTTPS

The application does not terminate TLS. [`docs/reverse-proxy.md`](https://github.com/elidune/elidune/blob/dev/docs/reverse-proxy.md) gives nginx and Apache examples. For the all-in-one image, the usual upstreams are the API on `127.0.0.1:8282` and the interface on `127.0.0.1:8181`.

When a host proxy is the API’s TCP peer, add it to `ELIDUNE_SERVER__TRUSTED_PROXIES` (CIDRs separated by commas). Without that, the API ignores `X-Forwarded-For` and counts the proxy address for quotas.

`ELIDUNE_SERVER__PUBLIC_BASE_URL` is the public origin of the interface, with no trailing slash. Empty, no password-reset email is sent.

If the browser calls the API on another origin, `ELIDUNE_SERVER__CORS_ORIGINS` is a JSON array, for example `["https://library.example.org"]`.

## Migrations

At startup, the API applies `server/migrations/` with `sqlx::migrate!`.

| File | Role |
| --- | --- |
| `001_initial_schema.sql` | Full schema and seed data |
| `002_advance_seeded_id_sequences.sql` | Aligns sequences on the highest identifier already inserted, so the first `INSERT` does not collide |
| `003_loans_archives_loan_id.sql` | Adds `loans_archives.loan_id`, a copy of the original loan identifier |

A fresh database needs nothing else. The server README still mentions a single file: the repository now ships these three files.

A database that already applied the old `002` to `072` chain must realign `_sqlx_migrations` **once**, before deploying a binary whose history starts at the squashed schema:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f server/database/reset_sqlx_migrations.sql
```

Do not run this script on a fresh database. The script clears `_sqlx_migrations` and inserts only version 1, with the checksum of `001`. On the next startup, `002` and `003` apply. If `001` changes, the checksum in the script must be recomputed, as the file comment says. Detail: [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md), section “Squashed migrations”.

## Backups

**SQL dump (administrator).** `GET /api/v1/maintenance/database/dump` runs `pg_dump --clean` (no owner, no ACL). `POST /api/v1/maintenance/database/restore` uploads that SQL (512 MiB limit) and runs it with `psql -f`. A `--clean` dump contains `DROP` statements: the operation is destructive. The repository images include the PostgreSQL client.

**PostgreSQL volume of the all-in-one image:**

```bash
docker run --rm -v elidune-postgres-data:/data -v "$(pwd):/backup" alpine \
  tar czf /backup/postgres-backup.tgz -C /data .
```

After a PostgreSQL restore, reindex: `POST /api/v1/admin/reindex-search` (administrator), also offered in Settings, Server, Catalog.

## Mail

| Variable | Compose default |
| --- | --- |
| `ELIDUNE_EMAIL__SMTP_HOST` | empty |
| `ELIDUNE_EMAIL__SMTP_PORT` | 587 |
| `ELIDUNE_EMAIL__SMTP_USERNAME` | empty |
| `ELIDUNE_EMAIL__SMTP_PASSWORD` | empty |
| `ELIDUNE_EMAIL__SMTP_FROM` | empty |
| `ELIDUNE_EMAIL__SMTP_FROM_NAME` | empty in Compose, “Elidune” in `sample.toml` |
| `ELIDUNE_EMAIL__SMTP_USE_TLS` | true |

Test: `POST /api/v1/admin/config/email/test`. The password is not returned in clear text.

Shipped templates, identifiers: `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`, `hold_ready`, `password_reset`, `2fa_code`, `recovery_code`, `event_announcement`, `inventory_loan_closed`.

## Profile and modules

`ELIDUNE_FEATURES__PROFILE=essential` turns off acquisitions, purchase suggestions, weeding, transits, deposits, and visitor counts, even when booleans in the same file say otherwise. Events, inventory, Z39.50, MARC import, and statistics stay on. A disabled module returns HTTP 403, code `feature_disabled`. Effective flags are on `GET /api/v1/library-info`, field `enabledFeatures`.

## Application log

`ELIDUNE_LOGGING__LEVEL` (`info` in Compose), format `pretty`, `plain`, or `json`, output `stdout`, `stderr`, `file`, or `syslog`. `RUST_LOG` also filters the Rust tracer (Compose default `elidune_server=info,tower_http=info`). For file output, the path and rotation (`daily` by default) are required.

Audit retention: `ELIDUNE_AUDIT__RETENTION_DAYS` = 365.

Automatic anonymisation: `ELIDUNE_PRIVACY__AUTO_ANONYMIZE_YEARS_AFTER_EXPIRY`, default 0 (task stopped). The task runs at 04:00 and ignores loans that are still active.

## Reclassify deposits

The server binary reclassifies copies whose lender had been stored as a site. Without `--apply`, the transaction is rolled back after the report.

```bash
elidune-server reclassify-deposits \
  --config config/default.toml \
  --lender 12 \
  --batch-reference "CITY-2027-SPRING" \
  --received-on 2027-03-01 \
  --return-due-on 2027-09-01 \
  --site 3 \
  --from-site 41
```

`--from-site` and `--barcodes` are mutually exclusive, and `--from-site` must differ from `--site`. `--return-due-on` is optional (a permanent deposit). A batch already `active` for that reference is reused. Another status is refused.

Per-copy refusals, with no write: `barcode_unknown`, `item_archived`, `item_in_other_batch`, `item_in_transit`. `already_reclassified` is a pass with no second audit row.

[`docs/README-deposit-reclassify.md`](https://github.com/elidune/elidune/blob/dev/docs/README-deposit-reclassify.md) still names `--from-source` and `items.source_id`. The binary of this version expects `--from-site` and updates `items.site_id`. The JSON report speaks of `remaining_on_old_site`.
