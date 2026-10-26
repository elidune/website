---
title: Installation
description: Préparer un serveur, choisir une image Docker, créer le premier compte administrateur, puis sauvegarder et mettre à jour.
navTitle: Installation
order: 10
section: install
draft: false
locale: fr
---

Ce guide explique comment mettre Elidune en service pour une bibliothèque. Les commandes, les noms de fichiers et les réglages du serveur sont dans le [déploiement](/fr/dev/deployment/).

Elidune est un logiciel libre, publié sous licence GNU AGPL-3.0.

## Ce qu’il faut avant de commencer

- Un ordinateur capable de lancer Docker, avec Docker Compose.
- De l’espace disque pour le logiciel, la base et l’index de recherche.
- Au moins 2 Go de mémoire pour un essai. Une bibliothèque en service a besoin de davantage.
- Les ports utilisés par l’installation choisie doivent être libres.

## Deux façons d’installer

**Une seule image.** Le serveur, l’interface, la base, le cache et la recherche tournent dans le même conteneur. C’est le chemin le plus court pour une bibliothèque qui démarre.

**Plusieurs services.** L’interface, le serveur, la base, le cache et la recherche sont séparés. Ce découpage sert quand chaque partie doit être surveillée ou sauvegardée à part.

Les deux installations ouvrent la même interface. Le choix ne change pas les écrans du guichet.

## Premier démarrage

1. Récupérer le logiciel et préparer le fichier de réglages, comme indiqué dans le [déploiement](/fr/dev/deployment/).
2. Changer les deux secrets demandés avant le premier lancement : celui qui signe les sessions, et la clé du moteur de recherche. Une clé trop courte est refusée.
3. Lancer les services.
4. Ouvrir l’interface. Tant qu’aucun compte et aucun réglage n’existent, l’assistant de première configuration s’affiche. Aucun mot de passe administrateur n’est livré avec le logiciel.

Laisser une ligne vide dans le fichier de réglages peut empêcher le démarrage. Mieux vaut supprimer la ligne que d’y écrire rien.

## Assistant de première configuration

Quatre étapes :

1. Introduction.
2. Bibliothèque : nom ou ville, pays obligatoire, fuseau horaire lorsque le pays en compte plusieurs, adresse, e-mail et téléphones facultatifs.
3. Administrateur : identifiant, mot de passe d’au moins 8 caractères, prénom, nom, sexe, date de naissance, e-mail facultatif, langue du compte (français, anglais, allemand ou espagnol). Le compte créé est un administrateur.
4. Envoi d’e-mails, facultatif. Passer l’étape laisse la configuration du fichier.

Un second passage dans l’assistant est refusé : la bibliothèque est déjà créée. Trop de tentatives depuis la même adresse ralentit l’assistant pendant une minute.

## Adresse publique et cadenas

Elidune ne termine pas lui-même le cadenas HTTPS. Un serveur web placé devant reçoit les visites chiffrées et les transmet au logiciel. Des exemples figurent dans le [déploiement](/fr/dev/deployment/).

L’adresse publique de la bibliothèque doit être enregistrée, sans barre oblique à la fin. Si elle reste vide, les messages de réinitialisation de mot de passe ne partent pas.

Si le navigateur joint l’interface et le serveur sur deux adresses différentes, l’origine autorisée doit être déclarée. Le détail est dans la documentation développeur.

## Mises à jour

1. Sauvegarder la base avant toute montée de version.
2. Choisir la version à installer : stable, version de développement, ou une version identifiée.
3. Relancer les services avec cette version.
4. Au démarrage, Elidune applique les mises à jour de base encore en attente.

Une base créée avec d’anciennes versions, avant le regroupement du schéma, doit être réalignée une seule fois avant le déploiement. Ne pas lancer cet alignement sur une base neuve. La procédure est dans le [déploiement](/fr/dev/deployment/).

Prévoir un arrêt, et essayer une restauration sur une copie avant une montée de version importante.

## Sauvegardes

Deux moyens existent.

**Depuis les paramètres**, un administrateur télécharge une sauvegarde de la base. La restauration remplace toute la base : l’opération est destructive. La prévoir pendant une fermeture. Si des connexions restent ouvertes ensuite, redémarrer le serveur. La taille envoyée est limitée.

**Les volumes Docker** conservent la base, le cache et l’index de recherche séparément. Après une restauration de la base, relancer l’indexation du catalogue dans Paramètres, Serveur, Catalogue. Sinon la recherche peut rester vide.

## Suite

- [Premiers pas](/fr/documentation/getting-started/)
- [Dépannage](/fr/documentation/troubleshooting/)
- [Déploiement](/fr/dev/deployment/)
