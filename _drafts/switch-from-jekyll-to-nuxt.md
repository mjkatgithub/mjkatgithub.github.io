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
<!--more-->
## so the journey begins

initializing a new nuxt project is very easy.

just run

```console
npx nuxi@latest init <project-name>
```

Then you will be asked on the console to select a package manager (I use npm) and you will be asked whether you want to initialize a git repo right away. That's it.
