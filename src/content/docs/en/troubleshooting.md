---
title: Troubleshooting
description: Busy ports, API health, quotas, SMTP, and search.
navTitle: Troubleshooting
order: 61
section: help
draft: false
locale: en
---

Compose commands run from the root of the software repository, with the file used at installation.

## The container does not start

```bash
docker compose -f docker/docker-compose.all-in-one.yml ps
docker compose -f docker/docker-compose.all-in-one.yml logs --tail=200 elidune-all-in-one
```

On the split stack, the API service is named `elidnune-server`:

```bash
docker compose -f docker/docker-compose.yml logs --tail=200 elidnune-server
```

HTTP check: `GET /api/v1/health`. The body reports a healthy state, a required first setup, or an unreachable database.

**Variables not found.** Run `docker compose` in the directory that contains `.env`, or pass `--env-file`.

**Port already in use.** Change `API_PORT`, `GUI_PORT`, `POSTGRES_PORT`, `REDIS_PORT`, or `MEILI_PORT`, then `down` and `up -d`. Ports inside the all-in-one image do not change (API 8080, UI 80, PostgreSQL 5432).

**GHCR image refused.** `docker login ghcr.io`. The image must be readable by the account in use.

**Empty string.** A line `SOME_VAR=` can make configuration parsing fail. Remove the line.

**Meilisearch rejects the key.** In production mode the key is at least 16 characters. Replace `ELIDUNE_MEILISEARCH__API_KEY` and restart so that `MEILI_MASTER_KEY` follows.

## Sign-in and quotas

A 429 response with `code` equal to `rate_limited` and a `Retry-After` header comes from the quota, not from a wrong password. Default: 30 authentication requests per minute per IP. Behind a reverse proxy, if every desk shares one address, raise `ELIDUNE_SERVER__AUTH_IP_PER_MINUTE` or list the proxy in `ELIDUNE_SERVER__TRUSTED_PROXIES` so the API reads `X-Forwarded-For`.

The per-login block (5 failures / 15 minutes) is cleared with `DELETE /api/v1/auth/rate-limit/{login}` by staff who have write access on users.

## Email

No password-reset message: check `ELIDUNE_SERVER__PUBLIC_BASE_URL`, the SMTP host, the sender, and that the email section is overridable if the values come from the UI. The test is `POST /api/v1/admin/config/email/test`.

## Empty search after an import

Meilisearch indexes apart from PostgreSQL. After a large import or an SQL restore, run reindex (Settings, Server, Catalog). If Meilisearch is stopped, the API searches PostgreSQL.

## SQL restore

The dump is `pg_dump --clean` SQL. Restoring it overwrites the database. Upload limit: 512 MiB. `pg_dump` must be installed in the image (the repository Dockerfiles add the PostgreSQL client). If connections stay open after the restore, restart the API container.
