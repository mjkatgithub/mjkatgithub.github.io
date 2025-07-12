---
date: '2025-07-11'
categories:
  - programming
tags:
  - programming
  - coding
  - vue
  - nuxt
excerpt_separator: <!--more-->
description: A Real-World Migration
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
      content: 'Upgrading a Nuxt 2 Project to Nuxt 3'
    - name: 'og:description'
      content: 'A Real-World Migration'
    - name: 'og:image'
      content: '/logo_518x270.png'
    - name: 'og:url'
      content: 'http://www.mjkweb.de'
    - name: 'twitter:title'
      content: 'Upgrading a Nuxt 2 Project to Nuxt 3'
    - name: 'twitter:description'
      content: 'A Real-World Migration'
    - name: 'twitter:image'
      content: '/logo_200x200.png'
    - name: 'twitter:card'
      content: 'summary'
---

# Upgrading a Nuxt 2 Project to Nuxt 3

Web technologies never stand still. With each new version, frameworks bring improvements in performance, developer experience, and long-term maintainability. That’s why I’ve decided to upgrade an existing Nuxt 2 project of mine to Nuxt 3.

The project in question is a small, personal website—somewhere between an online gallery and a digital business card—created to showcase my father’s artwork. It’s a relatively simple Nuxt 2 application, but it still offers a great opportunity to explore what’s involved in bringing a real-world project up to date with the latest version of Nuxt.

Nuxt 3 is built on top of Vue 3 and introduces a modern architecture that includes first-class support for the Composition API, a new `server/` directory for backend logic, and Vite as the default bundler for faster development builds. These changes not only modernize the development workflow but also make the codebase more modular and performant by default.

This upgrade isn’t just about staying current—it’s a chance to revisit old code, rethink the structure, and embrace best practices that have emerged since the original version was built.

In this blog post, I’ll document my migration process as it unfolds—step by step. The goal is to provide a transparent look at what’s involved in moving from Nuxt 2 to Nuxt 3, including the challenges I run into and how I solve them. Whether you're working on a personal project or maintaining something in production, I hope this will serve as a useful and honest guide.

<!--more-->

## 1. Preparation

Before jumping into the actual upgrade, I wanted to make sure I had a safe environment to experiment in. Since my Nuxt 2 project is already hosted on GitHub, I didn’t need a separate backup—version control has that covered.  
If you're not using Git, it's a good idea to create a manual backup of your project folder before starting, just to be safe.

I created a new branch specifically for the migration:

```sh
git checkout -b migrate/nuxt3
```

This allows me to work on the Nuxt 3 upgrade without touching the production code. If anything goes wrong, I can always fall back to the main branch or review the commit history.

If you're using Git on Windows and don’t have access to a Bash shell, the command below should still work in PowerShell or your Git GUI. If you're not using Git at all, simply duplicate your project folder manually and work on the copy.

At this stage, I also started looking into the official [Nuxt 3 upgrade guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-2-to-nuxt-3){:target="_blank"}. It gives a good overview of what has changed between Nuxt 2 and 3—from how routing works to how plugins, middleware, and API calls are structured.

Finally, I listed all major dependencies in the project and began checking whether they are compatible with Nuxt 3 or if replacements are needed.

## 2. Migration

### 2.1 Updating Dependencies

The first step in the actual migration process is to update the project dependencies. Since Nuxt 3 is built on top of Vue 3 and introduces a modernized architecture, many packages from the Nuxt 2 ecosystem are either no longer compatible or have been replaced by new solutions. Before making any code changes, it’s important to ensure that your dependencies are up to date and compatible with Nuxt 3.

**How do you know which dependencies need to be updated or replaced?**

Start by opening your `package.json` and making a list of all packages under `dependencies` and `devDependencies`. For each package, check the official documentation or GitHub repository to see if it supports Nuxt 3 (or Vue 3). The [Nuxt 3 upgrade guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-2-to-nuxt-3) is a great starting point, and many popular Nuxt modules have their own migration guides or compatibility tables.

