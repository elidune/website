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

<figure>
<picture>
<source srcset="/screens/fr/dark/holds.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/holds.webp" alt="Liste des réservations, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : réservations (`holds`).

## Poser une réservation

`POST /api/v1/holds` accepte :

- `biblioId` : réservation de titre (OPAC ou guichet) ;
- `itemId` : le personnel épingle un exemplaire.

Les deux créent la même ligne, sur la même notice. Un lecteur dont le droit `holds_rights` vaut `own` ne peut réserver que pour lui-même. Le personnel (`write`) peut indiquer un autre lecteur. Le droit `read` seul ne crée pas de réservation.

Une seule réservation active (`pending`, `to_pick` ou `ready`) par lecteur et par notice. Chaque réservation active compte pour un dans le plafond `maxActiveHolds` (défaut 20, réglable, avec une dérogation possible sur le type de public).

Le site de retrait (`pickupSiteId`) est un site. Voir [Multi-sites](/fr/documentation/sites/). Deux notes coexistent : `patronNote` (visible du lecteur) et `internalNote` (personnel seulement). L’e-mail `hold_ready` reprend le titre, le code-barres, la date limite et le site de retrait (`pickup_site`), dans le fuseau de la bibliothèque. Il ne reprend pas le site d’origine de l’exemplaire à la place du site de retrait.

## Prélèvement

Dès qu’une réservation de titre trouve un exemplaire en rayon, empruntable, non sorti du fonds, non prêté, non déjà réservé et non en transit, elle le prend. Un exemplaire déjà au site de retrait est préféré. La ligne passe à `to_pick` et l’exemplaire reste en rayon : le lecteur n’est pas encore prévenu.

Sans exemplaire libre, la ligne reste `pending`, dans l’ordre d’arrivée.

`/pick-list` (`GET /api/v1/holds/pick-list`) liste les `to_pick`. Un filtre de site restreint au site actuel de l’exemplaire. Le délai `pickDelayDays` (défaut 2, dans la politique des réservations) signale les lignes en retard. Il n’annule pas la réservation.

« Pas en rayon » (`POST /api/v1/holds/{id}/pick-not-found`) marque l’exemplaire `toSearch` et réaffecte la réservation, ou la remet `pending`. Un scan ultérieur de ce code-barres quitte `toSearch` et suit le circuit normal de retour.

## Quand l’exemplaire revient

Au retour, au scan du guichet :

- même site, ou pas de site de retrait : statut `ready`, notification, délai de retrait ;
- autre site : transit `requested`, la réservation reste allouée. La réception au site de retrait passe la même réservation à `ready`.

Le délai de retrait par défaut est `ELIDUNE_HOLDS__READY_EXPIRY_DAYS` = 7. Passé ce délai, la réservation expire et l’exemplaire est proposé à la suivante.

Annuler une réservation dont l’exemplaire est en transit libère la place et ouvre un transit de retour vers l’origine.

## Écrans

| Écran | Qui |
| --- | --- |
| `/holds` | Personnel : toutes les files |
| `/my-holds` | Lecteur : les siennes, annulation des siennes |
| Fiche notice | File de la notice, ordre d’arrivée |
| `/transits` | Transits d’exemplaires |

`DELETE /api/v1/holds/{id}` annule. Le personnel avec `write` annule n’importe quelle ligne. Un lecteur avec `own` n’annule que les siennes.
