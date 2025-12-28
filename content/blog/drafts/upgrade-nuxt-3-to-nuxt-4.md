---
title: Upgrading from Nuxt 3 to Nuxt 4
date: '2025-12-24'
categories:
  - programming
tags:
  - programming
  - coding
  - vue
  - nuxt
excerpt_separator: <!--more-->
draft: true
description: A Real-World Upgrade Experience
head:
  htmlAttrs:
    lang: en
  link:
    - rel: 'icon'
      type: 'mange/x-icon'
      href: '/favicon.ico'
  meta:
    - name: 'keywords'
      content: 'programming, coding, vue'
    - name: 'robots'
      content: 'index, follow'
    - name: 'author'
      content: 'Melchior Kannengießer'
    - name: 'og:title'
      content: 'mjk @ web - Upgrading from Nuxt 3 to Nuxt 4'
    - name: 'og:description'
      content: 'A Real-World Upgrade Experience'
    - name: 'og:image'
      content: '/logo_518x270.png'
    - name: 'og:url'
      content: 'http://www.mjkweb.de'
    - name: 'twitter:title'
      content: 'mjk @ web - Upgrading from Nuxt 3 to Nuxt 4'
    - name: 'twitter:description'
      content: 'A Real-World Upgrade Experience'
    - name: 'twitter:image'
      content: '/logo_200x200.png'
    - name: 'twitter:card'
      content: 'summary'
---

# Upgrading from Nuxt 3 to Nuxt 4

It's Christmas time, so I have time to code. Nuxt 3 reaches its end of life in January 2026, and Nuxt 4 is the new kid on the block. So I decided to upgrade my projects to Nuxt 4. Since my blog is already configured to be Nuxt 4 ready and it's just a simple blog with some markdown files, it should be a no-brainer, right?

Well, as it turns out, even projects that are already "Nuxt 4 ready" can throw unexpected challenges at you. In this blog post, I'll document my experience upgrading three projects to Nuxt 4: my personal blog (already Nuxt 4 ready), a web business card/gallery project (also already Nuxt 4 ready), and Linxz—a more complex application that required a full migration.

The irony? Most of the issues I encountered were with the projects that were supposedly already ready for Nuxt 4. This upgrade wasn't just about updating dependencies—it involved dealing with breaking changes in Nuxt Content 3.x, fixing TypeScript configuration issues, and working around problems with dark mode templates and Open Graph metadata.

In this post, I'll walk you through the entire process, including the challenges I faced and how I solved them. Whether you're upgrading a single project or multiple projects like I did, I hope this honest account will help you avoid some of the pitfalls I encountered.

<!--more-->

## 1. Preparation

Before jumping into the actual upgrade, I wanted to make sure I had a safe environment to experiment in. Since all my projects are already hosted on GitHub, I didn't need a separate backup—version control has that covered.  
If you're not using Git, it's a good idea to create a manual backup of your project folder before starting, just to be safe.

I created new branches specifically for the migration in each project:

```sh
git checkout -b upgrade/nuxt4
```

This allows me to work on the Nuxt 4 upgrade without touching the production code. If anything goes wrong, I can always fall back to the main branch or review the commit history.

If you're using Git on Windows and don't have access to a Bash shell, the command above should still work in PowerShell or your Git GUI. If you're not using Git at all, simply duplicate your project folder manually and work on the copy.

**A confession:** At this stage, I should have started looking into the official [Nuxt 4 upgrade guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-3-to-nuxt-4){:target="_blank"}. But I didn't. Why? Because I thought it would be a no-brainer—after all, two of my three projects were already configured to be Nuxt 4 ready. I figured I'd just update the dependencies and be done with it.

As you'll see, that assumption was wrong. Even projects that are "Nuxt 4 ready" can have issues when you actually upgrade to Nuxt 4. So my first piece of advice: **Read the documentation first**, even if you think you don't need to.

