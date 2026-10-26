---
title: Statistiques
description: Écrans catalogue, lecteurs et prêts, et requête avancée.
navTitle: Statistiques
order: 40
section: features
draft: false
locale: fr
---

`/stats` suit le module `stats` et le catalogue interne. Quatre onglets : catalogue, lecteurs, évolution des prêts, requête avancée. `GET /api/v1/stats` exige le droit de lecture sur les exemplaires. La requête avancée (`GET /api/v1/stats/schema`, `POST /api/v1/stats/query`) est réservée à un compte `librarian` ou `admin`.

Les compteurs de fréquentation (`visitor_counts`) ont une API `GET` et `POST /api/v1/visitor-counts`, avec le droit de lecture des paramètres, et un interrupteur dans Modules. L’interface ne leur consacre pas d’écran.

## Catalogue, lecteurs, prêts

L’onglet catalogue interroge `GET /api/v1/stats/catalog` et peut ventiler par année, par site (réponse `bySource`, libellé `siteName`) et par type de média ou de public.

L’onglet lecteurs interroge `GET /api/v1/stats/users` (classements, agrégats, année). L’onglet prêts interroge `GET /api/v1/stats/loans`. Un compte qui n’est pas administrateur est limité à ses propres lignes sur les statistiques de prêts. L’administrateur voit l’ensemble, ou filtre par lecteur.

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
