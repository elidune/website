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

### Statuts de commande

`PurchaseOrderStatus`, avec les libellés de l’interface :

| Code | Libellé |
| --- | --- |
| `draft` | Brouillon |
| `ordered` | Commandée |
| `partial` | Partielle |
| `received` | Réceptionnée |
| `cancelled` | Annulée |

Seul le brouillon se modifie et se soumet. La soumission exige un fournisseur et au moins une ligne, puis enregistre le statut `ordered`. Le montant engagé (`committed`) d’un fonds additionne, pour les commandes `ordered` et `partial`, la quantité encore non reçue multipliée par le prix unitaire.

L’annulation concerne un brouillon, ou une commande `ordered` dont aucune ligne n’a de quantité reçue. Une réception déjà enregistrée bloque l’annulation.

La réception concerne `ordered` ou `partial`. Elle augmente `quantity_received` de chaque ligne reçue. S’il ne reste aucune ligne avec `quantity_received` inférieur à `quantity_ordered`, le statut devient `received`. Sinon il devient `partial`.

Les lignes n’ont pas d’énumération de statut. Chaque ligne porte `quantity_ordered`, `quantity_received`, `unit_price`, une devise et une intention. La devise est un code ISO de trois lettres. Absente à la saisie, elle vaut `EUR` (`normalize_currency`). L’intention exige au moins une notice (`biblio_id`), un ISBN ou un titre.

Les exemplaires physiques sont créés à la réception. Un exemplaire est empruntable lorsque le code-barres, le site et le prix sont renseignés. Le prix peut être reporté (`price_deferred`, libellé « Prix reporté ») : le code-barres et le site suffisent alors. Sans ces conditions, l’exemplaire n’est pas empruntable.

## Suggestions d’achat

Un lecteur dépose une suggestion depuis son profil (`/profile#suggestions`). Le personnel les traite dans `/acquisitions/suggestions`.

Le filtre par défaut de l’écran affiche le statut `proposed` (« Proposée »). Accepter (`POST /api/v1/suggestions/{id}/accept`, libellé « Acceptée ») peut rattacher la suggestion à une commande. Refuser appelle `POST /api/v1/suggestions/{id}/refuse` (libellé « Refusée »).

La page d’accueil du lecteur rappelle ce formulaire lorsqu’il est connecté.
