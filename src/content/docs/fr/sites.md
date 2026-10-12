---
title: Multi-sites
description: Sources comme sites, site de retrait et transits d’exemplaires.
navTitle: Multi-sites
order: 41
section: features
draft: false
locale: fr
---

Elidune ne crée pas une table « site » séparée. Un lieu (rayon, annexe, bibliothèque du réseau) est une **source**.

## Enregistrer les lieux

Paramètres, onglet Sources (`/settings?tab=sources`), compte `admin` :

- créer une source (nom, et éventuellement source par défaut) ;
- renommer ;
- archiver (`POST /api/v1/sources/{id}/archive`) ;
- fusionner au moins deux sources (`POST /api/v1/sources/merge`) : les exemplaires sont réaffectés, les anciennes sources sont archivées.

L’exemplaire garde `sourceId` : le lieu où il est rangé. Le catalogue public affiche ce nom.

## Réservation et retrait

La réservation porte `pickupSiteId`, identifiant d’une source. Au moment de l’affectation :

- exemplaire déjà sur ce site : statut `ready` ;
- exemplaire ailleurs : ligne de transit vers ce site. La réservation ne devient `ready` qu’à la réception.

`/transits` suit ces mouvements. Les statuts de transit utilisés par la file sont `requested` puis `in_transit`. Un exemplaire `in_transit` n’est pas prêtable. Annuler la réservation pendant le transit ouvre un transit de retour vers le lieu d’origine.

La liste de prélèvement filtre par le site actuel de l’exemplaire.

## Règles communes

Les plafonds de prêt, les types de public et les amendes sont ceux de l’installation, pas un barème par source.

> **TODO.** Confirmer dans `TransitsPage.tsx` les actions proposées (expédier, recevoir) et leurs libellés, pour les décrire sans les deviner à partir des seuls statuts `requested` et `in_transit`.
