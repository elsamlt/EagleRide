<template>
  <div v-if="ride">
    <RideForm mode="edit" :initial-data="ride" @submit="handleUpdateRide" />
  </div>
  <div v-else>
    <p>Loading ride details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RideForm from '@/components/RideForm.vue';
import rideService from '@/services/rideService'; 

const ride = ref(null);
const route = useRoute();
const router = useRouter();
const rideId = route.params.id;

onMounted(async () => {
  try {
    const response = await rideService.getDetails(rideId);
    ride.value = response.data;
  } catch (error) {
    console.error('Failed to fetch ride details:', error);
    // Handle error, e.g., show a notification or redirect
  }
});

const handleUpdateRide = async (data) => {
  try {
    await rideService.edit(rideId, data);
    router.push('/my-drives'); // Redirect to a relevant page after update
  } catch (error) {
    console.error('Failed to update ride:', error);
    // Handle error
  }
};
</script>