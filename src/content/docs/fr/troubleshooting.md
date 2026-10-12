---
title: Dépannage
description: Ports occupés, santé de l’API, quotas, SMTP et recherche.
navTitle: Dépannage
order: 61
section: help
draft: false
locale: fr
---

Les commandes Compose se lancent depuis la racine du dépôt logiciel, avec le fichier utilisé à l’installation.

## Le conteneur ne démarre pas

```bash
docker compose -f docker/docker-compose.all-in-one.yml ps
docker compose -f docker/docker-compose.all-in-one.yml logs --tail=200 elidune-all-in-one
```

Pour la pile séparée, le service d’API s’appelle `elidnune-server` :

```bash
docker compose -f docker/docker-compose.yml logs --tail=200 elidnune-server
```

Contrôle HTTP : `GET /api/v1/health`. Le corps indique un état sain, une première configuration nécessaire, ou une base injoignable.

**Variables introuvables.** Lancer `docker compose` dans le dossier qui contient `.env`, ou passer `--env-file`.

**Port déjà pris.** Changer `API_PORT`, `GUI_PORT`, `POSTGRES_PORT`, `REDIS_PORT` ou `MEILI_PORT`, puis `down` et `up -d`. Les ports à l’intérieur de l’image tout-en-un ne changent pas (API 8080, interface 80, PostgreSQL 5432).

**Image GHCR refusée.** `docker login ghcr.io`. L’image doit être lisible pour le compte utilisé.

**Chaîne vide.** Une ligne `QUELQUE_CHOSE=` peut faire échouer la lecture de la configuration. Supprimer la ligne.

**Meilisearch refuse la clé.** En mode production la clé fait au moins 16 caractères. Remplacer `ELIDUNE_MEILISEARCH__API_KEY` et redémarrer pour que `MEILI_MASTER_KEY` suive.

## Connexion et quotas

Une réponse 429 avec `code` égal à `rate_limited` et un en-tête `Retry-After` vient du quota, pas d’un mot de passe faux. Défaut : 30 requêtes d’authentification par minute et par IP. Derrière un reverse proxy, si tous les guichets partagent la même adresse, élargir `ELIDUNE_SERVER__AUTH_IP_PER_MINUTE` ou déclarer le proxy dans `ELIDUNE_SERVER__TRUSTED_PROXIES` pour que l’API lise `X-Forwarded-For`.

Le blocage par identifiant (5 échecs / 15 minutes) se lève avec `DELETE /api/v1/auth/rate-limit/{login}` par un personnel qui a l’écriture sur les usagers.

## E-mail

Pas de message de réinitialisation : vérifier `ELIDUNE_SERVER__PUBLIC_BASE_URL`, l’hôte SMTP, l’expéditeur, et que la section e-mail est surchargeable si les valeurs viennent de l’interface. L’essai est `POST /api/v1/admin/config/email/test`.

## Recherche vide après import

Meilisearch indexe à part de PostgreSQL. Après un import important ou une restauration SQL, lancer la réindexation (Paramètres, Serveur, Catalogue). Si Meilisearch est arrêté, l’API cherche dans PostgreSQL.

## Restauration SQL

Le dump est du SQL `pg_dump --clean`. Le restaurer écrase la base. Limite d’envoi : 512 Mio. `pg_dump` doit être installé dans l’image (les Dockerfiles du dépôt ajoutent le client PostgreSQL). Si des connexions restent ouvertes après la restauration, redémarrer le conteneur de l’API.
