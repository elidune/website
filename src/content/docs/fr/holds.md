---
title: Réservations
description: File de réservation par notice, prélèvement en rayon, retrait et expiration.
navTitle: Réservations
order: 35
section: features
draft: false
locale: fr
---

Il n’existe qu’un type de réservation. La file est celle de la **notice**. Un exemplaire précis n’est choisi qu’ensuite. Le déplacement vers un autre site est un transit, pas une seconde sorte de réservation.

![Liste des réservations, thème clair.](screen:holds "La liste montre l’état de chaque réservation et le retrait.")

## Poser une réservation

Deux gestes aboutissent à la même file :

- réserver un titre, depuis l’espace du lecteur ou le guichet ;
- épingler un exemplaire, geste réservé au personnel.

Un lecteur dont le droit de réservation est limité à lui-même ne peut réserver que pour son compte. Le personnel autorisé à modifier les réservations peut indiquer un autre lecteur. Le droit de simple consultation ne crée pas de réservation.

Une seule réservation active (en attente, à prélever ou prête) par lecteur et par notice. Chaque réservation active compte pour un dans le plafond (20 par défaut, réglable, avec une exception possible sur le type de public).

Le site de retrait est un site. Voir [Multi-sites](/fr/documentation/sites/). Deux notes coexistent : une note visible du lecteur, et une note interne au personnel. Le message « réservation prête » reprend le titre, le code-barres, la date limite et le site de retrait, dans le fuseau de la bibliothèque. Il ne remplace pas le site de retrait par le site d’où part l’exemplaire.

## Prélèvement

Dès qu’une réservation de titre trouve un exemplaire en rayon, empruntable, non sorti du fonds, non prêté, non déjà réservé et non en transit, elle le prend. Un exemplaire déjà au site de retrait est préféré. La ligne passe à « à prélever » et l’exemplaire reste en rayon : le lecteur n’est pas encore prévenu.

Sans exemplaire libre, la ligne reste en attente, dans l’ordre d’arrivée.

La liste de prélèvement montre les lignes à prélever. Un filtre de site restreint au site actuel de l’exemplaire. Le délai de prélèvement (2 jours par défaut, dans la politique des réservations) signale les lignes en retard. Il n’annule pas la réservation.

« Pas en rayon » marque l’exemplaire à rechercher et réaffecte la réservation, ou la remet en attente. Un scan ultérieur de ce code-barres quitte l’état « à rechercher » et suit le circuit normal de retour.

## Quand l’exemplaire revient

Au retour, au scan du guichet :

- même site, ou pas de site de retrait : la réservation devient prête, un message part, le délai de retrait commence ;
- autre site : un transit est demandé, la réservation reste affectée. La réception au site de retrait passe cette réservation à « prête ».

Le délai de retrait par défaut est de 7 jours. Passé ce délai, la réservation expire et l’exemplaire est proposé au suivant.

Annuler une réservation dont l’exemplaire est en transit libère la place et ouvre un transit de retour vers l’origine.

## Écrans

| Écran | Qui |
| --- | --- |
| Liste des réservations | Personnel : toutes les files |
| Mes réservations | Lecteur : les siennes, et l’annulation des siennes |
| Fiche notice | File de la notice, dans l’ordre d’arrivée |
| Transits | Déplacements d’exemplaires |

Le personnel autorisé à modifier les réservations annule n’importe quelle ligne. Un lecteur n’annule que les siennes.
