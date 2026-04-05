<template>
  <div class="form-view">
    <button class="back-btn" @click="$router.back()">← Back to dashboard</button>
    
    <div class="form-card">
      <RideForm mode="create" @success="handleSuccess" />
    </div>
  </div>
</template>

<script setup>
import RideForm from '@/components/forms/RideForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const handleSuccess = () => {
  // Redirect to dashboard after posting
  router.push('/dashboard/my-drives');
};
</script>

<style scoped>
.back-btn { background: none; border: none; color: #9CA3AF; cursor: pointer; margin-bottom: 20px; }
.form-card { background: white; padding: 30px; border-radius: 16px; border: 1px solid #E5E7EB; }
</style>
