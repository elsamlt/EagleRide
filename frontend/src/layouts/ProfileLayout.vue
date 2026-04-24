<template>
  <div class="app-container">
    <Navbar />

    <main class="layout-body">
      <div class="content-wrapper">
        <aside class="sidebar">
          <ProfileSummary :user="currentUser" @edit="goToSettings" />
        </aside>

        <section class="main-content">
          <router-view />
        </section>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
/*  Importing your existing components */
import Navbar from '@/components/Navbar.vue';
import ProfileSummary from '@/components/ProfileSummary.vue';
import { useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();

//  This should come from your Pinia store (AuthStore)
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
  grid-template-columns: 500px 1fr;
  gap: 30px;
  align-items: start;
}

.main-content {
  /*  This area will contain My Drives, Post Ride, etc. */
  min-height: 500px;
}

/*  Responsive for tablets/mobile */
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
