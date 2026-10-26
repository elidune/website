---
title: Prêts et retours
description: Guichet de prêt et de retour, forçage avec motif, états des exemplaires et comptoir sur tablette.
navTitle: Prêts et retours
order: 36
section: features
draft: false
locale: fr
---

L’écran est `/loans`. Il s’ouvre avec le droit `loans_rights` en lecture. Prêter, rendre, prolonger et enregistrer une exception demandent l’écriture. Le menu s’intitule **Circulation**. Le droit de réservation ne suffit pas.

Quatre onglets : prêt, retour, retards, réclamations.

<figure>
<picture>
<source srcset="/screens/fr/dark/desk.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/desk.webp" alt="Guichet des emprunts, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : guichet (`desk`).

## Comptoir sur tablette

En dessous de 1024 px de large, la taille de base du texte passe de 16 px à 14 px. En dessous de 1024 px de large ou de 768 px de haut, le menu latéral se replie en sections. En dessous de 768 px, la liste des prêts en cours s’affiche en cartes plutôt qu’en tableau. Les champs de code-barres du guichet acceptent une douchette et, via `BarcodeScanField`, la caméra de l’appareil.

## Prêter

1. Choisir le lecteur (recherche ou code-barres de carte). Un scan de carte exact passe par `GET /api/v1/users/barcode/{code}` et affiche l’état du compte. La recherche par nom reste `GET /api/v1/users` et exige le droit de lecture sur les lecteurs.
2. Scanner le code-barres de l’exemplaire. `POST /api/v1/loans` crée le prêt. Un seul prêt actif par exemplaire. Le corps peut porter `force` et `overrideReason`.

Le serveur calcule la date de retour à partir de la durée du type de média et du type de public (voir [Premiers pas](/fr/documentation/getting-started/)). Si `skip_closed_days` est vrai, la date tombe le prochain jour d’ouverture. Le prêt enregistre le site où il est fait (`loans.site_id`). Un exemplaire de dépôt peut plafonner cette date : voir [Dépôts](/fr/documentation/deposits/).

### Refus et forçage

Un refus de prêt est un HTTP 422 avec un `code`. Le guichet affiche le message correspondant.

| Code | Forçable | Motif obligatoire |
| --- | --- | --- |
| `subscription_expired` | Oui, si `circulation_override_rights` est en écriture | Oui |
| `item_held_for_other` | Idem | Oui |
| `fines_over_threshold` | Oui, si `loans_rights` est en écriture | Non |
| `max_loans`, `max_media_loans`, `item_not_loanable` | Oui pour tout appel qui envoie `force` | Non |
| `card_lost`, `item_to_pick_for_other`, `deposit_return_due` | Non | — |

Sans motif alors qu’il est exigé, la réponse est `override_reason_required`. Le bouton **Forcer le prêt** de l’interface n’apparaît que si le serveur marque le refus `forceable` et si le compte a l’écriture sur les prêts. Le type `librarian` livré n’a pas `circulation_override_rights` en écriture : seul le type `admin` livré peut forcer un abonnement expiré ou un exemplaire réservé à un autre lecteur, tant que ce droit n’est pas accordé dans Paramètres.

`item_held_for_other` propose aussi **Mettre de côté**, sans quitter le prêt. `item_to_pick_for_other` affiche que l’exemplaire est déjà mis de côté et ne se force pas.

Une carte déclarée perdue bloque le prêt et la prolongation (`card_lost`). Les retours et le paiement des amendes restent possibles. Le bandeau du guichet le dit. L’enregistrement de la perte est `POST /api/v1/users/{id}/card-lost` (écriture lecteurs ou écriture prêts). Le remplacement, qui n’utilise pas l’ancien numéro, est `POST /api/v1/users/{id}/replace-card` (écriture lecteurs). Ces deux actions n’ont pas de bouton dans l’interface de cette version.

Un prêt par lot existe : `POST /api/v1/loans/batch-create`.

## États de l’exemplaire

L’état de circulation est `items.circulation_status`, indépendant de la ligne de prêt.

| Valeur | Code API | Effet |
| --- | --- | --- |
| 0 ou vide | `available` | Empruntable, si les autres règles le permettent |
| 1 | `lost` | Perdu. Absent du catalogue public |
| 2 | `damaged` | Abîmé. Non empruntable |
| 3 | `claimedReturned` | Dit rendu |
| 4 | `toSearch` | À rechercher. Encore listé, indisponible au public |
| 5 | `missing` | Manquant. Absent du catalogue public |

`PUT /api/v1/items/{id}` refuse un champ `circulationStatus`. Les changements passent par les actions du guichet.

Le motif de clôture d’un prêt archivé est `returned` (retour, retour abîmé, ou déclaration « dit rendu » retrouvée) ou `lost` (déclaré perdu, ou déclaration non retrouvée). Si l’exemplaire perdu est retrouvé plus tard, `foundAt` est renseigné. L’interface affiche « Perdu, retrouvé le {date} ».

## Rendre

Onglet Retour : le champ code-barres garde le focus pour une douchette. `POST /api/v1/loans/items/{code-barres}/return` clôt le prêt. Un code qui n’est pas en prêt peut répondre 200 avec une notice d’information (déjà rendu, perdu, à rechercher, etc.) au lieu d’un simple échec.

Si une réservation de la même notice attend un exemplaire, le retour ne le remet pas simplement en rayon. Il le passe à « prêt à retirer », ou il ouvre un transit. Voir [Réservations](/fr/documentation/holds/).

Retour par lot : `POST /api/v1/loans/batch-return`.

## Prolonger

Le lecteur prolonge son propre prêt dans `/my-loans`. Le personnel prolonge depuis le guichet. `POST /api/v1/loans/{id}/renew` accepte `force` et `overrideReason`.

Conditions lues dans les règles :

- le nombre de prolongations restantes n’est pas épuisé (`max_renewals`, forçable avec l’écriture sur les prêts) ;
- la date du jour est dans la fenêtre (`renew_window_days` avant l’échéance, défaut 7), ou le prêt est déjà en retard (`renewal_too_early`, forçable de la même façon) ;
- l’ancrage `at_due_date` ou `now` fixe la nouvelle échéance ;
- un compte bloqué (`account_blocked`) se force avec l’écriture sur les prêts ;
- un abonnement expiré se force comme au prêt, avec le droit de dérogation et un motif.

La date affichée après prolongation est celle renvoyée par le serveur.

## Retards et exceptions

L’onglet Retards liste `GET /api/v1/loans/overdue`. Chaque ligne peut être rendue ou prolongée.

Exceptions sur un prêt, avec le droit d’écriture :

| Action | Route |
| --- | --- |
| Perdu | `POST /api/v1/loans/{id}/lost` |
| Abîmé | `POST /api/v1/loans/{id}/damaged` (`return` clôt le prêt, `keep` le laisse ouvert) |
| Déclaré rendu par le lecteur | `POST /api/v1/loans/{id}/claimed-returned` |
| Clore cette déclaration | `POST /api/v1/loans/{id}/claims-returned/resolve` (`found` ou `notFound`) |

La liste des déclarations ouvertes est `GET /api/v1/loans/claims-returned`. La résolution et l’audit s’écrivent dans la même transaction.

L’envoi manuel des relances de retard est réservé à l’administrateur : `POST /api/v1/loans/send-overdue-reminders`. Le planning automatique est dans [Relances et amendes](/fr/documentation/reminders-fines/).
