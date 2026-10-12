---
title: Prêts et retours
description: Guichet de prêt et de retour, prolongations, retards et exceptions de circulation.
navTitle: Prêts et retours
order: 34
section: features
draft: false
locale: fr
---

L’écran est `/loans`. Il est réservé aux comptes `librarian` et `admin` (droit `loans_rights` en écriture). Le droit de réservation ne suffit pas pour prêter ou rendre.

Quatre onglets : prêt, retour, retards, réclamations.

<figure>
<picture>
<source srcset="/screens/fr/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/desk.webp" alt="Image de remplacement du bureau des prêts, thème clair." width="1440" height="900" />
</picture>
</figure>

Emplacement de capture : bureau des prêts (`desk`).

## Prêter

1. Choisir l’usager (recherche ou code-barres de carte).
2. Scanner le code-barres de l’exemplaire. `POST /api/v1/loans` crée le prêt. Un seul prêt actif par exemplaire.

Le serveur calcule la date de retour à partir de la durée du type de média et du type de public (voir [Premiers pas](/fr/documentation/getting-started/)). Si `skip_closed_days` est vrai, la date tombe le prochain jour d’ouverture.

Refus habituels, en HTTP 422 :

- plafond de prêts atteint ;
- exemplaire non empruntable, en transit, perdu, abîmé, ou sorti du fonds ;
- exemplaire déjà prélevé ou mis de côté pour une autre réservation (`item_to_pick_for_other`) ;
- solde d’amendes impayées au-dessus du seuil.

`force=true`, réservé au personnel, lève une partie de ces blocages. Forcer un exemplaire affecté à une réservation `to_pick` libère cette affectation au lieu d’annuler la place du réservataire.

Un prêt par lot existe : `POST /api/v1/loans/batch-create`.

## Rendre

Onglet Retour : le champ code-barres garde le focus pour une douchette. `POST /api/v1/loans/items/{code-barres}/return` clôt le prêt.

Si une réservation de la même notice attend un exemplaire, le retour ne le remet pas simplement en rayon. Il le passe à « prêt à retirer », ou il ouvre un transit. Voir [Réservations](/fr/documentation/holds/).

Retour par lot : `POST /api/v1/loans/batch-return`.

## Prolonger

Le lecteur prolonge son propre prêt dans `/my-loans`. Le personnel prolonge depuis le guichet. `POST /api/v1/loans/{id}/renew`.

Conditions lues dans les règles :

- le nombre de prolongations restantes n’est pas épuisé ;
- la date du jour est dans la fenêtre (`renew_window_days` avant l’échéance), ou le prêt est déjà en retard ;
- l’ancrage `at_due_date` ou `now` fixe la nouvelle échéance ;
- les mêmes blocages que le prêt (amende, désherbage) s’appliquent. `force` est réservé au droit d’écriture sur les prêts.

La date affichée après prolongation est celle renvoyée par le serveur.

## Retards et exceptions

L’onglet Retards liste `GET /api/v1/loans/overdue`. Chaque ligne peut être rendue ou prolongée.

Exceptions sur un prêt, toutes avec le droit d’écriture :

| Action | Route |
| --- | --- |
| Perdu | `POST /api/v1/loans/{id}/lost` |
| Abîmé | `POST /api/v1/loans/{id}/damaged` |
| Déclaré rendu par le lecteur | `POST /api/v1/loans/{id}/claimed-returned` |
| Clore cette déclaration | `POST /api/v1/loans/{id}/claims-returned/resolve` |

La liste des déclarations ouvertes est `GET /api/v1/loans/claims-returned`.

L’envoi manuel des relances de retard est réservé à l’administrateur : `POST /api/v1/loans/send-overdue-reminders`. Le planning automatique est dans [Relances et amendes](/fr/documentation/reminders-fines/).
