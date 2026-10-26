---
title: Inventaire
description: Session d’inventaire, scan des codes-barres, clôture et consolidation.
navTitle: Inventaire
order: 34
section: features
draft: false
locale: fr
---

`/inventory` est réservé au personnel qui a le droit d’écriture sur les exemplaires, et au module `inventory`. Les routes sont sous `/api/v1/inventory`.

<figure>
<picture>
<source srcset="/screens/fr/dark/inventory.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/inventory.webp" alt="Session d’inventaire, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : inventaire (`inventory`).

Une session a deux statuts (`InventoryStatus`) : `open` (« Ouverte ») et `closed` (« Clôturée »). Le badge « Consolidée » suit `consolidated_at`. L’énumération ne contient que ces deux valeurs.

Le périmètre se fixe à la création : site facultatif (`scope_site_id`, soit `items.site_id`) et code lieu facultatif (`scope_place`). Il ne se modifie plus ensuite. Les deux vides, le décompte porte sur les exemplaires actifs non archivés. Le champ « Indication de lieu » (`locationFilter`) reste un texte d’affichage. Le serveur ne filtre pas les exemplaires avec ce texte.

1. Créer une session avec un libellé. Le site et le code lieu sont facultatifs.
2. Tant que la session est `open`, enregistrer chaque exemplaire par code-barres, ou importer une liste. Le serveur refuse plus de 500 codes par requête (`INVENTORY_BATCH_MAX_BARCODES`). L’interface découpe les listes plus longues. Le scan par lot passe par une tâche de fond (`inventoryBatchScan`).
3. Chaque scan reçoit un résultat : `found` (« Actif », dans le périmètre), `found_out_of_scope` (« Hors périmètre »), `found_archived` (« Archivé »), `unknown_barcode` (« Inconnu »). Un même code peut être lu plusieurs fois. Le rapport compte ces lectures en trop comme doublons. La liste des manquants reprend les exemplaires actifs du périmètre absents du journal de la session.
4. Clôturer passe la session à `closed`. Une session close refuse tout nouveau scan. Le rapport d’écart reprend les attendus du périmètre, les hors périmètre, les archivés, les codes inconnus et les doublons.
5. Après clôture, la consolidation archive les exemplaires manquants du périmètre. Une notice sans exemplaire actif restant est archivée. Avec `force` à faux, les exemplaires en prêt actif sont laissés de côté et la session n’est pas marquée consolidée, afin de pouvoir relancer avec `force` à vrai. Avec `force` à vrai, ces prêts sont clos. Les lecteurs concernés reçoivent le modèle `inventory_loan_closed`, en français ou en anglais selon `language_chain` (voir [Langues](/fr/documentation/languages/)).

La consolidation est aussi une tâche de fond (`inventoryConsolidation`).
