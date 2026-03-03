<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      
      <div class="action-buttons">
        <button type="button" class="btn-user" @click="handleLogin('user')">
          Iniciar Sesión como Usuario
        </button>
        <button type="button" class="btn-admin" @click="handleLogin('admin')">
          Iniciar Sesión como Administrador
        </button>
      </div>
    </form>
    
    <p v-if="error" class="error">{{ error }}</p>
    <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async (role) => {
  if (!email.value || !password.value) {
    error.value = 'Por favor ingresa correo y contraseña.';
    return;
  }

  try {
    error.value = '';
    await authStore.login(email.value, password.value, role);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Credenciales o rol incorrectos';
  }
};
</script>

<style scoped>
.login-container { max-width: 400px; margin: 80px auto; padding: 40px 30px; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
h2 { text-align: center; color: #1a1a1a; margin-top: 0; margin-bottom: 25px; font-size: 24px; }
div { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; color: #555555; font-size: 14px; font-weight: 600; }
input { width: 100%; padding: 12px; border: 1px solid #dcdcdc; border-radius: 6px; box-sizing: border-box; font-size: 15px; transition: border-color 0.3s; }
input:focus { border-color: #0056b3; outline: none; }
.action-buttons { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
button { width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
.btn-user { background-color: #0056b3; color: #ffffff; }
.btn-user:hover { background-color: #004494; }
.btn-admin { background-color: #28a745; color: #ffffff; }
.btn-admin:hover { background-color: #218838; }
.error { color: #dc3545; text-align: center; margin-top: 15px; font-size: 14px; }
p { text-align: center; margin-top: 25px; color: #666666; font-size: 14px; }
a { color: #0056b3; text-decoration: none; font-weight: 600; }
a:hover { text-decoration: underline; }
</style>
