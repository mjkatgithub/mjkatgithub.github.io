---
date: '2024-12-28'
categories:
- programming
tags:
  - programming
  - coding
  - vue
  - nuxt
  - jekyll
excerpt_separator: <!-- EXCERPT_END -->
draft: false
description: i decided to switch from jekyll to nuxt
head:
  htmlAttrs:
    lang: en
  link:
    - rel: 'icon'
      type: 'mange/x-icon'
      href: '/favicon.ico'
  meta:
    - name: 'keywords'
      content: 'programming, coding, vue, nuxt, jekyll'
    - name: 'robots'
      content: 'index, follow'
    - name: 'author'
      content: 'Melchior Kannengießer'
    - name: 'og:title'
      content: 'mjk @ web - Jekyll to Nuxt'
    - name: 'og:description'
      content: 'i decided to switch from jekyll to nuxt'
    - name: 'og:image'
      content: '/logo_518x270.png'
    - name: 'og:url'
      content: 'http://www.mjkweb.de'
    - name: 'twitter:title'
      content: 'mjk @ web - Jekyll to Nuxt'
    - name: 'twitter:description'
      content: 'i decided to switch from jekyll to nuxt'
    - name: 'twitter:image'
      content: '/logo_200x200.png'
    - name: 'twitter:card'
      content: 'summary'
---
# Switch from Jekyll to Nuxt

I haven't use ruby for a while but more and more js/ts (especially vue) so i decided to switch from jekyll to nuxt, as I also like the benefits of autoloading components and server-side rendering with Nuxt.

Also, in Nuxt, using NuxtContent, like in jekyll, I can save my content as markdown, which is then converted to html.

so the journey begins
<!-- EXCERPT_END -->
## initializing a new nuxt project

initializing a new nuxt project is very easy.

just run

```console
npx nuxi@latest init <project-name>
```

Then you will be asked on the console to select a package manager (I use npm) and you will be asked whether you want to initialize a git repo right away. That's it.

## Dummy Content & Layout

I created the pages folder and saved some files with dummy content there. It should only help to adopt the design. Later we will use NuxtContent. Then we just need to copy the Markdown files from the Jekyll project. I also already replaced Nuxt's favicon with my own.

- about.vue

```vue
<template>
  <article class="post">
    <header class="post-header">
      <h1 class="post-title">About</h1>
    </header>

    <div class="post-content">
      <h1 id="about-this-blog">About this blog</h1>
      <p>Hello, my name is Melchior. In the past I posted various things on this blog, but decided to focus more on technical post. However, this does not mean that there is not something else to read here. I have also decided to write my posts in English in the future. Have fun reading my posts. They may also be useful for one or the other, even if I am now primarily writing them for myself in order to deepen topics.</p>
    </div>
  </article>
</template>
```

- datenschutzerklaerung.vue

```vue
<template>
  <div>
    datenschutzerklaerung
  </div>
</template>
```

- impressum.vue

```vue
<template>
  <div>
    impressum
  </div>
</template>
```

- index.vue

```vue
<template>
  <div>
    home
  </div>
</template>
```

- links.vue

```vue
<template>
  <div>
    links
  </div>
</template>
```

then I created the layout in the `app.vue`-file and transferred the design with a few small changes. What I changed, for example, is that this time I wanted to have a mobile-first design, which can also serve as a fallback for larger screens if things aren't supported there.

