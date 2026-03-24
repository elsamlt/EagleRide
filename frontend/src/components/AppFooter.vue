<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2026 Juniata EagleRide - All rights reserved.</p>
      <div class="footer-links">
        <router-link to="/contact">Contact</router-link>
        <router-link to="/terms">Terms of Service</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--juniata-blue);
  color: white;
  padding: 2rem 0;
  margin-top: auto; /* Pushes footer to bottom */
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}
.footer-links a { color: var(--juniata-gold); margin-left: 1rem; text-decoration: none; }
</style>
