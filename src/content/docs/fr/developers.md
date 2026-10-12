---
title: Développeurs
description: Architecture Rust et React, lancement local, tests, intégration continue et traductions.
navTitle: Développeurs
order: 70
section: dev
draft: false
locale: fr
---

Le dépôt [elidune/elidune](https://github.com/elidune/elidune) réunit l’API et l’interface. Les anciens dépôts séparés sont archivés.

## Architecture

| Partie | Rôle |
| --- | --- |
| `server/` | API Rust : Axum, SQLx, PostgreSQL, Redis, Meilisearch, Z39.50, JWT, OpenAPI (utoipa) |
| `ui/` | SPA React 19, TypeScript, Vite 7, TanStack Query, Tailwind CSS 4 |
| `docker/` | Images et fichiers Compose |
| `docs/` | Guides de déploiement et contrats d’API |

nginx sert les fichiers de l’interface et reverse-proxifie `/api`. Axum ne sert pas la SPA. Le préfixe d’API est `/api/v1`, en URL relative.

Chaîne d’une requête : handler `server/src/api/`, service `server/src/services/`, SQL `server/src/repository/`. Les migrations sont des fichiers SQL numérotés dans `server/migrations/`. Un fichier déjà publié ne se modifie pas.

Vocabulaire du code : **biblio** (notice), **item** (exemplaire), **loan** (prêt), **hold** (réservation), **source** (lieu).

## Lancer en local

PostgreSQL et Redis doivent tourner. Le fichier `server/config/default.toml` est ignoré par Git. Le modèle versionné est `server/config/sample.toml`. Le README lance :

```bash
cd server
cargo run -- --config config/default.toml
```

La chaîne par défaut du modèle est `postgres://elidune:elidune@localhost:5432/elidune`. Redis : `redis://127.0.0.1:6379`. Au démarrage, les migrations en attente s’appliquent.

Avant ce premier lancement, copier le modèle versionné vers le fichier ignoré par Git. `.gitignore` contient `**/config/default.toml`. Depuis `server/` :

```bash
cp config/sample.toml config/default.toml
```

Depuis la racine du dépôt : `cp server/config/sample.toml server/config/default.toml`. Le [README](https://github.com/elidune/elidune/blob/dev/README.md) donne ensuite la commande `cargo run` ci-dessus. Les clés du fichier sont dans [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md). Le même geste est rappelé dans [Installation](/fr/documentation/installation/).

Interface (Node, pnpm uniquement, `ui/pnpm-lock.yaml`) :

```bash
cd ui
pnpm install
pnpm dev
```

Vite écoute le port 3000 et proxifie `/api` vers `http://127.0.0.1:8080`. Ouvrir `http://localhost:3000`. `pnpm dev:https` active un certificat local (`VITE_HTTPS=true`).

Rust de la CI : 1.90. Node de la CI interface : 20. pnpm : 9.

## Tests

Serveur, depuis `server/` :

```bash
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --lib
```

Les tests d’intégration demandent PostgreSQL 16 et Redis. La CI crée la base `elidune_test` avec l’utilisateur `elidune` / `elidune`, installe `sqlx-cli` 0.7.4, lance `sqlx migrate run`, puis `cargo test` sur les binaires `lms_flows`, `repository_loans_holds`, `fines_circulation`, `security_rbac`, `weeding`, `holds_to_pick`, et les autres nommés dans `.github/workflows/ci.yml`. Variable `DATABASE_URL=postgres://elidune:elidune@localhost:5432/elidune_test` et `REDIS_URL=redis://localhost:6379`.

Interface :

```bash
cd ui
pnpm lint
pnpm build
```

`pnpm build` enchaîne `tsc -b` et `vite build`.

## Intégration continue

`.github/workflows/ci.yml` part sur les poussées et les pull requests vers `main` et vers `dev`.

- format, Clippy, schéma OpenAPI ;
- tests unitaires ;
- tests d’intégration avec PostgreSQL et Redis ;
- couverture (`cargo llvm-cov`, seuil de lignes 20) ;
- `pnpm lint` (ce job est marqué `continue-on-error`) et `pnpm build` ;
- construction des trois images Docker sur les pull requests, sans publication.

`.github/workflows/docker-publish.yml` publie les images sur GHCR lors d’une poussée vers `main` (`:latest` et le SHA) ou `dev` (`:dev` et le SHA). `:latest` n’est pas mis à jour par `dev`.

## Contribuer

Les contributions se proposent en pull request vers `dev`. Le mainteneur les fusionne par squash. `main` reçoit les versions publiées (l’étiquette d’image `:latest` suit une poussée vers `main`, voir ci-dessus). Cette pratique de squash est celle du mainteneur. Elle n’est pas écrite dans `AGENTS.md` ni dans les workflows. La CI continue d’écouter `main` et `dev`.

Une modification d’API et d’interface se livre dans le même jeu de commits. Les commentaires et le code du serveur sont en anglais. Les chaînes visibles de l’interface passent par `t('clé')`.

## Traductions de l’interface

Ajouter une clé dans les quatre fichiers `ui/src/locales/{en,fr,de,es}/translation.json` en même temps. Les dates affichées utilisent `i18n.language`.

La langue du compte, côté API, est l’énumération longue (`french`, `english`, …). La liste est dans [Langues](/fr/documentation/languages/).

Ce site de présentation a sa propre documentation, dans `elidune/website`, collection `src/content/docs/{fr,en}/`. Ce n’est pas le dossier `docs/` du logiciel.
