---
title: Exemplaires
description: Exemplaires physiques, code-barres, cote, disponibilité et inventaire.
navTitle: Exemplaires
order: 32
section: features
draft: false
locale: fr
---

Un exemplaire est un **item** : un objet prêté, rattaché à une notice. L’ancien mot « specimen » ne doit plus servir dans la documentation ni dans le code nouveau.

## Créer

Depuis la fiche notice, le personnel ajoute un exemplaire (`POST /api/v1/biblios/{id}/items`). Les champs utilisés au guichet sont le code-barres, la cote, la source (le site), et le fait que l’exemplaire soit empruntable. Un code-barres déjà présent demande une confirmation.

La réception peut être marquée incomplète : tant qu’elle ne l’est pas, l’exemplaire n’est pas prêtable et ne peut pas être affecté à une réservation.

## Disponibilité

Le serveur calcule un statut. L’interface ne le déduit pas du seul indicateur « emprunté ». Ordre de priorité : en prêt, en transit, réservé, à rechercher, indisponible, disponible.

| Statut | Sens |
| --- | --- |
| `available` | En rayon, prêtable |
| `onLoan` | Sorti en prêt |
| `inTransit` | En transit vers un autre site |
| `onHold` | Affecté à une réservation (`to_pick` ou `ready`) |
| `toSearch` | Introuvable au prélèvement. Le catalogue public regroupe ce cas avec `unavailable` |
| `unavailable` | Réception incomplète, perdu, abîmé, déclaré rendu, ou sorti du fonds |

Le catalogue public ne montre ni le motif de désherbage, ni le nom du réservataire.

## Modifier et supprimer

`PUT /api/v1/items/{id}` met à jour la fiche. Le désherbage n’y passe pas : il a sa route, décrite dans [Désherbage](/fr/documentation/weeding/). `DELETE /api/v1/items/{id}` supprime l’exemplaire. Un exemplaire emprunté exige une confirmation de forçage.

## Inventaire

`/inventory` est réservé au personnel (`librarian` ou `admin`). Les routes sont sous `/api/v1/inventory`.

Une session a deux statuts (`InventoryStatus`) : `open`, libellé « Ouverte », et `closed`, libellé « Clôturée ». Le badge « Consolidée » suit `consolidated_at`. L’énumération ne contient que ces deux valeurs.

Le périmètre se fixe à la création : source facultative (`scope_source_id`) et code lieu facultatif (`scope_place`). Il ne se modifie plus ensuite. Les deux vides, le décompte porte sur les exemplaires actifs non archivés. Le champ « Indication de lieu » (`locationFilter`) reste un texte d’affichage. Le serveur ne filtre pas les exemplaires avec ce texte.

1. Créer une session avec un libellé. La source et le code lieu sont facultatifs.
2. Tant que la session est `open`, enregistrer chaque exemplaire par code-barres, ou importer une liste. Le serveur refuse plus de 500 codes par requête (`INVENTORY_BATCH_MAX_BARCODES`). L’interface découpe les listes plus longues.
3. Chaque scan reçoit un résultat : `found` (« Actif », dans le périmètre), `found_out_of_scope` (« Hors périmètre »), `found_archived` (« Archivé »), `unknown_barcode` (« Inconnu »). Un même code peut être lu plusieurs fois. Le rapport compte ces lectures en trop comme doublons. La liste des manquants reprend les exemplaires actifs du périmètre absents du journal de la session.
4. Clôturer passe la session à `closed`. Une session close refuse tout nouveau scan. Le rapport d’écart reprend les attendus du périmètre, les hors périmètre, les archivés, les codes inconnus et les doublons.
5. Après clôture, la consolidation archive les exemplaires manquants du périmètre. Une notice sans exemplaire actif restant est archivée. Avec `force` à faux, les exemplaires en prêt actif sont laissés de côté et la session n’est pas marquée consolidée, afin de pouvoir relancer avec `force` à vrai. Avec `force` à vrai, ces prêts sont clos. Les lecteurs concernés reçoivent le modèle `inventory_loan_closed`, en français ou en anglais selon la langue du compte (voir [Langues](/fr/documentation/languages/)).
