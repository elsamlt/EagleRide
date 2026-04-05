<script setup>
import NavBar from '@/components/NavBar.vue'

</script>

<template>
  <NavBar />
  <div class="auth-layout">
    <div class="auth-header">
      <img src="@/assets/logo-juniata.png" alt="Juniata Logo" class="big-logo">
    </div>
    <div class="auth-card">
      <router-view /> </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.big-logo { width: 200px; margin-bottom: 2rem; }
</style>
