---
title: Modèle de données
description: Tables principales, statuts et liens entre notices, exemplaires, prêts, réservations et lecteurs.
navTitle: Modèle de données
order: 50
section: reference
draft: false
locale: fr
---

Le schéma livré est appliqué par `server/migrations/`. Les trois fichiers et le script d’alignement des anciennes bases sont dans [Déploiement](/fr/dev/deployment/). Les identifiants sont des `BIGINT`. Cette page retient les liens qui changent le comportement, pas le catalogue complet des colonnes.

## Cœur

- `biblios` décrit la notice. `items` sont les exemplaires, chacun rattaché à une notice et à un `sites` (colonne `site_id`).
- `loans` relie un lecteur et un exemplaire. La clôture déplace la ligne vers `loans_archives`. `loans_archives.loan_id` conserve l’identifiant d’origine (migration `003`), sans clé étrangère : la ligne de `loans` a été supprimée.
- `holds` porte `biblio_id`, un `item_id` facultatif et `pickup_site_id`. L’affectation peut créer une ligne de `item_transits`.
- `users` pointe vers `account_types.code` et, pour un lecteur, vers un type de public. `user_guardians` relie un enfant à son responsable.
- `fines` et `fine_rules` stockent des centimes. `circulation_settings` porte les durées, les plafonds et le seuil d’impayés.

## Statuts qui changent la circulation

| Domaine | Valeurs |
| --- | --- |
| Compte | `active`, `blocked`, `deleted` |
| Exemplaire, circulation | entiers 0 à 5 : disponible, perdu, abîmé, déclaré rendu, à rechercher, manquant. JSON : `available`, `lost`, `damaged`, `claimedReturned`, `toSearch`, `missing` |
| Désherbage | `on_shelf`, `candidate`, `withdrawn` |
| Réservation | `pending`, `to_pick`, `ready`, `fulfilled`, `cancelled`, `expired` |
| Transit | `requested`, `in_transit`, `received`, `cancelled` |
| Lot de dépôt | `active`, `returning`, `closed` |
| Commande | `draft`, `ordered`, `partial`, `received`, `cancelled` |
| Amende | `pending`, `partial`, `paid`, `waived`, `cancelled`, `refunded` |
| Inventaire | `open`, `closed`, plus `consolidated_at` |

## Ce que l’anonymisation garde

`DELETE /users/{id}` vide l’identité et laisse, sur `loans_archives`, la tranche d’âge à la date du prêt (`age_band` : `0-17`, `18-29`, `30-49`, `50-64`, `65+`), `loan_year`, la ville, le type de public et le type de compte. `user_id` devient nul. Le guide colonne par colonne est [`docs/README-patron-erasure.md`](https://github.com/elidune/elidune/blob/dev/docs/README-patron-erasure.md).

## Autres graphes

Acquisitions : `acquisition_vendors`, `acquisition_funds`, `purchase_orders` et leurs lignes. Dépôts : prêteurs, `deposit_batches`, lien `items.deposit_batch_id`, `lender_barcode`, `deposit_returned_at`. Événements : fiche, audiences, consentement du compte. Inventaire : sessions et scans. Audit : `audit_log`. Réglages surchargeables : table `settings`, à côté de `library_info`.

Le sexe d’un compte est `m`, `f`, ou nul. La langue d’un compte neuf vaut `french` et reste nullable (`VARCHAR(32)`).
