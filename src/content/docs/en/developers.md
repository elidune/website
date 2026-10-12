---
title: Developers
description: Rust and React architecture, local setup, tests, continuous integration, and translations.
navTitle: Developers
order: 70
section: dev
draft: false
locale: en
---

The [elidune/elidune](https://github.com/elidune/elidune) repository holds the API and the UI. The former split repositories are archived.

## Architecture

| Part | Role |
| --- | --- |
| `server/` | Rust API: Axum, SQLx, PostgreSQL, Redis, Meilisearch, Z39.50, JWT, OpenAPI (utoipa) |
| `ui/` | React 19 SPA, TypeScript, Vite 7, TanStack Query, Tailwind CSS 4 |
| `docker/` | Images and Compose files |
| `docs/` | Deployment guides and API contracts |

nginx serves the UI files and reverse-proxies `/api`. Axum does not serve the SPA. The API prefix is `/api/v1`, as a relative URL.

A request goes handler `server/src/api/`, service `server/src/services/`, SQL `server/src/repository/`. Migrations are numbered SQL files in `server/migrations/`. A published migration file is not edited.

Code vocabulary: **biblio** (record), **item** (physical copy), **loan**, **hold**, **source** (place).

## Run locally

PostgreSQL and Redis must be running. `server/config/default.toml` is gitignored. The versioned sample is `server/config/sample.toml`. The README starts the API with:

```bash
cd server
cargo run -- --config config/default.toml
```

The sample connection string is `postgres://elidune:elidune@localhost:5432/elidune`. Redis: `redis://127.0.0.1:6379`. Pending migrations run at startup.

> **TODO.** The README names `--config config/default.toml`, and that file is in `.gitignore`. The repository does not describe copying from `sample.toml`. Do that locally before the first `cargo run`.

UI (Node, pnpm only, `ui/pnpm-lock.yaml`):

```bash
cd ui
pnpm install
pnpm dev
```

Vite listens on port 3000 and proxies `/api` to `http://127.0.0.1:8080`. Open `http://localhost:3000`. `pnpm dev:https` turns on a local certificate (`VITE_HTTPS=true`).

CI Rust: 1.90. CI Node for the UI: 20. pnpm: 9.

## Tests

Server, from `server/`:

```bash
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --lib
```

Integration tests need PostgreSQL 16 and Redis. CI creates the database `elidune_test` with user `elidune` / `elidune`, installs `sqlx-cli` 0.7.4, runs `sqlx migrate run`, then `cargo test` on the binaries `lms_flows`, `repository_loans_holds`, `fines_circulation`, `security_rbac`, `weeding`, `holds_to_pick`, and the others named in `.github/workflows/ci.yml`. Variables `DATABASE_URL=postgres://elidune:elidune@localhost:5432/elidune_test` and `REDIS_URL=redis://localhost:6379`.

UI:

```bash
cd ui
pnpm lint
pnpm build
```

`pnpm build` runs `tsc -b` and then `vite build`.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main` and to `dev`.

- formatting, Clippy, OpenAPI schema;
- unit tests;
- integration tests with PostgreSQL and Redis;
- coverage (`cargo llvm-cov`, line threshold 20);
- `pnpm lint` (this job is marked `continue-on-error`) and `pnpm build`;
- build of the three Docker images on pull requests, without publishing.

`.github/workflows/docker-publish.yml` publishes images to GHCR on a push to `main` (`:latest` and the SHA) or `dev` (`:dev` and the SHA). `:latest` is not updated by `dev`.

## Contributing

Pull requests target `main` or `dev`, because CI listens on both branches. An API change and the matching UI change ship in the same set of commits. Server code and comments are in English. Visible UI strings go through `t('key')`.

> **TODO.** The repository does not say whether a merge must be a squash. Nothing in `AGENTS.md` or in the workflows requires that method.

## UI translations

Add a key to all four files `ui/src/locales/{en,fr,de,es}/translation.json` in the same change. Displayed dates use `i18n.language`.

The account language, on the API, is the long enumeration (`french`, `english`, …). The list is in [Languages](/en/docs/languages/).

This presentation site has its own documentation, in `elidune/website`, collection `src/content/docs/{fr,en}/`. That is not the software `docs/` directory.
