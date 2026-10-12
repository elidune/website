---
title: Administration
description: Paramètres, droits, SMTP, anonymisation RGPD et journal d’audit.
navTitle: Administration
order: 50
section: admin
draft: false
locale: fr
---

Les paramètres sont dans `/settings`. Un compte `admin` voit tous les onglets. Un compte `librarian` ne voit que Bibliothèque.

<figure>
<picture>
<source srcset="/screens/fr/dark/settings.webp" media="(prefers-color-scheme: dark)" />
<img src="/screens/fr/light/settings.webp" alt="Image de remplacement de l’écran des paramètres, thème clair." width="1440" height="900" />
</picture>
</figure>

Emplacement de capture : paramètres (`settings`).

## Onglets

| Onglet | Contenu |
| --- | --- |
| Bibliothèque | Nom, adresse, pays, fuseau, contact, horaires |
| Paramètres des emprunts | Durées, plafonds, renouvellement, réservations, relances, amendes, seuil d’impayés |
| Types de public | Publics, âges, abonnement, dérogations de prêt |
| Types de compte | Droits par type de compte |
| Modèles d’e-mails | Textes envoyés |
| Sources | Lieux de conservation et de retrait |
| Serveurs Z39.50 | Cibles d’import |
| Serveur | Relances, expiration des réservations, journaux, rétention d’audit, SMTP, réindexation, dump SQL |
| Audit | Journal des opérations sensibles |

L’onglet Serveur a trois sous-onglets : Général, Catalogue, Base de données. Une section marquée non surchargeable reste celle du fichier de configuration. « Revenir au fichier » efface la surcharge en base (`DELETE /api/v1/admin/config/{section}`).

Les sections surchargeables du modèle `sample.toml` incluent la journalisation, l’e-mail, les relances, l’audit et les réservations (`overridable = true`).

## Rôles et droits

Le type de compte (`guest`, `reader`, `group`, `librarian`, `admin`) porte des niveaux. Pour les documents, les usagers, les paramètres et les événements : aucun, lecture, écriture. Pour les prêts : aucun, lecture, écriture. Pour les réservations : aucun, soi-même (`own`), lecture, écriture.

Jeu initial après migrations :

| Type | Documents | Usagers | Prêts | Réservations | Paramètres |
| --- | --- | --- | --- | --- | --- |
| `guest` | lecture | aucun | aucun | aucun | lecture |
| `reader`, `group` | lecture | soi-même | soi-même (ne donne pas le guichet) | soi-même | lecture |
| `librarian` | écriture | écriture | écriture | écriture | lecture |
| `admin` | écriture | écriture | écriture | écriture | écriture |

Le droit `own` sur les prêts ne permet pas d’ouvrir `/loans`. Il permet au lecteur de voir et de prolonger ses prêts. Le droit `own` sur les réservations permet de créer et d’annuler les siennes. Les acquisitions ont un droit séparé, `acquisitions_rights` (`n`, `r`, `w`), à `w` pour `librarian` et `admin` après la migration `032`.

L’onglet Types de compte modifie ces lettres. Changer le type d’un utilisateur reste une action d’administrateur.

Les routes d’administration (`/api/v1/admin/config`, test SMTP, réindexation, audit, maintenance) exigent un compte `admin`.

## E-mail et SMTP

Variables, aussi éditables dans l’onglet Serveur lorsque la section e-mail est surchargeable :

| Variable | Défaut Compose |
| --- | --- |
| `ELIDUNE_EMAIL__SMTP_HOST` | vide |
| `ELIDUNE_EMAIL__SMTP_PORT` | 587 |
| `ELIDUNE_EMAIL__SMTP_USERNAME` | vide |
| `ELIDUNE_EMAIL__SMTP_PASSWORD` | vide |
| `ELIDUNE_EMAIL__SMTP_FROM` | vide |
| `ELIDUNE_EMAIL__SMTP_FROM_NAME` | vide dans Compose, « Elidune » dans `sample.toml` |
| `ELIDUNE_EMAIL__SMTP_USE_TLS` | vrai |

Ne pas écrire une chaîne vide pour une valeur facultative : omettre la variable. Le mot de passe SMTP n’est pas renvoyé en clair par l’écran. Un envoi d’essai existe : `POST /api/v1/admin/config/email/test`.

`ELIDUNE_SERVER__PUBLIC_BASE_URL` (sans barre finale) est l’origine des liens dans les messages. Vide, la réinitialisation de mot de passe n’envoie rien. Les annonces d’événements pointent vers `{origine}/events/unsubscribe?token=…`.

Modèles livrés : `overdue_reminder`, `overdue_second_reminder`, `overdue_formal_notice`, `hold_ready`, `password_reset`, `2fa_code`, `recovery_code`, `event_announcement`, `inventory_loan_closed`.

## Anonymisation (RGPD)

L’action de guichet s’appelle « Anonymiser pour les stats ». L’API reste `DELETE /api/v1/users/{id}`. `force=true` rend d’abord les prêts actifs, puis efface.

L’identifiant interne n’est pas réécrit. Le statut passe à `deleted`, les jetons sont révoqués, et les champs d’identité (identifiant, mot de passe, nom, e-mail, adresse, téléphone, code-barres, date de naissance, notes, second facteur) passent à null. Le type de compte, le type de public, la date de création et la date de fin d’abonnement restent. Les archives de prêts gardent des dimensions (tranche d’âge à la date du prêt, année, ville, type de public, type de compte) et perdent le lien vers la personne. Les réservations actives sont supprimées. Les amendes perdent l’usager. Les e-mails en attente vers cette adresse sont supprimés. Le journal d’audit ne stocke pas les données effacées.

Le passage automatique est `[privacy] auto_anonymize_years_after_expiry` (`ELIDUNE_PRIVACY__AUTO_ANONYMIZE_YEARS_AFTER_EXPIRY`). Défaut 0 : tâche arrêtée. Une valeur typique citée par le dépôt pour une bibliothèque municipale est 3, en années après `expiry_at`. La tâche tourne à 04:00. Elle ignore les usagers qui ont encore un prêt actif. Chaque anonymisation écrit `user.deleted` avec `trigger` égal à `retention_job`, et un événement de compteurs `system.privacy_auto_erasure`.

Le détail colonne par colonne est `docs/README-patron-erasure.md` dans le dépôt logiciel.

## Journaux

Deux journaux distincts :

- **Application.** `ELIDUNE_LOGGING__LEVEL` (`info` dans Compose), format `pretty`, `plain` ou `json`, sortie `stdout`, `stderr`, `file` ou `syslog`. `RUST_LOG` filtre en plus le traceur Rust (défaut Compose `elidune_server=info,tower_http=info`). En sortie fichier, le chemin et la rotation (`daily` par défaut) sont obligatoires.
- **Audit.** `GET /api/v1/audit` et export `GET /api/v1/audit/export`, administrateur. Rétention `ELIDUNE_AUDIT__RETENTION_DAYS` = 365. Les lignes plus anciennes sont supprimées. L’onglet Audit de Paramètres les consulte.

La première configuration écrit `system.first_setup_completed` (nom de la bibliothèque, présence ou non d’un SMTP), sans le mot de passe.
