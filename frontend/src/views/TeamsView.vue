<template>
  <div class="container">
    <div class="header">
      <h1>Gestión de Equipos</h1>
      <button class="btn-cancel" @click="router.push('/')">Volver a Partidos</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Equipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id">
            <td>{{ team.id }}</td>
            
            <td>
              <input type="text" v-model="team.name" class="name-input">
            </td>
            
            <td>
              <button @click="saveTeam(team)" class="btn-save" title="Guardar Cambios">💾</button>
              <button @click="deleteTeam(team.id)" class="btn-delete" title="Eliminar Equipo">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const teams = ref([]);

const fetchTeams = async () => {
  try {
    const res = await api.get('/auth/users');
    teams.value = res.data;
  } catch (error) {
    console.error("Error al cargar equipos", error);
  }
};

const saveTeam = async (team) => {
  try {
    await api.put(`/auth/teams/${team.id}`, { name: team.name });
    alert("Nombre actualizado correctamente");
  } catch (error) {
    alert("Error al actualizar el equipo");
  }
};

const deleteTeam = async (id) => {
  if (confirm("¿Estás seguro de eliminar este equipo? Se borrarán también todos los partidos donde participe.")) {
    try {
      await api.delete(`/auth/teams/${id}`);
      alert("Equipo eliminado");
      fetchTeams(); 
    } catch (error) {
      alert("Error al eliminar el equipo");
    }
  }
};

onMounted(fetchTeams);
</script>

<style scoped>
.container { max-width: 800px; margin: 40px auto; font-family: sans-serif; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.table-wrapper { background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px; border-bottom: 1px solid #eee; text-align: center; }
.name-input { width: 80%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; text-align: center; font-size: 16px; }
.btn-save, .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.5rem; margin: 0 10px; transition: transform 0.2s; }
.btn-save:hover, .btn-delete:hover { transform: scale(1.2); }
.btn-cancel { background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
</style>