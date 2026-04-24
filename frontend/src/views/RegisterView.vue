<template>
  <div class="auth-page-wrapper">
    <div class="auth-branding">
      <img src="@/assets/logo-juniata.png" alt="Juniata College" />
    </div>

    <UserForm mode="create" @success="handleSuccess" />
  </div>
</template>

<script setup>
import UserForm from '@/components/UserForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSuccess = () => {
  router.push('/auth/login');
};
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f7f6;
  padding: 40px 20px;
}
.auth-branding img {
  max-width: 250px;
  margin-bottom: 30px;
}
</style>