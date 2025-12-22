<template>
  <article class="prose dark:prose-ivert prose-pre:bg-white dark:prose-pre:bg-gray-800 prose-pre:text-gray-700 dark:prose-pre:text-gray-300">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>

<script setup>
const route = useRoute()
const isDev = process.env.NODE_ENV === 'development'

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

// Wenn es ein Draft ist und nicht im Dev-Modus, 404 zurückgeben
if (doc.value) {
  const isDraft = doc.value.draft === true || 
                  doc.value.path?.includes('/drafts/')
  
  if (isDraft && !isDev) {
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