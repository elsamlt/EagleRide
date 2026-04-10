<template>
  <div class="review-item">
    <div class="review-avatar">
      {{ review.passengerName.charAt(0) }}
    </div>

    <div class="review-content">
      <div class="review-header">
        <h4 class="passenger-name">{{ review.passengerName }}</h4>
        <div class="stars-row">
          <span
            v-for="n in 5"
            :key="n"
            :class="['star', n <= review.rating ? 'filled' : 'empty']"
          >
            ★
          </span>
        </div>
      </div>

      <p class="passenger-comment">
        {{ review.comment }}
      </p>
    </div>
  </div>
</template>

<script setup>
/* English: Define props for a single review object */
const props = defineProps({
  review: {
    type: Object,
    required: true
    /* Expected Structure:
       {
         passengerName: 'Alice Waster',
         rating: 5,
         comment: 'Super punctual and safe driver!',
       }
    */
  }
});
</script>

<style scoped>
.review-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #F3F4F6; /* Subtle divider between reviews */
}

/* Remove border from the last item in the list */
.review-item:last-child {
  border-bottom: none;
}

.review-avatar {
  width: 44px;
  height: 44px;
  background-color: var(--juniata-blue);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.passenger-name {
  color: var(--juniata-blue);
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.stars-row {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.star {
  font-size: 14px;
}

.star.filled {
  color: var(--juniata-gold);
}

.star.empty {
  color: #D1D5DB; /* Light gray for empty stars */
}

.passenger-comment {
  color: #6B7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}
</style>
