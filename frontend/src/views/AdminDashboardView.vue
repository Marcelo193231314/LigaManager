<template>
  <div class="admin-container">
    <h1>Panel de Administrador</h1>
    <p>Bienvenido, {{ authStore.user?.name }}.</p>
    <p>Aquí podrás gestionar toda la liga, crear partidos y actualizar marcadores.</p>
    
    <div class="admin-actions">
      <button @click="router.push('/create-match')" class="btn-primary">
        Ir a Crear Partido
      </button>
      <button @click="logout" class="btn-danger">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.admin-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}
.admin-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary {
  background-color: #0056b3;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>