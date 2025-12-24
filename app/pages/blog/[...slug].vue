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
}
</script>

<style>
  article {
    max-width: 992px!important;
    color: black!important;
  }
</style>