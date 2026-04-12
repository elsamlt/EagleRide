<template>
  <div class="form-view">
    <button class="back-btn" @click="$router.back()">← Back to dashboard</button>

    <div class="form-card">
      <!-- <div v-if="rideData" class="form-card"> -->
      <RideForm mode="edit" :initialData="rideData" @success="handleSuccess" />
      <!-- </div> -->

      <!-- <div v-else>
        <p>Loading ride data...</p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RideForm from '@/components/RideForm.vue';

const route = useRoute();
const router = useRouter();
const rideData = ref(null);

onMounted(async () => {
  const rideId = route.params.id;
  // Fetch specific ride details from API using rideId
  // rideData.value = await api.getRide(rideId);
});

const handleSuccess = () => {
  router.push('/dashboard/my-drives');
};
</script>

<style scoped>
.back-btn { background: none; border: none; color: #9CA3AF; cursor: pointer; margin-bottom: 20px; }
.form-card { background: white; padding: 30px; border-radius: 16px; border: 1px solid #E5E7EB; }
p { text-align: center; }
</style>
