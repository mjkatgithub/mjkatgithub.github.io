import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: {
        include: 'blog/**/*.md'
      },
      schema: z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
        excerpt: z.any().optional(),
        description: z.string().optional(),
        head: z.object({
          htmlAttrs: z.record(z.string(), z.any()).optional(),
          link: z.array(z.any()).optional(),
          meta: z.array(z.object({
            name: z.string().optional(),
            property: z.string().optional(),
            content: z.string().optional()
          })).optional()
        }).optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
        exclude: ['blog/**']
      },
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        head: z.object({
          htmlAttrs: z.record(z.string(), z.any()).optional(),
          link: z.array(z.any()).optional(),
          meta: z.array(z.object({
            name: z.string().optional(),
            property: z.string().optional(),
            content: z.string().optional()
          })).optional()
        }).optional()
      })
    }),
    data: defineCollection({
      type: 'data',
      source: {
        include: '*.json',
        exclude: ['blog/**']
      },
      schema: z.any()
    })
  }
})
