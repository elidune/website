---
title: Multi-sites
description: Sites de conservation, site de retrait et transits d’exemplaires.
navTitle: Multi-sites
order: 41
section: features
draft: false
locale: fr
---

Un lieu (rayon, annexe, bibliothèque du réseau) est une ligne de la table `sites`. L’API est `/api/v1/sites`.

<figure>
<picture>
<source srcset="/screens/fr/dark/transits.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/transits.webp" alt="Liste des transits, thème clair." width="1440" height="900" />
</picture>
</figure>

Capture : transits (`transits`).

## Enregistrer les lieux

Paramètres, onglet Gestion des sites (`/settings?tab=sites`), compte `admin` :

- créer un site (nom, et éventuellement site par défaut). Sur une base neuve, le premier enregistrement après le site `MyLibrary` échoue une fois (séquence non alignée, voir [Installation](/fr/documentation/installation/)) ;
- renommer ;
- archiver (`POST /api/v1/sites/{id}/archive`) ;
- fusionner au moins deux sites (`POST /api/v1/sites/merge`) : les exemplaires sont réaffectés, les anciens sites sont archivés.

L’exemplaire garde `siteId` : le lieu où il est rangé. Le catalogue public affiche ce nom. Un prêt enregistre aussi le site du guichet (`loans.site_id`). Vide, les statistiques et le calendrier utilisent le site par défaut, pas le site de l’exemplaire.

## Réservation et retrait

La réservation porte `pickupSiteId`, identifiant d’un site. Au moment de l’affectation :

- exemplaire déjà sur ce site : statut `ready` ;
- exemplaire ailleurs : ligne de transit vers ce site. La réservation ne devient `ready` qu’à la réception.

`/transits` suit ces mouvements. Annuler la réservation pendant le transit ouvre un transit de retour vers le lieu d’origine.

### Statuts et actions

`TransitStatus` est stocké en minuscules. Le JSON et l’interface utilisent le camelCase pour `inTransit`.

| Stocké | Interface | Libellé |
| --- | --- | --- |
| `requested` | `requested` | Demandé |
| `in_transit` | `inTransit` | En transit |
| `received` | `received` | Réceptionné |
| `cancelled` | `cancelled` | Annulé |

L’écran `/transits` filtre par En cours, Demandé, En transit ou Tous. Un exemplaire `in_transit` n’est pas prêtable.

| Action | Libellé | Condition |
| --- | --- | --- |
| Démarrer le transit | « Démarrer le transit » | Le bouton apparaît pour une réservation `pending` qui a un site de retrait et aucun transit actif. Il est masqué si l’exemplaire choisi est déjà sur ce site. Le serveur accepte aussi une réservation `to_pick` : il la repasse alors à `pending` |
| Expédier immédiatement | « Expédier immédiatement (en transit) » | Case au démarrage (`ship: true`). Le transit est créé directement en `in_transit`, sans passer par `requested` |
| Expédier | « Expédier » | Statut stocké `requested`. Le transit passe à `in_transit` |
| Réceptionner | « Réceptionner » | Statut `in_transit`. L’exemplaire prend le site de destination. Si le transit est lié à une réservation `pending`, cette réservation devient `ready` |
| Annuler le transit | « Annuler le transit » | Statut `requested` ou `in_transit`. La réservation liée reste. Pour un transit déjà `in_transit`, l’interface envoie `reverse: true` : le serveur ouvre un transit `requested` de la destination vers l’origine, sans réservation attachée |

La liste de prélèvement filtre par le site actuel de l’exemplaire.

## Règles communes

Les plafonds de prêt, les types de public et les amendes sont ceux de l’installation, pas un barème par site. Un exemplaire `in_transit` n’est pas prêtable. Un transit `requested` bloque aussi le prêt : `force` ne lève pas ce blocage (`business_rule_violation`).
