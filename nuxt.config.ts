// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="nuxt" />
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],
  // @ts-ignore - content property is provided by @nuxt/content module
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'material-theme'
        }
      }
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: []
    }
  }
})
