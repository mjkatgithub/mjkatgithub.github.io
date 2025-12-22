<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>

<script setup>
const { data: doc } = await useAsyncData('links', async () => {
  return await queryCollection('pages')
    .path('/links')
    .first()
})
</script>
