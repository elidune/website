---
title: Premiers pas
description: Connexion, bibliothèque, sites, règles de prêt, première notice, premier lecteur, premier prêt et premier retour.
navTitle: Premiers pas
order: 20
section: start
draft: false
locale: fr
---

Ce parcours suppose [Elidune installé](/fr/documentation/installation/) et l’assistant initial terminé.

## Connexion

La page d’accueil, sans session, montre le formulaire de connexion et, sur le même écran, la recherche du catalogue public. Après une connexion réussie, l’accueil du personnel s’ouvre.

L’identifiant ou l’adresse e-mail, et le mot de passe, suffisent. Si le compte a activé un second facteur, une seconde étape demande le code ou un code de secours.

Mot de passe oublié : le lien « mot de passe oublié », puis le message reçu. Aucun message ne part si l’adresse publique de la bibliothèque est vide. Cinq échecs sur le même identifiant en quinze minutes bloquent temporairement les essais. Ce n’est pas un verrouillage définitif du compte. Un membre du personnel qui peut modifier les lecteurs lève ce blocage depuis la fiche.

Un compte obligé de changer son mot de passe est envoyé vers cet écran avant le reste.

## Bibliothèque

Le menu Paramètres, pour un administrateur, ouvre tous les onglets. Un bibliothécaire ne voit que l’onglet Bibliothèque, aussi accessible par « Ma bibliothèque ».

Cet onglet enregistre le nom, l’adresse, le pays, le fuseau horaire, l’e-mail, les téléphones et les horaires d’ouverture. Le pays est obligatoire dans l’assistant. Les horaires servent notamment à repousser une date de retour au prochain jour ouvert, lorsque ce report est activé (c’est le cas du réglage livré).

## Sites

Un lieu de conservation ou de retrait est un **site**. Dans Paramètres, onglet Gestion des sites : créer un nom, choisir le site par défaut, renommer, archiver, fusionner. La fusion réaffecte les exemplaires et archive les anciens sites.

Chaque exemplaire porte le site où il se trouve. Une réservation peut indiquer un site de retrait. Le déplacement entre sites est décrit dans [Multi-sites](/fr/documentation/sites/).

Sur une installation actuelle, les numéros des lieux sont alignés au démarrage. Sur une base plus ancienne qui n’a pas reçu cette correction, le premier lieu ajouté après le site d’origine peut échouer une fois : enregistrer à nouveau.

## Règles de prêt

Paramètres, onglet « Paramètres des emprunts », compte administrateur :

- une ligne pour tous les supports, et au besoin une ligne par type de document ;
- durée en jours, nombre maximal de prêts, nombre maximal de prolongations ;
- point de départ d’une prolongation : l’échéance actuelle plus la durée, ou le jour de la prolongation plus la durée ;
- fenêtre de prolongation, en jours avant l’échéance (de 0 à 366, 7 par défaut). Un prêt déjà en retard reste prolongeable. La valeur 0 n’autorise la prolongation qu’à partir du jour de l’échéance.

Le jeu livré prévoit 5 prêts, 2 prolongations et 21 jours. Un type de public peut porter une exception (durée, plafonds). Le plafond retenu est calculé par le logiciel : d’abord le maximum du type de public, puis la ligne par défaut des exceptions de ce type, puis la ligne globale.

Le même onglet règle les réservations, les relances et les amendes. Voir [Réservations](/fr/documentation/holds/) et [Relances et amendes](/fr/documentation/reminders-fines/).

Les types de public livrés sont enfant, adulte, scolaire, personnel et senior, avec des âges et des durées d’abonnement modifiables dans l’onglet Types de public.

## Première notice

Menu Catalogage, puis création d’une notice. Le compte doit pouvoir modifier le catalogue. Un bibliothécaire ou un administrateur le peut dans le jeu livré.

La notice porte le titre, les auteurs, l’ISBN, le type de document, la série ou la collection. Un ISBN déjà présent demande une confirmation avant de remplacer la notice existante.

Deux imports évitent la saisie :

- la recherche Z39.50, après avoir enregistré au moins un serveur dans Paramètres ;
- l’import d’un fichier MARC.

La recherche du personnel passe par le moteur de recherche lorsqu’il répond, sinon par la base.

## Premier exemplaire

Depuis la notice, ajouter un exemplaire : code-barres, cote, site, et le fait qu’il soit empruntable. Le détail est dans [Exemplaires](/fr/documentation/copies/).

## Premier lecteur

Menu Circulation, Lecteurs. La création demande l’identité, un identifiant et un type de compte.

Les types livrés sont invité, lecteur, bibliothécaire, administrateur et groupe. Pour une personne qui emprunte, choisir lecteur. Le type de public d’un lecteur est calculé à partir de la date de naissance. Un enfant exige un responsable légal. L’abonnement a une date de fin, ou aucune (sans limite de date). Le code-barres de la carte sert au guichet.

Le lecteur se connecte avec son identifiant, puis ouvre « Mes emprunts ».

## Premier prêt et premier retour

Menu Circulation. Quatre onglets : prêt, retour, retards, réclamations.

**Prêt.** Identifier le lecteur, puis saisir ou scanner le code-barres de l’exemplaire. Le logiciel refuse le prêt si le plafond est atteint, si l’exemplaire est sorti du fonds, déjà réservé pour quelqu’un d’autre, en transit, ou si le solde d’amendes impayées dépasse le seuil. Le personnel peut forcer certains de ces cas. Le champ code-barres reprend le focus pour une douchette.

**Retour.** Onglet Retour, scanner le code-barres. Si une réservation attend cet exemplaire, le retour le marque prêt à retirer, ou ouvre un transit vers le site de retrait. Voir [Réservations](/fr/documentation/holds/).

![Guichet des emprunts, thème clair.](screen:desk "Le guichet montre le lecteur sélectionné et les prêts en cours.")

Le même écran se resserre sur une tablette. Voir [Prêts et retours](/fr/documentation/circulation/).

## Suite

- [Catalogue](/fr/documentation/catalogue/)
- [Lecteurs](/fr/documentation/patrons/)
- [Administration](/fr/documentation/administration/)
