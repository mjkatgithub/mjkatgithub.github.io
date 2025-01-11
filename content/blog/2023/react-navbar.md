---
date: '2023-02-12'
categories:
- programming
tags:
  - coding
  - programming
  - react
excerpt_separator: <!--more-->
description: creating a react-navbar npm package
head:
  htmlAttrs:
    lang: en
  link:
    - rel: 'icon'
      type: 'mange/x-icon'
      href: '/favicon.ico'
  meta:
    - name: 'keywords'
      content: 'coding, programming, react'
    - name: 'robots'
      content: 'index, follow'
    - name: 'author'
      content: 'Melchior Kannengießer'
    - name: 'og:title'
      content: 'mjk @ web - x'
    - name: 'og:description'
      content: 'creating a react-navbar npm package'
    - name: 'og:image'
      content: '/logo_518x270.png'
    - name: 'og:url'
      content: 'http://www.mjkweb.de'
    - name: 'twitter:title'
      content: 'mjk @ web - x'
    - name: 'twitter:description'
      content: 'creating a react-navbar npm package'
    - name: 'twitter:image'
      content: '/logo_200x200.png'
    - name: 'twitter:card'
      content: 'summary'
---
# react-navbar

Well, I know it's been a wile that i write something.  
I want to change that and I think this is the perfect topic to write an post about.

I actually intended to program a react-native app. Then I thought it wouldn't hurt to refresh my knowledge about react-js before I get into react-native.

And this is where the story begins.
<!--more-->
## practice reactjs

First of all I had to decide what I want to do. I didn't want to code a todo list for the umpteenth time, but something useful. Some time ago I discovered GatsbyJS and played around with it. I realy like Jekyll but I also like the concept behind ReactJS. So I decided to code a reactjs-component which I can reuse in other projects.

Speaking of Jekyll I really love the header. I love that it's "really" responsive and the fact the links disappear if its on a screen with under a given value an the burger icon/button appears where I can toggle the navigation. Except for a minor issue. But I'll come to this later. I want to rebuild this Navbar/header thing as an reactjs-component, make it generic and dynamical as hell and distribute it to npm later on.

I started a new React-Project and added some dummy contend. The I added a new Component, named it Navbar but i still had no idea how to isolate them and deploy them to npm. how can i get rid of this dummy-code? How can I get rid of the install and configuration overhead? Well, there is a solution called create-react-library.

### create-react-library

create-react-library is an awesome cli to create an react component library from scratch without anny configuration. If your npm version is up to date, you can even use it without installing it by simply running it with npx like this.:

```console
npx create-react-library myAwesomeLibraryName
```

Then we get some instructions to bring our component to life.

```console
To get started, in one tab, run:
$ cd myAwesomeLibraryName && npm start

And in another tab, run the create-react-app dev server:
$ cd myAwesomeLibraryName/example && npm start
```

This is awesome!!! We already have an existing component which is even used in an create-react-app example.

#### directory structure

Now let's have a quick look on the generated files.

```text
.
├── dist
│   ├── index.css
│   ├── index.js
│   ├── index.js.map
│   ├── index.modern.js
│   └── index.modern.js.map
├── example
│   ├── node_modules
│   |   ├── ...
|   │   └── ...
│   ├── public
│   |   ├── favicon.ico
│   |   ├── index.html
|   │   └── manifest.json
│   ├── src
│   |   ├── App.js
│   |   ├── App.test.js
│   |   ├── index.css
|   │   └── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── node_modules
│   ├── ...
│   └── ...
├── src
│   ├── .eslintrc
│   ├── index.js
│   ├── index.test.js
│   └── styles.module.css
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc
├── .travis.yml
├── package.json
├── package-lock.json
└── README.md
```

#### dist

This is where the magic happens. Our library will be built into this directory.

#### example

In this directory lives the sample app that uses our component.

#### node_modules

this is the Directory where npm stores the dependencies of our component

#### src

This is where the fun happened. Here we code our component library which will be built later in dist.

### keep it simple

I have many ideas of features I could implement in to this library but I think in the end this is realy timeconsuming and I shoud keep it simple. At leased for now. The goal is to just refresh my react skills, lern how to create and shere a npm package and then move on to the next project.

Sure, I want to rebuild this jekyll Navbar/header thing width the burger icon/button as an reactjs-component but for now let's keep it simple and add this stuff later on.

So I add a simple horizontal Navbar.

### link

We have this example `create-react-app` app in the example directory where we can check out our new component. But if we would like to us it in an other project, before we publish it to npm, we have to link it, so we can use it there.

insight myAwesomeLibraryName

```console
npm link
```

```console
npm unlink
```

insight another project

```console
npm link myAwesomeLibraryName
```

## distribute to npm

first create npm account and werifi email
then

```console
npm adduser
```

## next steps

this are just some notes to complete this post lateron

- use prop-types

```console
npm install --save prop-types
```

- use link
- use sass
- add the burger icon/button stuff
- calculate the width of the lins to prevent uggly design issues
