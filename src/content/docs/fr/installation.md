---
title: Installation avec Docker
description: Structure prévue du guide d'installation Docker. Brouillon, sans procédure pas à pas vérifiée.
navTitle: Installation
order: 1
draft: true
locale: fr
---

Cette page fixe le plan du guide d'installation. Elle ne remplace pas le guide du dépôt [elidune/elidune](https://github.com/elidune/elidune/blob/main/docs/README-docker.md).

## Ce que le guide couvrira

- Prérequis (Docker et Compose).
- Choix entre la pile multi-services et l'image tout-en-un.
- Fichier d'environnement et secrets.
- Démarrage, vérification, sauvegardes et mises à jour.

## Faits déjà écrits dans le dépôt du logiciel

Le README et `docs/README-docker.md` indiquent :

- deux fichiers Compose, `docker/docker-compose.yml` et `docker/docker-compose.all-in-one.yml` ;
- une image publiée `ghcr.io/elidune/elidune-all-in-one` ;
- l'absence de compte administrateur par défaut : le premier lancement passe par l'assistant de l'interface.

Les commandes, ports et variables exacts restent ceux de ce guide. Ils ne sont pas recopiés ici tant que cette page n'est pas relue.
