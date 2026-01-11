<template>
  <div class="not-prose">
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
// Lade die Ausschlussliste vom Server
const { 
  data: excludedRepos = [] 
} = await useFetch('/api/projects-exclude')

const { error, pending, data} = await useFetch(
  'https://api.github.com/users/mjkatgithub/repos'
)
const repos = computed(
  () => data.value
    .filter(repo => repo.description)
    .filter(repo => !excludedRepos.value.includes(repo.name))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
);
</script>