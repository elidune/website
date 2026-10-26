---
title: Désherbage
description: Candidat au désherbage, sortie du fonds, et effets sur le prêt et la réservation.
navTitle: Désherbage
order: 38
section: features
draft: false
locale: fr
---

Le désherbage est un statut de l’exemplaire, distinct du prêt, de la perte et de l’archivage. Trois valeurs :

| Statut | Effet |
| --- | --- |
| `onShelf` | En rayon. Circule normalement |
| `candidate` | Candidat. Reste en rayon et peut encore être prêté, prolongé ou réservé |
| `withdrawn` | Sorti du fonds. Plus de prêt, de prolongation ni de réservation |

L’interface le dit ainsi : un candidat reste en rayon. Un exemplaire sorti ne circule plus. La notice reste. Un exemplaire de dépôt répond `deposit_item_not_owned` : il ne se désherbe pas. Voir [Dépôts](/fr/documentation/deposits/).

<figure>
<picture>
<source srcset="/screens/fr/dark/weeding.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/weeding.webp" alt="Liste de désherbage, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : désherbage (`weeding`).

## Changer le statut

Sur la fiche exemplaire, le contrôle de désherbage envoie `POST /api/v1/items/{id}/weeding` avec `status` et un motif facultatif (200 caractères au plus). Ce n’est pas un champ de `PUT /api/v1/items/{id}`.

Le personnel qui gère les exemplaires (`librarian` ou `admin`) utilise ce contrôle.

Quand tous les exemplaires encore présents sont `withdrawn`, la notice est elle-même marquée `withdrawn`. Une réservation de titre est refusée s’il ne reste aucun exemplaire circulable.

## Au guichet

Un prêt, une prolongation ou une réservation sur un exemplaire sorti est refusé. Les messages sont ceux de `weeding.blockedCheckout`, `weeding.blockedRenew` et `weeding.blockedHold`.

Le catalogue public ne publie pas le motif de désherbage.
