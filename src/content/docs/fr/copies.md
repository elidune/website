---
title: Exemplaires
description: Exemplaires physiques, code-barres, cote, disponibilité et inventaire.
navTitle: Exemplaires
order: 32
section: features
draft: false
locale: fr
---

Un exemplaire est un **item** : un objet prêté, rattaché à une notice. L’ancien mot « specimen » ne doit plus servir dans la documentation ni dans le code nouveau.

## Créer

Depuis la fiche notice, le personnel ajoute un exemplaire (`POST /api/v1/biblios/{id}/items`). Les champs utilisés au guichet sont le code-barres, la cote, la source (le site), et le fait que l’exemplaire soit empruntable. Un code-barres déjà présent demande une confirmation.

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

Le catalogue public ne montre ni le motif de désherbage, ni le nom du réservataire.

## Modifier et supprimer

`PUT /api/v1/items/{id}` met à jour la fiche. Le désherbage n’y passe pas : il a sa route, décrite dans [Désherbage](/fr/documentation/weeding/). `DELETE /api/v1/items/{id}` supprime l’exemplaire. Un exemplaire emprunté exige une confirmation de forçage.

## Inventaire

`/inventory` (personnel) ouvre une session d’inventaire. Le périmètre peut viser une source. Les routes `/api/v1/inventory` exigent un compte `librarian` ou `admin`.

Pendant l’inventaire, un prêt encore ouvert peut être clos. Un modèle d’e-mail `inventory_loan_closed` existe en français et en anglais pour ce cas.

> **TODO.** Décrire le déroulement exact d’une session (création, scan, clôture) à partir de `InventoryPage.tsx` et de `server/src/api/inventory.rs`, écran par écran. Cette page ne le fait pas encore.
