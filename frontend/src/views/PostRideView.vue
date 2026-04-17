<template>
  <RideForm mode="create" @submit="handleCreateRide" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import RideForm from '@/components/RideForm.vue';
import rideService from '@/services/rideService';

const router = useRouter();

const handleCreateRide = async (data) => {
  try {
    await rideService.create(data);
    router.push('/my-drives'); // Redirect to a relevant page after creation
  } catch (error) {
    console.error('Failed to create ride:', error);
    // Handle error
  }
};
</script>