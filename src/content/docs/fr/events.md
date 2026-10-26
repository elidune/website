---
title: Événements
description: Annonces d’animations, audiences, consentement d’envoi et désinscription.
navTitle: Événements
order: 42
section: features
draft: false
locale: fr
---

Le module `events` est activé par défaut. L’adresse unique est `/events`. Le même écran sert le public et le personnel : un compte dont le droit `events_rights` est en écriture crée, modifie et supprime. Le fichier `EventsPage.tsx` n’est pas branché sur le routeur. `/events/manage` redirige vers `/events`.

Le catalogue public, sur la page de connexion, liste aussi les événements publics à côté de la recherche.

## Audiences

Un événement vise tous les types de public (`allAudiences`) ou une liste de noms de types de public (`event_audiences`). Le formulaire du personnel propose le basculement « toutes les audiences » et la liste des types.

## Consentement

L’envoi repose sur le consentement du compte (`eventsConsent`), modifié dans le profil. Un compte enfant suit le consentement du responsable légal. Le détail des phrases affichées est dans l’interface (`events.childNotice` et les clés voisines). Cette page ne recopie pas le corps des e-mails.

Le modèle livré est `event_announcement`, en français et en anglais, sous `server/data/email_templates/`. L’onglet Modèles d’e-mails édite ces deux langues. L’envoi utilise `language_chain` : français ou anglais du compte, sinon français puis anglais. L’allemand et l’espagnol du compte retombent sur le français pour ce modèle. Voir [Langues](/fr/documentation/languages/).

Le lien de désinscription des messages pointe vers `{origine publique}/events/unsubscribe?token=…`. L’en-tête List-Unsubscribe utilise `{origine}/api/v1/events/unsubscribe?token=…`.

## Désinscription

`/events/unsubscribe?token=` affiche la page publique. Elle envoie `POST /api/v1/events/unsubscribe`. Le même jeton sert au clic unique côté messagerie, sur l’URL d’API.
