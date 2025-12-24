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
// Lade die Link-Sets über queryCollection
const { data: result } = await useAsyncData(
  'link-sets',
  async () => {
    try {
      // Lade alle Data-Collection Einträge
      const allData = await queryCollection('data').all()
      
      // Finde die link-sets Datei - prüfe verschiedene Eigenschaften
      const linkSetsDoc = allData.find(item => {
        const id = item._id || item.id || item._path || item.path || ''
        return String(id).includes('link-sets')
      })
      
      if (linkSetsDoc) {
        // Die Daten könnten in body, data oder direkt im Objekt sein
        // Für JSON-Dateien sind die Daten meist direkt im Objekt
        return linkSetsDoc.body || 
               linkSetsDoc.data || 
               linkSetsDoc
      }
      
      return null
    } catch (error) {
      console.error('Error loading link-sets:', error)
      return null
    }
  }
)

const linkSets = computed(() => {
  if (!result.value) {
    return []
  }
  
  // Die Datenstruktur in Nuxt 4 Content ist:
  // result.value.meta['link-sets'] oder result.value.meta.body['link-sets']
  
  // Prüfe zuerst meta['link-sets']
  if (result.value.meta?.['link-sets']) {
    return result.value.meta['link-sets']
  }
  
  // Prüfe meta.body['link-sets']
  if (result.value.meta?.body?.['link-sets']) {
    return result.value.meta.body['link-sets']
  }
  
  // Fallback: leeres Array
  return []
})
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