Finally, I listed all major dependencies in each project and began checking whether they needed updates or if replacements were needed.

## 2. Migration

### 2.1 Updating Dependencies

The first step in the actual upgrade process is to update the project dependencies. Since Nuxt 4 is the latest major version, the main change is updating the `nuxt` package itself. However, you may also need to update related modules and Nuxt Content if you're using it.

**How do you know which dependencies need to be updated?**

Start by opening your `package.json` and making a list of all packages under `dependencies` and `devDependencies`. For each package, check the official documentation or GitHub repository to see if it supports Nuxt 4. The [Nuxt 4 upgrade guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-3-to-nuxt-4) is a great starting point.

You can also use tools like [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) to quickly see which of your dependencies have newer versions available:

```sh
npx npm-check-updates
```

However, always double-check compatibility manually, as not every update is Nuxt 4-ready.

In my projects, I identified the following dependencies that needed updates:

| Package                | Status in Nuxt 4         | Recommendation                                  |
|------------------------|--------------------------|-------------------------------------------------|
| nuxt                   | ❌ Needs update          | Update to `nuxt@^4.0.0`                        |
| @nuxt/content          | ⚠️  Major version change | Update to `@nuxt/content@^3.0.0` (breaking changes!) |
| @pinia/nuxt            | ✅ Compatible            | Update to latest version                        |
| @prisma/nuxt           | ✅ Compatible            | Update to latest version                        |
| @nuxtjs/tailwindcss    | ✅ Compatible            | Update to latest version                        |
| @nuxt/eslint           | ✅ Compatible            | Update to latest version                        |
| @nuxt/test-utils       | ✅ Compatible            | Update to latest version                        |

The most significant change was Nuxt Content, which jumped from version 2.x to 3.x. This introduced breaking changes in the API that I'll discuss in more detail later.

To update the dependencies, I used the following commands:

```sh
npm install nuxt@latest
npm install @nuxt/content@latest
```

For the other modules, I updated them to their latest versions as well:

```sh
npm install @pinia/nuxt@latest @prisma/nuxt@latest @nuxtjs/tailwindcss@latest
```

After running these commands, my `package.json` files were updated and ready for the next steps in the migration.

### 2.2 Adapting the Configuration

With the dependencies updated, the next step is to adapt your Nuxt configuration to match Nuxt 4's requirements. The changes are relatively minor compared to the Nuxt 2→3 migration, but there are still some important updates to make.

#### 2.2.1 Remove `future.compatibilityVersion`

If you had set `future.compatibilityVersion: 4` in your `nuxt.config.ts` to prepare for Nuxt 4, you can now remove it. This option is no longer needed since you're actually using Nuxt 4:

```ts
export default defineNuxtConfig({
  // Remove this:
  // future: {
  //   compatibilityVersion: 4,
  // },
  
  // Keep this:
  compatibilityDate: '2024-11-01', // Update to current date
  // ... rest of your config
})
```

#### 2.2.2 Update `compatibilityDate`

Update the `compatibilityDate` to the current date. This ensures you're using the latest Nuxt 4 features and conventions:

```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-12-24', // Update to current date
  // ... rest of your config
})
```

#### 2.2.3 TypeScript Reference

When using TypeScript, you might encounter an error like `Cannot find name 'defineNuxtConfig'`. To fix this, add a TypeScript reference directive at the top of your `nuxt.config.ts`:

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="nuxt" />
export default defineNuxtConfig({
  // ... your config
})
```

You may also need to add `"types": ["nuxt"]` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["nuxt"]
  }
}
```

This ensures TypeScript recognizes Nuxt's global types, including `defineNuxtConfig`.

### 2.3 Adapting the Project Structure (Linxz Only)

For my Linxz project, which wasn't already Nuxt 4 ready, I needed to restructure the project to follow Nuxt 4's new conventions. Nuxt 4 introduces a new `app/` directory structure that organizes your application code more clearly.

