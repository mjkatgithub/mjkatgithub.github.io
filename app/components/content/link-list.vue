<template>
  <div class="not-prose">
    <h3>My Link List</h3>
    <ul>
      <li v-for="(link, index) in parsedJsonProp.myLinks" :key="index">
        <a :href="link.url" target="_blank">{{ link.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  jsonProp: String
})

// Parsen des JSON-Strings in ein JavaScript-Objekt
const parsedJsonProp = ref(JSON.parse(props.jsonProp))
</script>
