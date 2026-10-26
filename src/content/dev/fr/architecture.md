---
title: Architecture
description: Serveur Rust, interface web, base PostgreSQL, Redis, Meilisearch et rôle de nginx.
navTitle: Architecture
order: 10
section: overview
draft: false
locale: fr
---

Cette page décrit Elidune tel que le code de la branche `dev` le construit, au commit `3e1ca84`. Le dépôt est [elidune/elidune](https://github.com/elidune/elidune). Le code est sous licence GNU AGPL-3.0. Le champ `license` du document OpenAPI généré indique encore `GPL-2.0` : ce champ ne reflète pas le fichier `LICENSE`.

## Pièces

| Dossier | Rôle |
| --- | --- |
| `server/` | API Rust, crate `elidune-server`. Axum, SQLx, PostgreSQL, Redis, Meilisearch, Z39.50, JWT, OpenAPI (utoipa) |
| `ui/` | Interface React 19, TypeScript, Vite 7, TanStack Query, Tailwind CSS 4. Paquet `elidune-ui` |
| `docker/` | Images, fichiers Compose, configuration nginx |
| `docs/` | Guides de déploiement et contrats conservés à côté du code |

Le serveur ne livre pas les fichiers de l’interface. nginx (ou le proxy de Vite en développement) sert l’interface et transmet le préfixe `/api` au serveur.

## Chemin d’une requête

1. Le navigateur appelle nginx, ou Vite en développement. Vite écoute le port 3000 et proxifie `/api` vers `http://127.0.0.1:8080`.
2. nginx sert les fichiers statiques de l’interface. `location /api` transmet au serveur et pose les en-têtes de proxy.
3. Axum monte le routeur sous `/api/v1`, après CORS et les limiteurs. Le montage est dans `server/src/app.rs`.
4. Le handler (`server/src/api/`) vérifie le jeton et les droits, puis appelle un service (`server/src/services/`), qui interroge le dépôt SQL (`server/src/repository/`).

Au démarrage (`server/src/main.rs`), le serveur charge la configuration, ouvre PostgreSQL, applique les migrations, fusionne les réglages surchargeables lus en base, puis prépare Redis, Meilisearch et le planificateur.

## Trois stockages

| Stockage | Rôle |
| --- | --- |
| PostgreSQL 16 | Source de vérité. Migrations dans `server/migrations/` |
| Redis 7 | Codes de second facteur, appareils de confiance, cache des réponses Z39.50 (sept jours par défaut) |
| Meilisearch 1.12 | Index de recherche du catalogue, nom par défaut `items`. S’il ne répond pas, la recherche retombe sur PostgreSQL |

Les identifiants métier sont des entiers 64 bits de type flocon. Dans le JSON, ils sont en général des chaînes, pour qu’un client JavaScript ne perde pas de précision.

## Vocabulaire du code

| Mot du code | Sens |
| --- | --- |
| biblio | Notice |
| item | Exemplaire |
| loan | Prêt |
| hold | Réservation |
| site | Lieu de conservation ou de retrait |
| user | Compte, lecteur ou personnel |

Certaines réponses JSON nomment encore le lieu `sourceName`.

## Hors de `/api/v1`

| Méthode | Chemin | Rôle |
| --- | --- | --- |
| GET | `/version` | Version du binaire |
| GET | `/metrics` | Mesures Prometheus, sans authentification |
| GET | `/swagger-ui/` | Interface du contrat OpenAPI |
| GET | `/api-docs/openapi.json` | Contrat généré à l’exécution, non versionné comme fichier |

La suite du contrat est dans [API](/fr/dev/api/). Le déploiement des images est dans [Déploiement](/fr/dev/deployment/).
