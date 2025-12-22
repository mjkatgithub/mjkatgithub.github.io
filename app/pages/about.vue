<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>

<script setup>
const { data: doc } = await useAsyncData('about', async () => {
  return await queryCollection('pages')
    .path('/about')
    .first()
})
</script>
