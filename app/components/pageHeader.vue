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
        <li><NuxtLink to="/" @click="hideMenu">Blog</NuxtLink></li>
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
@media (min-width: 670px) {
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
    background: #415c7b;
    display: block;
    padding: 0;
    border-radius: 20px 20px 0px 0px;
  }

  .branding {
    border-radius: 20px 20px 0px 0px;
    background: linear-gradient(to bottom, #0c5688 0%,#317bab 27%,#3780af 30%,#61a2ca 36%,#accce1 47%,#b2d0e3 48%,#f7f7f9 53%,#bcbfc9 54%,#40526d 54%,#19304f 55%,#0b2345 56%,#396587 56%,#548cad 57%,#65a4c5 58%,#71b5d6 58%,#7ac0e1 59%,#7fc8e9 60%,#82ceef 60%,#85d1f2 62%,#4e7a9a 76%,#182442 100%);
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .branding .logo {
    font-weight: bold;
    font-size: 3rem;
    margin-top: 3px!important;
    position: relative;
    display: inline-block;
    -webkit-box-reflect: below -17px
      -webkit-linear-gradient(
        top,
        rgba(0,0,0,0) 25%,
        rgba(255,255,255,1) 100%
      );
  }

  .branding .logo::before {
    content: "mjk @ web";
    position: absolute;
    top: 11px;
    left: 50%;
    transform: translate(-50%, 1px);
    z-index: -1;
    font-weight: bold;
    font-size: 3rem;
    line-height: 1;
    white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 1px;
    background: linear-gradient(to bottom, #ff2b2b 0%,#fcf400 50%,#00ff00 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }


  .pageHeader nav {
    margin-top: 10px;
    margin-bottom: -10px;
    display: block;
    width: 100%;
    text-align: center;
  }

  .mainNav {
    background: linear-gradient(to bottom, rgba(108,170,209,1) 0%,rgba(80,125,155,1) 49%,rgba(71,110,135,1) 50%,rgba(95,148,183,1) 100%);
    display: inline-block;
    border: 1px solid #4a728c;
    border-color: #5a829c #4a728c #3a627c;
    border-radius: 15px;
    -webkit-box-shadow: 0 1px 1px #415c7b, 
      inset 0 1px 0 rgba(108,170,209, 0.5);
    -moz-box-shadow: 0 1px 1px #415c7b, 
      inset 0 1px 0 rgba(108,170,209, 0.5);
    box-shadow: 0px 1px 2px #415c7b, 
      inset 0 1px 0 rgba(108,170,209, 0.5);
  }

  .mainNav li {
    float: left;
    position: relative;
    list-style: none;
  }

  .mainNav li a {
    font-weight: bolder;
    font-size: 1.1rem;
    padding: 8px 20px;
    text-decoration: none;
    display: block;
    /* color: #026; */
    text-shadow: 0px 1px 0px rgba(108,170,209, 0.55);
  }

  .mainNav li:hover > a {
    color: #000;
    text-shadow: 0px 1px 0px rgba(95,148,183, 0.55);
    -webkit-box-shadow: 0px 1px 1px 0px rgba(71,110,135, 0.2);
    -moz-box-shadow: 0px 1px 1px 0px rgba(71,110,135, 0.2);
    box-shadow: 0px 1px 1px 0px rgba(71,110,135, 0.2);
    background: #67a2c6;
    background: -moz-linear-gradient(top, #67a2c6 0%, #4e7996 49%, #4a728c 50%, #5a8dad 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#67a2c6), color-stop(49%,#4e7996), color-stop(50%,#4a728c), color-stop(100%,#5a8dad));
    background: -webkit-linear-gradient(top, #67a2c6 0%,#4e7996 49%,#4a728c 50%,#5a8dad 100%);
    background: -o-linear-gradient(top, #67a2c6 0%,#4e7996 49%,#4a728c 50%,#5a8dad 100%);
    background: -ms-linear-gradient(top, #67a2c6 0%,#4e7996 49%,#4a728c 50%,#5a8dad 100%);
    background: linear-gradient(to bottom, #67a2c6 0%,#4e7996 49%,#4a728c 50%,#5a8dad 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#67a2c6', endColorstr='#5a8dad',GradientType=0 );
  }

  .mainNav li:first-child:hover > a {
    border-radius: 15px 0 0 15px;
  }

  .mainNav li:last-child:hover > a {
    border-radius: 0 15px 15px 0;
  }

  .mainNav:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
  }
}

</style>