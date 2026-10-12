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

Les fichiers livrés existent en `.french.json` et `.english.json` : relances, réservation prête, réinitialisation de mot de passe, code de second facteur, code de secours, annonce d’événement, prêt clos par inventaire. L’onglet Modèles d’e-mails édite ces textes.

> **TODO.** Le critère qui choisit le fichier `.french` ou `.english` au moment de l’envoi (langue du compte, langue de l’interface, repli) n’a pas été vérifié dans le service d’e-mail pour cette page.
