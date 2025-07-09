---
draft: true
date: '2025-01-20'
categories:
  - programming
tags:
  - programming
  - coding
  - vue
  - nuxt
excerpt_separator: <!--more-->
---

# Upgrading a Nuxt 2 Project to Nuxt 3 – A Real-World Migration

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
