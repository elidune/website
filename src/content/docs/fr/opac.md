---
title: OPAC
description: Catalogue public sans compte, disponibilité, et espace du lecteur connecté.
navTitle: OPAC
order: 39
section: features
draft: false
locale: fr
---

Le catalogue public est sur la page de connexion `/`, sans jeton. La recherche appelle `GET /api/v1/opac/biblios` (texte libre, type de média, page de 20 notices). La fiche appelle `GET /api/v1/opac/biblios/{id}` et `GET /api/v1/opac/biblios/{id}/availability`.

Les filtres proposés sur cet écran : tous les supports, livre (`printedText`), DVD (`videoDvd`), revue (`periodic`), bande dessinée (`comics`).

La disponibilité publique indique le site (`sourceName`) et le nombre de réservations en attente. Elle ne donne ni le nom du réservataire, ni le statut interne `toSearch` (regroupé avec « indisponible »). Les couvertures passent par `GET /api/v1/covers/isbn/{isbn}`, route publique.

Le même écran liste les événements publics à côté du catalogue. Les horaires et l’adresse viennent de `GET /api/v1/library-info`, également public.

Ces routes publiques sont limitées à 600 requêtes par minute et par adresse IP, rafale 120, par défaut (`ELIDUNE_SERVER__PUBLIC_PER_MINUTE`).

<figure>
<picture>
<source srcset="/screens/fr/dark/opac-loans.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/opac-loans.webp" alt="Page Mes emprunts, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : prêts du lecteur (`opac-loans`). Un exemplaire en prêt expose `expectedReturnDate` (date, fuseau de la bibliothèque) tant que l’échéance n’est pas dépassée. Les exemplaires perdus, manquants, en cours de désherbage ou sortis du fonds sont absents de cette liste.

## Une fois connecté

`/catalog` reprend la recherche pour un compte connecté. Le lecteur ouvre ensuite :

- `/my-loans` pour prolonger un prêt dans la fenêtre autorisée ;
- `/my-holds` pour suivre ou annuler ses réservations ;
- `/profile` pour le mot de passe, la langue, l’historique et les suggestions d’achat.

Poser une réservation depuis le catalogue exige un compte dont le droit de réservation est au moins `own`. Le personnel n’utilise pas cet OPAC pour le prêt : le guichet est [Prêts et retours](/fr/documentation/circulation/).
