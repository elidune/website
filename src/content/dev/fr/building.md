---
title: Compiler, tester, contribuer
description: Lancer le serveur et l’interface, commandes de test, intégration continue et licence.
navTitle: Compiler et contribuer
order: 70
section: practice
draft: false
locale: fr
---

Le code est sous licence GNU AGPL-3.0 (`LICENSE` à la racine, `AGPL-3.0-or-later` dans `ui/package.json`). Les versions d’outils ci-dessous sont celles de `.github/workflows/ci.yml` au commit `3e1ca84`.

## Lancer en local

PostgreSQL et Redis doivent tourner. Le fichier `server/config/default.toml` est ignoré par Git (`.gitignore` contient `**/config/default.toml`). Le modèle versionné est `server/config/sample.toml`.

```bash
cp server/config/sample.toml server/config/default.toml
```

Depuis `server/`, la même copie est `cp config/sample.toml config/default.toml`. Renseigner `users.jwt_secret` (32 caractères au moins) et la clé Meilisearch (16 caractères au moins), ou désactiver Meilisearch. La chaîne livrée est `postgres://elidune:elidune@localhost:5432/elidune`. Redis : `redis://127.0.0.1:6379`.

```bash
cd server
cargo run -- --config config/default.toml
```

Les migrations en attente s’appliquent au démarrage. Les clés du fichier sont décrites dans [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md).

Interface, pnpm seulement (`ui/pnpm-lock.yaml`) :

```bash
cd ui
pnpm install
pnpm dev
```

Ouvrir `http://localhost:3000`. `pnpm dev:https` pose un certificat local (`VITE_HTTPS=true`).

## Tests

Serveur, depuis `server/` :

```bash
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --lib
```

Les tests d’intégration demandent PostgreSQL 16 et Redis 7. La CI crée la base `elidune_test` avec l’utilisateur `elidune` / `elidune`, installe `sqlx-cli` 0.7.4 (les versions 0.9 exigent un compilateur Rust plus récent que celui de la CI), lance `sqlx migrate run`, puis `cargo test`. Variables : `DATABASE_URL=postgres://elidune:elidune@localhost:5432/elidune_test`, `REDIS_URL=redis://localhost:6379`, `CI=true`.

Le contrat OpenAPI est compilé par `cargo test --lib api::openapi::tests::openapi_schema_compiles -- --exact`.

Interface :

```bash
cd ui
pnpm lint
pnpm test
pnpm build
```

`pnpm build` enchaîne `tsc -b` et `vite build`. `pnpm test` lance les fichiers `src/**/*.test.ts`.

## Intégration continue

`.github/workflows/ci.yml` part sur les poussées et les pull requests vers `main` et vers `dev`.

- Rust 1.90, rustfmt, Clippy avec `-D warnings` ;
- tests unitaires, puis tests d’intégration avec PostgreSQL et Redis ;
- `SQLX_OFFLINE=true` après `cargo sqlx prepare` ;
- couverture `cargo llvm-cov` sur les poussées vers `dev` et `main`, seuil de lignes 20 ;
- Node 20, pnpm 9. `pnpm lint` est marqué `continue-on-error`. `pnpm build` et `pnpm test` ne le sont pas ;
- construction des trois images Docker sur les pull requests qui touchent Docker, sans publication.

La publication des images est décrite dans [Déploiement](/fr/dev/deployment/).

## Contribuer

La CI écoute `main` et `dev`. Les images `:latest` du serveur et de l’interface suivent `main`. L’image tout-en-un publie aussi `:dev` depuis la branche `dev`.

Une modification d’API et d’interface se livre ensemble. Les commentaires et le code du serveur sont en anglais. Les chaînes visibles de l’interface passent par les quatre fichiers de traduction.

Ce site de documentation se construit avec Node 22 (`npm run build`). Les pages françaises sont à la forme impersonnelle. Le guide du personnel est la collection `src/content/docs/`. Cette partie est `src/content/dev/`.