```vue
<template>
  <div class="pageWrapper">
    <header class="pageHeader">
      <div class="branding">
        <NuxtLink to="/" class="logo">mjk @ web</NuxtLink>
      </div>
      <!-- Navigation -->
      <nav :class="{ active: isMenuOpen }">
        <ul class="mainNav">
          <li><NuxtLink to="/about" @click="hideMenu">About</NuxtLink></li>
          <li><NuxtLink to="/links" @click="hideMenu">Links</NuxtLink></li>
          <li><NuxtLink to="/datenschutzerklaerung" @click="hideMenu">Datenschutz-Erklärung</NuxtLink></li>
          <li><NuxtLink to="/impressum" @click="hideMenu">Impressum</NuxtLink></li>
        </ul>
      </nav>
      <!-- Hamburger Menu -->
      <div class="hamburgerMenu" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
    <div class="pageContent">
      <NuxtPage />
    </div>
    <footer>footer</footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    hideMenu() {
      this.isMenuOpen = false;
    },
  },
};
</script>

<style>
/* Mobile-First Design */

/* Basic-Styling for mobile Devices */
body {
  background-color: #213c5b;
  margin: 0;
  font-family: Arial, sans-serif;
}
.pageWrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1024px;
  margin-right: auto;
  margin-left: auto;
}
.pageHeader {
  color: black;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #1e6695;
  background: -moz-linear-gradient(top, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  background: -webkit-linear-gradient(top, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  background: linear-gradient(to bottom, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e6695', endColorstr='#2f4a66',GradientType=0 );
}

/* Branding */
.branding .logo {
  font-size: 1.5rem;
  text-decoration: none;
  color: black;
}

/* Navigation */
nav {
  display: none;
}
.mainNav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 1rem;
  background-color: #819cbb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.mainNav li a {
  text-decoration: none;
  color: black;
  transition: color 0.3s;
}

/* Hamburger Menu */
.hamburgerMenu {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  cursor: pointer;
}
.hamburgerMenu span {
  width: 25px;
  height: 3px;
  background-color: black;
}

/* Aktives Menü (für Mobile) */
nav.active {
  display: block;
}

.pageContent {
  background-color: #415c7b;
  padding: 15px;
}

.pageContent article {
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #819cbb;
  padding: 15px;
}

footer {
  height: 38px;
  line-height: 38px;
  text-align: center;
  background: #415c7b;
  background: -moz-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #415c7b), color-stop(100%, #273749));
  background: -webkit-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -o-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -ms-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: linear-gradient(to bottom, #415c7b 0%, #273749 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#415c7b', endColorstr='#273749',GradientType=0 );
  border-bottom: 1px solid black;
}

@media (max-width: 599px) {
  .mainNav li:hover {
    background-color: #7E99B8;
  }
  nav.active {
    position: absolute;
    top: 46px; /* Direkt unter der Header-Höhe */
    right: 16px;
    width: 200px;
    z-index: 10;
  }
}

/* Media Queries für größere Bildschirme */
@media (min-width: 600px) {
  .mainNav {
    flex-direction: row;
    justify-content: center;
    background: none;
    padding: 0;
    box-shadow: none;
  }
  nav {
    display: flex;
  }
  .hamburgerMenu {
    display: none;
  }
}

@media (min-width: 1024px) {
  .pageHeader {
    margin-top: 10px;
    -webkit-border-radius: 20px 20px 0 0;
    border-radius: 20px 20px 0 0;
    border: 1px solid black;
    border-bottom: 0px;
  }
  .pageContent {
    border-left: solid 1px black;
    border-right: solid 1px black;
  }
  footer {
    -webkit-border-radius: 0 0 20px 20px;
    border-radius: 0 0 20px 20px;
    border: 1px solid black;
    border-top: 0px;
  }
}
</style>
```

The directory structure now looks like this.

```text
.
├── .nuxt
│   ├── ...
│   └── ...
├── .output
│   ├── ...
│   └── ...
├── node_modules
│   ├── ...
│   └── ...
├── pages
│   ├── about.vue
│   ├── datenschutzerklaerung.vue
│   ├── impressum.vue
│   ├── index.vue
│   └── links.vue
├── public
│   ├── favicon.ico
│   └── robots.txt
├── server
│   └── tsconfig.json
├── .gitignore
├── app.vue
├── nuxt.config.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

I have left out the contents of the folders `.nuxt`, `.output` and `node_modules` because the contents are generated by nuxt or npm and we should not edit or save anything here.

## Extract components

Vue and therefore Nuxt is a component-based framework. So I created the folder `components` in the root directory and extracted the components `pageFooter.vue` and `pageHeader.vue` from the `app.vue`, which makes it much clearer.

- pageFooter.vue

```vue
<template>
  <footer>
    <span>&copy; by Melchior Jascha Kannengießer</span>
  </footer>
</template>

<style scoped>
footer {
  height: 38px;
  line-height: 38px;
  text-align: center;
  background: #415c7b;
  background: -moz-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #415c7b), color-stop(100%, #273749));
  background: -webkit-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -o-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -ms-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: linear-gradient(to bottom, #415c7b 0%, #273749 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#415c7b', endColorstr='#273749',GradientType=0 );
  border-bottom: 1px solid black;
}

@media (min-width: 1024px) {
  footer {
    -webkit-border-radius: 0 0 20px 20px;
    border-radius: 0 0 20px 20px;
    border: 1px solid black;
    border-top: 0px;
  }
}

</style>
```

- pageHeader.vue

```vue
<template>
  <header class="pageHeader">
    <div class="branding">
      <NuxtLink to="/" class="logo">mjk @ web</NuxtLink>
    </div>
    <!-- Navigation -->
    <nav :class="{ active: isMenuOpen }">
      <ul class="mainNav">
        <li><NuxtLink to="/about" @click="hideMenu">About</NuxtLink></li>
        <li><NuxtLink to="/links" @click="hideMenu">Links</NuxtLink></li>
        <li><NuxtLink to="/datenschutzerklaerung" @click="hideMenu">Datenschutz-Erklärung</NuxtLink></li>
        <li><NuxtLink to="/impressum" @click="hideMenu">Impressum</NuxtLink></li>
      </ul>
    </nav>
    <!-- Hamburger Menu -->
    <div class="hamburgerMenu" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    hideMenu() {
      this.isMenuOpen = false;
    },
  },
};
</script>

