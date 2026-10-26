---
title: Installation
description: Install Elidune with Docker, PostgreSQL, the first administrator, an HTTPS reverse proxy, upgrades, and backups.
navTitle: Installation
order: 10
section: install
draft: false
locale: en
---

This guide follows `docker/` and `docs/README-docker.md` in [elidune/elidune](https://github.com/elidune/elidune) (branch `dev`). Variable details stay in [`docker/.env.example`](https://github.com/elidune/elidune/blob/dev/docker/.env.example) and [`server/config/sample.toml`](https://github.com/elidune/elidune/blob/dev/server/config/sample.toml).

## Local start without Docker

Before the first `cargo run`, copy the versioned sample to the gitignored file:

```bash
cp server/config/sample.toml server/config/default.toml
```

`.gitignore` lists `**/config/default.toml`. From the `server/` directory, the same copy is `cp config/sample.toml config/default.toml`. The [application README](https://github.com/elidune/elidune/blob/dev/README.md) then starts the API with `cd server` and `cargo run -- --config config/default.toml`. File keys are described in [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md). Tests and CI: [Developers](/en/docs/developers/).

## Requirements

- Docker 20.10 or newer, and Docker Compose v2 (`docker compose`).
- Several gigabytes of disk for the images, PostgreSQL, and Meilisearch.
- 2 GB of RAM as a minimum for light use. A production load needs more.
- The host ports published by the chosen Compose file must be free.

```bash
docker --version
docker compose version
```

Run the commands below from the root of the software repository.

## Two ways to start

| | `docker/docker-compose.yml` | `docker/docker-compose.all-in-one.yml` |
| --- | --- | --- |
| Contents | UI (nginx), API, PostgreSQL 16, Redis 7, Meilisearch 1.12 | One container: PostgreSQL 16, Redis, Meilisearch 1.12.0, API, nginx, via Supervisor |
| Images | `elidune-ui` and `elidune-server`, or GHCR | `elidune-all-in-one` |
| Default host ports | UI `80`, API `8080`, PostgreSQL `5432`, Redis `6379`, Meilisearch `7700` | PostgreSQL `5433`, Redis `6379`, Meilisearch `7700`, API `8282`, UI `8181` |

The API listens on HTTP port 8080 inside the container. nginx serves the UI and forwards `/api` to the API. The API does not serve UI files.

On each push to `main` or `dev` that touches the server, the UI, or Docker, GitHub Actions publishes three images:

| Image | Dockerfile | Tags |
| --- | --- | --- |
| `ghcr.io/elidune/elidune-server` | `docker/Dockerfile` | `:latest` on `main`, `:dev` on `dev`, plus the Git SHA |
| `ghcr.io/elidune/elidune-ui` | `docker/Dockerfile.ui` | same |
| `ghcr.io/elidune/elidune-all-in-one` | `docker/Dockerfile.all-in-one` | same |

A push to `dev` does not replace `:latest`.

## All-in-one image

Copy the environment template, then replace at least `ELIDUNE_USERS__JWT_SECRET` and `ELIDUNE_MEILISEARCH__API_KEY` (16 characters or more: Meilisearch in production mode rejects a shorter key). The same value feeds `MEILI_MASTER_KEY`.

```bash
cp docker/.env.example .env
```

Docker Compose reads `.env` from the current directory, which is not necessarily `docker/`. An empty variable can break configuration parsing: omit the line to keep the default.

Ports and volumes as the Compose file defines them (excerpt):

```yaml
services:
  elidune-all-in-one:
    image: ${ELIDUNE_IMAGE:-elidune-all-in-one:latest}
    ports:
      - "${POSTGRES_PORT:-5433}:5432"
      - "${REDIS_PORT:-6379}:6379"
      - "${MEILI_PORT:-7700}:7700"
      - "${API_PORT:-8282}:8080"
      - "${GUI_PORT:-8181}:80"
    environment:
      ELIDUNE_DATABASE__URL: ${ELIDUNE_DATABASE__URL:-postgres://elidune:elidune@localhost:5432/elidune}
      ELIDUNE_USERS__JWT_SECRET: ${ELIDUNE_USERS__JWT_SECRET:-change-this-secret-in-production}
      ELIDUNE_REDIS__URL: ${ELIDUNE_REDIS__URL:-redis://127.0.0.1:6379}
      ELIDUNE_MEILISEARCH__URL: ${ELIDUNE_MEILISEARCH__URL:-http://127.0.0.1:7700}
      ELIDUNE_MEILISEARCH__API_KEY: ${ELIDUNE_MEILISEARCH__API_KEY:-change-this-meili-key}
      ELIDUNE_SERVER__TRUSTED_PROXIES: "${ELIDUNE_SERVER__TRUSTED_PROXIES:-127.0.0.1/32,::1/128}"
      ELIDUNE_SERVER__PUBLIC_BASE_URL: ${ELIDUNE_SERVER__PUBLIC_BASE_URL:-}
volumes:
  postgres_data:
    name: elidune-postgres-data
  redis_data:
    name: elidune-redis-data
  meili_data:
    name: elidune-meili-data
```

Inside this image, PostgreSQL listens on `localhost:5432`. `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` default to `elidune` and must stay aligned with `ELIDUNE_DATABASE__URL`. Those values are the Compose defaults, not a production password.

```bash
# ELIDUNE_IMAGE=ghcr.io/elidune/elidune-all-in-one:latest in .env
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

nginx inside the container reaches the API on `127.0.0.1:8080`. Only addresses listed in `ELIDUNE_SERVER__TRUSTED_PROXIES` (default `127.0.0.1/32,::1/128`) may supply `X-Forwarded-For`.

## Server and UI images

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

The UI service is `ui`. The API service key in the file is `elidnune-server` (image `elidune-server`, container `elidune-server`). PostgreSQL is `postgres:16-alpine` (`elidune` / `elidune` / database `elidune`), Redis is `redis:7-alpine`, Meilisearch is `getmeili/meilisearch:v1.12` with `MEILI_ENV=production`.

The default API database URL is `postgres://elidune:elidune@db:5432/elidune`. PostgreSQL credentials are written in the YAML. For production, change them in that file and align `ELIDUNE_DATABASE__URL`.

The UI has the fixed address `172.30.78.10` on network `172.30.78.0/24`. `ELIDUNE_SERVER__TRUSTED_PROXIES` defaults to `172.30.78.10/32`, so a direct hit on the published API port cannot forge `X-Forwarded-For`.

Named volumes match the all-in-one stack: `elidune-postgres-data`, `elidune-redis-data`, `elidune-meili-data`.

To use a published API image:

```bash
export ELIDUNE_IMAGE=ghcr.io/elidune/elidune-server:latest
docker login ghcr.io
docker compose -f docker/docker-compose.yml pull elidnune-server
docker compose -f docker/docker-compose.yml up -d --no-build
```

Health: `curl -sS "http://127.0.0.1:${API_PORT:-8080}/api/v1/health"`.

## PostgreSQL

Both stacks ship PostgreSQL 16. On startup the API opens the pool and applies SQL migrations from `server/migrations/` (`sqlx::migrate!`). Those migrations do not create an application account: the first account comes from the wizard.

Default pool limits are `ELIDUNE_DATABASE__MAX_CONNECTIONS=10` and `ELIDUNE_DATABASE__MIN_CONNECTIONS=2`.

## First administrator account

No administrator is shipped. While the database has neither users nor `settings` rows, `GET /api/v1/health` reports that first setup is required, and the UI opens `/first-setup`.

The wizard sends `POST /api/v1/first_setup` (201, JWT, redirect to `/home`). Four steps:

1. Introduction.
2. Library: name or city, country required, time zone when the country needs one, optional address, email, and phones.
3. Administrator: login, password (8 characters minimum), first name, last name, sex, date of birth, optional email, account language (`fr`, `en`, `de`, `es`). The account type is `admin`. Public type `adult` is used when that row exists after migrations.
4. Optional SMTP. Skipping the step leaves the file configuration. Saving is accepted only when `email.overridable` is true (it is, in the sample file).

A second call receives 409. The route shares the authentication quota: 30 requests per minute per IP address, burst 30, by default.

## Reverse proxy and HTTPS

The application does not terminate TLS. [docs/reverse-proxy.md](https://github.com/elidune/elidune/blob/dev/docs/reverse-proxy.md) has nginx and Apache examples. For the all-in-one image, typical upstreams are the API on `127.0.0.1:8282` and the UI on `127.0.0.1:8181`.

nginx, split paths (excerpt adapted from that guide to the all-in-one ports; point the certificate paths at the real host):

```nginx
upstream elidune_api { server 127.0.0.1:8282; }
upstream elidune_gui { server 127.0.0.1:8181; }

server {
    listen 443 ssl http2;
    server_name library.example.org;

    ssl_certificate     /etc/letsencrypt/live/library.example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/library.example.org/privkey.pem;

    location /api {
        proxy_pass http://elidune_api;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
        proxy_connect_timeout 300s;
        proxy_send_timeout    300s;
        proxy_read_timeout    300s;
        proxy_buffering off;
    }

    location / {
        proxy_pass http://elidune_gui;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Port 80 in the guide redirects to HTTPS (`return 301 https://$host$request_uri;`).

When a host proxy is the API’s TCP peer, add it to `ELIDUNE_SERVER__TRUSTED_PROXIES` (comma-separated CIDRs). Otherwise the API ignores `X-Forwarded-For` and counts the proxy address for quotas. `ELIDUNE_SERVER__PUBLIC_BASE_URL` is the public UI origin, with no trailing slash. When it is empty, no password-reset email is sent.

If the browser calls the API on another origin, set `ELIDUNE_SERVER__CORS_ORIGINS` to a JSON array, for example `["https://library.example.org"]`.

## Upgrades and migrations

1. Back up the volumes or take an SQL dump (next section).
2. Choose a tag (`:latest`, `:dev`, or a SHA) in `ELIDUNE_IMAGE` / `ELIDUNE_UI_IMAGE`.
3. `docker compose … pull`, then `docker compose … up -d`.
4. On startup the API applies pending migrations. An applied migration file is not edited: the repository adds a new numbered file.

The Docker guide asks for planned downtime and for a restore test on a copy before an upgrade.

## Backups and restore

Two mechanisms exist.

**SQL dump (administrator).** In Settings, Server tab, Database sub-tab, the UI calls `GET /api/v1/maintenance/database/dump`. The server runs `pg_dump --clean` (no owner, no ACL) and needs PostgreSQL client tools. Restore, `POST /api/v1/maintenance/database/restore`, uploads that SQL (512 MiB limit) and runs it with `psql -f`. A `--clean` dump contains `DROP` statements: the operation is destructive. The API comment recommends a maintenance window and a restart if connections fail during the restore.

**Docker volumes.** The Docker guide gives this example for the all-in-one PostgreSQL volume:

```bash
docker run --rm -v elidune-postgres-data:/data -v "$(pwd):/backup" alpine \
  tar czf /backup/postgres-backup.tgz -C /data .
```

Redis (`elidune-redis-data`) and Meilisearch (`elidune-meili-data`) are separate volumes. After a PostgreSQL restore, reindex Meilisearch from the server Catalog tab (`POST /api/v1/admin/reindex-search`, administrator).

## See also

- [Getting started](/en/docs/getting-started/)
- [Troubleshooting](/en/docs/troubleshooting/)
- [Developers](/en/docs/developers/) to run the API and UI without Docker
