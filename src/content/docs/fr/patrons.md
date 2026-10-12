---
title: Lecteurs
description: Comptes lecteurs, types de public, abonnement, responsable légal et anonymisation.
navTitle: Lecteurs
order: 33
section: features
draft: false
locale: fr
---

Le menu Usagers (`/users`) liste les comptes. La recherche porte sur le nom, le prénom et le code-barres. La fiche est `/users/{id}`.

## Créer un compte

Le personnel (`librarian` ou `admin`, droit d’écriture sur les usagers) envoie `POST /api/v1/users`. Champs demandés par les écrans : identité, identifiant, mot de passe, type de compte, type de public, coordonnées, date de naissance, langue, code-barres de carte.

Types de compte livrés par les migrations :

| Code | Rôle au guichet |
| --- | --- |
| `reader` | Lecteur. Emprunte et réserve pour lui-même |
| `group` | Compte collectif, mêmes droits de circulation que `reader` après migration |
| `guest` | Invité. Pas de prêt |
| `librarian` | Personnel. Catalogue, usagers, prêts. Paramètres limités à la bibliothèque |
| `admin` | Administrateur. Tous les onglets de paramètres |

Le type de compte ne se change qu’avec un compte `admin` (`PUT /api/v1/users/{id}/account-type`). Forcer un changement de mot de passe à la prochaine connexion est aussi réservé à l’administrateur.

Mot de passe : 8 caractères au minimum. Aucune autre règle de complexité n’est appliquée par `validate_password_strength`.

## Type de public et abonnement

Le type de public (enfant, adulte, scolaire, personnel, senior, ou un type ajouté dans Paramètres) porte l’âge, la durée d’abonnement, le tarif et, en option, des plafonds de prêt différents de la règle globale.

La fiche a une date de fin d’abonnement, ou aucune (abonnement sans date de fin). Le bouton Renouveler enregistre une nouvelle date. Le tarif stocké au départ pour `adult` est l’entier `1500`.

`subscription_price` est un entier en centimes. Le modèle serveur le commente ainsi : « Subscription price in cents (e.g. 1500 = 15.00€) ». L’écran des types de public divise la valeur par 100 pour l’affichage (`toFixed(2)` suivi du signe €) et, à l’enregistrement, multiplie le montant saisi par 100 (`emptyToNullPriceCents`). Le libellé du champ est « Prix d'abonnement (€) ». La valeur de départ `1500` s’affiche donc `15.00€`. Ce signe € est écrit dans l’interface. Aucun champ de code devise ne convertit ce tarif.

Un type de public `child` ne peut pas être inscrit sans responsable légal (`user_guardians`). Le sélecteur est sur la fiche.

## Ce que le lecteur voit

Connecté, le lecteur ouvre :

- Mes emprunts, `/my-loans` : prêts en cours, prolongation lorsque la fenêtre de renouvellement le permet ;
- Mes réservations, `/my-holds`, si le droit de réservation du compte est `own` ou plus ;
- Mon profil, `/profile` : coordonnées, langue, mot de passe, suggestions d’achat, préférence d’historique.

L’historique de prêts (`GET /api/v1/users/{id}/history`) est lisible par le titulaire ou le personnel. La préférence qui le conserve ou non se modifie par le titulaire ou un administrateur.

## Anonymiser

L’action « Anonymiser pour les stats » appelle `DELETE /api/v1/users/{id}`. Le détail des colonnes effacées et de ce qui reste pour les statistiques est dans [Administration](/fr/documentation/administration/).
