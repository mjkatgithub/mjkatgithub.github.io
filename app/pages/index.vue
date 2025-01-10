<template>
  <section>
    <article class="prose" style="margin-bottom: 1rem;">
      <h1>Blog Posts</h1>
      <p>This are my recent blog posts</p>
    </article>
    <article v-for="post in posts" :key="post._path" class="prose" style="margin-bottom: 1rem;">
      <header>
        <div>{{ post.date }}</div>
        <h2><nuxt-link :to="post._path">{{ post.title }}</nuxt-link></h2>
      </header>
      <main v-if="'paragraphs' in post">
        <p v-for="paragraph in post.paragraphs" :key="paragraph">
          {{ paragraph }}
        </p>
      </main>
      <footer>
        <span><b>Categories: </b></span>
        <span v-for="category in post.categories" :key="category">{{ category }}, </span>
        <span><b>Tags: </b></span>
        <span v-for="tag in post.tags" :key="tag">{{ tag }}, </span><br />
        <nuxt-link :to="post._path">read more</nuxt-link>
      </footer>
    </article>
  </section>
</template>

<script setup>
const isDev = process.env.NODE_ENV === 'development'

const { data } = await useAsyncData(
  'blog-list',
   () => {
     const query = queryContent('/blog')
       .only(['_path', 'title', 'date', 'excerpt', 'tags', 'categories'])
       .sort({ date: -1 })
     if (!isDev) {
       query.where({ draft: { $ne: true } })
     }
     return query.find()
   }
)

const posts = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value.map(post => {
    const preview = {
      ...post,
      date: formatDate(post.date),
      paragraphs: extractParagraphs(post.excerpt)
    }
    return preview
  })
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date)
}

function extractParagraphs(excerpt) {
  const paragraphs = [];
  function extractText(node) {
    if (!node) return;
    if (node.type === 'element' && node.tag === 'p') {
      const paragraphText = node.children
        .filter(child => child.type === 'text')
        .map(child => child.value)
        .join('');
      paragraphs.push(paragraphText);
    } else if (Array.isArray(node.children)) {
      node.children.forEach(child => extractText(child));
    }
  }
  extractText(excerpt);
  return paragraphs;
}

</script>