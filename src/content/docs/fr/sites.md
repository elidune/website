---
title: Multi-sites
description: Sites de conservation, site de retrait et transits d’exemplaires.
navTitle: Multi-sites
order: 41
section: features
draft: false
locale: fr
---

Un lieu (rayon, annexe, bibliothèque du réseau) est un site. Le module des transits peut être coupé. Sans lui, les déplacements entre sites ne sont pas proposés.

![Liste des transits, thème clair.](screen:transits "Les exemplaires en déplacement vers un site de retrait.")

## Enregistrer les lieux

Paramètres, onglet Gestion des sites, compte administrateur :

- créer un site (un nom, et éventuellement le site par défaut) ;
- renommer ;
- archiver ;
- fusionner au moins deux sites : les exemplaires sont réaffectés, les anciens sites sont archivés.

Sur une installation actuelle, le premier site ajouté après le site d’origine s’enregistre du premier coup. Sur une base plus ancienne qui n’a pas reçu la correction des numéros, ce premier enregistrement peut échouer une fois : enregistrer à nouveau. Voir [Installation](/fr/documentation/installation/).

L’exemplaire garde le lieu où il est rangé. Le catalogue public affiche ce nom. Un prêt enregistre aussi le site du guichet. S’il est vide, les statistiques et le calendrier utilisent le site par défaut, pas le site de l’exemplaire.

## Réservation et retrait

La réservation porte un site de retrait. Au moment de l’affectation :

- exemplaire déjà sur ce site : la réservation devient prête ;
- exemplaire ailleurs : un transit part vers ce site. La réservation ne devient prête qu’à la réception.

L’écran des transits suit ces mouvements. Annuler la réservation pendant le transit ouvre un transit de retour vers le lieu d’origine.

### États et actions

| État | Sens |
| --- | --- |
| Demandé | Le déplacement est prévu, l’exemplaire n’est pas encore parti |
| En transit | L’exemplaire est en route. Il n’est pas prêtable |
| Réceptionné | L’exemplaire est arrivé |
| Annulé | Le déplacement est abandonné |

L’écran filtre par en cours, demandé, en transit, ou tous.

| Action | Condition |
| --- | --- |
| Démarrer le transit | Le bouton apparaît pour une réservation en attente qui a un site de retrait et aucun transit actif. Il est masqué si l’exemplaire choisi est déjà sur ce site. Une réservation à prélever est aussi acceptée : elle repasse alors en attente |
| Expédier immédiatement | Case au démarrage. Le transit est créé directement en route, sans passer par « demandé » |
| Expédier | L’état demandé passe à « en transit » |
| Réceptionner | L’exemplaire est en route. Il prend le site de destination. Si le transit est lié à une réservation en attente, cette réservation devient prête |
| Annuler le transit | État demandé ou en route. La réservation liée reste. Pour un transit déjà en route, l’interface demande un retour : un nouveau transit est ouvert de la destination vers l’origine, sans réservation attachée |

La liste de prélèvement filtre par le site actuel de l’exemplaire.

## Règles communes

Les plafonds de prêt, les types de public et les amendes sont ceux de l’installation, pas un barème par site. Un exemplaire en transit n’est pas prêtable. Un transit seulement demandé bloque aussi le prêt. Forcer ne lève pas ce blocage.
