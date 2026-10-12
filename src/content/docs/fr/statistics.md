---
title: Statistiques
description: Écrans catalogue, usagers et prêts, et requête avancée.
navTitle: Statistiques
order: 40
section: features
draft: false
locale: fr
---

`/stats` est réservé au personnel (`librarian` ou `admin`). Quatre onglets : catalogue, usagers, prêts, avancé.

## Catalogue, usagers, prêts

L’onglet catalogue interroge `GET /api/v1/stats/catalog` et peut ventiler par année, par source et par type de média ou de public.

L’onglet usagers interroge `GET /api/v1/stats/users` (classements, agrégats, année). L’onglet prêts interroge `GET /api/v1/stats/loans`. Un compte qui n’est pas administrateur est limité à ses propres lignes sur les statistiques de prêts. L’administrateur voit l’ensemble, ou filtre par usager.

`GET /api/v1/stats` exige le droit de lecture sur les documents.

## Requête avancée

L’onglet avancé envoie `POST /api/v1/stats/query`. Le corps est en camelCase.

- `filters` : liste de conditions combinées par ET.
- `filterGroups` : tableaux combinés par OU, chaque tableau interne par ET. Au plus 16 groupes, 32 filtres par groupe, 128 clauses au total.
- `unionWith` : aujourd’hui, `loans` avec `loans_archives` seulement. Le champ calculé `loans.union_source` ne s’utilise que dans ce cas.
- Les champs marqués calculés dans `GET /api/v1/stats/schema` servent au choix des colonnes, aux regroupements et aux filtres. Ils ne servent pas d’agrégat ni de découpage temporel.

Exemples de champs calculés sur `users` : `age_band` (`0-17`, `18-29`, `30-49`, `50-64`, `65+`), `age_band_3` (`0-14`, `15-64`, `65+`), `sex_label`. La colonne `sex` stocke `m`, `f`, ou null.

Après une [anonymisation](/fr/documentation/administration/), les comptes de prêts actifs ne suivent plus la personne. Les archives gardent ces dimensions (`age_band`, `loan_year`, type de public, ville, type de compte), pas l’identité.

Le guide du dépôt `docs/README-stats-frontend.md` décrit le corps de requête en détail. Cette page ne le remplace pas.
