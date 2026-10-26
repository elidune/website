---
title: Authentification et droits
description: Jeton JWT, types de compte, lettres de droits, premier assistant et quotas.
navTitle: Authentification
order: 30
section: reference
draft: false
locale: fr
---

Les chemins ci-dessous sont relatifs à `/api/v1`, sauf mention contraire. Le contrat généré est `GET /api-docs/openapi.json`. La matrice maintenue à côté du code est [`docs/README-api-access-rights.md`](https://github.com/elidune/elidune/blob/dev/docs/README-api-access-rights.md) : en cas d’écart, le routeur de `server/src/api/` fait foi. Un écart connu : l’archivage d’un exemplaire (`DELETE /items/{id}`) exige le droit d’archivage en écriture, pas seulement le droit d’écriture sur les documents.

## Jeton

Algorithme HS256. Secret `users.jwt_secret`, durée `users.jwt_expiration_hours` (24 heures par défaut, `server/config/sample.toml`). Le secret de production fait au moins 32 caractères.

Le jeton porte `sub`, `user_id`, `account_type`, les droits, `exp`, `iat`, `token_version` (il doit correspondre à la base, sinon le jeton est refusé) et, parfois, `scope`.

En-tête : `Authorization: Bearer <jwt>`.

Un jeton dont `scope` vaut `change_password_only` n’ouvre que `POST /auth/change-password`.

Les mutations de guichet acceptent l’en-tête `Idempotency-Key`.

## Connexion

`POST /auth/login` attend `username` (identifiant ou e-mail), `password`, et `deviceId` facultatif.

Réponse (`LoginResponse`, camelCase) : `token` (absent si un second facteur est exigé), `tokenType` (`Bearer`), `expiresIn`, `user`, `requires2fa`, `twoFactorMethod` (`totp` ou `email`), `deviceId`, `mustChangePassword`.

Le second facteur par e-mail stocke le code dans Redis pendant 600 secondes. `POST /auth/verify-2fa` et `POST /auth/verify-recovery` terminent la connexion. Un appareil de confiance est mémorisé dans Redis.

Autres routes publiques d’authentification : `POST /auth/request-password-reset`, `POST /auth/reset-password`.

Routes de session : `GET /auth/me`, `PUT /auth/profile`, `POST /auth/change-password`, `POST /auth/setup-2fa`, `POST /auth/disable-2fa`, `DELETE /auth/rate-limit/{login}`.

Effacer le blocage d’un identifiant exige un compte du personnel et le droit d’écriture sur les lecteurs.

## Premier compte

`POST /first_setup` est public et partage le quota d’authentification par adresse. Il n’est accepté que si la base n’a ni utilisateur ni ligne de réglages. Sinon la réponse est 409. Le corps crée le compte `admin`, enregistre la bibliothèque, et peut enregistrer le courrier si la section est surchargeable. Réponse 201, avec un jeton du même genre que la connexion.

## Lettres de droits

En base, une lettre. En JSON, un mot en minuscules : `none`, `own`, `read`, `write`. L’ordre est none < own < read < write. Le décodage accepte aussi l’alias `borrowsRights` pour les réservations.

| Champ JSON | Lettres | Ce qu’il ouvre |
| --- | --- | --- |
| `itemsRights` | n, r, w | Lecture ou écriture du catalogue |
| `usersRights` | n, r, w | Comptes |
| `loansRights` | n, o, r, w | `o` (soi-même) est sous la lecture. Le guichet exige r ou w. Le `o` d’un lecteur ne passe pas `require_read_loans` |
| `holdsRights` | n, o, r, w | Réservations du lecteur (`o`) ou files et transits du personnel (r, w) |
| `settingsRights` | n, r, w | Fiche bibliothèque et sections de configuration |
| `eventsRights` | n, r, w | Événements |
| `acquisitionsRights` | n, r, w | Fournisseurs, budgets, commandes |
| `weedingRights` | n, r, w | Désherbage |
| `weedingCancelRights` | n, r, w | Annuler une sortie du fonds (écriture) |
| `itemsArchiveRights` | n, r, w | `DELETE /items/{id}` exige l’écriture |
| `circulationOverrideRights` | n, r, w | Forcer un abonnement expiré ou un exemplaire réservé à autrui, avec `overrideReason` |

Types livrés (`account_types`, `is_system`) : `guest`, `reader`, `librarian`, `admin`, `group`. Seul `reader` déduit le type de public de la date de naissance. `librarian` et `admin` passent les extracteurs personnel. `admin` passe l’extracteur administrateur. Tout autre code en minuscules est un type personnalisé.

Jeu initial, lettres principales : voir le guide [Administration](/fr/documentation/administration/). En base, le bibliothécaire a `items_archive_rights = w`, `circulation_override_rights = n`, `settings_rights = r`. L’administrateur a `w` partout, y compris la dérogation.

## Quotas

Défauts de `server/src/app.rs` et de `sample.toml`.

| Limiteur | Routes | Défaut |
| --- | --- | --- |
| Adresse, authentification | connexion, second facteur, mot de passe, `first_setup` | 30 par minute, rafale 30 |
| Identifiant | échecs de connexion | 5 sur 900 secondes |
| Réinitialisation | compteur séparé | 3 sur 3600 secondes |
| Session | `/auth/me`, profil, changement de mot de passe, second facteur, effacement du quota | 120 par minute, rafale 60 |
| Public | OPAC, couvertures, `GET /library-info`, `POST /events/unsubscribe` | 600 par minute, rafale 120 |

Réponse 429 : `code` = `rate_limited`, champ `retryAfter`, en-tête `Retry-After`. Derrière un proxy, déclarer ce proxy dans `ELIDUNE_SERVER__TRUSTED_PROXIES`, sinon toutes les visites comptent pour l’adresse du proxy. Le plafond d’authentification par adresse se règle avec `ELIDUNE_SERVER__AUTH_IP_PER_MINUTE`.

## Forme des erreurs

Corps habituel :

```json
{ "code": "not_found", "error": "Not Found", "message": "…" }
```

Les règles de guichet répondent souvent 422, avec un `code` de domaine. La liste centrale est le module `error_code` de `server/src/error.rs`. Exemples stables : `authentication_failed`, `authorization_failed`, `not_found`, `validation_error`, `conflict`, `database_error`, `feature_disabled`, `rate_limited`, `business_rule_violation`, `card_lost`, `subscription_expired`, `fines_over_threshold`, `max_loans`, `item_held_for_other`, `item_not_loanable`, `override_reason_required`, `payment_exceeds_balance`.

Certains refus ajoutent des champs (`remainingCents`, identifiant d’exemplaire). Le contrat OpenAPI les décrit un par un.
