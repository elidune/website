---
title: Acquisitions et suggestions
description: Fournisseurs, budgets, bons de commande et suggestions d’achat.
navTitle: Acquisitions et suggestions
order: 37
section: features
draft: false
locale: fr
---

Le menu Acquisitions n’apparaît que si le droit `acquisitions_rights` vaut `r` ou `w` (`canViewAcquisitions`). L’écriture (fournisseurs, budgets, commandes) exige `w`. Les migrations mettent `w` pour `librarian` et `admin`, `n` sinon. Ce droit est distinct du catalogage.

| Écran | Chemin |
| --- | --- |
| Commandes | `/acquisitions/orders` et `/acquisitions/orders/{id}` |
| Fournisseurs | `/acquisitions/vendors` |
| Budgets | `/acquisitions/funds` |
| Suggestions | `/acquisitions/suggestions` |

`/acquisitions` redirige vers la liste des commandes.

## Fournisseurs, budgets, commandes

L’ordre de travail prévu par les écrans : enregistrer un fournisseur et un budget, puis ouvrir une commande et y ajouter des lignes. La fiche commande est une page distincte.

Les tables viennent de la migration `032_acquisitions.sql`. Cette page ne recopie pas le schéma.

> **TODO.** Lister les statuts de commande et de ligne réellement proposés par `AcquisitionsOrdersPage.tsx` et le service acquisitions, après relecture de ces fichiers. Ils ne sont pas repris ici pour éviter un libellé inexact.

## Suggestions d’achat

Un lecteur dépose une suggestion depuis son profil (`/profile#suggestions`). Le personnel les traite dans `/acquisitions/suggestions`.

Le filtre par défaut de l’écran affiche le statut `proposed`. Accepter (`POST /api/v1/suggestions/{id}/accept`) peut rattacher la suggestion à une commande. Refuser appelle `POST /api/v1/suggestions/{id}/refuse`.

La page d’accueil du lecteur rappelle ce formulaire lorsqu’il est connecté.
