---
title: Dépôts
description: Lots de documents reçus d’un autre établissement, prêteurs, import, retour et pertes.
navTitle: Dépôts
order: 33
section: features
draft: false
locale: fr
---

Un dépôt est un ensemble d’exemplaires qui restent la propriété d’un prêteur. Le menu **Dépôts** apparaît lorsque le module est actif et que le compte peut lire le catalogue. Créer un lot, lancer un retour ou clôturer demande le droit de modifier les exemplaires.

![Liste des lots de dépôt, thème clair.](screen:deposits "Chaque lot indique le prêteur et l’état du dépôt.")

## Prêteurs

L’onglet Prêteurs enregistre un nom unique (200 caractères au plus), un contact, des notes et, en option, un taux de remplacement strictement positif. L’archivage d’un prêteur est refusé tant qu’un de ses lots n’est pas clôturé.

## Lots

Un lot porte une référence unique pour ce prêteur, un site d’accueil, une date d’arrivée et une date de retour facultative. Sans date de retour, le dépôt est permanent. Si une date de retour est saisie, elle est au moins égale à la date d’arrivée.

| État | Sens |
| --- | --- |
| En circulation | Le lot peut être prêté |
| Retour en cours | Le retour au prêteur est lancé |
| Clôturé | Le lot est fermé, les exemplaires sont archivés |

Créer un lot le place en circulation. Changer le site du lot ne déplace pas les exemplaires déjà rattachés.

## Import en mode dépôt

L’import d’un fichier MARC se fait depuis le catalogue, onglet d’import. Le mode **Dépôt** exige un lot encore en circulation et le module d’import. Le mode **Fonds propre** exige un site.

Pour un ISBN déjà présent, l’import ajoute des exemplaires sans réécrire la notice. Le code-barres du prêteur est conservé. S’il entre en collision avec un code-barres de guichet déjà actif, le logiciel peut réétiqueter (nouveau code local), écraser ou ignorer. Sans consigne, il réétiquette. Un exemplaire déjà facturé comme perdu refuse l’import.

La recherche Z39.50 ne crée pas d’exemplaire de dépôt.

## Circulation d’un exemplaire déposé

- La date de retour d’un prêt ou d’une prolongation ne dépasse pas la date de retour du lot. L’écran signale ce plafond.
- Si cette date est aujourd’hui ou déjà passée, un nouveau prêt est refusé. Ce refus ne se force pas.
- Une prolongation qui n’avancerait pas l’échéance est refusée.
- Un lot en cours de retour, clôturé, ou dont la date de retour est dépassée, ne reçoit pas de nouvelle réservation.
- Un exemplaire déposé ne se désherbe pas.
- Un exemplaire déjà marqué comme renvoyé au prêteur refuse un nouveau prêt. Ce refus ne se force pas.
- Retirer l’exemplaire du catalogue n’enregistre pas un retour au prêteur. Voir [Exemplaires](/fr/documentation/copies/).

## Retour au prêteur

1. **Lancer le retour** passe le lot de « en circulation » à « retour en cours » et détache les réservations des exemplaires du lot. Ces réservations ne sont pas restaurées si le retour est annulé.
2. Le scan de sortie exige un lot en cours de retour. Il marque l’exemplaire comme renvoyé. Un exemplaire encore en prêt est refusé : le retour au guichet vient d’abord. Un retour au guichet pendant que le lot est en cours de retour marque aussi l’exemplaire comme renvoyé, sauf s’il est perdu.
3. **Clôturer** n’est possible qu’en cours de retour, et seulement s’il ne reste aucun prêt ouvert. Les exemplaires scannés comptent comme renvoyés. Les autres, y compris un exemplaire perdu non scanné, comptent comme manquants. La clôture archive les exemplaires du lot. Elle est définitive pour la circulation de ces exemplaires.

Le rapport de clôture compte des exemplaires. Il ne reprend pas le nom d’un lecteur.

## Pertes à signaler

Déclarer un exemplaire déposé perdu ou abîmé crée une amende de remplacement ou de dégât. Le montant suit, dans l’ordre, le taux du prêteur, le prix de l’exemplaire s’il est positif, puis un montant saisi. Sans aucun de ces montants, l’enregistrement est refusé.

Le guichet permet de déclarer la perte. La liste des pertes encore à signaler au prêteur, et le bouton qui enregistre ce signalement, ne sont pas dans l’interface de cette version. Le personnel garde donc sa propre trace jusqu’à ce que cet écran existe. Le détail technique est dans la [référence d’API](/fr/dev/api/).

## Exemplaires classés au mauvais endroit

Si des exemplaires ont été rangés sous un lieu qui était en réalité le prêteur, un administrateur peut les reclasser dans un lot. La commande et ses garde-fous sont dans le [déploiement](/fr/dev/deployment/). Sans confirmation explicite, l’opération ne fait qu’un rapport et n’écrit rien.
