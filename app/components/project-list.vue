<template>
  <div>
    <p class="mb-10">Take a look at my GitHub projects!</p>
    <section v-if="pending">Loading ...</section>
    <section v-else-if="error">{{ error }}</section>
    <section v-else>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="repo in repos" :key="repo.id" class="border border-gray-600 rounded-sm p-4 hover:bg-gray-400 font-mono">
          <a :href="repo.html_url" target="_blank">
            <div class="flex justify-between text-sm">
              <div>{{ repo.name }}</div>
              <div>{{ repo.stargazers_count }} ★</div>
            </div>
            <p class="text-sm text-gray-700">
              {{ repo.description }}
            </p>
          </a>
        </li>
      </ul>
      </section>
  </div>
</template>
<script setup>
const { error, pending, data} = await useFetch(
  'https://api.github.com/users/mjkatgithub/repos'
)
const repos = computed(
  () => data.value.filter(repo => repo.description)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
);
</script>