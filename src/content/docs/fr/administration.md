---
title: Administration
description: Paramètres, droits, envoi d’e-mails, anonymisation et journal d’audit.
navTitle: Administration
order: 50
section: admin
draft: false
locale: fr
---

Les paramètres s’ouvrent depuis le menu du même nom. Un administrateur voit tous les onglets. Un bibliothécaire ne voit que Bibliothèque.

![Paramètres de la bibliothèque, thème clair.](screen:settings "L’onglet Bibliothèque : nom, adresse et contact.")

## Onglets

| Onglet | Contenu |
| --- | --- |
| Bibliothèque | Nom, adresse, pays, fuseau, contact, horaires |
| Paramètres des emprunts | Durées, plafonds, renouvellement, réservations, relances, amendes, seuil d’impayés |
| Types de public | Publics, âges, abonnement, exceptions de prêt |
| Types de compte | Droits par type de compte |
| Modèles d’e-mails | Textes envoyés |
| Gestion des sites | Lieux de conservation et de retrait |
| Serveurs Z39.50 | Cibles d’import, si le module est actif |
| Modules | Fonctionnalités facultatives, y compris le profil essentiel |
| Serveur | Relances, expiration des réservations, journaux, conservation de l’audit, envoi d’e-mails, réindexation, sauvegarde de la base |
| Audit | Journal des opérations sensibles |

L’onglet Serveur a trois sous-onglets : Général, Catalogue, Base de données. Une section marquée non modifiable depuis l’interface reste celle du fichier de configuration. « Revenir au fichier » efface la surcharge enregistrée dans la base.

Les sections que le modèle permet de surcharger incluent la journalisation, l’e-mail, les relances, l’audit et les réservations.

## Rôles et droits

Le type de compte porte des niveaux. Pour les documents, les lecteurs, les paramètres et les événements : aucun, lecture, écriture. Pour les prêts et les réservations : aucun, soi-même, lecture, écriture.

| Type | Documents | Lecteurs | Prêts | Réservations | Paramètres |
| --- | --- | --- | --- | --- | --- |
| Invité | lecture | aucun | aucun | aucun | lecture |
| Lecteur, groupe | lecture | soi-même | soi-même, sans le guichet | soi-même | lecture |
| Bibliothécaire | écriture | écriture | écriture | écriture | lecture |
| Administrateur | écriture | écriture | écriture | écriture | écriture |

Le niveau « soi-même » sur les prêts ne permet pas d’ouvrir le guichet. Il permet au lecteur de voir et de prolonger ses prêts. Le niveau « soi-même » sur les réservations permet de créer et d’annuler les siennes.

D’autres droits existent sur le type de compte : acquisitions, désherbage, annulation d’un désherbage, archivage d’un exemplaire, dérogation de circulation, événements. Le bibliothécaire livré a l’écriture partout sauf les paramètres (lecture) et la dérogation de circulation (aucun). L’administrateur livré a l’écriture, y compris cette dérogation. Des types personnalisés se créent dans l’onglet Types de compte. Les types livrés avec le logiciel ne se suppriment pas.

L’onglet Modules active ou coupe les fonctions facultatives, y compris le profil essentiel. Ce profil désactive acquisitions, suggestions d’achat, désherbage, transits, dépôts et compteurs de fréquentation, même si les cases correspondantes sont cochées. Événements, inventaire, Z39.50, import MARC et statistiques restent actifs. Une fonction coupée répond par un refus. Les compteurs de fréquentation n’ont pas d’écran, seulement l’interrupteur.

Changer le type d’un utilisateur reste une action d’administrateur.

Les opérations de serveur (configuration, essai d’envoi, réindexation, audit, sauvegarde) exigent un compte administrateur.

## E-mail

Lorsque la section e-mail peut être surchargée, l’onglet Serveur enregistre l’hôte, le port (587 par défaut), l’identifiant, le mot de passe, l’adresse d’expéditeur, le nom d’expéditeur et le chiffrement. Le mot de passe n’est pas renvoyé en clair par l’écran. Un envoi d’essai existe pour l’administrateur.

Ne pas enregistrer une valeur vide à la place d’un réglage facultatif : laisser le champ de côté.

L’adresse publique de la bibliothèque, sans barre finale, est l’origine des liens dans les messages. Vide, la réinitialisation de mot de passe n’envoie rien. Les annonces d’événements pointent vers la page de désinscription.

Modèles livrés : trois relances de retard, réservation prête, mot de passe oublié, code de second facteur, code de secours, annonce d’événement, prêt clos par un inventaire.

## Anonymisation

L’action du guichet s’appelle « Anonymiser pour les stats ». Si le lecteur a encore des prêts actifs, l’action peut d’abord les rendre, puis effacer, lorsqu’elle est confirmée.

L’identifiant interne n’est pas réécrit. Le compte passe à l’état supprimé, les sessions sont révoquées, et les champs d’identité (identifiant, mot de passe, nom, e-mail, adresse, téléphone, code-barres, date de naissance, notes, second facteur) sont vidés. Le type de compte, le type de public, la date de création et la date de fin d’abonnement restent. Les archives de prêts gardent des dimensions (tranche d’âge à la date du prêt, année, ville, type de public, type de compte) et perdent le lien vers la personne. Les réservations actives sont supprimées. Les amendes perdent le lecteur. Les messages en attente vers cette adresse sont supprimés. Le journal d’audit ne stocke pas les données effacées.

Le passage automatique, en années après la fin d’abonnement, est arrêté par défaut (zéro année). Une valeur souvent retenue pour une bibliothèque municipale est de trois ans après la date de fin. La tâche tourne à 4 h. Elle ignore les lecteurs qui ont encore un prêt actif. Chaque anonymisation est journalisée.

L’action est irréversible. Le détail colonne par colonne est dans la documentation technique du dépôt logiciel, rappelée dans le [modèle de données](/fr/dev/data-model/).

## Journaux

Deux journaux distincts :

- **Application.** Niveau, format et sortie se règlent dans le fichier ou, lorsque la section est surchargeable, dans l’onglet Serveur. Ce journal sert au diagnostic. Il n’est pas le journal d’audit.
- **Audit.** Consultable par un administrateur, avec un export. La conservation par défaut est de 365 jours. Les lignes plus anciennes sont supprimées. L’onglet Audit les affiche.

La première configuration écrit un événement de fin d’assistant (nom de la bibliothèque, présence ou non d’un envoi d’e-mails), sans le mot de passe.
