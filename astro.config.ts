import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { remarkFrenchTypography } from './src/i18n/remark-french';
import { remarkScreenshots } from './src/i18n/remark-screenshots';
import { alternatesForUrl } from './src/i18n/routes';

export default defineConfig({
  site: process.env.SITE ?? 'https://elidune.fr',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'de', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkFrenchTypography, remarkScreenshots],
    }),
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/' && !path.includes('/404');
      },
      serialize(item) {
        const links = alternatesForUrl(item.url);
        if (links.length > 0) item.links = links;
        return item;
      },
    }),
  ],
});
