---
layout: post
title: Switch from Jekyll to Nuxt
date: '2023-02-12'
categories:
- Allgemein
tags: [coding, vue, nuxt]
comments: []
excerpt_separator: <!--more-->
---
I haven't use ruby for a while but more and more js/ts (especially vue) so i decided to switch from jekyll to nuxt, as I also like the benefits of autoloading components and server-side rendering with Nuxt.

Also, in Nuxt, using NuxtContent, like in jekyll, I can save my content as mardown, which is then converted to html.

so the journey begins
<!--more-->
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
    links
  </div>
</template>
```

- impressum.vue

```vue
<template>
  <div>
    links
  </div>
</template>
```

- index.vue

```vue
<template>
  <div>
    links
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

**to be continued ...**