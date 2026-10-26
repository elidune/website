---
title: Aide et questions fréquentes
description: Questions fréquentes sur l’installation, la connexion, les prêts et les données.
navTitle: Aide et questions
order: 60
section: help
draft: false
locale: fr
---

Les pannes de démarrage sont dans [Dépannage](/fr/documentation/troubleshooting/). Le signalement de bug se fait sur les issues de [elidune/elidune](https://github.com/elidune/elidune/issues).

## Installation

**Faut-il un administrateur au premier lancement ?**  
Non. Tant que la base n’a ni lecteur ni réglage enregistré, l’interface ouvre `/first-setup`. Il n’y a pas de mot de passe livré.

**Quelle image choisir ?**  
`elidune-all-in-one` pour un seul conteneur. `elidune-server` et `elidune-ui` pour séparer l’API, l’interface, PostgreSQL, Redis et Meilisearch. Les ports par défaut ne sont pas les mêmes. Voir [Installation](/fr/documentation/installation/).

**Où est la démo ?**  
Le README du logiciel indique `https://elidune.b-612.fr/`. Ce site de présentation pointe aussi vers `https://elidune-demo.b-612.fr`.

## Connexion

**La page `/login` est vide de formulaire.**  
Elle redirige vers `/`.

**Le mot de passe oublié ne donne rien.**  
Sans `ELIDUNE_SERVER__PUBLIC_BASE_URL`, le serveur n’envoie pas le message. Au-delà de trois demandes par heure pour le même identifiant, la réponse reste un succès générique et aucun message ne part.

**Trop d’essais.**  
Cinq échecs en 15 minutes sur le même identifiant bloquent les essais suivants. Ce n’est pas un verrouillage définitif du compte. Le personnel lève le blocage sur la fiche lecteur.

## Prêts et réservations

**Le bouton de prêt n’est pas dans le menu.**  
`/loans` suit le droit `loans_rights` (lecture pour ouvrir l’écran, écriture pour prêter). Un lecteur prolonge dans `/my-loans`.

**Une réservation ne prévient pas tout de suite.**  
Tant que l’exemplaire est encore en rayon (`to_pick`), le lecteur n’est pas notifié. La notification part quand le statut devient `ready`.

**Le renouvellement est refusé avant l’échéance.**  
La fenêtre par défaut est de 7 jours avant la date de retour. En dehors, le serveur refuse, sauf si le prêt est déjà en retard.

## Données

**Supprimer un lecteur efface-t-il les statistiques ?**  
L’action « Anonymiser pour les stats » retire l’identité et garde des dimensions non nominatives sur les archives de prêts. Voir [Administration](/fr/documentation/administration/).

**Les captures d’écran de ce site sont-elles le logiciel ?**  
Oui. Elles viennent d’une instance lancée depuis la branche `dev`, avec des lecteurs fictifs et des titres du domaine public. Aucune ne montre le nom d’un lecteur sur un ticket, une étiquette ou un rapport de lot.
