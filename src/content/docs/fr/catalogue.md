---
title: Catalogue
description: Notices, recherche, Z39.50 et import MARC, pour le personnel de bibliothèque.
navTitle: Catalogue
order: 31
section: features
draft: false
locale: fr
---

Une **notice** décrit une œuvre ou une édition. Un **exemplaire** est l’objet physique rattaché à cette notice. Le personnel catalogue dans le menu Catalogage. Un lecteur connecté consulte le catalogue de son espace. Le catalogue de la page d’accueil ne demande pas de compte. Voir [OPAC](/fr/documentation/opac/).

![Liste du catalogue, thème clair.](screen:catalogue "La liste du catalogue indique la disponibilité de chaque titre.")

![Notice d’un titre, thème clair.](screen:record "La notice liste les exemplaires et leur état.")

L’import MARC de documents déposés est décrit dans [Dépôts](/fr/documentation/deposits/).

## Créer et modifier

Créer une notice, l’ouvrir, ou la modifier, demande le droit de modifier le catalogue. Les comptes bibliothécaire et administrateur l’ont dans le jeu livré.

Champs usuels : titres, auteurs, ISBN, ISSN de collection, type de document, public, indice Dewey, série, collection. Un ISBN déjà connu demande une confirmation avant d’écraser la notice existante.

Les types de document proposés couvrent le livre, la bande dessinée, le périodique, la vidéo et le DVD, la cassette vidéo, la musique et les autres enregistrements sonores, le cédérom, les images, le multimédia, et un type inconnu. D’anciens codes courts restent lisibles.

Séries et collections ont leur propre fiche : nom, titres secondaires, et un ISSN pour une collection.

Supprimer une notice demande le même droit d’écriture. La suppression est refusée s’il reste un exemplaire ou une réservation. Forcer n’enlève pas ce refus.

Un export du catalogue au format tableur est proposé au personnel autorisé à lire le catalogue.

## Recherche

Le personnel cherche dans la liste du catalogue. Le moteur de recherche répond lorsqu’il est joignable. Sinon la recherche utilise la base. Une réindexation complète est réservée à l’administrateur : Paramètres, Serveur, onglet Catalogue.

## Z39.50

L’écran de recherche interroge les serveurs enregistrés dans Paramètres. Un résultat peut être importé comme notice. Les réponses sont mises en cache pendant sept jours par défaut.

Chaque serveur a une adresse, un port, une base et un interrupteur d’activation. Le formulaire est dans l’onglet « Serveurs Z39.50 », visible lorsque le module est actif.

## Import MARC

L’écran d’import envoie un fichier ISO 2709 ou MARCXML. Charger le fichier pour le relire demande le droit de lecture du catalogue. Enregistrer le lot dans le catalogue demande le droit d’écriture. Les lots déjà chargés peuvent être rouverts.

Le type de document est déduit de la notice MARC. Le mode dépôt, qui rattache les exemplaires à un lot reçu d’un prêteur, est décrit dans [Dépôts](/fr/documentation/deposits/).

## Fiche notice

La fiche liste les exemplaires, leur disponibilité et la file de réservation de la notice. Ajouter un exemplaire est décrit dans [Exemplaires](/fr/documentation/copies/).
