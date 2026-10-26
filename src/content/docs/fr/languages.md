---
title: Langues
description: Langue de l’interface, langue du compte et langue de la notice.
navTitle: Langues
order: 42
section: features
draft: false
locale: fr
---

Deux familles de langues coexistent. Elles ne se règlent pas au même endroit.

## Interface

L’interface React est traduite en anglais, français, allemand et espagnol (`ui/src/locales/{en,fr,de,es}/translation.json`). Les quatre fichiers portent les mêmes clés.

Sans session, la langue suit le navigateur. Avec une session, elle suit la langue enregistrée sur le compte, puis le choix mémorisé. Le sélecteur est dans la barre de l’application (clair, sombre ou système est un réglage distinct, pas une langue).

À la première configuration, le compte administrateur choisit parmi ces quatre langues. Le profil (`/profile`) la modifie ensuite. Le serveur stocke un nom long (`french`, `english`, `german`, `spanish`), pas le code court.

## Notices et comptes

La langue d’une notice ou d’un usager utilise la liste du serveur : `unknown`, `french`, `english`, `german`, `spanish`, `italian`, `portuguese`, `japanese`, `chinese`, `russian`, `arabic`, `dutch`, `swedish`, `norwegian`, `danish`, `finnish`, `polish`, `czech`, `hungarian`, `romanian`, `turkish`, `korean`, `latin`, `greek`, `croatian`, `hindi`, `hebrew`, `persian`, `catalan`, `thai`, `vietnamese`, `indonesian`, `malay`.

Seules les quatre premières langues parlées ont une interface traduite. Les autres restent des valeurs de fiche.

## Modèles d’e-mail

Les fichiers livrés existent en `.french.json` et `.english.json` : relances, réservation prête, réinitialisation de mot de passe, code de second facteur, code de secours, annonce d’événement, prêt clos par inventaire. L’onglet Modèles d’e-mails édite ces textes. Les langues empaquetées sont `english` et `french` (`SUPPORTED_LANGUAGES`).

À l’envoi, le serveur lit la langue du compte destinataire (`users.language`), pas la langue affichée dans l’interface. Les relances, l’e-mail de réservation prête, l’annonce d’événement, le prêt clos par inventaire, la réinitialisation de mot de passe et le code de second facteur passent cette valeur à `language_chain` (`server/src/email_templates.rs`).

La chaîne de résolution :

| Langue du compte | Ordre des modèles |
| --- | --- |
| `english` | `english`, puis `french` |
| `french` | `french`, puis `english` |
| absente (`NULL`), `unknown`, ou toute autre valeur (`german`, `spanish`, `italian`, …) | `french`, puis `english` |

Pour chaque langue de la chaîne, une ligne déjà enregistrée en base est essayée d’abord, puis le fichier `{id}.{langue}.json`. La colonne `users.language` est `VARCHAR(32) DEFAULT 'french'` et reste nullable. Un compte qui a gardé cette valeur par défaut est déjà en `french`. Une préférence absente, stockée `NULL`, suit la même chaîne français puis anglais.
