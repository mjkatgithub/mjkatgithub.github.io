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
  color: black!important;
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
