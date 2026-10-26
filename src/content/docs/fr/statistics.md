---
title: Statistiques
description: Écrans catalogue, lecteurs et prêts, requête avancée et compteurs de fréquentation.
navTitle: Statistiques
order: 40
section: features
draft: false
locale: fr
---

L’écran des statistiques suit le module correspondant et le droit de lire le catalogue. Quatre onglets : catalogue, lecteurs, évolution des prêts, requête avancée. La requête avancée est réservée à un bibliothécaire ou à un administrateur.

Les compteurs de fréquentation ont un interrupteur dans Modules. L’interface ne leur consacre pas d’écran. Le détail technique est dans la [référence d’API](/fr/dev/api/).

## Catalogue, lecteurs, prêts

L’onglet catalogue peut ventiler par année, par site et par type de document ou de public.

L’onglet lecteurs montre des classements et des totaux, par année. L’onglet prêts montre l’évolution des prêts. Un compte qui n’est pas administrateur est limité à ses propres lignes sur les statistiques de prêts. L’administrateur voit l’ensemble, ou filtre par lecteur.

## Requête avancée

L’onglet avancé combine des conditions.

- Les conditions d’une liste se combinent toutes ensemble (et).
- Des groupes de conditions se combinent entre eux par « ou ». À l’intérieur d’un groupe, c’est encore « et ». Au plus 16 groupes, 32 conditions par groupe, 128 conditions au total.
- Croiser les prêts en cours et les prêts archivés n’est possible que pour ces deux ensembles.
- Les champs calculés servent au choix des colonnes, aux regroupements et aux filtres. Ils ne servent pas de total ni de découpage dans le temps.

Exemples de champs calculés sur les lecteurs : une tranche d’âge fine (0-17, 18-29, 30-49, 50-64, 65 et plus), une tranche large (0-14, 15-64, 65 et plus), et le libellé du sexe. Le sexe enregistré est masculin, féminin, ou non renseigné.

Après une [anonymisation](/fr/documentation/administration/), les prêts encore ouverts ne suivent plus la personne. Les archives gardent la tranche d’âge, l’année du prêt, le type de public, la ville et le type de compte, pas l’identité.

Le guide technique du dépôt logiciel décrit le corps de la requête. Cette page ne le remplace pas. Voir la [référence d’API](/fr/dev/api/).
