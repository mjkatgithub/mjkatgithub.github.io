<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>

<script setup>
const { data: doc } = await useAsyncData('impressum', async () => {
  return await queryCollection('pages')
    .path('/impressum')
    .first()
})
</script>
