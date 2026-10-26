---
title: Installation
description: Installer Elidune avec Docker, PostgreSQL, le premier compte administrateur, un reverse proxy HTTPS, les mises à jour et les sauvegardes.
navTitle: Installation
order: 10
section: install
draft: false
locale: fr
---

Ce guide reprend les fichiers `docker/` et `docs/README-docker.md` de [elidune/elidune](https://github.com/elidune/elidune) (branche `dev`). Le détail des variables reste dans [`docker/.env.example`](https://github.com/elidune/elidune/blob/dev/docker/.env.example) et [`server/config/sample.toml`](https://github.com/elidune/elidune/blob/dev/server/config/sample.toml).

## Lancement local sans Docker

Avant le premier `cargo run`, copier le modèle versionné vers le fichier ignoré par Git :

```bash
cp server/config/sample.toml server/config/default.toml
```

`.gitignore` contient `**/config/default.toml`. Depuis le répertoire `server/`, la même copie est `cp config/sample.toml config/default.toml`. Le [README du logiciel](https://github.com/elidune/elidune/blob/dev/README.md) lance ensuite l’API avec `cd server` puis `cargo run -- --config config/default.toml`. Les clés du fichier sont décrites dans [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md). Tests et CI : [Développeurs](/fr/documentation/developers/).

## Prérequis

- Docker 20.10 ou plus récent, et Docker Compose v2 (`docker compose`).
- Plusieurs gigaoctets de disque pour les images, PostgreSQL et Meilisearch.
- 2 Go de mémoire vive au minimum pour un usage léger. Une charge de production demande davantage.
- Les ports publiés par le fichier Compose choisi doivent être libres.

```bash
docker --version
docker compose version
```

Les commandes ci-dessous se lancent depuis la racine du dépôt logiciel.

## Deux façons de lancer

| | `docker/docker-compose.yml` | `docker/docker-compose.all-in-one.yml` |
| --- | --- | --- |
| Contenu | Interface (nginx), API, PostgreSQL 16, Redis 7, Meilisearch 1.12 | Un conteneur : PostgreSQL 16, Redis, Meilisearch 1.12.0, API, nginx, via Supervisor |
| Images | `elidune-ui` et `elidune-server`, ou GHCR | `elidune-all-in-one` |
| Ports hôte par défaut | Interface `80`, API `8080`, PostgreSQL `5432`, Redis `6379`, Meilisearch `7700` | PostgreSQL `5433`, Redis `6379`, Meilisearch `7700`, API `8282`, interface `8181` |

L’API écoute en HTTP sur le port 8080 à l’intérieur du conteneur. nginx sert l’interface et transmet `/api` à l’API. L’API ne sert pas les fichiers de l’interface.

Sur une poussée vers `main` ou `dev` qui touche le serveur, l’interface ou Docker, GitHub Actions publie les images. `elidune-server` et `elidune-ui` ne sont construites que sur `main`. `elidune-all-in-one` l’est sur `main` et sur `dev`.

| Image | Dockerfile | Étiquettes |
| --- | --- | --- |
| `ghcr.io/elidune/elidune-server` | `docker/Dockerfile` | `:latest` et le SHA, sur `main` seulement |
| `ghcr.io/elidune/elidune-ui` | `docker/Dockerfile.ui` | idem |
| `ghcr.io/elidune/elidune-all-in-one` | `docker/Dockerfile.all-in-one` | `:latest` sur `main`, `:dev` sur `dev`, plus le SHA |

Une poussée sur `dev` ne remplace pas `:latest`.

## Image tout-en-un

Copier le modèle d’environnement, puis remplacer au minimum `ELIDUNE_USERS__JWT_SECRET` et `ELIDUNE_MEILISEARCH__API_KEY` (16 caractères au moins : Meilisearch en mode production refuse une clé plus courte). La même valeur alimente `MEILI_MASTER_KEY`.

```bash
cp docker/.env.example .env
```

Docker Compose lit `.env` dans le répertoire courant, pas forcément dans `docker/`. Une variable vide peut casser la lecture de la configuration : omettre la ligne pour garder la valeur par défaut.

Ports et volumes tels que le fichier Compose les définit (extrait) :

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

PostgreSQL, dans cette image, écoute sur `localhost:5432`. `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` valent `elidune` par défaut et doivent rester alignés avec `ELIDUNE_DATABASE__URL`. Ces valeurs sont celles du fichier Compose, pas un mot de passe de production.

```bash
# ELIDUNE_IMAGE=ghcr.io/elidune/elidune-all-in-one:latest dans .env
docker login ghcr.io
docker compose -f docker/docker-compose.all-in-one.yml pull
docker compose -f docker/docker-compose.all-in-one.yml up -d
```

Pour construire l’image localement : `docker build -f docker/Dockerfile.all-in-one -t elidune-all-in-one:latest .`

Contrôle :

```bash
docker compose -f docker/docker-compose.all-in-one.yml ps
curl -sS "http://127.0.0.1:${API_PORT:-8282}/api/v1/health"
curl -sS -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:${GUI_PORT:-8181}/"
```

nginx, dans le conteneur, joint l’API sur `127.0.0.1:8080`. Seules les adresses listées dans `ELIDUNE_SERVER__TRUSTED_PROXIES` (défaut `127.0.0.1/32,::1/128`) peuvent faire accepter `X-Forwarded-For`.

## Images serveur et interface

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Le service d’interface est `ui`. Le service d’API, dans le fichier, s’appelle `elidnune-server` (image `elidune-server`, conteneur `elidune-server`). PostgreSQL est `postgres:16-alpine` (`elidune` / `elidune` / base `elidune`), Redis `redis:7-alpine`, Meilisearch `getmeili/meilisearch:v1.12` avec `MEILI_ENV=production`.

L’URL par défaut de l’API est `postgres://elidune:elidune@db:5432/elidune`. Les identifiants PostgreSQL sont écrits dans le YAML. Pour la production, les modifier dans ce fichier et aligner `ELIDUNE_DATABASE__URL`.

L’interface a l’adresse fixe `172.30.78.10` sur le réseau `172.30.78.0/24`. `ELIDUNE_SERVER__TRUSTED_PROXIES` vaut `172.30.78.10/32` par défaut, afin qu’un accès direct au port API publié ne puisse pas forger `X-Forwarded-For`.

Les volumes nommés sont les mêmes que pour l’image tout-en-un : `elidune-postgres-data`, `elidune-redis-data`, `elidune-meili-data`.

Pour utiliser l’image API déjà publiée :

```bash
export ELIDUNE_IMAGE=ghcr.io/elidune/elidune-server:latest
docker login ghcr.io
docker compose -f docker/docker-compose.yml pull elidnune-server
docker compose -f docker/docker-compose.yml up -d --no-build
```

Santé : `curl -sS "http://127.0.0.1:${API_PORT:-8080}/api/v1/health"`.

## PostgreSQL

Les deux piles embarquent PostgreSQL 16. Au démarrage, l’API ouvre le pool puis applique les migrations SQL de `server/migrations/` (`sqlx::migrate!`). Il n’y a pas de compte applicatif créé par ces migrations : le premier compte vient de l’assistant.

Les limites de pool par défaut sont `ELIDUNE_DATABASE__MAX_CONNECTIONS=10` et `ELIDUNE_DATABASE__MIN_CONNECTIONS=2`.

## Premier compte administrateur

Aucun administrateur n’est livré. Tant que la base n’a ni utilisateur ni ligne `settings`, `GET /api/v1/health` indique qu’une première configuration est nécessaire, et l’interface ouvre `/first-setup`.

L’assistant envoie `POST /api/v1/first_setup` (réponse 201, jeton JWT, redirection vers `/home`). Quatre étapes :

1. Introduction.
2. Bibliothèque : nom ou ville, pays obligatoire, fuseau horaire lorsque le pays en demande un, adresse, e-mail et téléphones facultatifs.
3. Administrateur : identifiant, mot de passe (8 caractères au minimum), prénom, nom, sexe, date de naissance, e-mail facultatif, langue du compte (`fr`, `en`, `de`, `es`). Le compte est créé avec le type `admin`. Le type de public `adult` est utilisé s’il existe après les migrations.
4. SMTP facultatif. Ignorer l’étape laisse la configuration fichier. L’enregistrement n’est accepté que si `email.overridable` est vrai (c’est le cas du modèle).

Un second appel reçoit 409. La route partage le quota d’authentification : 30 requêtes par minute et par adresse IP, rafale 30, par défaut.

## Reverse proxy et HTTPS

L’application ne termine pas TLS. Le guide [docs/reverse-proxy.md](https://github.com/elidune/elidune/blob/dev/docs/reverse-proxy.md) donne des exemples nginx et Apache. Pour l’image tout-en-un, les amonts habituels sont l’API sur `127.0.0.1:8282` et l’interface sur `127.0.0.1:8181`.

nginx, chemins séparés (extrait du guide, certificats Let’s Encrypt à adapter) :

```nginx
upstream elidune_api { server 127.0.0.1:8282; }
upstream elidune_gui { server 127.0.0.1:8181; }

server {
    listen 443 ssl http2;
    server_name bibliotheque.exemple.org;

    ssl_certificate     /etc/letsencrypt/live/bibliotheque.exemple.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bibliotheque.exemple.org/privkey.pem;

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

Le port 80 du guide renvoie vers HTTPS (`return 301 https://$host$request_uri;`).

Quand un proxy hôte est le pair TCP de l’API, l’ajouter à `ELIDUNE_SERVER__TRUSTED_PROXIES` (CIDR séparés par des virgules). Sans cela, l’API ignore `X-Forwarded-For` et compte l’adresse du proxy pour les quotas. `ELIDUNE_SERVER__PUBLIC_BASE_URL` est l’origine publique de l’interface, sans barre finale. Vide, aucun e-mail de réinitialisation de mot de passe n’est envoyé.

Si le navigateur appelle l’API sur une autre origine, renseigner `ELIDUNE_SERVER__CORS_ORIGINS` avec un tableau JSON, par exemple `["https://bibliotheque.exemple.org"]`.

## Mises à jour et migrations

1. Sauvegarder les volumes ou un dump SQL (section suivante).
2. Choisir une étiquette (`:latest`, `:dev` ou un SHA) dans `ELIDUNE_IMAGE` / `ELIDUNE_UI_IMAGE`.
3. `docker compose … pull` puis `docker compose … up -d`.
4. Au démarrage, l’API applique les migrations encore en attente.

Le dépôt ne contient plus qu’un fichier, `server/migrations/001_initial_schema.sql`. Une base neuve n’enregistre que la version 1. Une base qui a déjà appliqué l’ancienne chaîne `002` à `072` doit réaligner `_sqlx_migrations` **une fois**, avant de déployer un binaire qui ne livre que `001` :

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f server/database/reset_sqlx_migrations.sql
```

La commande se lance depuis la racine du dépôt logiciel. Depuis `server/`, le chemin relatif du README est `database/reset_sqlx_migrations.sql`. Ne pas lancer ce script sur une base neuve. Le détail est dans [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md), section « Squashed migrations ».

Ce fichier insère des identifiants explicites (`sites`, `public_types`, `public_type_loan_settings`, `loans_settings`, `fine_rules`, `z3950servers`) sans `setval`. Le premier `INSERT` qui laisse PostgreSQL choisir l’identifiant reprend `1` et répond HTTP 500 (`database_error`, contrainte `23505`). `nextval` n’est pas annulé : une seconde tentative obtient l’identifiant suivant. Pour aligner une séquence sur le maximum déjà présent :

```sql
SELECT setval(pg_get_serial_sequence('sites', 'id'), (SELECT MAX(id) FROM sites));
```

La même forme vaut pour les autres tables de la liste.

Le guide Docker demande de prévoir un arrêt et de tester la restauration sur une copie avant une montée de version.

## Sauvegardes et restauration

Deux mécanismes existent.

**Dump SQL (compte administrateur).** Dans Paramètres, onglet Serveur, sous-onglet Base de données, l’interface appelle `GET /api/v1/maintenance/database/dump`. Le serveur lance `pg_dump --clean` (sans propriétaire ni ACL) et exige les outils client PostgreSQL. La restauration, `POST /api/v1/maintenance/database/restore`, envoie ce SQL (limite 512 Mio) et l’exécute avec `psql -f`. Un dump `--clean` contient des `DROP` : l’opération est destructive. Le commentaire d’API conseille une fenêtre de maintenance et un redémarrage si des connexions échouent pendant la restauration.

**Volumes Docker.** Le guide Docker donne cet exemple pour le volume PostgreSQL de l’image tout-en-un :

```bash
docker run --rm -v elidune-postgres-data:/data -v "$(pwd):/backup" alpine \
  tar czf /backup/postgres-backup.tgz -C /data .
```

Redis (`elidune-redis-data`) et Meilisearch (`elidune-meili-data`) sont des volumes distincts. Après une restauration PostgreSQL, une réindexation Meilisearch se lance depuis l’onglet Catalogue du serveur (`POST /api/v1/admin/reindex-search`, administrateur).

## Voir aussi

- [Premiers pas](/fr/documentation/getting-started/)
- [Dépannage](/fr/documentation/troubleshooting/)
- [Développeurs](/fr/documentation/developers/) pour lancer l’API et l’interface sans Docker
