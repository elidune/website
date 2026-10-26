---
title: Référence d’API
description: Points d’entrée regroupés par domaine, formes principales et erreurs, d’après les routeurs Axum.
navTitle: API
order: 40
section: reference
draft: false
locale: fr
---

Préfixe `/api/v1`. JSON en camelCase. Identifiants en chaînes. Authentification et quotas : [Authentification](/fr/dev/authentication/). Les modules coupés répondent 403 `feature_disabled`.

Cette liste reprend les `router()` de `server/src/api/` au commit `3e1ca84`. Elle ne recopie pas chaque champ : le contrat OpenAPI reste la liste exhaustive des propriétés.

## Santé

| Méthodes | Chemin | Accès |
| --- | --- | --- |
| GET | `/health` | Public. Signale aussi qu’une première configuration est nécessaire |
| GET | `/ready` | Public |

## Catalogue public

| Méthodes | Chemin | Accès |
| --- | --- | --- |
| GET | `/opac/biblios` | Public. Texte, type de média, pages de 20 |
| GET | `/opac/biblios/{id}` | Public |
| GET | `/opac/biblios/{id}/availability` | Public. Site (`sourceName`), nombre de réservations. Pas le nom du lecteur. `toSearch` est regroupé avec indisponible |
| GET | `/covers/isbn/{isbn}` | Public |
| GET | `/library-info` | Public. `enabledFeatures` en camelCase |
| PUT | `/library-info` | Jeton, écriture des paramètres |

Les exemplaires perdus, manquants, candidats au désherbage et sortis du fonds sont absents du catalogue public. `publicNote` est visible. `internalNote` ne l’est pas.

## Notices, exemplaires, séries

| Méthodes | Chemin | Accès |
| --- | --- | --- |
| GET, POST | `/biblios` | Lecture / écriture documents |
| GET, PUT, DELETE | `/biblios/{id}` | Idem. La suppression exige zéro exemplaire et zéro réservation (`biblio_has_items`, `biblio_has_holds`). `force` ne lève pas ces refus |
| GET, POST | `/biblios/{id}/items` | Créer un exemplaire. Un ISBN déjà connu demande `duplicate_isbn_needs_confirmation`. Un code-barres déjà connu demande une confirmation |
| GET | `/biblios/export.csv` | Lecture |
| POST | `/biblios/load-marc` | Lecture. Le module d’import peut refuser |
| POST | `/biblios/import-marc-batch` | Écriture |
| POST | `/biblios/import-marc-batch/scan-deposit-duplicates` | Écriture. Prépare un import en dépôt |
| GET | `/biblios/list-marc-batches` | Lecture |
| GET | `/biblios/marc-batch/{id}` | Lecture |
| GET | `/items/barcode/{barcode}` | Lecture. Renvoie la notice, avec seulement cet exemplaire |
| GET, PUT, DELETE | `/items/{id}` | `PUT` refuse un champ `circulationStatus`. `DELETE` archive (`itemsArchiveRights` en écriture) |
| POST | `/items/{id}/weeding` | `status` et motif facultatif (200 caractères) |
| GET, POST | `/series` | Lecture / écriture |
| GET, PUT, DELETE | `/series/{id}` | Idem |
| GET | `/series/{id}/biblios` | Lecture |
| GET, POST | `/collections` | Lecture / écriture. ISSN sur une collection |
| GET, PUT, DELETE | `/collections/{id}` | Idem |
| GET | `/collections/{id}/biblios` | Lecture |
| GET | `/genres` | Lecture |
| POST | `/genres/reload` | Écriture |

Types de média acceptés à l’écriture, camelCase : `printedText`, `comics`, `periodic`, `video`, `videoDvd`, `videoTape`, `audio`, `audioMusic`, `audioMusicCd`, `audioMusicTape`, `audioNonMusic`, `audioNonMusicCd`, `audioNonMusicTape`, `cdRom`, `images`, `multimedia`, `unknown`. D’anciens codes courts restent lisibles.

Disponibilité calculée, par priorité : `onLoan`, `inTransit`, `onHold`, `toSearch`, `unavailable`, `available`.

Archivage d’un exemplaire du fonds propre : un prêt ouvert, un transit, une réservation `pending`, `to_pick` ou `ready`, une amende impayée ou un historique de prêt répondent 422 (`item_has_history_use_weeding` pour l’historique). `force` ne contourne pas cela.

