<template>
  <div class="form-view">
    <button class="back-btn" @click="$router.back()">← Back to dashboard</button>

    <div v-if="rideData" class="form-card">
      <RideForm mode="edit" :initialData="rideData" @success="handleSuccess" />
    </div>
    <div v-else>Loading ride data...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RideForm from '@/components/forms/RideForm.vue';

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
