<script setup>
import NavBar from '@/components/NavBar.vue'

</script>

<template>
  <NavBar />
  <div class="auth-layout">
    <div class="auth-header">
      <img src="@/assets/logo-juniata.png" alt="Juniata Logo" class="big-logo">
    </div>
    <router-view /> </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.big-logo { width: 200px; margin-bottom: 2rem; }
</style>