Exemplaire de dépôt, lot `active` : premier `DELETE` en 409 `deposit_item_delete_needs_confirmation`. `force=true` confirme, sans enregistrer un retour au prêteur. Prêt ouvert : `deposit_item_on_loan`. Amende impayée : `deposit_item_delete_unpaid_fine`. Lot `returning` ou `closed` : `deposit_item_delete_use_batch_return`.

## Z39.50

Module requis.

| Méthodes | Chemin | Accès |
| --- | --- | --- |
| GET | `/z3950/search` | Lecture documents |
| POST | `/z3950/import` | Écriture. Ne pose pas `deposit_batch_id` |
| GET, PUT | `/z3950/servers` | Paramètres |

Cache Redis : `ELIDUNE_REDIS__Z3950_CACHE_TTL_SECONDS`, défaut 604800.

## Prêts

`POST /loans` crée un prêt. Corps utile : identifiant du lecteur, code-barres ou identifiant d’exemplaire, `force`, `overrideReason`. Un seul prêt actif par exemplaire. La date de retour vient des règles, du type de public, de `skip_closed_days`, et du plafond `return_due_on` d’un dépôt.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET | `/me/loans` | Prêts du titulaire. `expectedReturnDate` tant que l’échéance n’est pas dépassée |
| GET | `/users/{id}/loans` | Personnel |
| GET | `/users/{id}/loans/export` | Export MARC des prêts |
| GET, PUT | `/loans/settings` | Règles. Ancrage `at_due_date` ou `now`. Fenêtre `renewWindowDays` de 0 à 366, défaut 7 |
| GET | `/loans/overdue` | Retards |
| POST | `/loans/send-overdue-reminders` | Administrateur |
| GET | `/loans/claims-returned` | Déclarations ouvertes |
| GET | `/loans/{id}/user` | Lecteur du prêt, forme réduite |
| POST | `/loans/{id}/return` | Clôture |
| POST | `/loans/{id}/renew` | `force`, `overrideReason` |
| POST | `/loans/{id}/lost` | Perdu. Motif de clôture `lost` |
| POST | `/loans/{id}/damaged` | `return` clôt, `keep` laisse ouvert |
| POST | `/loans/{id}/claimed-returned` | Déclaration |
| POST | `/loans/{id}/claims-returned/resolve` | `found` ou `notFound`, dans la même transaction que l’audit |
| POST | `/loans/items/{barcode}/return` | Un code qui n’est pas en prêt peut répondre 200 avec une notice |
| POST | `/loans/items/{itemId}/lost-found` | Exemplaire perdu retrouvé. `foundAt` est renseigné |
| POST | `/loans/items/{itemId}/renew` | Prolongation par exemplaire |
| POST | `/loans/batch-create` | Lot |
| POST | `/loans/batch-return` | Lot |

Refus de prêt fréquents, HTTP 422 : `subscription_expired` et `item_held_for_other` se forcent avec la dérogation et un motif (`override_reason_required` sinon). `fines_over_threshold`, `max_loans`, `max_media_loans`, `item_not_loanable`, `max_renewals`, `renewal_too_early`, `account_blocked` se forcent avec l’écriture sur les prêts, sans motif obligatoire pour les amendes. `card_lost`, `item_to_pick_for_other`, `deposit_return_due`, `deposit_item_returned_to_lender` ne se forcent pas.

Motif de clôture archivé : `returned` ou `lost`.

## Réservations et transits

