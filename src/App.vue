<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <NavBar />
  <router-view />
  <Footer/>
</template>

<style>
@layer{
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif
}


body {
  background-color: #6384af;
}
}
</style>
