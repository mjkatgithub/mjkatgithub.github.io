<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>

<script setup>
const route = useRoute()
// Prüfe, ob wir im Prerender/Generate-Modus sind
const isPrerendering = import.meta.prerender || 
                       process.env.NITRO_PRESET === 'static'

// Prüfe, ob der Artikel ein Draft ist
const { data: doc } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    try {
      const article = await queryCollection('blog')
        .path(route.path)
        .first()
      return article
    } catch {
      return null
    }
  }
)

// Wenn es ein Draft ist und wir im Generate-Modus sind, 404 zurückgeben
if (doc.value) {
  const isDraft = doc.value.draft === true || 
                  doc.value.path?.includes('/drafts/')
  
  if (isDraft && isPrerendering) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }

  // Verarbeite head-Daten aus Frontmatter
  // Prüfe sowohl head als auch direkt verfügbare Meta-Daten
  const headData = doc.value.head || doc.value.meta?.head
  if (headData) {
    const head = headData
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL || 
                    config.app?.baseURL || 
                    'https://mjkatgithub.github.io'

    // Extrahiere Meta-Tags
    const metaTags = head.meta || []
    const ogTags = {}
    const twitterTags = {}
    const otherMeta = []

    metaTags.forEach((tag) => {
      // Unterstütze sowohl 'name' als auch 'property' Attribute
      const tagName = tag.property || tag.name
      
      if (tagName?.startsWith('og:')) {
        const key = tagName.replace('og:', '')
        ogTags[key] = tag.content
      } else if (tagName?.startsWith('twitter:')) {
        const key = tagName.replace('twitter:', '')
        twitterTags[key] = tag.content
      } else if (tagName) {
        // Verwende property für Open Graph, name für andere
        const metaTag = tag.property 
          ? { property: tag.property, content: tag.content }
          : { name: tag.name, content: tag.content }
        otherMeta.push(metaTag)
      }
    })

    // Setze SEO Meta-Tags
    useSeoMeta({
      title: doc.value.title || ogTags.title || '',
      description: doc.value.description || 
                   ogTags.description || '',
      ogTitle: ogTags.title || doc.value.title || '',
      ogDescription: ogTags.description || 
                     doc.value.description || '',
      ogImage: ogTags.image || '',
      ogUrl: ogTags.url || `${baseURL}${route.path}`,
      twitterTitle: twitterTags.title || 
                    ogTags.title || 
                    doc.value.title || '',
      twitterDescription: twitterTags.description || 
                          ogTags.description || 
                          doc.value.description || '',
      twitterImage: twitterTags.image || '',
      twitterCard: twitterTags.card || 'summary'
    })

    // Setze zusätzliche Meta-Tags und HTML-Attribute
    useHead({
      htmlAttrs: head.htmlAttrs || {},
      link: head.link || [],
      meta: otherMeta
    })
  } else {
    // Fallback: Verwende Standard-Meta-Tags wenn kein head vorhanden
    useSeoMeta({
      title: doc.value.title || '',
      description: doc.value.description || ''
    })
  }
}
</script>

<style>
  article {
    max-width: 992px!important;
    color: black!important;
  }
</style>