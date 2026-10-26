---
title: Dépôts
description: Lots de documents reçus d’un autre établissement, prêteurs, import MARC, retour et pertes.
navTitle: Dépôts
order: 33
section: features
draft: false
locale: fr
---

Un dépôt est un ensemble d’exemplaires qui restent la propriété d’un prêteur. Le module s’active avec la fonctionnalité `deposits` (activée par défaut). Le menu **Dépôts** (`/deposits`) demande le catalogue interne et le droit de lecture sur les exemplaires. L’écriture (création, retour, clôture) demande le droit d’écriture sur les exemplaires.

<figure>
<picture>
<source srcset="/screens/fr/dark/deposits.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/deposits.webp" alt="Liste des lots de dépôt, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : lots de dépôt (`deposits`).

## Prêteurs

L’onglet Prêteurs est `/deposits?tab=lenders`. Un prêteur a un nom (unique, 200 caractères au plus), un contact, des notes et un taux de remplacement facultatif en centimes d’euro (`replacementRateCents`, strictement positif, ou absent). L’archivage est refusé tant qu’un lot de ce prêteur n’est pas clôturé (`lender_has_active_batches`).

## Lots

Un lot (`deposit_batches`) porte une référence unique pour ce prêteur, un site d’accueil, une date d’arrivée et une date de retour facultative. Sans date de retour, le dépôt est permanent. La date de retour, si elle est saisie, est au moins égale à la date d’arrivée.

| Statut | Sens |
| --- | --- |
| `active` | Le lot circule |
| `returning` | Le retour au prêteur est lancé |
| `closed` | Le lot est clôturé, les exemplaires sont archivés |

Créer un lot le place en `active`. Modifier le site du lot ne déplace pas les exemplaires déjà rattachés.

## Import MARC en mode dépôt

L’import ISO 2709 ou MARCXML est sur `/biblios?tab=import` (l’adresse `/import-iso` y renvoie). Le mode **Dépôt** exige un lot `active` et la fonctionnalité `importIso`. Le mode **Fonds propre** exige un site.

Pour un ISBN déjà présent, l’import rattache des exemplaires sans réécrire la notice. Le code-barres du prêteur est conservé dans `lender_barcode`. S’il entre en collision avec un code-barres de guichet déjà actif, le serveur peut réétiqueter (nouveau code local), écraser ou ignorer. Le choix par défaut, sans consigne, est le réétiquetage. Un exemplaire déjà facturé comme perdu (`wasLost`) refuse l’import (`deposit_item_was_lost`).

La recherche Z39.50 ne crée pas d’exemplaire de dépôt : elle laisse `deposit_batch_id` vide.

## Circulation d’un exemplaire déposé

Un exemplaire de dépôt a `deposit_batch_id` renseigné. Les autres sont le fonds propre.

- La date de retour d’un prêt ou d’une prolongation est plafonnée à `return_due_on` du lot. L’interface signale ce plafond.
- Si cette date est aujourd’hui ou déjà passée, un nouveau prêt répond 422 `deposit_return_due`. Ce refus n’est pas forçable.
- Une prolongation qui n’avancerait pas l’échéance répond `deposit_renewal_no_extension` ou `deposit_return_due`.
- Un lot `returning` ou `closed`, ou dont la date de retour est dépassée, ne reçoit pas de nouvelle réservation (`deposit_batch_returning`).
- Le désherbage d’un exemplaire déposé répond `deposit_item_not_owned`.

## Retour au prêteur

1. **Lancer le retour** passe le lot de `active` à `returning` et détache les réservations des exemplaires du lot. Ces réservations ne sont pas restaurées si le retour est annulé.
2. Le scan de sortie (`POST /api/v1/deposit-batches/{id}/scan-out`, ou le scan global) exige un lot `returning`. Il enregistre `deposit_returned_at`. Un exemplaire encore en prêt répond 422 `deposit_item_on_loan` : le retour au guichet vient d’abord. Un retour au guichet pendant que le lot est `returning` marque aussi l’exemplaire comme renvoyé, sauf s’il est perdu.
3. **Clôturer** n’est possible qu’en `returning`, et seulement s’il ne reste aucun prêt ouvert (`deposit_batch_has_active_loans`). Les exemplaires scannés comptent comme renvoyés. Les autres, y compris un exemplaire perdu non scanné, comptent comme manquants. La clôture archive les exemplaires du lot.

Le rapport de clôture compte des exemplaires. Il ne reprend pas le nom d’un lecteur.

## Pertes à signaler

Déclarer un exemplaire déposé perdu ou abîmé crée une amende de remplacement ou de dégât et un événement d’audit `deposit_item_lost`. Le montant suit, dans l’ordre, le taux du prêteur, le prix de l’exemplaire s’il est positif, puis un montant saisi. Sans aucun de ces montants, la réponse est `deposit_replacement_amount_required`.

`GET /api/v1/deposit-losses` liste ces exemplaires. Par défaut, seuls ceux qui n’ont pas encore été signalés au prêteur (`notified=false`). `POST /api/v1/items/{id}/deposit-loss-notified` enregistre la date de signalement. Un second appel répond `deposit_loss_already_notified`.

L’interface du guichet déclare la perte. La liste « pertes à signaler » et le bouton de notification ne sont pas dans l’interface de cette version : ces deux routes restent un appel d’API.

## Script `reclassify-deposits`

La commande du binaire serveur reclasse des exemplaires dont le prêteur avait été stocké comme un site.

```bash
elidune-server reclassify-deposits \
  --config config/default.toml \
  --lender 12 \
  --batch-reference "VILLE-2027-PRINTEMPS" \
  --received-on 2027-03-01 \
  --return-due-on 2027-09-01 \
  --site 3 \
  --from-site 41
```

Sans `--apply`, la transaction est annulée après le rapport. `--from-site` et `--barcodes` sont exclusifs, et `--from-site` doit différer de `--site`. `--return-due-on` est facultatif à la création du lot (dépôt permanent). Un lot déjà `active` pour cette référence est réutilisé. Un autre statut est refusé.

Refus par exemplaire, sans écriture : `barcode_unknown`, `item_archived`, `item_in_other_batch`, `item_in_transit`. `already_reclassified` est un passage sans seconde ligne d’audit.

Le fichier `docs/README-deposit-reclassify.md` du dépôt logiciel nomme encore `--from-source` et `items.source_id`. Le binaire de cette version attend `--from-site` et met à jour `items.site_id`. Le rapport JSON parle de `remaining_on_old_site`.