**What needs to be moved?**

The following directories should be moved into a new `app/` directory:
- `pages/` → `app/pages/`
- `components/` → `app/components/`
- `layouts/` → `app/layouts/`
- `composables/` → `app/composables/`
- `plugins/` → `app/plugins/`
- `stores/` → `app/stores/`
- `app.vue` → `app/app.vue`
- `lib/` → `app/lib/` (if you have one)

Directories that remain in the root:
- `server/` (stays at root)
- `public/` (stays at root)
- `tests/` (stays at root)
- `config/` (stays at root, if you have one)
- `prisma/` (stays at root, if you have one)

**Migration steps:**

1. Create the `app/` directory in your project root.

2. Move the directories:

```sh
# On Linux/macOS
mkdir app
mv pages components layouts composables plugins stores lib app/
mv app.vue app/

# On Windows PowerShell
mkdir app
Move-Item pages,components,layouts,composables,plugins,stores,lib app/
Move-Item app.vue app/
```

3. Update `nuxt.config.ts` to set `srcDir`:

```ts
export default defineNuxtConfig({
  srcDir: 'app',
  // ... rest of your config
})
```

4. Update import paths for server-side code. Since `~` and `@` now point to `app/`, you need to use `~~` for root-level imports:

```ts
// Old (points to app/server, which doesn't exist)
import { something } from '~/server/utils'

// New (points to root/server)
import { something } from '~~/server/utils'
```

5. Update test configuration. If you're using Vitest, update your `vitest.config.ts` aliases:

```ts
export default defineVitestConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app'),
    }
  }
})
```

And update test files to use `~~/server` for server imports:

```ts
// Old
import { something } from '~/server/utils'

// New
import { something } from '~~/server/utils'
```

After these changes, my Linxz project structure looked like this:

```
linxz/
├── app/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── composables/
│   ├── plugins/
│   ├── stores/
│   ├── lib/
│   └── app.vue
├── server/
├── public/
├── tests/
├── config/
├── prisma/
├── nuxt.config.ts
└── package.json
```

### 2.4 Nuxt Content 3.x Migration

One of the biggest changes in this upgrade was Nuxt Content jumping from version 2.x to 3.x. This introduced breaking changes in the API, particularly for data collections.

**The main breaking change: `.path()` no longer works for data collections**

In Nuxt Content 2.x, you could query data collections like this:

```ts
const { data } = await useAsyncData('links', async () => {
  return await queryCollection('data')
    .path('/link-sets')
    .first()
})
```

In Nuxt Content 3.x, `.path()` doesn't work for data collections anymore. Instead, you need to use `.all()` and filter manually:

```ts
const { data } = await useAsyncData('links', async () => {
  const allData = await queryCollection('data')
    .all()
  const doc = allData.find(item => 
    item._path === '/link-sets' || 
    item._id === 'link-sets'
  )
  return doc
})
```

This affected my Links and Projects pages, which I'll discuss in more detail in the Challenges section.

## 3. Challenges & Solutions

No upgrade is ever completely smooth, and moving from Nuxt 3 to Nuxt 4 was no exception. Here are the main challenges I encountered during the process—and how I solved them:

### 3.1 TypeScript Configuration Errors

**Problem:**  
After updating to Nuxt 4, TypeScript complained about `defineNuxtConfig` not being found:

```
Cannot find name 'defineNuxtConfig'. Did you mean 'defineNitroConfig'?
```

**Solution:**  
Add a TypeScript reference directive at the top of your `nuxt.config.ts`:

```ts
/// <reference types="nuxt" />
export default defineNuxtConfig({
  // ... your config
})
```