`POST /holds` : `biblioId` ou `itemId` (le second épingle un exemplaire). Même ligne, même notice. `pickupSiteId`, `patronNote`, `internalNote`. Une seule réservation active (`pending`, `to_pick`, `ready`) par lecteur et par notice. Plafond `maxActiveHolds`, défaut 20.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET | `/me/holds` | Titulaire |
| GET, POST | `/holds` | Liste / création |
| GET | `/holds/pick-list` | Lignes `to_pick`. Filtre par site actuel de l’exemplaire |
| POST | `/holds/{id}/pick-not-found` | Passe l’exemplaire à `toSearch` et réaffecte |
| GET, PUT | `/holds/policy` | `pickDelayDays` défaut 2. N’annule pas la réservation |
| GET | `/holds/quota` | Plafond du compte |
| DELETE | `/holds/{id}` | Annulation. Écriture : toute ligne. `own` : les siennes |
| GET | `/items/{id}/holds` | |
| GET | `/biblios/{id}/holds` | File de la notice |
| GET | `/users/{id}/holds` | |
| GET, POST | `/holds/{id}/transits` | Démarrer. `ship: true` crée directement `in_transit` |
| GET | `/transits` | |
| GET | `/transits/{id}` | |
| POST | `/transits/{id}/ship` | `requested` vers `in_transit` |
| POST | `/transits/{id}/receive` | L’exemplaire prend le site de destination. Une réservation `pending` liée devient `ready` |
| POST | `/transits/{id}/cancel` | `reverse: true` ouvre un transit de retour sans réservation |
| GET | `/items/{id}/transit` | Transit actif |

Statuts stockés : `requested`, `in_transit`, `received`, `cancelled`. Le JSON écrit `inTransit`. Un transit `requested` ou `in_transit` bloque le prêt. `force` ne lève pas ce blocage (`business_rule_violation`).

Expiration « prêt à retirer » : `ELIDUNE_HOLDS__READY_EXPIRY_DAYS`, défaut 7.

Module transits : s’il est coupé, ces routes répondent `feature_disabled`.

## Lecteurs

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET, POST | `/users` | Création : identité, identifiant, mot de passe (8 caractères au moins), type de compte, langue |
| GET | `/users/by-card/{cardNumber}` | Scan de carte au guichet |
| GET, PUT, DELETE | `/users/{id}` | `DELETE` anonymise. `force=true` rend d’abord les prêts actifs |
| POST | `/users/{id}/card-lost` | Écriture lecteurs ou écriture prêts. Pas de bouton dans l’interface de cette version |
| POST | `/users/{id}/replace-card` | Nouveau numéro. Écriture lecteurs |
| PUT | `/users/{id}/account-type` | Administrateur |
| PUT | `/users/{id}/force-password-change` | Administrateur |
| GET, POST | `/account-types` | |
| GET, PUT, DELETE | `/account-types/{code}` | Les types `is_system` ne se suppriment pas |

