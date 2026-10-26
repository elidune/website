---
title: Lecteurs
description: Comptes, types de public, abonnement, responsable légal et anonymisation.
navTitle: Lecteurs
order: 33
section: features
draft: false
locale: fr
---

Le menu Lecteurs liste les comptes. La recherche porte sur le nom, le prénom et le code-barres. L’ouverture de l’écran suit le droit de consulter les lecteurs, pas seulement le titre « bibliothécaire ».

![Fiche lecteur, thème clair.](screen:patrons "La fiche montre le type de public et le responsable légal. Le nom n’est pas repris sur un ticket.")

Le nom figure sur la fiche. Il n’est pas repris sur un ticket, une étiquette ou un rapport de lot.

## Créer un compte

Le personnel qui peut modifier les lecteurs crée le compte. Les écrans demandent l’identité, un identifiant, un mot de passe, le type de compte, le type de public, les coordonnées, la date de naissance, la langue et le code-barres de la carte.

| Type livré | Rôle au guichet |
| --- | --- |
| Lecteur | Emprunte et réserve pour lui-même |
| Groupe | Compte collectif, mêmes droits de circulation qu’un lecteur |
| Invité | Pas de prêt |
| Bibliothécaire | Catalogue, lecteurs, prêts. Paramètres limités à la bibliothèque |
| Administrateur | Tous les onglets de paramètres, y compris les dérogations de prêt |

Changer le type de compte d’une personne, ou exiger un nouveau mot de passe à la prochaine connexion, est réservé à l’administrateur.

Le mot de passe compte au moins 8 caractères. Aucune autre règle de complexité n’est imposée.

## Type de public et abonnement

Le type de public (enfant, adulte, scolaire, personnel, senior, ou un type ajouté dans Paramètres) porte l’âge, la durée d’abonnement, le tarif et, en option, des plafonds de prêt différents de la règle globale.

La fiche a une date de fin d’abonnement, ou aucune (abonnement sans date de fin). Le bouton Renouveler enregistre une nouvelle date.

Les montants d’abonnement sont saisis en euros. Le logiciel les conserve en centimes. Le tarif livré pour l’adulte est 15,00 €. Voir aussi [Relances et amendes](/fr/documentation/reminders-fines/).

Un enfant ne peut pas être inscrit sans responsable légal. Le sélecteur est sur la fiche. Le responsable ne peut pas lui-même être un enfant ou un scolaire.

Pour un compte lecteur, le type de public est déduit de la date de naissance et des bornes d’âge. Si aucune borne ne correspond, l’enregistrement est refusé. Un type de compte personnalisé n’est pas déduit ainsi.

L’onglet Amendes de la fiche liste les charges lorsque le droit de lire les lecteurs est présent.

Une carte déclarée perdue bloque le prêt. Le remplacement retire l’ancien numéro et en donne un nouveau. Ces deux actions n’ont pas de bouton dans l’interface de cette version : le personnel les prépare avec l’administrateur, le détail est dans la [référence d’API](/fr/dev/api/). Les retours et le paiement des amendes restent possibles avec une carte perdue. Voir [Prêts et retours](/fr/documentation/circulation/).

## Ce que le lecteur voit

Une fois connecté, le lecteur ouvre :

- Mes emprunts : prêts en cours, prolongation lorsque la fenêtre le permet ;
- Mes réservations, si le compte peut gérer les siennes ;
- Mon profil : coordonnées, langue, mot de passe, suggestions d’achat, préférence d’historique.

L’historique de prêts est lisible par le titulaire ou le personnel. La préférence qui le conserve ou non se modifie par le titulaire ou un administrateur.

## Anonymiser

L’action « Anonymiser pour les stats » retire l’identité et garde des dimensions non nominatives pour les statistiques. Le détail de ce qui disparaît et de ce qui reste est dans [Administration](/fr/documentation/administration/). L’action est irréversible.