Look out for these common patterns:
- Packages starting with `@nuxtjs/` may need to be updated or replaced.
- Any direct Vue 2 dependencies (like `vue`, `vuex`, `vue-router`, `vue-template-compiler`) should be removed or replaced with their Vue 3 equivalents.
- If you’re unsure about a package, search for “Nuxt 3 support” or “Vue 3 support” in its documentation or issues.

You can also use tools like [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) to quickly see which of your dependencies have newer versions available:
```sh
npx npm-check-updates
```
However, always double-check compatibility manually, as not every update is Nuxt 3-ready.

In my own project, I identified the following outdated or incompatible dependencies:

| Package                | Status in Nuxt 3         | Recommendation                                  |
|------------------------|--------------------------|-------------------------------------------------|
| nuxt                   | ❌ Not compatible         | Update to `nuxt@latest`                         |
| vue                    | ❌ Not required           | Remove (Nuxt 3 includes Vue 3 internally)       |
| vue-server-renderer    | ❌ Not required           | Remove                                          |
| vue-template-compiler  | ❌ Not required           | Remove                                          |
| @nuxtjs/vuetify        | ⚠️  Needs update          | Replace with latest Vuetify for Vue 3           |
| core-js                | ✅ Compatible (optional)  | Keep if polyfills are needed                    |
| compass-mixins         | ✅ Compatible             | Keep if used                                    |
| push-dir               | ✅ Compatible             | Keep if used                                    |
| sass                   | ✅ Compatible             | Keep                                            |
| sass-loader            | ⚠️  Needs update          | Update to version 12 or higher                  |

To update the dependencies, I used the following commands:

```sh
npm uninstall vue vue-server-renderer vue-template-compiler @nuxtjs/vuetify nuxt
```

> **Note:** At the time of writing, Nuxt 4 is already in beta. This means that running `npm install nuxt@latest` might soon install Nuxt 4 instead of Nuxt 3.
> To make sure you’re installing Nuxt 3, use the explicit version tag:
>
> ```sh
> npm install nuxt@3
> ```
>
> This guarantees that you’re working with the stable Nuxt 3 release, which is what this migration guide is based on.

```sh
npm install nuxt@latest
npm install vuetify@latest
```

```sh
npm install --save-dev sass-loader@^12
```

After running these commands, my `package.json` was much cleaner and ready for the next steps in the migration.

### 2.2 Adapting the Codebase and Directory Structure

With the dependencies updated, the next step is to adapt your codebase and project structure to match the conventions and requirements of Nuxt 3. Nuxt 3 introduces several architectural changes, including new directories, file naming conventions, and the removal or replacement of some legacy features.