<style scoped>
.pageHeader {
  color: black;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #1e6695;
  background: -moz-linear-gradient(top, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  background: -webkit-linear-gradient(top, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  background: linear-gradient(to bottom, #1e6695 0%, #74aacc 33%, #79aecb 66%, #2f4a66 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e6695', endColorstr='#2f4a66',GradientType=0 );
}

/* Branding */
.branding .logo {
  font-size: 1.5rem;
  text-decoration: none;
  color: black;
}

/* Navigation */
nav {
  display: none;
}
.mainNav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 1rem;
  background-color: #819cbb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.mainNav li a {
  text-decoration: none;
  color: black;
  transition: color 0.3s;
}

/* Hamburger Menu */
.hamburgerMenu {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  cursor: pointer;
}
.hamburgerMenu span {
  width: 25px;
  height: 3px;
  background-color: black;
}

/* Aktives Menü (für Mobile) */
nav.active {
  display: block;
}

@media (max-width: 599px) {
  .mainNav li:hover {
    background-color: #7E99B8;
  }
  nav.active {
    position: absolute;
    top: 46px; /* Direkt unter der Header-Höhe */
    right: 16px;
    width: 200px;
    z-index: 10;
  }
}

/* Media Queries für größere Bildschirme */
@media (min-width: 600px) {
  .mainNav {
    flex-direction: row;
    justify-content: center;
    background: none;
    padding: 0;
    box-shadow: none;
  }
  nav {
    display: flex;
  }
  .hamburgerMenu {
    display: none;
  }
}

@media (min-width: 1024px) {
  .pageHeader {
    margin-top: 10px;
    -webkit-border-radius: 20px 20px 0 0;
    border-radius: 20px 20px 0 0;
    border: 1px solid black;
    border-bottom: 0px;
  }
}

</style>
```

- app.vue

```vue
<template>
  <div class="pageWrapper">
    <pageHeader />
    <div class="pageContent">
      <NuxtPage />
    </div>
    <pageFooter />
  </div>
</template>

<style>
/* Mobile-First Design */

/* Basic-Styling for mobile Devices */
body {
  background-color: #213c5b;
  margin: 0;
  font-family: Arial, sans-serif;
}
.pageWrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1024px;
  margin-right: auto;
  margin-left: auto;
}

.pageContent {
  background-color: #415c7b;
  padding: 15px;
}

.pageContent article {
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #819cbb;
  padding: 15px;
}

/* Media Queries für größere Bildschirme */
@media (min-width: 1024px) {
  .pageContent {
    border-left: solid 1px black;
    border-right: solid 1px black;
  }
}
</style>
```

## Nuxt-Content

Nuxt Content is a Nuxt module that enables us to render our Markdown posts from the Jekyll project.

First I had to install the module

```console
npm install --save-dev @nuxt/content
```

and add it to the Modules array in nuxt.config.ts in the root directory

```ts
export default defineNuxtConfig({
  ...
  modules: ['@nuxt/content']
  ...
})
```

Then I created a directory called `content` in the root directory of my project and inside it a directory called `blog`. All files from the `_posts` directory of the Jekyll project now go into this directory.

In order to render the posts, however, a "catchAllRoute" is required, i.e. a file with the name `[...slug].vue` in the Pages directory (more precisely in the blog subdirectory) which only contains the template with `<ContentDoc />` which loads and renders the content of the Markdown files.

- [...slug].vue

```vue
<template>
  <article>
    <ContentDoc />
  </article>
</template>
```

## Tailwind

the next step was to install the tailwind module

```console
npm install --save-dev @nuxtjs/tailwindcss
```

and add it to the nuxtConfig

```ts
export default defineNuxtConfig({
  ...
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ]
  ...
})
```

In order for the markdown to be rendered correctly, tailwindcss-typography was required.

I istalled it by

```console
npm install -D @tailwindcss/typography
```

to enable it i added a `tailwind.config.ts` to the root directory and added the typography-plugin.

```ts
module.exports = {
  plugins: [
    require('@tailwindcss/typography')
  ]
}
```

and in the catchAllRoute for the blog-posts I added the `prose` class to `article` and added a `max-width: 992px!important;` to override the one from the `prose` class of tailwind-typography for now.

## Copy and adjust content

Finally, I was able to copy the remaining Markdown files from the Jekyll project into the content directory. Some of the Markdown files still contained HTML, so I quickly converted them into pure Markdown.

In order to be able to render everything, I then had to create the corresponding Vue files in the pages directory and read in and render the Markdown files with `<ContentDoc>`. I'm just using `about.vue` as an example here, since the other files basically look exactly the same.

- about.vue

```vue
<template>
  <article class="prose">
    <ContentDoc path="/about" />
  </article>
