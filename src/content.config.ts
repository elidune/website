import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    navTitle: z.string(),
    order: z.number(),
    section: z.enum(['install', 'start', 'features', 'admin', 'help']),
    draft: z.boolean().default(true),
    locale: z.enum(['fr', 'en', 'de', 'es']),
  }),
});

const devdocs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dev' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    navTitle: z.string(),
    order: z.number(),
    section: z.enum(['overview', 'reference', 'practice']),
    draft: z.boolean().default(true),
    locale: z.enum(['fr', 'en', 'de', 'es']),
  }),
});

export const collections = { docs, devdocs };
