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

useSeoMeta({
  title: 'mjk @ web',
  description: 'Blog posts about web development, programming, and other stuff',
  ogTitle: 'mjk @ web',
  ogDescription: 'Blog posts about web development, programming, and other stuff',
  ogImage: '/logo_518x270.png',
  ogUrl: 'http://www.mjkweb.de',
  twitterTitle: 'mjk @ web',
  twitterDescription: 'Blog posts about web development, programming, and other stuff',
  twitterImage: '/logo_200x200.png',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})

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
  if (!dateString) {
    console.error('Leeres Datum gefunden:', dateString)
    return 'soon :tm:';
  }
  const date = new Date(dateString)
  if (isNaN(date)) {
    console.error('Ungültiges Datum:', dateString)
    return 'invalid date';
  }
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