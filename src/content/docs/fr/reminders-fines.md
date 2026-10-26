---
title: Relances et amendes
description: Trois niveaux de relance, montants en euros et paiement plafonné au reste dû.
navTitle: Relances et amendes
order: 38
section: features
draft: false
locale: fr
---

Les relances et le calcul des amendes se règlent dans Paramètres, onglet des emprunts, et dans Paramètres, Serveur (horaire d’envoi, activation). Un compte administrateur est requis pour ces écrans. L’interface saisit les montants en euros, avec deux décimales. Le logiciel les conserve en centimes : 0,20 € est stocké comme 20, et 15,00 € comme 1500.

## Trois relances

Si l’envoi est activé (c’est le cas du réglage livré) :

| Niveau | Délai après l’échéance | Message |
| --- | --- | --- |
| Première relance | 7 jours | 1er rappel |
| Deuxième relance | 14 jours | 2e rappel |
| Mise en demeure | 21 jours | Mise en demeure |

Désactiver le premier niveau désactive les deux suivants. Désactiver le deuxième désactive la mise en demeure. L’heure d’envoi par défaut est 9 h. Un court intervalle sépare deux messages, pour ne pas saturer le serveur d’envoi. Le niveau suivant dépend du nombre de relances déjà parties : aucune, puis une, puis deux, puis plus rien.

Les textes sont livrés en français, anglais, allemand et espagnol. L’onglet Modèles d’e-mails n’édite que le français et l’anglais. La langue du message suit la préférence du lecteur, puis la langue de la bibliothèque, puis le français, puis l’anglais. Voir [Langues](/fr/documentation/languages/). Sans serveur d’envoi configuré, rien ne part.

L’envoi n’a lieu que si le destinataire a une adresse e-mail et a accepté les relances (c’est le cas à la création du compte). L’envoi immédiat, hors planning, est réservé à l’administrateur. Couper le calcul des amendes n’arrête pas les e-mails de relance.

## Amendes

La règle livrée, sans type de document particulier, a un tarif journalier de 0,20 €, un plafond de 15,00 € et 3 jours de grâce. Le montant est le tarif multiplié par les jours de retard au-delà de la grâce, puis plafonné s’il existe un maximum. Une seule amende ouverte par prêt et par type de charge.

| Charge | Sens |
| --- | --- |
| Retard | Jours au-delà de l’échéance |
| Remplacement | Exemplaire perdu |
| Dégât | Exemplaire abîmé |

| Situation | Sens |
| --- | --- |
| Impayée | Rien n’a été encaissé |
| Partiellement payée | Un acompte a été encaissé |
| Payée | Le reste dû est nul |
| Exonérée | Le personnel a annulé la dette |
| Annulée | Rien n’avait été encaissé, la ligne est close |
| Remboursée | Ce qui avait été encaissé a été rendu |

Le passage de nuit recalcule l’amende de retard lorsque le calcul est activé (c’est le cas du réglage livré). Le personnel peut aussi lancer le calcul d’un prêt. La fiche lecteur, onglet Amendes, liste les lignes pour qui peut lire les lecteurs.

Les boutons d’encaissement et d’exonération de cette liste ne sont pas branchés dans l’interface de cette version. L’encaissement et l’exonération existent pour les outils connectés. Le détail est dans la [référence d’API](/fr/dev/api/).

### Paiement plafonné au reste dû

Un paiement supérieur au reste dû est refusé. Un montant nul ou négatif est refusé. La somme encaissée ne dépasse jamais le montant de l’amende. Un remboursement ne dépasse jamais ce qui a été encaissé. Il est produit quand un exemplaire perdu est retrouvé, pas par un second paiement.

## Seuil de blocage

Le blocage sur impayé n’a lieu que si le calcul des amendes est activé. Sinon les seuils enregistrés sont ignorés pour le prêt. Les factures de perte et de dégât restent visibles.

Le mode global est « aucun » ou « un montant ». Une installation neuve part de « aucun » : pas de blocage sur le montant. En mode montant, un solde impayé **strictement supérieur** au seuil bloque le prêt et la prolongation. Avec un seuil à 0, tout solde positif bloque. Ce refus se force avec le droit de modifier les prêts, sans motif obligatoire. Voir [Prêts et retours](/fr/documentation/circulation/).

Un type de public a son propre mode : suivre le réglage global, ne jamais bloquer sur le montant, ou appliquer ses propres centimes. Le défaut des types livrés est de suivre le réglage global.
