<script setup>
import { ref } from 'vue'
import { userService } from '@/api'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Team will implement login logic here
}
</script>

<template>
  <div class="login-view">
    register
  </div>
</template>

<style scoped>
/* Scoped styles for this page only */
input { display: block; width: 100%; margin: 10px 0; padding: 10px; }
</style>
