<template>
  <div v-if="show" class="notification-overlay">
    <div class="notification-card">
      <div class="icon-circle">
        <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <div class="text-content">
        <h2 class="title">{{ title }}</h2>
        <p class="message">{{ message }}</p>
      </div>

      <button class="confirm-btn" @click="$emit('close')">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
/* English: Define props to make the notification reusable for any success message */
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Success!'
  },
  message: {
    type: String,
    default: 'Your changes have been successfully confirmed.'
  },
  buttonText: {
    type: String,
    default: 'Okay'
  }
});

/* English: Emit 'close' event so the parent component can hide the notification */
defineEmits(['close']);
</script>

<style scoped>
/* English: Centering the modal over the entire app */
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dimmed background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Always on top */
}

.notification-card {
  background-color: var(--white);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background-color: #DEF7EC; /* Light green for success */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.check-icon {
  width: 30px;
  height: 30px;
  color: #0E9F6E; /* Success green */
}

.title {
  color: var(--juniata-blue);
  font-family: var(--font-main);
  margin-bottom: 8px;
  font-size: 20px;
}

.message {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 25px;
  line-height: 1.5;
}

.confirm-btn {
  background-color: var(--juniata-blue);
  color: var(--white);
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-main);
  transition: opacity 0.2s;
}

.confirm-btn:hover {
  opacity: 0.9;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
