<template>
  <div class="ride-card">
    <div class="ride-info">
      <h3>Destination</h3>
      <p>Time - Price</p>
    </div>
    <button class="btn-primary">View Details</button>
  </div>
</template>

<script setup>
// English: Props will be added here later to receive ride data
</script>

<style scoped>
.ride-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 5px solid var(--juniata-gold);
}
</style>
