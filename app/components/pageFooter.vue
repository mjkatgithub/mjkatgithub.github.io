<template>
  <footer>
    <span>&copy; by Melchior Jascha Kannengießer</span>
  </footer>
</template>

<style scoped>
footer {
  height: 38px;
  line-height: 38px;
  text-align: center;
  background: #415c7b;
  background: -moz-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #415c7b), color-stop(100%, #273749));
  background: -webkit-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -o-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: -ms-linear-gradient(top, #415c7b 0%, #273749 100%);
  background: linear-gradient(to bottom, #415c7b 0%, #273749 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#415c7b', endColorstr='#273749',GradientType=0 );
  border-bottom: 1px solid black;
}

@media (min-width: 1024px) {
  footer {
    -webkit-border-radius: 0 0 20px 20px;
    border-radius: 0 0 20px 20px;
    border: 1px solid black;
    border-top: 0px;
  }
}

</style>