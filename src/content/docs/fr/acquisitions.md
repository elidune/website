---
title: Acquisitions et suggestions
description: Fournisseurs, budgets, bons de commande et suggestions d’achat.
navTitle: Acquisitions et suggestions
order: 37
section: features
draft: false
locale: fr
---

Le menu Acquisitions n’apparaît que si le droit `acquisitions_rights` vaut `r` ou `w` et si le module est actif. L’écriture (fournisseurs, budgets, commandes) exige `w`. Les types `librarian` et `admin` livrés ont `w`, les autres `n`. Ce droit est distinct du catalogage.

<figure>
<picture>
<source srcset="/screens/fr/dark/acquisitions.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/acquisitions.webp" alt="Écran des acquisitions, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : acquisitions (`acquisitions`).

| Écran | Chemin |
| --- | --- |
| Commandes | `/acquisitions?tab=orders` et la fiche `/acquisitions/orders/{id}` |
| Fournisseurs | `/acquisitions?tab=vendors` |
| Budgets | `/acquisitions?tab=funds` |
| Suggestions | `/acquisitions?tab=suggestions` |

`/acquisitions/orders`, `/acquisitions/vendors`, `/acquisitions/funds` et `/acquisitions/suggestions` redirigent vers ces onglets.

## Fournisseurs, budgets, commandes

L’ordre de travail prévu par les écrans : enregistrer un fournisseur et un budget, puis ouvrir une commande et y ajouter des lignes. La fiche commande est une page distincte.

Les tables `acquisition_vendors`, `acquisition_funds` et `purchase_orders` sont dans `001_initial_schema.sql`. Cette page ne recopie pas le schéma. La réception (`POST /api/v1/acquisitions/orders/{id}/receive`) augmente `quantity_received` et crée les exemplaires physiques.

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
