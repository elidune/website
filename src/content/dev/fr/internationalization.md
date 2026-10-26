---
title: Langues et messages
description: Fichiers de l’interface, langue du compte côté API, et choix de la langue d’un e-mail.
navTitle: Langues
order: 60
section: reference
draft: false
locale: fr
---

Le guide pour le personnel est [Langues](/fr/documentation/languages/). Cette page nomme les fichiers et les fonctions.

## Interface

Fichiers : `ui/src/locales/{en,fr,de,es}/translation.json`. Le registre est `ui/src/locales/languages.ts` et `ui/src/locales/index.ts`.

Codes d’interface : `en`, `fr`, `de`, `es`. Produit sans choix : le français (`UI_LANGUAGE_FALLBACK`). Stockage du choix : `i18nextLng`. Choix public anonyme : `elidune_public_language`.

Une clé visible passe par `t('clé')`. Ajouter une clé dans les quatre fichiers en même temps. Les dates affichées utilisent `Intl.DateTimeFormat` et `i18n.language` (`ui/src/utils/localeDate.ts`).

## API

L’énumération `Language` de `server/src/models/mod.rs` est longue (`Unknown`, `French`, `English`, jusqu’à `Malay`). La valeur JSON est en camelCase. La valeur en base, via `as_db_str()`, est un mot (`french`, `english`, …).

`library_info.language` n’accepte que `fr`, `en`, `de`, `es`. NULL : les clients retombent sur le français (`ui/src/utils/uiLanguage.ts`). Les fuseaux sont des noms IANA. Refus : `invalid_timezone`, `timezone_country_mismatch`, `timezone_required`.

## E-mails

`SUPPORTED_LANGUAGES` accepte `english`, `french`, `german`, `spanish`. Deux fonctions de `server/src/email_templates.rs` choisissent le fichier. Aucune ne lit la langue affichée dans l’interface.

`notice_language_order` : relances, `hold_ready`, réinitialisation de mot de passe. Langue du compte si elle est parmi les quatre, puis langue de la bibliothèque, puis français, puis anglais.

`language_chain` : second facteur, code de secours, annonce d’événement, prêt clos par inventaire. Français puis anglais, ou l’inverse. L’allemand et l’espagnol commencent par le français. Ces modèles ne sont livrés qu’en `.french.json` et `.english.json`, sous `server/data/email_templates/`.

Pour chaque langue essayée, une ligne déjà en base passe avant le fichier `{id}.{langue}.json`.

Ce site de présentation a sa propre collection, `src/content/docs/` et `src/content/dev/` dans [elidune/website](https://github.com/elidune/website). Ce n’est pas le dossier `docs/` du logiciel.
