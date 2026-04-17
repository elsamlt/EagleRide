<template>
  <button
    :class="[
      'base-button',
      {
        'size-standard': size === 'standard',
        'size-large': size === 'large',
        'size-full': size === 'full'
      },
      'variant',
      {
        'size-outline-variant': variant === 'outline',
        'primary-variant': variant === 'primary',
        'grey-variant': variant === 'grey'
      },
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
.size-outline-variant {
  background: white;
  border: 1px solid #ddd;
  color: var(--juniata-blue);
}
.size-outline-variant:hover {
  background: #fcfcfc;
  border-color: var(--juniata-blue);
}

/* Variant: Grey (NEW) */
.grey-variant {
  background-color: var(--light-gray);
  color: var(--juniata-blue);
}
.grey-variant:hover {
  background-color: #e2e2e2;
}

.size-standard { padding: 10px 20px; font-size: 14px; }

.size-large {
  width: 85%;
  margin: 2rem auto;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
}

.size-full{
  width: 100%;
  padding: 12px;
  font-size: 16px;
}
</style>
