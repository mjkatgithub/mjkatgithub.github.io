<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
    <div v-else>
      <p>Loading...</p>
    </div>
  </article>
</template>

<script setup>
const { data: doc } = await useAsyncData('links', async () => {
  try {
    return await queryCollection('pages')
      .path('/links')
      .first()
  } catch (error) {
    console.error('Error loading links page:', error)
    return null
  }
})
</script>