</template>
```

I then copied the directory `icons` from the directory `_assets` in the Jekyll project to `public/assets/` in the Nuxt project so that the social media icons are also displayed.

## Query and Render Blog-Posts

On the homepage, which until now was just a dummy with the template

```vue
<template>
  <div>
    home
  </div>
</template>
```

, I wanted to list the blog posts. However, only those that are not drafts.

In Jekyll, the drafts were recognized because they were in the `_drafts` directory, which as far as I know doesn't exist in Nuxt, but since all the Markdown files have a front matter section anyway and there are usually only one or two drafts anyway, I can specify that there with `draft: true`.

In order not to exclude the designs during development, I first had to check whether the code was executed in a development environment.

```js
const isDev = process.env.NODE_ENV === 'development'
```

With this information I could then query the contents of the blog posts.

```js
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
```

Since only the title as a link to the full article, the introduction as well as tags and categories should be displayed on the homepage, I used computed properties to extract the relevant data from the posts.

```js
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
```

With this data I was finally able to render the content.

```vue
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
```

## cleanup

I originally started the blog with wordpress and many of the old blog posts were basically just one-liners with a couple of links. Some of the posts I didn't even convert to Markdown but just took the HTML from wordpress. I think I used some tool to export everything from wordpress so I could integrate it into my new jekyll site. Anyway. I deleted most of the old blog posts. If you still want to see them there is always the [Wayback Machine](http://web.archive.org/) ;-).

## replace jekyll blog

### deploment

I published the Jekyll blog on GitHub pages. Of course, I wanted to do the same with the Nuxt blog. The only thing that was supposed to change was the underlying technology from Jekyll to Nuxt.

github-pages is intended for static websites. which means that no server code runs there. The Nuxt project must therefore generate static HTML. In the Nuxt documentation I have a section on GitHub-Pages which says right at the beginning:

> GitHub Pages only support static sites, Nuxt will pre-render your application to static HTML files.

which I have just described

and

> If you are not using a custom domain, you need to set NUXT_APP_BASE_URL to your repository-slug for your build step.Example: https://<user>.github.io/<repository>/: NUXT_APP_BASE_URL=/<repository>/ npx nuxt build --preset github_pages

followed by an example GitHub Actions workflow.

So I adjusted my nuxt.config.ts and configured the base URL, since I had created a new repo for the nuxt project and created a `deploy.yml` in `.github/workflows/`:

```yml
# https://github.com/actions/deploy-pages#usage
name: Deploy to GitHub Pages
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      # Pick your own package manager and build script
      - run: npm install
      - run: npx nuxt build --preset github_pages
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public
  # Deployment job
  deploy:
    # Add a dependency to the build job
    needs: build
    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
      pages: write      # to deploy to Pages
      id-token: write   # to verify the deployment originates from an appropriate source
    # Deploy to the github_pages environment
    environment:
      name: github_pages
      url: ${{ steps.deployment.outputs.page_url }}
    # Specify runner + deployment step
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
I then adapted this to my needs and wanted to deploy the new blog for the first time. But it didn't work.

### replace the old repository

unfortunately, something was often missing during prerendering. The yml file with the gitHub actions consists of 2 areas: `build` and `deploy`. `build` eventually worked, but assets were always missing during `deploy`. At some point I remembered the gh-pages npm package. I then installed it without further ado and it "worked" straight away. Except for the baseURL. But since I only wanted to have one blog anyway and only wanted to switch from jekyll to nuxt, I quickly deleted the jekyll repo and renamed the nuxt repo.
