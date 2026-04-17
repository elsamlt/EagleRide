<script setup>
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="layout-wrapper">
    <NavBar />

    <main class="main-content">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full screen height */
}
.main-content {
  flex: 1; /* Takes all available space between header and footer */
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
