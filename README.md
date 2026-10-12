# Site de présentation Elidune

Site statique du projet [Elidune](https://github.com/elidune/elidune), généré avec [Astro](https://astro.build). Français par défaut (`/fr/`), anglais (`/en/`). L’allemand et l’espagnol sont préparés dans la configuration, pas encore publiés.

Le code est sous [GNU AGPL-3.0](LICENSE). © Jean Collonvillé et les contributeurs.

## Prérequis

- Node.js 22
- npm

## Commandes

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ + index Pagefind
npm run preview    # sert dist/
npm run check      # astro check
```

`npm run build` interroge l’API GitHub des publications de `elidune/elidune`. S’il n’y en a pas, ou si l’appel échoue, le journal des versions reste une page vide expliquant la situation. Le build ne s’arrête pas pour ça.

L’adresse canonique est `https://elidune.fr` (`site` dans `astro.config.ts`). Pour une autre origine : `SITE=https://exemple.org npm run build`.

## Langues

Pas de redirection forcée. `/` affiche l’accueil français et signale la version anglaise. Le sélecteur de langue est un lien.

| | Publié | Fichiers |
|---|---|---|
| fr | oui | `src/i18n/messages/fr.ts`, `src/content/docs/fr/` |
| en | oui | `src/i18n/messages/en.ts`, `src/content/docs/en/` |
| de | non | `src/i18n/locales.ts` (`enabled: false`), `src/content/docs/de/` |
| es | non | idem, `src/content/docs/es/` |

Les chaînes d’interface passent par `t()` (`src/i18n/ui.ts`). Une clé absente retombe sur le français. La ponctuation française (espaces insécables) est appliquée à ce moment-là, et dans le Markdown français via `src/i18n/remark-french.ts`.

Les dates et les nombres utilisent `Intl` avec `fr-FR` ou `en-GB`.

### Traduire l’interface

1. Copier `src/i18n/messages/en.ts` vers `src/i18n/messages/de.ts` (ou `es.ts`).
2. Traduire chaque valeur. Le type `Record<keyof typeof fr, string>` refuse une clé manquante.
3. Brancher le dictionnaire dans `src/i18n/ui.ts`.
4. Passer `enabled: true` pour la langue dans `src/i18n/locales.ts`.

Les chemins (`/de/funktionen/`, etc.) sont déjà dans `src/i18n/routes.ts`.

### Traduire la documentation

Les guides sont une collection de contenu : `src/content/docs/<langue>/<slug>.md`.

Slugs stables : `installation`, `getting-started`, `features`, `administration`, `faq`.

Si le fichier manque dans la langue demandée, la page française est affichée avec un bandeau « non traduit ». Le lien « Traduire cette page » ouvre la création du fichier sur GitHub. « Modifier cette page » pointe vers le fichier existant.

Les pages actuelles sont des brouillons : elles annoncent le plan, elles ne décrivent pas de procédure qui n’est pas déjà dans le dépôt du logiciel.

### Captures d’écran

Emplacements, à remplacer par de vraies images puis à reconstruire :

```text
public/screens/{fr,en}/{light,dark}/{desk,record,catalogue,holds,settings,opac-loans}.webp
```

Mettre à jour le texte alternatif dans les fichiers de messages en même temps. `node scripts/placeholders.mjs` régénère les emplacements.

## Recherche

Pagefind indexe la documentation au build (`data-pagefind-body`, filtre `locale`). En `npm run dev`, l’index n’existe pas encore : le champ l’indique, le sommaire reste utilisable.

## Déploiement

`.github/workflows/ci.yml` :

- sur une pull request : build, contrôle des liens, contrôle d’accessibilité axe ;
- sur `main` : les mêmes contrôles, puis `rsync --delete` du **contenu** de `dist/` vers `/var/www/elidune/public/` (port 22, secrets `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`).

Le dossier parent n’est pas modifié. `.github/workflows/check-vps.yml` est inchangé.

## Accessibilité et vie privée

Pas de cookie, pas de traceur, police Inter auto-hébergée. Le doré `#c9a961` sert de décor ; le texte d’accent est un ambre plus sombre. Thème clair ou sombre selon `prefers-color-scheme`.
