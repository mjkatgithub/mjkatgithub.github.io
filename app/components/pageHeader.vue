<template>
  <header class="pageHeader">
    <div class="branding">
      <NuxtLink to="/" class="logo">mjk @ web</NuxtLink>
    </div>
    <!-- Navigation -->
    <nav :class="{ active: isMenuOpen }">
      <ul class="mainNav">
        <li><NuxtLink to="/about" @click="hideMenu">About</NuxtLink></li>
        <li><NuxtLink to="/projects" @click="hideMenu">Projects</NuxtLink></li>
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