You may also need to add `"types": ["nuxt"]` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["nuxt"]
  }
}
```

This ensures TypeScript recognizes Nuxt's global types. The triple-slash directive is particularly important and should be placed at the very top of your config file.

### 3.2 baseURL for GitHub Pages (Windows)

**Problem:**  
For the web business card project, I needed to set a `baseURL` for GitHub Pages deployment. The standard approach of setting environment variables doesn't work well on Windows PowerShell:

```sh
# This doesn't work on Windows PowerShell
BASE_URL=/kunstkanne/ npm run generate
```

**Solution (or rather, workaround):**  
I ended up not deploying the web business card to GitHub Pages anymore. This is a workaround rather than a proper solution, but it was the path of least resistance for this particular project.

If you need to solve this properly, you could:
1. Use `cross-env` to set environment variables cross-platform
2. Detect the npm script in `nuxt.config.ts` and set `baseURL` accordingly
3. Use a `.env` file (though this affects local development too)

For now, I've documented this as an unresolved issue that I worked around rather than solved.

### 3.3 Nuxt Content 3.x API Changes

**Problem:**  
After upgrading to Nuxt Content 3.x, my Links and Projects pages stopped showing data. The error in the console was:

```
no such column: "path"
```

The issue was that `.path()` no longer works for data collections in Nuxt Content 3.x.

**Solution:**  
Replace `.path()` with `.all()` and filter manually:

```vue
<script setup>
const { data: result } = await useAsyncData(
  'link-sets',
  async () => {
    const allData = await queryCollection('data')
      .all()
    const doc = allData.find(item => 
      item._path === '/link-sets' || 
      item._id === 'link-sets' ||
      item.path === '/link-sets'
    )
    return doc || allData[0]
  }
)
const linkSets = result.value?.['link-sets'] || result.value
</script>
```

This approach loads all data from the collection and then filters it in JavaScript, which is less efficient but works with the new API.

### 3.4 Open Graph Meta Tags from Frontmatter

**Problem:**  
After the upgrade, Open Graph meta tags from the frontmatter of blog posts were no longer being processed automatically. The `head` section in the frontmatter was being ignored.

**Solution:**  
Manually process the `head` data from frontmatter and set meta tags using `useSeoMeta()` and `useHead()`:

```vue
<script setup>
const route = useRoute()
const { data: doc } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    try {
      const article = await queryCollection('blog')
        .path(route.path)
        .first()
      return article
    } catch {
      return null
    }
  }
)

if (doc.value?.head) {
  const head = doc.value.head
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || 
                  config.app?.baseURL || 
                  'https://mjkatgithub.github.io'

  // Extract meta tags
  const metaTags = head.meta || []
  const ogTags = {}
  const twitterTags = {}
  const otherMeta = []

  metaTags.forEach((tag) => {
    const tagName = tag.property || tag.name
    
    if (tagName?.startsWith('og:')) {
      const key = tagName.replace('og:', '')
      ogTags[key] = tag.content
    } else if (tagName?.startsWith('twitter:')) {
      const key = tagName.replace('twitter:', '')
      twitterTags[key] = tag.content
    } else if (tagName) {
      const metaTag = tag.property 
        ? { property: tag.property, content: tag.content }
        : { name: tag.name, content: tag.content }
      otherMeta.push(metaTag)
    }
  })

  // Set SEO meta tags
  useSeoMeta({
    title: doc.value.title || ogTags.title || '',
    description: doc.value.description || 
                 ogTags.description || '',
    ogTitle: ogTags.title || doc.value.title || '',
    ogDescription: ogTags.description || 
                   doc.value.description || '',
    ogImage: ogTags.image || '',
    ogUrl: ogTags.url || `${baseURL}${route.path}`,
    twitterTitle: twitterTags.title || 
                  ogTags.title || 
                  doc.value.title || '',
    twitterDescription: twitterTags.description || 
                        ogTags.description || 
                        doc.value.description || '',
    twitterImage: twitterTags.image || '',
    twitterCard: twitterTags.card || 'summary'
  })

  // Set additional meta tags and HTML attributes
  useHead({
    htmlAttrs: head.htmlAttrs || {},
    link: head.link || [],
    meta: otherMeta
  })
}
</script>
```

This manually extracts and processes all the meta tags from the frontmatter, ensuring they're properly set in the page head.

### 3.5 Dark Mode Template Switching Issues

**Problem:**  
After the upgrade, code boxes in blog articles had poor contrast in dark mode. More importantly, the template wasn't switching between light and dark mode properly—the `dark:prose-invert` class wasn't being applied when the mode changed.

**Solution:**  
I simplified the template by removing the dark mode variant entirely. Instead of trying to make the template switch between light and dark modes, I kept it at a single dark template:

```vue
<template>
  <article class="prose">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>
