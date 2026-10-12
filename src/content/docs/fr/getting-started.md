---
title: Premiers pas
description: Connexion, bibliothèque, sites, règles de prêt, première notice, premier usager, premier prêt et retour.
navTitle: Premiers pas
order: 20
section: start
draft: false
locale: fr
---

Ce parcours suppose [Elidune installé](/fr/documentation/installation/) et l’assistant initial terminé. L’adresse de connexion est `/`. La route `/login` redirige vers `/`.

## Connexion

La page d’accueil non connectée affiche le formulaire de connexion et, sur le même écran, la recherche du catalogue public. Après une connexion réussie, l’interface ouvre `/home`.

Le corps de `POST /api/v1/auth/login` utilise l’identifiant ou l’e-mail, et le mot de passe. Si le compte a activé un second facteur, l’étape suivante appelle `POST /api/v1/auth/verify-2fa` ou `POST /api/v1/auth/verify-recovery`.

Mot de passe oublié : `/forgot-password`, puis le lien reçu (`/reset-password`). Aucun e-mail ne part si `ELIDUNE_SERVER__PUBLIC_BASE_URL` est vide. Cinq échecs sur le même identifiant en 15 minutes bloquent temporairement les essais. Un membre du personnel qui a le droit d’écriture sur les usagers lève ce blocage depuis la fiche (`DELETE /api/v1/auth/rate-limit/{login}`).

Un jeton dont la portée est limitée au changement de mot de passe envoie vers `/change-password`.

## Bibliothèque

Le menu Paramètres (compte `admin`) ouvre `/settings`. Un compte `librarian` ne voit que l’onglet Bibliothèque, aussi accessible par « Ma bibliothèque ».

L’onglet Bibliothèque enregistre le nom, l’adresse, le pays, le fuseau horaire, l’e-mail, les téléphones et les horaires d’ouverture. Le pays est obligatoire dans l’assistant. Les horaires servent notamment à repousser une date de retour sur le prochain jour ouvert lorsque `[circulation] skip_closed_days` vaut vrai (défaut du fichier `sample.toml`).

## Sites

Dans ce logiciel, un site de conservation ou de retrait est une **source** (`sources`). Paramètres, onglet Sources : créer un nom, choisir la source par défaut, renommer, archiver, fusionner. La fusion réaffecte les exemplaires à la nouvelle source et archive les anciennes.

Chaque exemplaire porte la source où il se trouve. Une réservation peut indiquer un site de retrait, qui est aussi une source. Le transit entre sites est décrit dans [Multi-sites](/fr/documentation/sites/).

## Règles de prêt

Paramètres, onglet « Paramètres des emprunts » (compte `admin`) :

- une ligne par défaut (tous supports) et, au besoin, une ligne par type de document ;
- durée en jours, nombre maximal de prêts, nombre maximal de prolongations ;
- ancrage du renouvellement : `at_due_date` (échéance actuelle plus la durée, défaut en base) ou `now` (jour du renouvellement plus la durée) ;
- fenêtre de renouvellement, en jours avant l’échéance (0 à 366, défaut 7). Un prêt en retard reste prolongeable. La valeur 0 n’autorise le renouvellement qu’à partir du jour de l’échéance.

Les migrations créent une ligne globale : 5 prêts, 2 prolongations, 21 jours. Le type de public peut porter une dérogation (durée, plafonds). Le plafond effectif est calculé par le serveur : d’abord le maximum du type de public, puis la ligne par défaut des dérogations de ce type, puis la ligne globale.

Le même onglet règle la politique des réservations, les relances et les amendes. Voir [Réservations](/fr/documentation/holds/) et [Relances et amendes](/fr/documentation/reminders-fines/).

Les types de public initiaux sont `child`, `adult`, `school`, `staff` et `senior`, avec des bornes d’âge et des durées d’abonnement modifiables dans l’onglet Types de public.

## Première notice

Menu Catalogage, « Catalogue » (`/biblios`), puis création (`/biblios/new`). Le compte doit être `librarian` ou `admin`.

La notice (biblio) porte le titre, les auteurs, l’ISBN, le type de média, la série ou la collection. Un ISBN déjà présent demande une confirmation avant remplacement.

Deux imports évitent la saisie :

- Recherche Z39.50 (`/z3950`), après avoir enregistré au moins un serveur dans Paramètres ;
- Import MARC (`/import-iso`).

La recherche du personnel s’appuie sur Meilisearch (index `items`) lorsqu’il répond, sinon sur PostgreSQL.

## Premier exemplaire

Depuis la notice, ajouter un exemplaire : code-barres, cote, source (site), indicateur « empruntable ». Le vocabulaire du code est **item** pour l’exemplaire physique. Le détail est dans [Exemplaires](/fr/documentation/copies/).

## Premier usager

Menu Circulation, Usagers (`/users`). La création demande l’identité, un identifiant, un type de compte et un type de public.

Les types de compte livrés sont `guest`, `reader`, `librarian`, `admin` et `group`. Pour un lecteur, choisir `reader`. Un type de public `child` exige un responsable légal. L’abonnement a une date de fin, ou aucune (illimité). Le code-barres de la carte sert au guichet.

Le lecteur se connecte avec son identifiant sur `/`, puis voit « Mes emprunts » (`/my-loans`).

## Premier prêt et premier retour

Menu Circulation, Emprunts/Retours (`/loans`). Quatre onglets : prêt, retour, retards, réclamations.

**Prêt.** Identifier l’usager, puis saisir ou scanner le code-barres de l’exemplaire. Le serveur refuse le prêt si le plafond est atteint, si l’exemplaire est sorti du fonds, déjà réservé pour quelqu’un d’autre, en transit, ou si le solde d’amendes impayées dépasse le seuil. Le personnel peut forcer certains de ces cas. Le champ code-barres reprend le focus pour un lecteur de codes.

**Retour.** Onglet Retour, scanner le code-barres (`POST /api/v1/loans/items/{code-barres}/return`). Si une réservation attend cet exemplaire, le retour le marque prêt à retirer ou ouvre un transit vers le site de retrait. Voir [Réservations](/fr/documentation/holds/).

<figure>
<picture>
<source srcset="/screens/fr/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/desk.webp" alt="Image de remplacement du bureau des prêts, thème clair." width="1440" height="900" />
</picture>
</figure>

Emplacement de capture : bureau des prêts (`desk`).

## Suite

- [Catalogue](/fr/documentation/catalogue/)
- [Lecteurs](/fr/documentation/patrons/)
- [Administration](/fr/documentation/administration/)
