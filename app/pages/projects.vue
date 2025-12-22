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
</script>