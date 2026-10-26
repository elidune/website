---
title: Catalogue
description: Notices bibliographiques, recherche, Z39.50 et import MARC dans Elidune.
navTitle: Catalogue
order: 31
section: features
draft: false
locale: fr
---

Une **notice** (biblio) décrit une œuvre ou une édition. Un **exemplaire** (item) est un objet physique rattaché à cette notice. Le personnel catalogue dans `/biblios`. Les lecteurs consultent `/catalog` une fois connectés, ou le catalogue public de la page `/` sans compte. Voir [OPAC](/fr/documentation/opac/).

<figure>
<picture>
<source srcset="/screens/fr/dark/catalogue.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/catalogue.webp" alt="Liste du catalogue, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : liste du catalogue (`catalogue`). La fiche notice a une capture distincte (`record`). L’import MARC en mode dépôt est décrit dans [Dépôts](/fr/documentation/deposits/).

## Créer et modifier

`/biblios/new` crée une notice. `/biblios/{id}` l’affiche, `/biblios/{id}/edit` la modifie. Le droit d’écriture sur les documents (`items_rights` = écriture) est requis. Les comptes `librarian` et `admin` l’ont dans le jeu initial.

Champs usuels : titres, auteurs, ISBN, ISSN de collection, type de média, public, Dewey, série, collection. Un ISBN déjà connu renvoie une demande de confirmation (`duplicate_isbn_needs_confirmation`) avant d’écraser la notice existante.

Types de média reconnus par l’API, en camelCase : `printedText`, `comics`, `periodic`, `video`, `videoDvd`, `videoTape`, `audio`, `audioMusic`, `audioMusicCd`, `audioMusicTape`, `audioNonMusic`, `audioNonMusicCd`, `audioNonMusicTape`, `cdRom`, `images`, `multimedia`, `unknown`. Des codes courts historiques (`b`, `vd`, `p`, etc.) sont encore acceptés à la lecture.

Séries et collections ont leurs propres routes (`/api/v1/series`, `/api/v1/collections`) : nom, titres secondaires, ISSN pour une collection.

La suppression d’une notice demande le même droit d’écriture. L’écran de suppression peut forcer le retrait d’exemplaires encore empruntés.

Export CSV : `GET /api/v1/biblios/export.csv`.

## Recherche

Le personnel cherche dans `/biblios`. Meilisearch (index dont le nom par défaut est `items`) sert la recherche lorsqu’il est joignable. Sinon l’API retombe sur la recherche PostgreSQL. Une réindexation complète est réservée à l’administrateur : `POST /api/v1/admin/reindex-search`, aussi proposé dans Paramètres, Serveur, onglet Catalogue.

## Z39.50

`/z3950` interroge les serveurs enregistrés dans Paramètres. Le résultat peut être importé comme notice (`POST /api/v1/z3950/import`). Les réponses sont mises en cache Redis. La durée par défaut est `ELIDUNE_REDIS__Z3950_CACHE_TTL_SECONDS` = 604800 (7 jours).

Chaque serveur a un hôte, un port, une base et un indicateur d’activation. Le formulaire est dans l’onglet « Serveurs Z39.50 ».

## Import MARC

`/import-iso` envoie un fichier MARC. Les routes associées sont `POST /api/v1/biblios/load-marc` (lecture) et `POST /api/v1/biblios/import-marc-batch` (écriture). Les lots déjà chargés se relisent avec `GET /api/v1/biblios/list-marc-batches` et `GET /api/v1/biblios/marc-batch/{id}`.

Le traducteur MARC vit dans `server/src/marc/`. Le type de média est déduit de la position 6 du Leader.

## Fiche notice

La fiche liste les exemplaires, leur disponibilité et la file de réservation de la notice (`GET /api/v1/biblios/{id}/holds`). L’ajout d’un exemplaire est décrit dans [Exemplaires](/fr/documentation/copies/).
