---
title: Exemplaires
description: Exemplaires physiques, code-barres, cote, disponibilité et inventaire.
navTitle: Exemplaires
order: 32
section: features
draft: false
locale: fr
---

Un exemplaire est un **item** : un objet prêté, rattaché à une notice.

## Créer

Depuis la fiche notice, le personnel ajoute un exemplaire (`POST /api/v1/biblios/{id}/items`). Les champs utilisés au guichet sont le code-barres, la cote, le site, et le fait que l’exemplaire soit empruntable. Un code-barres déjà présent demande une confirmation.

La réception peut être marquée incomplète : tant qu’elle ne l’est pas, l’exemplaire n’est pas prêtable et ne peut pas être affecté à une réservation.

## Disponibilité

Le serveur calcule un statut. L’interface ne le déduit pas du seul indicateur « emprunté ». Ordre de priorité : en prêt, en transit, réservé, à rechercher, indisponible, disponible.

| Statut | Sens |
| --- | --- |
| `available` | En rayon, prêtable |
| `onLoan` | Sorti en prêt |
| `inTransit` | En transit vers un autre site |
| `onHold` | Affecté à une réservation (`to_pick` ou `ready`) |
| `toSearch` | Introuvable au prélèvement. Le catalogue public regroupe ce cas avec `unavailable` |
| `unavailable` | Réception incomplète, perdu, abîmé, déclaré rendu, ou sorti du fonds |

Le catalogue public omet les exemplaires perdus, manquants, candidats au désherbage et sortis du fonds. Il ne montre ni le motif de désherbage, ni le nom du réservataire, ni la note interne. Une étiquette de rayon ne porte pas le nom du lecteur : l’interface lit `holdFor` sans l’afficher sur l’étiquette.

`public_note` est visible au catalogue public. `internal_note` reste au personnel. Les deux se saisissent sur la fiche. `PUT /api/v1/items/{id}` refuse `circulationStatus` : les états perdu, abîmé, dit rendu, à rechercher et manquant passent par le guichet. Voir [Prêts et retours](/fr/documentation/circulation/).

## Modifier et supprimer

`PUT /api/v1/items/{id}` met à jour la fiche. Le désherbage n’y passe pas : il a sa route, décrite dans [Désherbage](/fr/documentation/weeding/). `DELETE /api/v1/items/{id}` archive l’exemplaire (`archived_at`). Un historique de prêt, de réservation ou d’amende bloque la suppression. Le paramètre `force` est ignoré. Le retrait passe alors par le désherbage.

## Inventaire

Le déroulement d’une session (création, scan, clôture, consolidation) est dans [Inventaire](/fr/documentation/inventory/).
