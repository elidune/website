---
title: Déploiement
description: Images Docker, variables, proxy HTTPS, migrations, sauvegardes et reclassement des dépôts.
navTitle: Déploiement
order: 20
section: overview
draft: false
locale: fr
---

Le guide pour le personnel est [Installation](/fr/documentation/installation/). Cette page donne les commandes et les noms exacts, d’après `docker/` et [`docs/README-docker.md`](https://github.com/elidune/elidune/blob/dev/docs/README-docker.md) de la branche `dev`.

Les commandes se lancent depuis la racine du dépôt logiciel. Docker Compose lit `.env` dans le répertoire courant. Une variable vide peut casser la lecture de la configuration : omettre la ligne pour garder la valeur par défaut.

## Deux piles

| | `docker/docker-compose.yml` | `docker/docker-compose.all-in-one.yml` |
| --- | --- | --- |
| Contenu | Interface (nginx), API, PostgreSQL 16, Redis 7, Meilisearch 1.12 | Un conteneur : PostgreSQL 16, Redis, Meilisearch 1.12.0, API, nginx, via Supervisor |
| Images locales | `elidune-ui`, `elidune-server` | `elidune-all-in-one` |
| Ports hôte par défaut | Interface `80`, API `8080`, PostgreSQL `5432`, Redis `6379`, Meilisearch `7700` | PostgreSQL `5433`, Redis `6379`, Meilisearch `7700`, API `8282`, interface `8181` |

L’API écoute en HTTP sur le port 8080 à l’intérieur du conteneur. nginx sert l’interface et transmet `/api`. Dans la pile séparée, le service d’API s’appelle `elidnune-server` (image `elidune-server`). L’interface a l’adresse fixe `172.30.78.10` sur le réseau `172.30.78.0/24`.

## Images publiées

Une poussée vers `main` ou `dev` qui touche le serveur, l’interface ou Docker publie des images sur GHCR (`.github/workflows/docker-publish.yml`).

| Image | Dockerfile | Étiquettes |
| --- | --- | --- |
| `ghcr.io/elidune/elidune-server` | `docker/Dockerfile` | `:latest` et le SHA, sur `main` seulement |
| `ghcr.io/elidune/elidune-ui` | `docker/Dockerfile.ui` | idem |
| `ghcr.io/elidune/elidune-all-in-one` | `docker/Dockerfile.all-in-one` | `:latest` sur `main`, `:dev` sur `dev`, plus le SHA |

Une poussée sur `dev` ne remplace pas `:latest` du serveur ni de l’interface.

## Image tout-en-un

```bash
cp docker/.env.example .env
```

Remplacer au minimum `ELIDUNE_USERS__JWT_SECRET` et `ELIDUNE_MEILISEARCH__API_KEY` (16 caractères au moins : Meilisearch en production refuse une clé plus courte). La même valeur alimente `MEILI_MASTER_KEY`.

```bash
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

PostgreSQL, dans cette image, écoute sur `localhost:5432`. `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` valent `elidune` par défaut et doivent rester alignés avec `ELIDUNE_DATABASE__URL`. Ces valeurs sont celles du fichier Compose, pas un mot de passe de production.

`ELIDUNE_SERVER__TRUSTED_PROXIES` vaut par défaut `127.0.0.1/32,::1/128`. Seules ces adresses peuvent faire accepter `X-Forwarded-For`.

## Pile séparée

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

L’URL de base livrée est `postgres://elidune:elidune@db:5432/elidune`. Les identifiants PostgreSQL sont écrits dans le YAML. Pour la production, les modifier dans ce fichier et aligner `ELIDUNE_DATABASE__URL`.

`ELIDUNE_SERVER__TRUSTED_PROXIES` vaut `172.30.78.10/32` par défaut, afin qu’un accès direct au port API publié ne puisse pas forger `X-Forwarded-For`.

```bash
export ELIDUNE_IMAGE=ghcr.io/elidune/elidune-server:latest
docker login ghcr.io
docker compose -f docker/docker-compose.yml pull elidnune-server
docker compose -f docker/docker-compose.yml up -d --no-build
```

Santé : `curl -sS "http://127.0.0.1:${API_PORT:-8080}/api/v1/health"`. `GET /api/v1/health` indique un état sain, une première configuration nécessaire, ou une base injoignable.

Les volumes nommés des deux piles : `elidune-postgres-data`, `elidune-redis-data`, `elidune-meili-data`.

Le pool SQL livré : `ELIDUNE_DATABASE__MAX_CONNECTIONS=10`, `ELIDUNE_DATABASE__MIN_CONNECTIONS=2`.

## Journaux et ports occupés

```bash
docker compose -f docker/docker-compose.all-in-one.yml logs --tail=200 elidune-all-in-one
docker compose -f docker/docker-compose.yml logs --tail=200 elidnune-server
```

Un port déjà pris se change avec `API_PORT`, `GUI_PORT`, `POSTGRES_PORT`, `REDIS_PORT` ou `MEILI_PORT`, puis `down` et `up -d`. Les ports internes de l’image tout-en-un restent 8080 (API), 80 (interface) et 5432 (PostgreSQL).

## Reverse proxy et HTTPS

L’application ne termine pas TLS. [`docs/reverse-proxy.md`](https://github.com/elidune/elidune/blob/dev/docs/reverse-proxy.md) donne des exemples nginx et Apache. Pour l’image tout-en-un, les amonts habituels sont l’API sur `127.0.0.1:8282` et l’interface sur `127.0.0.1:8181`.

Quand un proxy hôte est le pair TCP de l’API, l’ajouter à `ELIDUNE_SERVER__TRUSTED_PROXIES` (CIDR séparés par des virgules). Sans cela, l’API ignore `X-Forwarded-For` et compte l’adresse du proxy pour les quotas.

`ELIDUNE_SERVER__PUBLIC_BASE_URL` est l’origine publique de l’interface, sans barre finale. Vide, aucun e-mail de réinitialisation de mot de passe n’est envoyé.

Si le navigateur appelle l’API sur une autre origine, `ELIDUNE_SERVER__CORS_ORIGINS` est un tableau JSON, par exemple `["https://bibliotheque.exemple.org"]`.

## Migrations

Au démarrage, l’API applique `server/migrations/` avec `sqlx::migrate!`.

| Fichier | Rôle |
| --- | --- |
| `001_initial_schema.sql` | Schéma complet et données initiales |
| `002_advance_seeded_id_sequences.sql` | Aligne les séquences sur le plus grand identifiant déjà inséré, pour éviter une collision au premier `INSERT` |
| `003_loans_archives_loan_id.sql` | Ajoute `loans_archives.loan_id`, copie de l’identifiant de prêt d’origine |

Une base neuve n’a pas besoin d’autre chose. Le README du serveur mentionne encore un fichier unique : le dépôt livre désormais ces trois fichiers.

Une base qui a déjà appliqué l’ancienne chaîne `002` à `072` doit réaligner `_sqlx_migrations` **une fois**, avant le déploiement d’un binaire dont l’historique commence au schéma regroupé :

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f server/database/reset_sqlx_migrations.sql
```

Ne pas lancer ce script sur une base neuve. Le script efface `_sqlx_migrations` et n’insère que la version 1, avec l’empreinte de `001`. Au démarrage suivant, `002` et `003` s’appliquent. Si `001` change, l’empreinte du script doit être recalculée, comme le commentaire du fichier l’indique. Détail : [`server/README.md`](https://github.com/elidune/elidune/blob/dev/server/README.md), section « Squashed migrations ».

## Sauvegardes

**Dump SQL (administrateur).** `GET /api/v1/maintenance/database/dump` lance `pg_dump --clean` (sans propriétaire ni ACL). `POST /api/v1/maintenance/database/restore` envoie ce SQL (limite 512 Mio) et l’exécute avec `psql -f`. Un dump `--clean` contient des `DROP` : l’opération est destructive. Les images du dépôt embarquent le client PostgreSQL.

**Volume PostgreSQL de l’image tout-en-un :**

```bash
docker run --rm -v elidune-postgres-data:/data -v "$(pwd):/backup" alpine \
  tar czf /backup/postgres-backup.tgz -C /data .
```

Après une restauration PostgreSQL, réindexer : `POST /api/v1/admin/reindex-search` (administrateur), aussi proposé dans Paramètres, Serveur, Catalogue.

## Courrier

| Variable | Défaut Compose |
| --- | --- |
| `ELIDUNE_EMAIL__SMTP_HOST` | vide |
| `ELIDUNE_EMAIL__SMTP_PORT` | 587 |
| `ELIDUNE_EMAIL__SMTP_USERNAME` | vide |
| `ELIDUNE_EMAIL__SMTP_PASSWORD` | vide |
| `ELIDUNE_EMAIL__SMTP_FROM` | vide |
| `ELIDUNE_EMAIL__SMTP_FROM_NAME` | vide dans Compose, « Elidune » dans `sample.toml` |
| `ELIDUNE_EMAIL__SMTP_USE_TLS` | vrai |

Essai : `POST /api/v1/admin/config/email/test`. Le mot de passe n’est pas renvoyé en clair.

Modèles livrés, identifiants : `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`, `hold_ready`, `password_reset`, `2fa_code`, `recovery_code`, `event_announcement`, `inventory_loan_closed`.

## Profil et modules

`ELIDUNE_FEATURES__PROFILE=essential` désactive acquisitions, suggestions d’achat, désherbage, transits, dépôts et compteurs de fréquentation, même si les booléens du même fichier disent le contraire. Événements, inventaire, Z39.50, import MARC et statistiques restent actifs. Un module coupé répond HTTP 403, code `feature_disabled`. Les drapeaux effectifs sont dans `GET /api/v1/library-info`, champ `enabledFeatures`.

## Journal applicatif

`ELIDUNE_LOGGING__LEVEL` (`info` dans Compose), format `pretty`, `plain` ou `json`, sortie `stdout`, `stderr`, `file` ou `syslog`. `RUST_LOG` filtre en plus le traceur Rust (défaut Compose `elidune_server=info,tower_http=info`). En sortie fichier, le chemin et la rotation (`daily` par défaut) sont obligatoires.

Rétention d’audit : `ELIDUNE_AUDIT__RETENTION_DAYS` = 365.

Anonymisation automatique : `ELIDUNE_PRIVACY__AUTO_ANONYMIZE_YEARS_AFTER_EXPIRY`, défaut 0 (tâche arrêtée). La tâche tourne à 04:00 et ignore les prêts encore actifs.

## Reclasser des dépôts

La commande du binaire reclasse des exemplaires dont le prêteur avait été stocké comme un site. Sans `--apply`, la transaction est annulée après le rapport.

```bash
elidune-server reclassify-deposits \
  --config config/default.toml \
  --lender 12 \
  --batch-reference "VILLE-2027-PRINTEMPS" \
  --received-on 2027-03-01 \
  --return-due-on 2027-09-01 \
  --site 3 \
  --from-site 41
```

`--from-site` et `--barcodes` sont exclusifs, et `--from-site` doit différer de `--site`. `--return-due-on` est facultatif (dépôt permanent). Un lot déjà `active` pour cette référence est réutilisé. Un autre statut est refusé.

Refus par exemplaire, sans écriture : `barcode_unknown`, `item_archived`, `item_in_other_batch`, `item_in_transit`. `already_reclassified` est un passage sans seconde ligne d’audit.

Le fichier [`docs/README-deposit-reclassify.md`](https://github.com/elidune/elidune/blob/dev/docs/README-deposit-reclassify.md) nomme encore `--from-source` et `items.source_id`. Le binaire de cette version attend `--from-site` et met à jour `items.site_id`. Le rapport JSON parle de `remaining_on_old_site`.