Start by reviewing the official [Nuxt 3 directory structure documentation](https://nuxt.com/docs/guide/directory-structure/overview) to get an overview of what’s new and what has changed.

Some of the most important changes include:

#### 2.2.1 Configuration file

  Rename `nuxt.config.js` to `nuxt.config.ts` and update its syntax to use TypeScript and the new Nuxt 3 options.

```sh
# Rename your Nuxt config file to use TypeScript
mv nuxt.config.js nuxt.config.ts
```

and use `defineNuxtConfig`. My `nuxt.config.ts` file now looks like this:

```ts
export default defineNuxtConfig({
  // Target: Only 'static' or 'server' in Nuxt 2, in Nuxt 3 use 'ssr: false' for static
  ssr: false, // Set to false if you want a static site
  app: {
    baseURL: '/kunstkanne/',
    head: {
      title: 'kunstkanne',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', type: 'image/x-icon', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  css: [
    '~/assets/css/main.scss'
  ],
  components: true,
  modules: [
    // Add Nuxt 3 compatible modules here
  ],
  build: {
    // Add custom build options if needed
  }
}) 
```

When migrating your Nuxt config from JavaScript to TypeScript (`nuxt.config.js` → `nuxt.config.ts`), you might encounter some common TypeScript or linter errors. Here are two typical issues and how to resolve them:

- **Error:**  
  `Cannot find name 'defineNuxtConfig'.`

  This happens because TypeScript (and your linter) does not know about the special Nuxt 3 global types by default.

  to fix this, add `"nuxt"` to the `types` array in your `tsconfig.json` file.
  ```json
  {
    "compilerOptions": {
      "types": ["nuxt"]
    }
  }
  ```

- **Error:**  
  `Cannot read file './.nuxt/tsconfig.json'.`

  This occurs if your `tsconfig.json` tries to extend a file that does not exist yet. The `.nuxt/tsconfig.json` file is generated only after the first build, so it should not be referenced directly in your main `tsconfig.json`.

  ```json
  {
    "compilerOptions": {
      "target": "ESNext",
      "module": "ESNext",
      "moduleResolution": "Node",
      "strict": true,
      "jsx": "preserve",
      "esModuleInterop": true,
      "allowJs": true,
      "skipLibCheck": true,
      "types": ["nuxt"],
      "baseUrl": ".",
      "paths": {
        "~/*": ["./*"],
        "@/*": ["./*"]
      }
    },
    "exclude": ["node_modules", ".output", ".nuxt", "dist"]
  }
  ```

**What do these `tsconfig.json` options mean?**

  - `target`, `module`, `moduleResolution`: Set the JavaScript version and module system for your project.
  - `strict`: Enables strict type-checking for safer code.
  - `jsx`: Allows Vue’s JSX/TSX support if needed.
  - `esModuleInterop`, `allowJs`, `skipLibCheck`: Improve compatibility with JavaScript and third-party libraries.
  - `types`: Ensures Nuxt’s global types (like `defineNuxtConfig`) are available everywhere.
  - `baseUrl`, `paths`: Allow you to use `~/` and `@/` aliases in your imports.
  - `exclude`: Prevents TypeScript from checking build and output folders.

If you run into these errors, updating your `tsconfig.json` as shown above will resolve them and ensure a smooth TypeScript experience with Nuxt 3.

#### 2.2.2 Middleware and server routes

In my project, I did not have any custom server middleware or API routes, so there was nothing to migrate for this step.

If you do have custom middleware, you should move them from the old `middleware/` directory to the new `server/middleware/` directory in Nuxt 3.  
For example:

```sh
# Move your custom server middleware or API routes into the new server/ directory
# For example, move from:
# /middleware/my-middleware.js
# to:
# /server/middleware/my-middleware.ts
```

#### 2.2.3 Store

In my project, I did not use Vuex or any other state management solution, so there was nothing to migrate for this step.

If your project uses Vuex, you should consider migrating to [Pinia](https://pinia.vuejs.org/), the new recommended state management solution for Nuxt 3.  
Here’s how you would do it:

```sh
# If you used Vuex, install Pinia and create a new store in the stores/ directory
npm install pinia

# Example: stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

#### 2.2.4 Plugins and composables

In my project, I did not have any custom plugins or composables, so there was nothing to migrate for this step.

If your project uses plugins or reusable logic (e.g. from `plugins/`, `utils/`, or mixins), you should move them to the new `composables/` directory and update their syntax to use the Composition API.  
Here’s an example of a simple composable:

```ts
// Example: composables/useExample.ts
export function useExample() {
  const message = ref('Hello from a composable!')
  return { message }
}
```

#### 2.2.5 API requests

In my project, I did not use the `$axios` module or make any direct API requests, so there was nothing to migrate for this step.

If your project uses `$axios` (for example, `this.$axios.get('/api/data')`), you should migrate to the new Nuxt 3 composables like `useFetch` or `useAsyncData`.  
Here’s an example of how you would do this:

```js
// Old (Nuxt 2, Options API)
export default {
  asyncData({ $axios }) {
    return $axios.$get('/api/data')
  }
}

// New (Nuxt 3, Composition API)
<script setup>
const { data } = await useFetch('/api/data')
</script>
```

#### 2.2.6 Other breaking changes

In my project, I did not encounter any additional breaking changes or deprecated features that required migration.  
However, depending on your project, you may need to address some of the following changes. Here’s how these aspects differ between Nuxt 2 and Nuxt 3:

##### Directory structure

- **Nuxt 2:**  
  Special folders like `middleware/`, `store/`, `plugins/`, `static/`, `assets/`, `pages/`, `components/`, `layouts/`
- **Nuxt 3:**  
  New folders like `server/` (for API routes and middleware), `composables/` (for reusable logic).  
  Some folders (like `store/`) are now optional.

##### Global CSS and assets

- **Nuxt 2:**  
  Add global CSS in `nuxt.config.js`:
  ```js
  css: [
    '~/assets/css/main.scss'
  ]
  ```
- **Nuxt 3:**  
  Same principle, but in `nuxt.config.ts`:
  ```ts
  css: [
    '~/assets/css/main.scss'
  ]
  ```

###### Migrating static assets and favicons

In Nuxt 2, static files such as favicons, robots.txt, and other assets were placed in the static directory.  
With Nuxt 3 and Nuxt 4, the static directory has been replaced by public.  
All files that should be directly accessible (e.g. /favicon.ico, /site.webmanifest, images for Open Graph, etc.) must now be placed in the public folder at the project root.

**Migration steps:**
- Move all files from static to public.
- Update any references in your configuration or templates if needed.
- You can safely delete the old static directory after migrating.

**Example structure:**  
PLACEHOLDER_EXAMPLE_STRUCTURE

```
public/
  favicon.ico
  favicon-32x32.png
  favicon-16x16.png
  site.webmanifest
  apple-touch-icon.png
  android-chrome-512x512.png
  android-chrome-192x192.png
```

This ensures that favicons and other static assets are correctly served in Nuxt 3/4.

##### Deprecated features/APIs

- **Nuxt 2:**  
  Features like `context.app`, `context.store`, automatic injection of `$axios`, etc.
- **Nuxt 3:**  
  Many of these features are removed or replaced by composables (e.g. `useFetch`, Pinia instead of Vuex, no automatic plugin injection).

**Import aliases**

- **Nuxt 2:**  
  Usually `@/` and `~/` for imports, but sometimes not consistent.
- **Nuxt 3:**  
  The aliases `@/` and `~/` are still standard and should be used for all imports:
  ```js
  import MyComponent from '@/components/MyComponent.vue'
  import { useExample } from '~/composables/useExample'
  ```

If you do run into issues, consult the [Nuxt 3 migration guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-2-to-nuxt-3) and check the official documentation for any modules or features you use.

### 2.3 Bonus: Nuxt 3/4 Features & Folder Structure

#### Automatic Component Imports

One of the best quality-of-life improvements in Nuxt 3 and Nuxt 4 is automatic component import.  
You no longer need to manually import and register components from your `components/` directory—they are available globally in your templates.

**Before (Nuxt 2):**
```js
import Header from '~/components/Header.vue'
export default {
  components: { Header }
}
```

**Now (Nuxt 3/4):**
```vue
<template>
  <Header />
</template>
```

This makes your code cleaner and easier to maintain!

#### Nuxt 4-Ready: Folder Structure

With Nuxt 4, some directories are now expected to be inside the new `app/` directory.  
Here’s how you should organize your project for Nuxt 4 compatibility:

```
my-nuxt-project/
│
├─ app/
│   ├─ components/
│   ├─ layouts/
│   └─ pages/
│
├─ assets/
├─ public/
├─ server/
├─ nuxt.config.ts
├─ package.json
└─ ...
```

- Move your `components/`, `pages/`, and `layouts/` folders into the new `app/` directory.
- Your `assets/`, `public/`, and `server/` folders remain at the project root.



#### Nuxt 4 Compatibility Option

To make your project Nuxt 4 ready, add the following option to your `nuxt.config.ts`:

[codeblock: nuxt4-future-option]
```ts
export default defineNuxtConfig({
  // ...your other config options
  future: {
    compatibilityVersion: 4,
  },
})
```

This ensures your project uses the latest conventions and is prepared for the next major version.

## 3. Challenges & Solutions

No migration is ever completely smooth, and moving from Nuxt 2 to Nuxt 3 was no exception. Here are some of the main challenges I encountered during the process—and how I solved them:

### 3.1 Dependency and Build Issues

**Problem:**  
After updating dependencies and running the dev server, I encountered errors like `Cannot find module 'bindings'` and issues related to `@vercel/nft`.

**Solution:**  
These errors were caused by leftover or broken dependencies from the old setup. Deleting `node_modules` and `package-lock.json` and running a fresh `npm install` resolved the issue.  
If you see similar errors, always try a clean install first.

### 3.2 TypeScript and Linter Errors

**Problem:**  
After converting `nuxt.config.js` to `nuxt.config.ts`, TypeScript complained about `defineNuxtConfig` not being found.

**Solution:**  
Add `"types": ["nuxt"]` to your `tsconfig.json` to make Nuxt 3’s global types available.  
If you see errors about missing or unreadable `tsconfig.json` files, use a standalone config and do not extend from `.nuxt/tsconfig.json`.

### 3.3 SCSS/Sass Import and Mixin Problems

**Problem:**  
Sass `@import` rules are deprecated, and Compass-Mixins are not compatible with Nuxt 3/Vite.  
I also got errors like `Undefined mixin` and warnings about deprecated imports.

**Solution:**  
- Remove all Compass-Mixins and replace them with native CSS.
- Switch from `@import` to the new `@use` syntax for SCSS files.
- If you rely on variables or mixins across files, use the namespace provided by `@use`.

### 3.4 Layout and Styling Differences

**Problem:**  
After migration, the layout looked different:  
- The page had unwanted white margins.
- Navigation links were stuck together.
- The font was not loading.
- The mobile navigation did not behave as expected.

**Solution:**  
- Add `body { margin: 0; padding: 0; }` to your global CSS to remove default browser margins.
- Add or adjust CSS for the navigation to provide spacing between links.
- Update font paths in SCSS to use the new Vite-compatible syntax (e.g. `@/assets/fonts/vivaldi.ttf`).
- For the mobile navigation, implement a burger menu that closes when a link is clicked.

### 3.5 General Advice

- Test your app after every major migration step.
- Use browser DevTools to debug layout and CSS issues.
- Don’t be afraid to remove legacy code or dependencies that are no longer needed.

Every migration is unique, but most issues can be solved with a bit of patience and by consulting the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/upgrade#nuxt-2-to-nuxt-3) and community resources.

## 3.6 Additional Issues After Removing Old Config and Enabling Nuxt 4 Compatibility

After removing legacy configuration files and updating the project for Nuxt 4 compatibility, several common migration issues may arise. Here are some general patterns and solutions that apply to most Nuxt 3/4 migrations:

### 3.6.1 SCSS/CSS Not Found

**Problem:**  
After updating the configuration, global SCSS or CSS files may no longer be found.  
Typical error message:

```
Pre-transform error: Failed to resolve import "assets/css/main.scss"
```

**Solution:**  
- Ensure the path in the css option of your Nuxt config is correct.
- Do not use a tilde or leading slash.
- In some cases, using an absolute path with a path join helper can help.

```js
import { join } from 'path'

export default defineNuxtConfig({
  css: [
    join(__dirname, 'assets/css/main.scss')
  ],
  // ...other config options
})
```

Always clear the cache after such changes:
- Delete node_modules, .nuxt, and your lock file, then reinstall dependencies and restart the dev server.

### 3.6.2 Images Not Found

**Problem:**  
After switching to Nuxt 3/4 and Vite, images previously loaded from the assets folder may no longer be found in templates.  
Typical error message:

```
Failed to resolve import "/img/kanne.jpg"
```

**Solution:**  
- Images used in templates (e.g. img src) must be moved to the public folder.
- Update the paths in your templates to point to the correct location.

```html
<img src="/img/example.jpg" alt="Example">
<img src="/img/gallery/picture.png" alt="Gallery Picture">
<img src="/img/layout/header.jpg" alt="Header">
```

### 3.6.3 PowerShell: Copying Images

**Problem:**  
When copying images on Windows PowerShell, Unix commands like && or cp do not work.

**Solution:**  
- Create the folder structure with mkdir and use Copy-Item to move the images.

for windows users
```PowerShell
mkdir public\img
mkdir public\img\gallery
mkdir public\img\layout

Copy-Item assets\img\example.jpg public\img\
Copy-Item assets\img\gallery\* public\img\gallery\
Copy-Item assets\img\layout\* public\img\layout\
```

for linux macos users
```Bash
mkdir -p public/img/gallery
mkdir -p public/img/layout

cp assets/img/example.jpg public/img/
cp assets/img/gallery/* public/img/gallery/
cp assets/img/layout/* public/img/layout/
```

### 3.6.4 SCSS: @font-face Must Be Top-Level

**Problem:**  
A SCSS error may occur if the @font-face rule is nested inside a selector.  
This causes the entire SCSS file to fail processing.

**Solution:**  
- The @font-face rule must be at the top level, not nested.

```scss
@font-face {
  font-family: 'custom-font';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('@/assets/fonts/custom-font.ttf') format('truetype');
}

h1 {
  font-family: 'custom-font', 'Segoe Script', 'sans-serif';
}
```

### 3.6.5 Lessons Learned

Especially after removing old config files and switching to Nuxt 4 standards, many legacy issues become visible.  
Key takeaways:
- Paths and imports must be exact.
- Assets and static files must be strictly separated.
- Clear caches regularly.
- Pay attention to SCSS syntax.

## 4. Conclusion

### Summary of my experience

Migrating from Nuxt 2 to Nuxt 3 was both a challenge and a great learning experience. While the process required a deep dive into the new architecture, updated conventions, and breaking changes, the end result is a more modern, maintainable, and performant codebase. The new features of Nuxt 3—like the Composition API, Vite integration, and the new directory structure—make development more enjoyable and future-proof.

### Recommendations for others

- **Read the official migration guide** before you start. It will save you a lot of time and confusion.
- **Take it step by step:** Update dependencies, migrate config and structure, then tackle code and styling issues.
- **Expect to break things:** Don’t be discouraged by errors—most are solvable with a bit of research and patience.
- **Test early and often:** Run your app after every major change to catch issues before they pile up.
- **Clean up your codebase:** Use the migration as an opportunity to remove unused dependencies, legacy code, and outdated patterns.
- **Leverage the community:** If you get stuck, search GitHub issues, Discord, or the Nuxt forums—chances are, someone else had the same problem.
- **Work in a dedicated migration branch:** This keeps your production code safe and lets you experiment freely.
- **Document your process:** Writing down each step (or blogging about it) is invaluable for yourself and others.

### What I would do differently next time

- **Plan more time for CSS and layout adjustments:** Small differences in how styles are handled can have a big impact.
- **Be prepared for subtle differences in tooling:** Especially with Vite and modern Sass, some things work differently than in the old Webpack world.
- **Consider a full rewrite for very old projects:** Sometimes, starting from scratch with Nuxt 3 and porting over only the essentials is faster and cleaner.

**Final thoughts:**  
The migration to Nuxt 3 is absolutely worth it for most projects. The ecosystem is moving forward, and the new features and performance improvements are significant. With a bit of patience and a systematic approach, you’ll end up with a codebase that’s ready for the future.

Good luck with your own migration!