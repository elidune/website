---
title: Relances et amendes
description: Trois niveaux de relance, amendes en centimes d’euro et paiement plafonné au reste dû.
navTitle: Relances et amendes
order: 38
section: features
draft: false
locale: fr
---

Les relances et le calcul des amendes se règlent dans Paramètres, onglet des emprunts, et dans Paramètres, Serveur (horaire d’envoi, activation). Le compte `admin` est requis pour ces écrans. L’interface saisit les montants en euros, avec deux décimales. Le stockage est un entier de centimes.

## Trois relances

Le planificateur envoie, si `ELIDUNE_REMINDERS__ENABLED` est vrai (défaut) :

| Niveau | Délai après l’échéance (défaut) | Modèle | Libellé |
| --- | --- | --- | --- |
| Première relance | 7 jours | `overdue_reminder` | 1er rappel |
| Deuxième relance | 14 jours | `overdue_second_reminder` | 2e rappel |
| Mise en demeure | 21 jours | `overdue_formal_notice` | Mise en demeure |

Désactiver le premier niveau désactive les deux suivants. Désactiver le deuxième désactive la mise en demeure. L’heure d’envoi par défaut est 09:00 (`ELIDUNE_REMINDERS__SEND_TIME`). Un écart de 100 ms sépare deux messages (`ELIDUNE_REMINDERS__SMTP_THROTTLE_MS`). `frequency_days` (défaut 7) reste dans la configuration. Le niveau suivant dépend de `loans.reminder_count` : 0, puis 1, puis 2, puis plus rien.

Les modèles de relance sont livrés en français, anglais, allemand et espagnol dans `server/data/email_templates/`. L’onglet Modèles d’e-mails édite le français et l’anglais. La langue du message suit la préférence du lecteur, puis la langue de la bibliothèque, puis le français, puis l’anglais. Voir [Langues](/fr/documentation/languages/). Sans SMTP configuré, rien n’est envoyé.

L’envoi n’a lieu que si le destinataire a un e-mail et `receive_reminders` à vrai (valeur par défaut à la création). L’envoi immédiat, hors planning, est `POST /api/v1/loans/send-overdue-reminders` (administrateur). Couper `accrue_fines` n’arrête pas les e-mails de relance.

## Amendes en centimes

Les colonnes `fines.amount`, `paid_amount`, `refunded_amount`, `fine_rules.daily_rate` et `fine_rules.max_amount` sont des entiers en centimes d’euro. Le commentaire de schéma le dit : `20` est 0,20 €, `1500` est 15,00 €. L’API expose ces montants en chaîne décimale (`"0.20"`, `"15.00"`) via `euro_string`. Un appel qui envoie `"12.50"` est converti en 1250 centimes. Plus de deux décimales significatives est refusé.

La règle livrée, sans type de média, a un tarif journalier de 20 centimes, un plafond de 1500 centimes et 3 jours de grâce. Le montant est `tarif × max(0, jours de retard − grâce)`, puis plafonné si un maximum est défini. Une seule amende ouverte par prêt et par type de charge.

| `charge_type` | Libellé |
| --- | --- |
| `overdue` | Retard |
| `replacement` | Exemplaire perdu |
| `damage` | Exemplaire abîmé |

| `status` | Libellé |
| --- | --- |
| `pending` | Impayée |
| `partial` | Partiellement payée |
| `paid` | Payée |
| `waived` | Exonérée |
| `cancelled` | Annulée (rien n’avait été encaissé) |
| `refunded` | Remboursée |

Le passage nocturne recalcule l’amende de retard lorsque `accrue_fines` est vrai (défaut de `sample.toml`). Le personnel peut lancer le calcul d’un prêt (`POST /api/v1/loans/{id}/fines/accrue`). La fiche lecteur, onglet Amendes, liste les lignes pour qui a le droit de lecture sur les lecteurs. Les boutons d’encaissement et d’exonération de cette liste ne sont pas branchés dans l’interface : l’API reste `POST /api/v1/fines/{id}/pay` et `POST /api/v1/fines/{id}/waive`.

### Paiement plafonné au reste dû

`POST /api/v1/fines/{id}/pay` prend `amount` en euros décimaux. Le serveur refuse un montant supérieur à `amount − paid_amount`. La réponse est HTTP 422, code `payment_exceeds_balance`, avec `remainingCents` (le reste dû, en centimes). Un montant nul ou négatif est refusé. `paid_amount` ne dépasse jamais `amount`. Un remboursement (`refunded_amount`) ne dépasse jamais ce qui a été encaissé. Il est produit quand un exemplaire perdu est retrouvé, pas par une route de paiement séparée.

## Seuil de blocage

Le blocage sur impayé n’a lieu que si `accrue_fines` est vrai. Sinon les seuils enregistrés sont ignorés pour le prêt. Les factures de perte et de dégât restent visibles.

Le mode global (`circulation_settings.unpaid_threshold_mode`) est `none` ou `amount`. Une installation neuve part de `none` : aucun blocage sur le montant. En mode `amount`, le solde impayé **strictement supérieur** à `unpaid_fine_threshold` (centimes) bloque le prêt et la prolongation. Avec 0, tout solde positif bloque. Le code de refus est `fines_over_threshold`. Il se force avec l’écriture sur les prêts, sans motif obligatoire. Voir [Prêts et retours](/fr/documentation/circulation/).

Un type de public a son propre mode : `inherit` (suit le global), `none` (ne bloque jamais sur le montant), ou `amount` (ses propres centimes). Le défaut des types livrés est `inherit`.

L’interface envoie les centimes déjà convertis (`unpaidThresholdCents`) pour la politique, et des euros décimaux pour le barème journalier. Le tarif d’abonnement, lui aussi en centimes, est décrit dans [Lecteurs](/fr/documentation/patrons/).
