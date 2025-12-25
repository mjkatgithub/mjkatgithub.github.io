<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
    <div v-else>
      <p>Loading...</p>
    </div>
  </article>
</template>

<script setup>
const { data: doc } = await useAsyncData('projects', async () => {
  try {
    return await queryCollection('pages')
      .path('/projects')
      .first()
  } catch (error) {
    console.error('Error loading projects page:', error)
    return null
  }
})

// Verarbeite head-Daten aus Frontmatter
// Prüfe sowohl head als auch direkt verfügbare Meta-Daten
const headData = doc.value?.head || doc.value?.meta?.head
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
    ogUrl: ogTags.url || `${baseURL}/projects`,
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
} else if (doc.value) {
  // Fallback: Verwende Standard-Meta-Tags
  useSeoMeta({
    title: doc.value.title || '',
    description: doc.value.description || ''
  })
}
</script>