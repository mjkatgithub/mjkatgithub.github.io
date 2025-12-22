import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: {
        include: 'blog/**/*.md',
        exclude: ['blog/drafts/**']
      },
      schema: z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
        excerpt: z.any().optional(),
        description: z.string().optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
        exclude: ['blog/**']
      }
    }),
    data: defineCollection({
      type: 'data',
      source: {
        include: '*.json',
        exclude: ['blog/**']
      }
    })
  }
})
