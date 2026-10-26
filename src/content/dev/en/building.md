---
title: Build, test, contribute
description: Run the server and the interface, test commands, continuous integration, and the licence.
navTitle: Build and contribute
order: 70
section: practice
draft: false
locale: en
---

The code is under the GNU AGPL-3.0 licence (`LICENSE` at the root, `AGPL-3.0-or-later` in `ui/package.json`). The tool versions below are those of `.github/workflows/ci.yml` at commit `3e1ca84`.

## Run locally

PostgreSQL and Redis must be running. `server/config/default.toml` is ignored by Git (`.gitignore` contains `**/config/default.toml`). The versioned template is `server/config/sample.toml`.

```bash
cp server/config/sample.toml server/config/default.toml
```

From `server/`, the same copy is `cp config/sample.toml config/default.toml`. Set `users.jwt_secret` (at least 32 characters) and the Meilisearch key (at least 16 characters), or disable Meilisearch. The shipped URL is `postgres://elidune:elidune@localhost:5432/elidune`. Redis: `redis://127.0.0.1:6379`.

```bash
cd server
cargo run -- --config config/default.toml
```

Pending migrations apply at startup. File keys are described in [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md).

Interface, pnpm only (`ui/pnpm-lock.yaml`):

```bash
cd ui
pnpm install
pnpm dev
```

Open `http://localhost:3000`. `pnpm dev:https` sets a local certificate (`VITE_HTTPS=true`).

## Tests

Server, from `server/`:

```bash
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --lib
```

Integration tests need PostgreSQL 16 and Redis 7. CI creates the database `elidune_test` with user `elidune` / `elidune`, installs `sqlx-cli` 0.7.4 (0.9 releases need a Rust compiler newer than CI’s), runs `sqlx migrate run`, then `cargo test`. Variables: `DATABASE_URL=postgres://elidune:elidune@localhost:5432/elidune_test`, `REDIS_URL=redis://localhost:6379`, `CI=true`.

The OpenAPI contract is compiled by `cargo test --lib api::openapi::tests::openapi_schema_compiles -- --exact`.

Interface:

```bash
cd ui
pnpm lint
pnpm test
pnpm build
```

`pnpm build` runs `tsc -b` and `vite build`. `pnpm test` runs `src/**/*.test.ts`.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main` and to `dev`.

- Rust 1.90, rustfmt, Clippy with `-D warnings`;
- unit tests, then integration tests with PostgreSQL and Redis;
- `SQLX_OFFLINE=true` after `cargo sqlx prepare`;
- `cargo llvm-cov` coverage on pushes to `dev` and `main`, line threshold 20;
- Node 20, pnpm 9. `pnpm lint` is marked `continue-on-error`. `pnpm build` and `pnpm test` are not;
- build of the three Docker images on pull requests that touch Docker, without publishing.

Image publishing is described in [Deployment](/en/dev/deployment/).

## Contribute

CI listens to `main` and `dev`. `:latest` images of the server and the interface follow `main`. The all-in-one image also publishes `:dev` from the `dev` branch.

An API change and an interface change ship together. Server comments and server code are in English. Visible interface strings go through the four translation files.

This documentation site builds with Node 22 (`npm run build`). French pages use an impersonal voice. The staff guide is the `src/content/docs/` collection. This part is `src/content/dev/`.
