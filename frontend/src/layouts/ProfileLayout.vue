<template>
  <div class="app-container">
    <Navbar />

    <main class="layout-body">
      <div class="content-wrapper">
        <aside class="sidebar">
          <ProfileSummary :user="currentUser" @edit="goToSettings" />
        </aside>

        <section class="main-content">
          <slot></slot>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
/* English: Importing your existing components */
import Navbar from '@/components/Navbar.vue';
import ProfileSummary from '@/components/ProfileSummary.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// English: This should come from your Pinia store (AuthStore)
const currentUser = {
  fullName: 'Kai Sterling',
  email: 'sterling@juniata.edu',
  isVerified: true,
  preferences: { /* ... */ }
};

const goToSettings = () => {
  router.push('/profile/edit');
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--light-gray);
}

.layout-body {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-wrapper {
  display: grid;
  /* English: 1/3 for sidebar, 2/3 for content */
  grid-template-columns: 350px 1fr;
  gap: 30px;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 100px; /* English: Keeps the profile visible while scrolling */
}

.main-content {
  /* English: This area will contain My Drives, Post Ride, etc. */
  min-height: 500px;
}

/* English: Responsive for tablets/mobile */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: relative;
    top: 0;
  }
}
</style>
