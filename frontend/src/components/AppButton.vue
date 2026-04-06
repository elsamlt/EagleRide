<template>
  <button
    :class="[
      'base-button',
      size === 'large' ? 'large-size' : 'standard-size',
      variant === 'outline' ? 'outline-variant' : 'primary-variant'
    ]"
    @click="$emit('click')"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'standard' },
  // variant can be 'primary' (blue) or 'outline' (white/edit style)
  variant: { type: String, default: 'primary' }
});
defineEmits(['click']);
</script>

<style scoped>
.base-button {
  font-family: var(--font-main);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Variant: Primary (Blue) */
.primary-variant {
  background-color: var(--juniata-blue);
  color: var(--white);
}
.primary-variant:hover {
  filter: brightness(1.2);
}

/* Variant: Outline (Your .btn-edit style) */
.outline-variant {
  background: white;
  border: 1px solid #ddd;
  color: var(--juniata-blue);
}
.outline-variant:hover {
  background: #fcfcfc;
  border-color: var(--juniata-blue);
}

.standard-size { padding: 10px 20px; font-size: 14px; }

.large-size {
  width: 85%;
  margin: 2rem auto;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
}
</style>
