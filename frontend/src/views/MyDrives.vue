<script setup>
import { ref } from 'vue'
import RideCard from '@/components/RideCard.vue'
</script>

<template>
  <div class="my-drives">
    <h1>My Created Drives</h1>
    <div class="list">
       <p>No drives created yet. Start by offering a ride!</p>
    </div>
  </div>
</template>

<style scoped>
h1 { color: var(--juniata-blue); }
</style>
