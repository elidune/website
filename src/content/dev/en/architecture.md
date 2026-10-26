---
title: Architecture
description: The Rust server, the web UI, PostgreSQL, Redis, Meilisearch, and the role of nginx.
navTitle: Architecture
order: 10
section: overview
draft: false
locale: en
---

This page describes Elidune as the `dev` branch builds it, at commit `3e1ca84`. The repository is [elidune/elidune](https://github.com/elidune/elidune). The code is under the GNU AGPL-3.0 licence. The generated OpenAPI document’s `license` field still says `GPL-2.0`: that field does not match the `LICENSE` file.

## Parts

| Path | Role |
| --- | --- |
| `server/` | Rust API, crate `elidune-server`. Axum, SQLx, PostgreSQL, Redis, Meilisearch, Z39.50, JWT, OpenAPI (utoipa) |
| `ui/` | React 19 interface, TypeScript, Vite 7, TanStack Query, Tailwind CSS 4. Package `elidune-ui` |
| `docker/` | Images, Compose files, nginx configuration |
| `docs/` | Deployment guides and contracts kept next to the code |

The server does not serve the interface files. nginx (or the Vite proxy in development) serves the interface and forwards the `/api` prefix to the server.

## Path of a request

1. The browser calls nginx, or Vite in development. Vite listens on port 3000 and proxies `/api` to `http://127.0.0.1:8080`.
2. nginx serves the interface’s static files. `location /api` forwards to the server and sets the proxy headers.
3. Axum mounts the router under `/api/v1`, after CORS and the limiters. The mount is in `server/src/app.rs`.
4. The handler (`server/src/api/`) checks the token and the rights, then calls a service (`server/src/services/`), which queries the SQL repository (`server/src/repository/`).

At startup (`server/src/main.rs`), the server loads configuration, opens PostgreSQL, applies migrations, merges overridable settings read from the database, then prepares Redis, Meilisearch, and the scheduler.

## Three stores

| Store | Role |
| --- | --- |
| PostgreSQL 16 | Source of truth. Migrations in `server/migrations/` |
| Redis 7 | Second-factor codes, trusted devices, Z39.50 response cache (seven days by default) |
| Meilisearch 1.12 | Catalogue search index, default name `items`. When it does not answer, search falls back to PostgreSQL |

Business identifiers are 64-bit snowflake integers. In JSON they are usually strings, so a JavaScript client does not lose precision.

## Code vocabulary

| Code word | Meaning |
| --- | --- |
| biblio | Bibliographic record |
| item | Physical copy |
| loan | Loan |
| hold | Hold |
| site | Shelving or pickup place |
| user | Account, patron or staff |

Some JSON responses still name the place `sourceName`.

## Outside `/api/v1`

| Method | Path | Role |
| --- | --- | --- |
| GET | `/version` | Binary version |
| GET | `/metrics` | Prometheus metrics, with no authentication |
| GET | `/swagger-ui/` | OpenAPI contract UI |
| GET | `/api-docs/openapi.json` | Contract generated at runtime, not committed as a file |

The rest of the contract is in [API](/en/dev/api/). Image deployment is in [Deployment](/en/dev/deployment/).
