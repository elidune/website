---
title: Fonctionnalités
description: "Plan des guides par domaine : catalogue, dépôts, circulation, acquisitions, OPAC, statistiques, sites et langues."
navTitle: Vue d’ensemble
order: 30
section: features
draft: false
locale: fr
---

Chaque domaine a sa page. Les chemins cités sont ceux de l’interface React, servie sur la même origine que l’API `/api/v1`. La version décrite est celle de la branche `dev` du dépôt [elidune/elidune](https://github.com/elidune/elidune) (commit `c902e67`, schéma unique `001_initial_schema.sql`).

## Au guichet et dans les rayons

- [Catalogue](/fr/documentation/catalogue/) : notices, Z39.50, import MARC, recherche.
- [Exemplaires](/fr/documentation/copies/) : codes-barres, cotes, états de circulation, notes publiques et internes.
- [Dépôts](/fr/documentation/deposits/) : prêteurs, lots, import MARC en dépôt, retour au prêteur, pertes.
- [Inventaire](/fr/documentation/inventory/) : session, scan, clôture, consolidation.
- [Lecteurs](/fr/documentation/patrons/) : comptes, type de public dérivé de la date de naissance, responsable légal, anonymisation.
- [Prêts et retours](/fr/documentation/circulation/) : guichet, forçage avec motif, exceptions, comptoir sur tablette.
- [Réservations](/fr/documentation/holds/) : file par notice, prélèvement, site de retrait.
- [Relances et amendes](/fr/documentation/reminders-fines/) : trois niveaux d’e-mail, montants en centimes, paiement plafonné au reste dû.
- [Désherbage](/fr/documentation/weeding/) : candidat, sortie du fonds, destination.

## Autour du catalogue

- [Acquisitions et suggestions](/fr/documentation/acquisitions/) : fournisseurs, budgets, commandes, réception, suggestions.
- [OPAC](/fr/documentation/opac/) : catalogue public sans compte, et espace lecteur.
- [Événements](/fr/documentation/events/) : annonces, audiences, consentement, désinscription.
- [Statistiques](/fr/documentation/statistics/) : catalogue, lecteurs, prêts, requête avancée, compteurs de fréquentation.
- [Multi-sites](/fr/documentation/sites/) : sites, retraits, transits.
- [Langues](/fr/documentation/languages/) : interface et langue des messages.

Les modules facultatifs (acquisitions, suggestions, désherbage, transits, dépôts, événements, inventaire, Z39.50, import MARC, statistiques, compteurs de fréquentation) se coupent dans Paramètres, onglet Modules, ou avec `ELIDUNE_FEATURES__PROFILE=essential`. Le profil `essential` désactive acquisitions, suggestions d’achat, désherbage, transits, dépôts et compteurs de fréquentation. Voir [Administration](/fr/documentation/administration/).
