import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const node = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number(),
  y: z.number(),
  kind: z.enum(['source', 'process', 'store', 'surface', 'actor', 'ledger']).default('process'),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),             // short name for nav and cards
    summary: z.string(),           // one sentence: cards and meta description
    org: z.string(),
    period: z.string(),
    role: z.string(),
    order: z.number(),
    domain: z.string(),            // e.g. "Fintech", shown as the project's world
    status: z.enum(['live', 'in-development', 'delivered', 'academic']).default('delivered'),
    stack: z.array(z.string()),
    facts: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    diagram: z
      .object({
        caption: z.string(),
        nodes: z.array(node),
        edges: z.array(z.array(z.string()).min(2).max(3)),
      })
      .optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    start: z.string(),             // 'YYYY-MM'
    end: z.string().optional(),    // omit for current role
    location: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]), // project ids
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum([
      'software-architecture', 'java-backend', 'ai-agents-llm', 'blockchain-web3',
      'python-data', 'cloud-devops', 'fintech-quant', 'engineering-leadership',
    ]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const learning = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learning' }),
  schema: z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    href: z.string(),              // the interactive lesson page under /public
    topics: z.array(z.string()).default([]),
    exercises: z.array(z.object({ label: z.string(), href: z.string(), note: z.string() })).default([]),
  }),
});

export const collections = { projects, experience, insights, learning };
