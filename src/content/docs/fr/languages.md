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

La langue d’une notice ou d’un lecteur utilise la liste du serveur : `unknown`, `french`, `english`, `german`, `spanish`, `italian`, `portuguese`, `japanese`, `chinese`, `russian`, `arabic`, `dutch`, `swedish`, `norwegian`, `danish`, `finnish`, `polish`, `czech`, `hungarian`, `romanian`, `turkish`, `korean`, `latin`, `greek`, `croatian`, `hindi`, `hebrew`, `persian`, `catalan`, `thai`, `vietnamese`, `indonesian`, `malay`.

Seules les quatre premières langues parlées ont une interface traduite. Les autres restent des valeurs de fiche.

## Modèles d’e-mail

`SUPPORTED_LANGUAGES` accepte `english`, `french`, `german` et `spanish`. L’onglet Modèles d’e-mails n’édite que le français et l’anglais.

Deux chaînes coexistent dans `server/src/email_templates.rs`. Aucune ne lit la langue affichée dans l’interface.

**Avis au lecteur** (`notice_language_order`) : relances, réservation prête (`hold_ready`), réinitialisation de mot de passe. Ordre : langue du compte si elle est française, anglaise, allemande ou espagnole, puis langue de la bibliothèque, puis français, puis anglais. L’italien, `unknown` et une valeur absente sont sautés. Les fichiers livrés de ces modèles existent dans les quatre langues.

**Autres messages** (`language_chain`) : code de second facteur, code de secours, annonce d’événement, prêt clos par inventaire. Français puis anglais, ou anglais puis français. Toute autre langue, y compris l’allemand et l’espagnol, commence par le français. Ces modèles ne sont livrés qu’en `.french.json` et `.english.json`.

Pour chaque langue, une ligne déjà enregistrée en base est essayée d’abord, puis le fichier `{id}.{langue}.json`. La colonne `users.language` est `VARCHAR(32) DEFAULT 'french'` et reste nullable.