```

I also simplified the Tailwind configuration by removing the `invert` variant:

```ts
// tailwind.config.ts
import { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{vue,js,ts}',
    './content/**/*.{md,yaml,json}',
  ],
  plugins: [
    typography,
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
};

export default config;
```

This is a workaround rather than a proper fix, but it solved the immediate problem. The root cause was that the template switching mechanism wasn't working correctly after the upgrade, and rather than spending more time debugging it, I chose to simplify.

### 3.6 Test Configuration Updates (Linxz)

**Problem:**  
After moving the project structure to the `app/` directory, tests started failing because import paths were incorrect. The Vitest aliases needed to be updated, and server imports needed to use `~~/server` instead of `~/server`.

**Solution:**  
Update `vitest.config.ts` to point aliases to the `app/` directory:

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'
import path from 'path'

export default defineVitestConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app'),
    }
  }
})
```

Update test files to use `~~/server` for server imports:

```ts
// Old
import { something } from '~/server/utils'

// New
import { something } from '~~/server/utils'
```

After these changes, all 313 tests in the Linxz project passed successfully.

## 4. Conclusion

### Summary of my experience

Upgrading from Nuxt 3 to Nuxt 4 was more challenging than I initially expected. Even though two of my three projects were already configured to be "Nuxt 4 ready," I still encountered several issues that required fixes and workarounds.

The most significant challenges came from:
1. **Nuxt Content 3.x breaking changes** - The API changes required refactoring data collection queries
2. **Open Graph metadata** - Manual processing of frontmatter head data became necessary
3. **Dark mode template switching** - Simplified to a single template as a workaround
4. **TypeScript configuration** - Required explicit type references

The Linxz project, which required a full structural migration, was actually the smoothest part of the upgrade. The folder structure changes were straightforward, and all tests passed after updating the import paths.

### Recommendations for others

- **Read the documentation first** - Even if your project is "Nuxt 4 ready," read the upgrade guide. You might encounter issues you didn't expect.
- **Test thoroughly after each change** - Don't assume everything will work just because dependencies updated successfully.
- **Be prepared for Nuxt Content 3.x changes** - If you're using Nuxt Content, the API changes are significant and will require code updates.
- **Check your TypeScript configuration** - The `defineNuxtConfig` error is common and easily fixed, but it's worth knowing about upfront.
- **Consider workarounds vs. proper fixes** - Sometimes a workaround (like simplifying the dark mode template) is acceptable if it solves the problem and doesn't impact functionality significantly.

### What I would do differently next time

- **Read the documentation before starting** - I should have consulted the Nuxt 4 upgrade guide first, even though I thought I didn't need to.
- **Test one project at a time** - Upgrading three projects simultaneously made it harder to track which issues were project-specific vs. general.
- **Document issues as they occur** - Keeping better notes during the upgrade would have made writing this blog post easier.

**Final thoughts:**  
The upgrade to Nuxt 4 is worth it for most projects. The new features and improvements are significant, and the migration path is generally smoother than the Nuxt 2→3 migration. However, don't underestimate the work involved, especially if you're using Nuxt Content or have complex configurations. With a bit of patience and systematic problem-solving, you'll end up with a codebase that's ready for the future.

Good luck with your own upgrade!
