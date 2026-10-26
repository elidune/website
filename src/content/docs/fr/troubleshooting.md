---
title: Dépannage
description: Démarrage, connexion, envoi d’e-mails, recherche vide et restauration.
navTitle: Dépannage
order: 61
section: help
draft: false
locale: fr
---

Les commandes et les noms de réglages sont dans le [déploiement](/fr/dev/deployment/). Cette page décrit ce que le personnel et la personne qui installe peuvent constater.

## Le logiciel ne démarre pas

Regarder l’état des services et les dernières lignes du journal. Les commandes sont dans le déploiement.

**Réglages introuvables.** Lancer la pile depuis le dossier qui contient le fichier d’environnement, ou indiquer ce fichier explicitement.

**Port déjà pris.** Changer le port publié, arrêter la pile, puis la relancer. Les ports à l’intérieur de l’image tout-en-un ne changent pas.

**Image refusée.** Se connecter au registre avant de télécharger l’image. Le compte utilisé doit pouvoir la lire.

**Ligne vide.** Une variable écrite sans valeur peut faire échouer la lecture de la configuration. Supprimer la ligne.

**Recherche qui refuse sa clé.** En mode de production, la clé compte au moins 16 caractères. La remplacer, puis redémarrer, pour que le moteur de recherche suive.

L’indicateur de santé distingue un service sain, une première configuration encore nécessaire, et une base injoignable. Son adresse est dans le déploiement.

## Connexion

Trop de tentatives depuis la même adresse ralentissent la connexion pendant une minute. Ce n’est pas un mot de passe faux. Derrière un serveur web qui regroupe tous les guichets sur une seule adresse, élargir le quota ou déclarer ce serveur comme intermédiaire de confiance, afin que chaque guichet soit compté à part. Le détail est dans l’[authentification](/fr/dev/authentication/).

Le blocage par identifiant (cinq échecs en quinze minutes) se lève depuis la fiche lecteur, par un membre du personnel qui peut modifier les lecteurs.

## E-mail

Pas de message de réinitialisation : vérifier l’adresse publique de la bibliothèque, l’hôte d’envoi, l’expéditeur, et que la section e-mail peut être modifiée depuis l’interface si les valeurs viennent de l’écran. L’essai d’envoi est réservé à l’administrateur, dans les paramètres du serveur.

## Recherche vide après un import

L’index de recherche est distinct de la base. Après un import important ou une restauration, lancer la réindexation (Paramètres, Serveur, Catalogue). Si le moteur de recherche est arrêté, la recherche utilise la base.

## Restauration

Restaurer une sauvegarde remplace toute la base. La taille envoyée est limitée. Prévoir une fermeture. Si des connexions restent ouvertes après la restauration, redémarrer le serveur.
