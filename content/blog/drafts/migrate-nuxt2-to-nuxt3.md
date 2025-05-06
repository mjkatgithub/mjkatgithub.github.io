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
