---
title: Relances et amendes
description: E-mails de retard, barème d’amende et seuil qui bloque le prêt.
navTitle: Relances et amendes
order: 36
section: features
draft: false
locale: fr
---

Les relances et le calcul des amendes se règlent dans Paramètres, onglet des emprunts, et dans Paramètres, Serveur (horaires d’envoi, activation). Le compte `admin` est requis pour ces écrans.

## Trois relances

Le planificateur envoie, si `ELIDUNE_REMINDERS__ENABLED` est vrai (défaut) :

| Niveau | Délai après l’échéance (défaut) | Modèle |
| --- | --- | --- |
| Première relance | 7 jours | `overdue_reminder` |
| Deuxième relance | 14 jours | `overdue_second_reminder` |
| Mise en demeure | 21 jours | `overdue_formal_notice` |

Chaque niveau peut être désactivé séparément. L’heure d’envoi par défaut est 09:00 (`ELIDUNE_REMINDERS__SEND_TIME`). Un écart de 100 ms sépare deux messages (`ELIDUNE_REMINDERS__SMTP_THROTTLE_MS`). `frequency_days` (défaut 7) reste dans la configuration pour d’anciens écrans. Les délais ci-dessus sont ceux que le code de relance graduée utilise.

Les modèles existent en français et en anglais dans `server/data/email_templates/`. L’onglet Modèles d’e-mails les édite. Sans SMTP configuré, rien n’est envoyé. Voir [Administration](/fr/documentation/administration/).

L’envoi n’a lieu que si le destinataire a un e-mail et `receive_reminders` à vrai (valeur par défaut à la création). L’envoi immédiat, hors planning, est `POST /api/v1/loans/send-overdue-reminders` (administrateur).

## Amendes

Le barème est une règle par type de média, plus une règle par défaut sans type. Chaque règle a :

- un tarif journalier (`daily_rate`) ;
- un plafond facultatif (`max_amount`) ;
- des jours de grâce (`grace_days`, défaut 0).

Le montant est `tarif × max(0, jours de retard − grâce)`, puis plafonné si un maximum est défini. Une seule amende ouverte par prêt. Le passage nocturne recalcule cette amende lorsque `accrue_fines` est vrai (défaut de `sample.toml`). Le personnel peut aussi lancer le calcul, encaisser (`POST /api/v1/fines/{id}/pay`) ou annuler (`POST /api/v1/fines/{id}/waive`).

## Seuil de blocage

`circulation_settings.unpaid_fine_threshold` vaut 0 par défaut. Un solde impayé **strictement supérieur** au seuil bloque le prêt et la prolongation. Avec 0, tout solde positif bloque. Les amendes payées ou annulées ne comptent pas. Le personnel peut forcer le prêt. Le seuil se règle sur l’onglet des emprunts, et un type de public peut porter une dérogation.

Les montants d’amende sont des euros. L’interface les saisit et les affiche en euros, avec deux décimales. `daily_rate`, `max_amount`, `amount`, `paid_amount` et `unpaid_fine_threshold` sont des `NUMERIC(12, 2)` qui portent ce montant : `15.00` signifie 15,00 €. La règle livrée est un tarif journalier de `0.20` et un plafond de `15.00`. L’écran renvoie à l’API la valeur saisie telle quelle (`PUT /api/v1/fines/policy`, champ `unpaidFineThreshold`). Un appel API ou un `INSERT` envoie donc les euros (`15.00` pour 15,00 €). Le tarif d’abonnement est décrit dans [Lecteurs](/fr/documentation/patrons/).