`DELETE /users/{id}` passe le statut à `deleted`, révoque les jetons, vide l’identité, garde le type de compte, le type de public et les dates, coupe le lien des archives, supprime les réservations actives, détache les amendes. Le guide colonne par colonne est [`docs/README-patron-erasure.md`](https://github.com/elidune/elidune/blob/dev/docs/README-patron-erasure.md).

Un enfant (`public type` enfant) exige un responsable qui n’est ni enfant ni scolaire (`user_guardians`). Pour un `reader`, le type de public suit l’âge. Aucune borne : `no_public_type_for_age`.

## Amendes

Montants en centimes en base. L’API parle en chaîne décimale (`"0.20"`). Plus de deux décimales significatives est refusé.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET | `/users/{id}/fines` | Lecture lecteurs |
| POST | `/users/{id}/fines/accrue` | Recalcul |
| POST | `/loans/{id}/fines/accrue` | Recalcul d’un prêt |
| POST | `/fines/accrue` | Passage global |
| GET, PUT | `/fines/rules` | Tarif journalier, plafond, grâce |
| GET, PUT | `/fines/policy` | Seuil. Mode `none` ou `amount`. Un type de public : `inherit`, `none`, `amount` |
| POST | `/fines/{id}/pay` | `amount` en euros. Au-dessus du reste dû : 422 `payment_exceeds_balance`, `remainingCents` |
| POST | `/fines/{id}/waive` | Exonération |

`chargeType` : `overdue`, `replacement`, `damage`. `status` : `pending`, `partial`, `paid`, `waived`, `cancelled`, `refunded`.

Le blocage `fines_over_threshold` n’a lieu que si `accrue_fines` est vrai, et si le solde est strictement supérieur au seuil.

## Dépôts

Module requis. Écriture : droit d’écriture sur les exemplaires.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET, POST | `/lenders` | Nom unique, 200 caractères. `replacementRateCents` strictement positif ou absent |
| PATCH, DELETE | `/lenders/{id}` | Archivage refusé : `lender_has_active_batches` |
| GET, POST | `/deposit-batches` | Création en `active`. `returnDueOn` facultatif, au moins égal à l’arrivée |
| GET, PATCH | `/deposit-batches/{id}` | Changer le site ne déplace pas les exemplaires déjà liés |
| GET | `/deposit-batches/{id}/items` | |
| POST | `/deposit-batches/{id}/start-return` | `active` vers `returning`. Détache les réservations, sans les restaurer si le retour est annulé |
| POST | `/deposit-batches/{id}/cancel-return` | |
| POST | `/deposit-batches/{id}/scan-out` | Exige `returning`. Encore en prêt : 422 `deposit_item_on_loan` |
| POST | `/deposit-batches/scan-out` | Scan global |
| POST | `/deposit-batches/{id}/close` | Exige `returning` et zéro prêt ouvert (`deposit_batch_has_active_loans`). Rapport `{ returned, missing }` |
| GET | `/deposit-losses` | Défaut : non encore signalés |
| POST | `/items/{id}/deposit-loss-notified` | Second appel : `deposit_loss_already_notified` |

Autres codes : `deposit_return_due`, `deposit_renewal_no_extension`, `deposit_batch_returning`, `deposit_item_not_owned`, `deposit_item_returned_to_lender`, `deposit_item_was_lost`, `deposit_replacement_amount_required`.

La liste « pertes à signaler » n’a pas d’écran dans cette version.

## Acquisitions et suggestions

Modules séparés.

| Méthodes | Chemin |
| --- | --- |
| GET, POST | `/acquisitions/vendors` |
| GET, PUT, DELETE | `/acquisitions/vendors/{id}` |
| GET, POST | `/acquisitions/funds` |
| GET, PUT | `/acquisitions/funds/{id}` |
| GET, POST | `/acquisitions/orders` |
| GET, PUT | `/acquisitions/orders/{id}` |
| POST | `/acquisitions/orders/{id}/lines` |
| PUT, DELETE | `/acquisitions/orders/{id}/lines/{lineId}` |
| POST | `/acquisitions/orders/{id}/submit` |
| POST | `/acquisitions/orders/{id}/cancel` |
| POST | `/acquisitions/orders/{id}/receive` |
| GET | `/acquisitions/orders/{id}/audit` |
| GET, POST | `/suggestions` |
| GET | `/suggestions/{id}` |
| POST | `/suggestions/{id}/accept` |
| POST | `/suggestions/{id}/refuse` |

Statuts de commande : `draft`, `ordered`, `partial`, `received`, `cancelled`. La réception crée les exemplaires. Devise absente : `EUR`. Intention : au moins `biblioId`, un ISBN ou un titre. Suggestions : `proposed`, puis acceptée ou refusée.

## Désherbage

`items.weeding_status` : `on_shelf`, `candidate`, `withdrawn`. Le candidat circule encore. `withdrawn` bloque prêt, prolongation et réservation.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| POST | `/items/{id}/weeding` | Changement d’état |
| POST | `/items/withdrawals` | Sortie par lot |
| POST, GET | `/items/{id}/withdrawals` | Sortie unitaire, sortie active |
| GET | `/weeding-candidates` | |
| GET | `/item-withdrawals` | |
| GET | `/item-withdrawals/export.csv` | |
| POST | `/item-withdrawals/dispose` | |
| POST | `/item-withdrawals/{id}/cancel` | Droit d’annulation |
| GET, PATCH | `/item-withdrawals/{id}` | |

## Inventaire

Statuts `open` et `closed`. `consolidatedAt` est une date, pas un troisième statut.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET, POST | `/inventory/sessions` | Périmètre : `scopeSiteId`, `scopePlace`. Le texte d’indication de lieu n’est pas un filtre |
| GET | `/inventory/sessions/{id}` | |
| POST | `/inventory/sessions/{id}/close` | Refuse les scans suivants |
| POST | `/inventory/sessions/{id}/scan` | |
| POST | `/inventory/sessions/{id}/scans/batch` | Plafond 500 codes |
| GET | `/inventory/sessions/{id}/scans` | |
| GET | `/inventory/sessions/{id}/missing` | |
| GET | `/inventory/sessions/{id}/report` | |
| GET | `/inventory/sessions/{id}/consolidate/preview` | |
| POST | `/inventory/sessions/{id}/consolidate` | `force` faux laisse les prêts actifs et ne marque pas la session consolidée |

Résultats de scan : `found`, `found_out_of_scope`, `found_archived`, `unknown_barcode`.

## Événements

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET, POST | `/events` | Personnel, droit événements. `allAudiences` ou liste de types |
| GET, PUT, DELETE | `/events/{id}` | |
| POST | `/events/{id}/send-announcement` | Consentement du compte. Un enfant suit le responsable |
| GET | `/events/{id}/announcement-recipients/count` | |
| GET | `/events/stream` | Flux SSE |
| POST | `/events/unsubscribe` | Public, corps avec jeton. La page est dans l’interface. Un aperçu de message ne retire pas le consentement |

## Statistiques

Lecture des documents pour les totaux. La requête avancée est réservée au personnel (`librarian` ou `admin`).

| Méthodes | Chemin |
| --- | --- |
| GET | `/stats` |
| GET | `/stats/catalog` |
| GET | `/stats/users` |
| GET | `/stats/loans` |
| GET | `/stats/schema` |
| POST | `/stats/query` |
| GET, POST | `/stats/saved` |
| PUT, DELETE | `/stats/saved/{id}` |
| GET | `/stats/saved/{id}/run` |
| GET, POST | `/visitor-counts` |
| DELETE | `/visitor-counts/{id}` |

`POST /stats/query` : `filters` (ET), `filterGroups` (OU de groupes, ET dedans ; 16 groupes, 32 filtres, 128 clauses), `unionWith` limité à `loans` avec `loans_archives`. Les champs calculés ne servent pas d’agrégat. Détail : [`docs/README-stats-frontend.md`](https://github.com/elidune/elidune/blob/dev/docs/README-stats-frontend.md).

Les compteurs de fréquentation exigent la lecture des paramètres. L’interface n’a pas d’écran.

## Lieux, horaires, publics, matériel

| Méthodes | Chemin |
| --- | --- |
| GET, POST | `/sites` |
| POST | `/sites/merge` |
| GET, PUT | `/sites/{id}` |
| POST | `/sites/{id}/archive` |
| GET, POST | `/schedules/periods` |
| PUT, DELETE | `/schedules/periods/{id}` |
| GET, POST | `/schedules/periods/{id}/slots` |
| DELETE | `/schedules/slots/{id}` |
| GET, POST | `/schedules/closures` |
| DELETE | `/schedules/closures/{id}` |
| GET, POST | `/public-types` |
| GET, PUT, DELETE | `/public-types/{id}` |
| PUT | `/public-types/{id}/loan-settings` |
| GET, POST | `/equipment` |
| GET, PUT, DELETE | `/equipment/{id}` |

`subscriptionPrice` est un entier de centimes. L’écran saisit des euros.

## Administration

Compte `admin`, sauf mention.

| Méthodes | Chemin | Notes |
| --- | --- | --- |
| GET | `/admin/config` | |
| PUT, DELETE | `/admin/config/{section}` | `DELETE` revient au fichier |
| POST | `/admin/config/email/test` | |
| POST | `/admin/reindex-search` | Meilisearch, index `items` |
| GET | `/settings/email-templates` | |
| GET, PUT | `/settings/email-templates/{templateId}/{language}` | L’onglet n’édite que le français et l’anglais |
| GET | `/audit` | |
| GET | `/audit/export` | Rétention 365 jours par défaut |
| GET | `/tasks` | Tâches de fond |
| GET | `/tasks/{id}` | |
| POST | `/maintenance` | |
| GET | `/maintenance/database/dump` | `pg_dump --clean` |
| POST | `/maintenance/database/restore` | 512 Mio. Destructif |

## Relances

Si `ELIDUNE_REMINDERS__ENABLED` est vrai (défaut) : 7, 14 et 21 jours, modèles `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`. Heure `ELIDUNE_REMINDERS__SEND_TIME` (09:00). Intervalle `ELIDUNE_REMINDERS__SMTP_THROTTLE_MS` (100). Couper le premier niveau coupe les suivants. `receive_reminders` doit être vrai et l’adresse présente. Couper `accrue_fines` n’arrête pas les messages.
