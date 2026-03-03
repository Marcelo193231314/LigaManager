<template>
  <div class="container">
    <h2>Crear Nuevo Partido</h2>
    <form @submit.prevent="createMatch" class="form-card">
      
      <div class="form-group">
        <label>Equipo Local:</label>
        <select v-model="match.local_team_id" required>
          <option value="" disabled>Selecciona un equipo</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Equipo Visitante:</label>
        <select v-model="match.visitor_team_id" required>
          <option value="" disabled>Selecciona un equipo</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Fecha y Hora:</label>
        <input type="datetime-local" v-model="match.match_date" required>
      </div>

      <div class="form-group">
        <label>Cancha (Ubicación):</label>
        <input type="text" v-model="match.location" placeholder="Ej. Cancha 1" required>
      </div>

      <div class="buttons">
        <button type="submit" class="btn-primary">Guardar Partido</button>
        <button type="button" class="btn-secondary" @click="router.push('/')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const teams = ref([]);
const match = ref({
  local_team_id: '',
  visitor_team_id: '',
  match_date: '',
  location: ''
});

const fetchTeams = async () => {
  try {
    const res = await api.get('/teams'); // Ruta correcta para traer los equipos
    teams.value = res.data;
  } catch (error) {
    console.error("Error al cargar los equipos", error);
  }
};

const createMatch = async () => {
  if (match.value.local_team_id === match.value.visitor_team_id) {
    alert("Un equipo no puede jugar contra sí mismo");
    return;
  }
  
  try {
    // ESTA ES LA MAGIA: Limpiamos la fecha para que MySQL la acepte sin chistar
    const formattedDate = match.value.match_date.replace('T', ' ') + ':00';
    
    // Armamos el paquete de datos con la fecha ya corregida
    const matchData = {
      local_team_id: match.value.local_team_id,
      visitor_team_id: match.value.visitor_team_id,
      match_date: formattedDate,
      location: match.value.location
    };

    // Enviamos el paquete corregido al backend
    await api.post('/matches', matchData);
    
    alert("Partido creado con éxito");
    router.push('/'); // Regresamos a la tabla
  } catch (error) {
    alert("Error al crear el partido");
    console.error(error);
  }
};

onMounted(fetchTeams);
</script>

<style scoped>
.container { max-width: 600px; margin: 40px auto; font-family: sans-serif; }
.form-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
label { margin-bottom: 5px; font-weight: bold; }
select, input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
.buttons { display: flex; justify-content: space-between; margin-top: 20px; }
.btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-secondary { background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
</style>
