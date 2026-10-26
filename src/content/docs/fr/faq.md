---
title: Aide et questions fréquentes
description: Questions fréquentes sur l’installation, la connexion, les prêts et les données.
navTitle: Aide et questions
order: 60
section: help
draft: false
locale: fr
---

Les pannes de démarrage sont dans [Dépannage](/fr/documentation/troubleshooting/). Un bug se signale dans les issues du dépôt du logiciel, lien « GitHub » du site.

## Installation

**Faut-il un administrateur au premier lancement ?**
Non. Tant que la base n’a ni compte ni réglage enregistré, l’interface ouvre l’assistant. Il n’y a pas de mot de passe livré.

**Quelle installation choisir ?**
Une seule image pour tout regrouper. Plusieurs services pour séparer l’interface, le serveur, la base, le cache et la recherche. Les ports par défaut ne sont pas les mêmes. Voir [Installation](/fr/documentation/installation/) et le [déploiement](/fr/dev/deployment/).

**Où essayer sans installer ?**
Le bouton Démo de l’en-tête ouvre une instance de démonstration, distincte de ce site.

## Connexion

**Le formulaire de connexion n’est pas sur une page à part.**
Il est sur la page d’accueil, à côté du catalogue public.

**Le mot de passe oublié ne donne rien.**
Sans adresse publique de la bibliothèque, le message ne part pas. Au-delà de trois demandes par heure pour le même identifiant, la réponse reste un succès général et aucun message ne part.

**Trop d’essais.**
Cinq échecs en quinze minutes sur le même identifiant bloquent les essais suivants. Ce n’est pas un verrouillage définitif du compte. Le personnel lève le blocage sur la fiche lecteur.

## Prêts et réservations

**Le bouton de prêt n’est pas dans le menu.**
Le guichet suit le droit de prêt : lecture pour ouvrir l’écran, écriture pour prêter. Un lecteur prolonge dans Mes emprunts.

**Une réservation ne prévient pas tout de suite.**
Tant que l’exemplaire est encore en rayon, à prélever, le lecteur n’est pas notifié. Le message part quand la réservation est prête.

**La prolongation est refusée avant l’échéance.**
La fenêtre par défaut est de sept jours avant la date de retour. En dehors, le logiciel refuse, sauf si le prêt est déjà en retard.

## Données

**Supprimer un lecteur efface-t-il les statistiques ?**
L’action « Anonymiser pour les stats » retire l’identité et garde des dimensions non nominatives sur les archives de prêts. Voir [Administration](/fr/documentation/administration/).

**Les captures de ce site sont-elles le logiciel ?**
Oui. Elles viennent d’une instance lancée depuis la branche de développement, avec des lecteurs fictifs et des titres du domaine public. Aucune ne montre le nom d’un lecteur sur un ticket, une étiquette ou un rapport de lot.
