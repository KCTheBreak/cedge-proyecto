<template>
  <div id="app">
     <!-- Banner global -->
    <header class="header">
      <img src="/src/assets/img/banner.png" alt="Logo SUNEO" class="logo" />
      <h1>Universidad de la Sierra Sur</h1>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer v-if="route.name !== 'login'">
      <p>© Universidad de la Sierra Sur</p>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style>
/* Banner global */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: #651717;
  display: flex;
  align-items: center;
  padding: 0 30px;
  z-index: 1000;
  color: white;
}

.logo {
  height: 45px;
  margin-right: 10px;
}

body {
  margin: 0;
  padding-top: 90px;
  font-family: Arial, sans-serif;
}

</style>