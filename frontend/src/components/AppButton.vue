<template>
  <button
    :class="[
      'base-button',
      size === 'large' ? 'large-size' : 'standard-size'
    ]"
    @click="$emit('click')"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup>
defineProps({
  // Size can be 'standard' or 'large'
  size: {
    type: String,
    default: 'standard'
  }
});
defineEmits(['click']);
</script>

<style scoped>
.base-button {
  /* Using your CSS variables */
  background-color: var(--juniata-blue);
  color: var(--white);
  font-family: var(--font-main);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: filter 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-button:hover {
  filter: brightness(1.2);
}

.standard-size {
  padding: 10px 20px;
  font-size: 14px;
}

.large-size {
  width: 100%;
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 12px;
}
</style>
