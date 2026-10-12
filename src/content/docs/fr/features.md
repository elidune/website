---
title: Fonctionnalités
description: "Plan des guides par domaine : catalogue, circulation, acquisitions, OPAC, statistiques, sites et langues."
navTitle: Vue d’ensemble
order: 30
section: features
draft: false
locale: fr
---

Chaque domaine a sa page. Les chemins cités sont ceux de l’interface React, servie sur la même origine que l’API `/api/v1`.

## Au guichet et dans les rayons

- [Catalogue](/fr/documentation/catalogue/) : notices, Z39.50, import MARC, recherche.
- [Exemplaires](/fr/documentation/copies/) : codes-barres, cotes, disponibilité, inventaire.
- [Lecteurs](/fr/documentation/patrons/) : comptes, abonnement, responsable légal.
- [Prêts et retours](/fr/documentation/circulation/) : guichet, prolongations, exceptions.
- [Réservations](/fr/documentation/holds/) : file par notice, prélèvement, retrait.
- [Relances et amendes](/fr/documentation/reminders-fines/) : e-mails de retard et barème.
- [Désherbage](/fr/documentation/weeding/) : candidat, sortie du fonds.

## Autour du catalogue

- [Acquisitions et suggestions](/fr/documentation/acquisitions/) : fournisseurs, budgets, commandes, suggestions.
- [OPAC](/fr/documentation/opac/) : catalogue public sans compte, et espace lecteur.
- [Statistiques](/fr/documentation/statistics/) : catalogue, usagers, prêts, requête avancée.
- [Multi-sites](/fr/documentation/sites/) : sources, retraits, transits.
- [Langues](/fr/documentation/languages/) : interface et langue de la notice.

Le menu latéral ajoute aussi **Événements** (`/events`, gestion `/events/manage` pour le personnel) : annonces, audiences et consentement d’envoi. Cette documentation ne décrit pas encore le détail de ces écrans.

> **TODO.** Décrire les événements (audiences, consentement, désinscription `/events/unsubscribe`) à partir de `docs/` et des pages `EventsPage` / `PublicEventsPage`, sans extrapoler le contenu des modèles d’e-mail.
