<template>
  <div class="not-prose">
    <p>Here you will find links to my social media and so on.</p>
    <div v-for="(linkSet, index) in linkSets" :key="index">
      <h2>{{ linkSet.title }}</h2>
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <li v-for="(link, index) in linkSet.links" :key="index">
          <a :href="link.url" target="_blank">
            <div class="border border-gray-600 rounded-xl p-4 text-center bg-gradient-to-t from-custom-gray to-custom-gray-light shadow-md">
              <div>
                <img v-if="link.thumbnail && link.thumbnail != 'none'" :src="link.thumbnail" alt="thumbnail" class="thumbnail">
              </div>
              <p>{{ link.title }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { data: result } = await useAsyncData(
  'link-sets',
  async () => {
    const doc = await queryCollection('data')
      .path('/link-sets')
      .first()
    return doc
  }
)
const linkSets = result.value?.['link-sets'] || result.value
</script>

<style scoped>

h2{
  color: var(--tw-prose-headings);
    font-weight: 700;
    font-size: 1.5em;
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.3333333;
}

.thumbnail{
  position:absolute;
  margin-top: -10px;
}
</style>