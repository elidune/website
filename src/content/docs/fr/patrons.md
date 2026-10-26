---
title: Lecteurs
description: Comptes lecteurs, types de public, abonnement, responsable légal et anonymisation.
navTitle: Lecteurs
order: 33
section: features
draft: false
locale: fr
---

Le menu Lecteurs (`/users`) liste les comptes. La recherche porte sur le nom, le prénom et le code-barres. La fiche est `/users/{id}`. L’ouverture de l’écran suit le droit `users_rights`, pas le seul libellé `librarian`.

<figure>
<picture>
<source srcset="/screens/fr/dark/patrons.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/patrons.webp" alt="Fiche lecteur, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : fiche lecteur (`patrons`). Le nom figure sur la fiche. Il n’est pas repris sur un ticket, une étiquette ou un rapport de lot.

## Créer un compte

Le personnel (`librarian` ou `admin`, droit d’écriture sur les lecteurs) envoie `POST /api/v1/users`. Champs demandés par les écrans : identité, identifiant, mot de passe, type de compte, type de public, coordonnées, date de naissance, langue, code-barres de carte.

Types de compte livrés par les migrations :

| Code | Rôle au guichet |
| --- | --- |
| `reader` | Lecteur. Emprunte et réserve pour lui-même |
| `group` | Compte collectif, mêmes droits de circulation que `reader` après migration |
| `guest` | Invité. Pas de prêt |
| `librarian` | Personnel. Catalogue, lecteurs, prêts. Paramètres limités à la bibliothèque |
| `admin` | Administrateur. Tous les onglets de paramètres |

Le type de compte ne se change qu’avec un compte `admin` (`PUT /api/v1/users/{id}/account-type`). Forcer un changement de mot de passe à la prochaine connexion est aussi réservé à l’administrateur.

Mot de passe : 8 caractères au minimum. Aucune autre règle de complexité n’est appliquée par `validate_password_strength`.

## Type de public et abonnement

Le type de public (enfant, adulte, scolaire, personnel, senior, ou un type ajouté dans Paramètres) porte l’âge, la durée d’abonnement, le tarif et, en option, des plafonds de prêt différents de la règle globale.

La fiche a une date de fin d’abonnement, ou aucune (abonnement sans date de fin). Le bouton Renouveler enregistre une nouvelle date. Le tarif stocké au départ pour `adult` est l’entier `1500`, soit 15,00 €.

`subscription_price` est un entier en centimes (`1500` = 15,00 €). L’écran des types de public saisit et affiche des euros : le libellé est « Prix d'abonnement (€) », l’affichage divise la valeur stockée par 100, et l’enregistrement multiplie le montant saisi par 100. Un appel API ou un `INSERT` dans `public_types.subscription_price` doit envoyer les centimes (`1500` pour 15,00 €).

Un type de public `child` ne peut pas être inscrit sans responsable légal (`user_guardians`). Le sélecteur est sur la fiche. Le responsable ne peut pas lui-même être `child` ou `school`.

Pour un compte `reader`, le type de public est dérivé de la date de naissance et des bornes `age_min` / `age_max`. Aucune borne ne correspond : la réponse est `no_public_type_for_age`. Un type de compte personnalisé n’est pas dérivé ainsi.

L’onglet Amendes de la fiche liste les charges lorsque le droit de lecture sur les lecteurs est présent. Voir [Relances et amendes](/fr/documentation/reminders-fines/).

Une carte déclarée perdue (`users.card_lost`) bloque le prêt. Le remplacement retire l’ancien numéro. Le détail des routes est dans [Prêts et retours](/fr/documentation/circulation/).

## Ce que le lecteur voit

Connecté, le lecteur ouvre :

- Mes emprunts, `/my-loans` : prêts en cours, prolongation lorsque la fenêtre de renouvellement le permet ;
- Mes réservations, `/my-holds`, si le droit de réservation du compte est `own` ou plus ;
- Mon profil, `/profile` : coordonnées, langue, mot de passe, suggestions d’achat, préférence d’historique.

L’historique de prêts (`GET /api/v1/users/{id}/history`) est lisible par le titulaire ou le personnel. La préférence qui le conserve ou non se modifie par le titulaire ou un administrateur.

## Anonymiser

L’action « Anonymiser pour les stats » appelle `DELETE /api/v1/users/{id}`. Le détail des colonnes effacées et de ce qui reste pour les statistiques est dans [Administration](/fr/documentation/administration/).
