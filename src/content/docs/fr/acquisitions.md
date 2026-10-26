---
title: Acquisitions et suggestions
description: Fournisseurs, budgets, bons de commande, réception et suggestions d’achat.
navTitle: Acquisitions et suggestions
order: 37
section: features
draft: false
locale: fr
---

Le menu Acquisitions n’apparaît que si le module est actif et si le compte peut au moins consulter les acquisitions. Créer un fournisseur, un budget ou une commande demande le droit de les modifier. Les types bibliothécaire et administrateur livrés l’ont. Les autres ne l’ont pas. Ce droit est distinct du catalogage.

![Écran des acquisitions, thème clair.](screen:acquisitions "Commandes, fournisseurs et budgets.")

Quatre onglets : commandes (et la fiche d’une commande), fournisseurs, budgets, suggestions.

## Ordre de travail

Enregistrer d’abord un fournisseur et un budget, puis ouvrir une commande et y ajouter des lignes. La fiche commande est une page distincte.

### États d’une commande

| État | Sens |
| --- | --- |
| Brouillon | Encore modifiable |
| Commandée | Envoyée au fournisseur |
| Partielle | Une partie a été reçue |
| Réceptionnée | Tout ce qui était commandé est arrivé |
| Annulée | La commande est abandonnée |

Seul le brouillon se modifie et se soumet. La soumission exige un fournisseur et au moins une ligne. Le montant engagé d’un budget additionne, pour les commandes envoyées ou partielles, la quantité encore non reçue multipliée par le prix unitaire.

L’annulation concerne un brouillon, ou une commande envoyée dont aucune ligne n’a encore été reçue. Une réception déjà enregistrée bloque l’annulation.

La réception concerne une commande envoyée ou partielle. Elle augmente la quantité reçue de chaque ligne traitée et crée les exemplaires physiques. Si chaque ligne est complète, la commande devient réceptionnée. Sinon elle devient partielle.

Chaque ligne porte une quantité commandée, une quantité reçue, un prix unitaire, une devise et ce qu’il faut commander. La devise est un code de trois lettres. Absente à la saisie, elle vaut l’euro. La ligne exige au moins une notice déjà connue, un ISBN, ou un titre.

Un exemplaire créé à la réception est empruntable lorsque le code-barres, le site et le prix sont renseignés. Le prix peut être reporté : le code-barres et le site suffisent alors. Sans ces conditions, l’exemplaire n’est pas empruntable.

## Suggestions d’achat

Un lecteur dépose une suggestion depuis son profil. Le personnel les traite dans l’onglet Suggestions.

Le filtre par défaut montre les suggestions proposées. Accepter peut rattacher la suggestion à une commande. Refuser la classe comme refusée.

La page d’accueil du lecteur rappelle ce formulaire lorsqu’il est connecté.
