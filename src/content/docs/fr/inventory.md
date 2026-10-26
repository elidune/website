---
title: Inventaire
description: Session d’inventaire, scan des codes-barres, clôture et consolidation.
navTitle: Inventaire
order: 34
section: features
draft: false
locale: fr
---

L’inventaire est réservé au personnel qui peut modifier les exemplaires, et au module d’inventaire.

![Session d’inventaire, thème clair.](screen:inventory "Une session ouverte, avec le champ de scan des codes-barres.")

Une session est **ouverte** ou **clôturée**. Le badge « Consolidée » apparaît après la consolidation. Il n’y a pas d’autre état.

Le périmètre se fixe à la création : un site facultatif, et un code lieu facultatif. Il ne se modifie plus ensuite. Les deux vides, le décompte porte sur les exemplaires actifs, non archivés. Le texte « indication de lieu » reste un libellé d’affichage. Le logiciel ne filtre pas les exemplaires avec ce texte.

1. Créer une session avec un libellé. Le site et le code lieu sont facultatifs.
2. Tant que la session est ouverte, enregistrer chaque exemplaire par code-barres, ou importer une liste. Plus de 500 codes d’un seul envoi sont refusés. L’interface découpe les listes plus longues. L’import d’une longue liste se fait en tâche de fond.
3. Chaque scan reçoit un résultat : trouvé dans le périmètre, trouvé hors périmètre, trouvé mais déjà archivé, ou code-barres inconnu. Un même code peut être lu plusieurs fois. Le rapport compte ces lectures en trop comme doublons. La liste des manquants reprend les exemplaires actifs du périmètre absents du journal de la session.
4. Clôturer passe la session à « clôturée ». Une session close refuse tout nouveau scan. Le rapport d’écart reprend les attendus du périmètre, les hors périmètre, les archivés, les codes inconnus et les doublons.
5. Après la clôture, la consolidation archive les exemplaires manquants du périmètre. Une notice sans exemplaire actif restant est archivée. Sans forcer, les exemplaires en prêt actif sont laissés de côté et la session n’est pas marquée consolidée, afin de pouvoir relancer en forçant. En forçant, ces prêts sont clos. Les lecteurs concernés reçoivent un message, en français ou en anglais selon la chaîne de langue décrite dans [Langues](/fr/documentation/languages/).

La consolidation est irréversible pour les exemplaires archivés et, si elle est forcée, pour les prêts qu’elle clôt. Lire le rapport et l’aperçu avant de confirmer.

La consolidation peut aussi s’exécuter en tâche de fond. Le personnel suit l’avancement depuis l’écran.
