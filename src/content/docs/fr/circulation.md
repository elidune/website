---
title: Prêts et retours
description: Guichet de prêt et de retour, forçage avec motif, états des exemplaires et comptoir sur tablette.
navTitle: Prêts et retours
order: 36
section: features
draft: false
locale: fr
---

L’écran s’ouvre avec le droit de consulter les prêts. Prêter, rendre, prolonger et enregistrer une exception demandent le droit de modifier les prêts. Le menu s’intitule **Circulation**. Le seul droit de réservation ne suffit pas.

Quatre onglets : prêt, retour, retards, réclamations.

![Guichet des emprunts, thème clair.](screen:desk "Le guichet, avec le lecteur et les actions prolonger, retour, perdu ou abîmé.")

## Comptoir sur tablette

En dessous de 1024 pixels de large, le texte de base passe de 16 à 14 pixels. En dessous de 1024 pixels de large ou de 768 pixels de haut, le menu latéral se replie. En dessous de 768 pixels, la liste des prêts en cours s’affiche en cartes plutôt qu’en tableau. Les champs de code-barres acceptent une douchette et, sur l’appareil, la caméra.

## Prêter

1. Choisir le lecteur, par le nom ou par le code-barres de la carte. Un scan de carte exact montre l’état du compte. La recherche par nom demande le droit de lire les lecteurs.
2. Scanner le code-barres de l’exemplaire. Un seul prêt actif par exemplaire.

Le logiciel calcule la date de retour à partir de la durée du type de document et du type de public (voir [Premiers pas](/fr/documentation/getting-started/)). Si le report des jours de fermeture est actif, la date tombe le prochain jour d’ouverture. Le prêt enregistre le site où il est fait. Un exemplaire de dépôt peut plafonner cette date : voir [Dépôts](/fr/documentation/deposits/).

### Refus et forçage

Un refus affiche son motif. Certains se forcent, d’autres non.

| Situation | Forçable | Motif obligatoire |
| --- | --- | --- |
| Abonnement expiré | Oui, avec le droit de dérogation | Oui |
| Exemplaire réservé pour un autre lecteur | Oui, avec le droit de dérogation | Oui |
| Amendes au-dessus du seuil | Oui, avec le droit de modifier les prêts | Non |
| Plafond de prêts, plafond par support, exemplaire non empruntable | Oui, en forçant | Non |
| Carte déclarée perdue, exemplaire déjà mis de côté pour quelqu’un d’autre, dépôt à rendre, exemplaire déjà renvoyé au prêteur | Non | — |

Sans motif alors qu’il est exigé, le forçage est refusé. Le bouton **Forcer le prêt** n’apparaît que si le refus est forçable et si le compte peut modifier les prêts. Le bibliothécaire livré n’a pas le droit de dérogation : seul l’administrateur livré peut forcer un abonnement expiré ou un exemplaire réservé à un autre lecteur, tant que ce droit n’est pas accordé dans Paramètres.

Lorsqu’un exemplaire est réservé pour quelqu’un d’autre, le guichet propose aussi **Mettre de côté**, sans quitter le prêt. Si l’exemplaire est déjà mis de côté, le prêt ne se force pas.

Une carte déclarée perdue bloque le prêt et la prolongation. Les retours et le paiement des amendes restent possibles. Le bandeau du guichet le dit. Déclarer la perte et remplacer la carte n’ont pas de bouton dans l’interface de cette version. Voir [Lecteurs](/fr/documentation/patrons/).

Un prêt de plusieurs exemplaires d’un coup existe pour les outils qui s’y connectent. L’écran du guichet scanne un exemplaire à la fois.

## États de l’exemplaire

L’état de circulation est indépendant de la simple ligne de prêt.

| État | Effet |
| --- | --- |
| Disponible | Empruntable, si les autres règles le permettent |
| Perdu | Absent du catalogue public |
| Abîmé | Non empruntable |
| Déclaré rendu | Le lecteur dit l’avoir rendu |
| À rechercher | Encore listé, indisponible au public |
| Manquant | Absent du catalogue public |

Ces états se changent par les actions du guichet, pas en éditant la fiche.

Un prêt archivé se ferme pour retour (retour, retour abîmé, ou déclaration « dit rendu » retrouvée) ou pour perte (déclaré perdu, ou déclaration non retrouvée). Si l’exemplaire perdu est accepté plus tard, l’écran affiche « Perdu, retrouvé le … ».

## Rendre

Onglet Retour : le champ code-barres garde le focus pour une douchette. Scanner clôt le prêt. Un code qui n’est pas en prêt peut répondre par une information (déjà rendu, perdu, à rechercher, et ainsi de suite) plutôt que par un simple échec.

Si une réservation de la même notice attend un exemplaire, le retour ne le remet pas simplement en rayon. Il le passe à « prêt à retirer », ou il ouvre un transit. Voir [Réservations](/fr/documentation/holds/).

Le retour de plusieurs codes d’un coup existe pour les outils connectés. Le guichet scanne un code à la fois.

## Prolonger

Le lecteur prolonge son propre prêt dans Mes emprunts. Le personnel prolonge depuis le guichet.

Conditions lues dans les règles :

- il reste des prolongations ; sinon le refus se force avec le droit de modifier les prêts ;
- la date du jour est dans la fenêtre (sept jours avant l’échéance, par défaut), ou le prêt est déjà en retard ; trop tôt se force de la même façon ;
- le point de départ choisi (échéance actuelle, ou jour de la prolongation) fixe la nouvelle échéance ;
- un compte bloqué se force avec le droit de modifier les prêts ;
- un abonnement expiré se force comme au prêt, avec le droit de dérogation et un motif.

La date affichée après prolongation est celle calculée par le logiciel.

## Retards et exceptions

L’onglet Retards liste les prêts échus. Chaque ligne peut être rendue ou prolongée.

Exceptions, avec le droit de modifier les prêts :

| Action | Effet |
| --- | --- |
| Perdu | Le prêt se ferme comme perdu. Une amende de remplacement peut suivre |
| Abîmé | Rendre clôt le prêt. Garder le laisse ouvert, marqué abîmé |
| Déclaré rendu par le lecteur | Ouvre une réclamation |
| Clore cette déclaration | Retrouvé, ou non retrouvé |

La liste des déclarations ouvertes est l’onglet Réclamations. La clôture et le journal s’écrivent ensemble.

L’envoi manuel des relances de retard est réservé à l’administrateur. Le planning automatique est dans [Relances et amendes](/fr/documentation/reminders-fines/).
