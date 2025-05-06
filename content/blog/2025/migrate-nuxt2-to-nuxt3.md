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
