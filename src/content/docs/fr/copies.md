---
title: Exemplaires
description: Exemplaires physiques, code-barres, cote, disponibilité, archivage et lien avec l’inventaire.
navTitle: Exemplaires
order: 32
section: features
draft: false
locale: fr
---

Un exemplaire est l’objet prêté. Il est toujours rattaché à une notice.

## Créer

Depuis la fiche notice, le personnel ajoute un exemplaire. Les champs utiles au guichet sont le code-barres, la cote, le site, et le fait que l’exemplaire soit empruntable. Un code-barres déjà présent demande une confirmation.

La réception peut être marquée incomplète. Tant qu’elle ne l’est pas, l’exemplaire n’est pas prêtable et ne peut pas être affecté à une réservation.

## Disponibilité

Le logiciel calcule un état. Il ne se contente pas de savoir si l’exemplaire est sorti. L’ordre est : en prêt, en transit, réservé, à rechercher, indisponible, disponible.

| État affiché | Sens |
| --- | --- |
| Disponible | En rayon, prêtable si les autres règles le permettent |
| En prêt | Sorti |
| En transit | En route vers un autre site |
| Réservé | Affecté à une réservation en cours de prélèvement ou prête à retirer |
| À rechercher | Introuvable au prélèvement. Le catalogue public le regroupe avec « indisponible » |
| Indisponible | Réception incomplète, perdu, abîmé, déclaré rendu, ou sorti du fonds |

Le catalogue public omet les exemplaires perdus, manquants, candidats au désherbage et sortis du fonds. Il ne montre ni le motif de désherbage, ni le nom du lecteur qui a réservé, ni la note interne. Une étiquette de rayon ne porte pas le nom du lecteur.

La note publique est visible au catalogue public. La note interne reste au personnel. Les deux se saisissent sur la fiche.

Perdu, abîmé, déclaré rendu, à rechercher et manquant se changent depuis le guichet, pas depuis la fiche exemplaire. Voir [Prêts et retours](/fr/documentation/circulation/).

## Modifier et retirer du catalogue

Modifier la fiche met à jour le code-barres, la cote, le site et les notes. Le désherbage ne passe pas par cette fiche : voir [Désherbage](/fr/documentation/weeding/).

Retirer l’exemplaire du catalogue l’archive. Le droit nécessaire est celui d’archiver les exemplaires. Il est distinct du droit de les modifier, même si le jeu livré accorde les deux au bibliothécaire et à l’administrateur. Un lecteur ne peut pas archiver un exemplaire.

Sur le fonds propre, forcer ne change rien. Un prêt ouvert, un transit demandé ou en cours, une réservation en attente, à prélever ou prête, une amende impayée, ou un historique de prêt bloquent l’archivage. Le retrait passe alors par le désherbage.

Sur un exemplaire de dépôt dont le lot circule encore, le premier essai demande une confirmation. Confirmer archive l’exemplaire. Cela n’enregistre pas un retour au prêteur. Un prêt encore ouvert ou une amende impayée bloque. Un lot déjà en cours de retour ou clôturé refuse cet archivage : le scan de sortie du lot est la voie prévue. L’historique des prêts ne bloque pas cet exemplaire de dépôt.

## Inventaire

Le déroulement d’une session est dans [Inventaire](/fr/documentation/inventory/).
