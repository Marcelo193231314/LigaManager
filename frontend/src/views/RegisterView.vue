<template>
  <div class="register-container">
    <h2>Crear Cuenta</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Nombre:</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      
      <div class="admin-toggle">
        <label>
          <input type="checkbox" v-model="isAdminMode" />
          Registrarme como Administrador
        </label>
      </div>

      <div v-if="isAdminMode" class="secret-code-input">
        <label>Código Secreto de Autorización:</label>
        <input type="password" v-model="adminSecret" placeholder="Ingresa el código" required />
      </div>

      <button type="submit">Registrarme</button>
    </form>
    
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>
    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const isAdminMode = ref(false);
const adminSecret = ref('');
const error = ref('');
const successMsg = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    error.value = '';
    const secretToSend = isAdminMode.value ? adminSecret.value : '';
    await authStore.register(name.value, email.value, password.value, secretToSend);
    
    successMsg.value = '¡Registro exitoso! Redirigiendo al login...';
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al registrar usuario. Verifica tus datos.';
  }
};
</script>

<style scoped>
.register-container { max-width: 400px; margin: 50px auto; padding: 40px 30px; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
h2 { text-align: center; color: #1a1a1a; margin-bottom: 25px; }
div { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; }
input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #dcdcdc; border-radius: 6px; }
.admin-toggle { margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 6px; }
.admin-toggle label { display: flex; align-items: center; gap: 10px; margin: 0; cursor: pointer; color: #0056b3; }
.secret-code-input { margin-top: 15px; padding: 15px; background-color: #ffeeba; border-radius: 6px; border: 1px solid #ffdf7e; }
button { width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 15px; }
button:hover { background-color: #218838; }
.error { color: #dc3545; text-align: center; margin-top: 15px; }
.success { color: #28a745; text-align: center; margin-top: 15px; font-weight: bold; }
p { text-align: center; margin-top: 20px; }
</style>
