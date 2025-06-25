<template>
  <div>
    <!-- Banner superior -->
    <div class="top-bar">
      <div class="menu-title">UNSIS</div>
      <div class="dropdown">
        <button class="dropdown-btn">Selección de campos</button>
        <div class="dropdown-content">
          <a href="#" @click.prevent>Opción 1</a>
          <a href="#" @click.prevent>Opción 2</a>
          <a href="#" @click.prevent>Opción 3</a>
        </div>
      </div>
    </div>

    <!-- Contenedor principal -->
    <div class="container">
      <!-- Menú lateral -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>Menú</h2>
        </div>

        <div class="sidebar-icons">
          <a href="#" class="home-icon">
            <i class="fas fa-home"></i>
          </a>
          <a href="#" class="settings-icon">
            <i class="fas fa-cog"></i>
          </a>
        </div>

        <div class="sidebar-menu">
          <router-link to="/prestamos" class="sidebar-link">
            <i class="fas fa-clipboard-list"></i>
            Prestamos
          </router-link>
          <router-link to="/materiales" class="sidebar-link">
            <i class="fas fa-list"></i>
            Listado de materiales
          </router-link>
          <router-link to="/entregados" class="sidebar-link">
            <i class="fas fa-check-circle"></i>
            Entregados
          </router-link>
          <router-link to="/pendientes" class="sidebar-link">
            <i class="fas fas fa-clock"></i>
            Pendientes
          </router-link>
          <router-link to="/historial" class="sidebar-link">
            <i class="fas fa-book"></i>
            Historial
          </router-link>
        </div>

        <div class="profile-section">
          <div class="profile-pic">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="profile-info">
            <p>Tecnico Rafael</p>
            <button class="edit-profile-btn">Editar perfil</button>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="main-content">
        <h1>Lista de materiales</h1>

        <div class="action-buttons">
          <button type="button" class="add-btn" @click="agregarMaterial">
            <i class="fas fa-plus-circle"></i> Agregar
          </button>

          <button type="button" class="delete-btn" @click="eliminarUltimo">
            <i class="fas fa-trash"></i> Eliminar último
          </button>
        </div>

        <div class="search-bar">
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o código" />
          <p class="search-hint">Inventario de materiales</p>
        </div>

        <!-- Mensaje de carga -->
        <div v-if="cargando" class="loading-message">
          <p>Cargando materiales...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="cargarMateriales" class="retry-btn">Reintentar</button>
        </div>

        <!-- Tabla de materiales -->
        <div v-if="!cargando && !error" class="materials-table">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Artículo</th>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Disponibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(material, index) in materialesFiltrados" :key="material.codigo || index">
                <td>{{ index + 1 }}</td>
                <td>{{ material.nombre }}</td>
                <td>{{ material.codigo }}</td>
                <td>{{ material.cantidad }}</td>
                <td :style="{ color: material.disponibilidad === 'Disponible' ? 'green' : 'red' }">
                  {{ material.disponibilidad }}
                </td>
                <td>
                  <button @click="eliminarMaterial(material.codigo)" class="delete-item-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Mensaje cuando no hay materiales -->
          <div v-if="materialesFiltrados.length === 0" class="no-materials">
            <p>No se encontraron materiales</p>
          </div>
        </div>

        <div class="bottom-note">
          <p>Inventario de materiales - Total: {{ materiales.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// Variables reactivas
const materiales = ref([]);
const busqueda = ref('');
const cargando = ref(false);
const error = ref('');

// Cargar materiales al montar el componente
onMounted(() => {
  cargarMateriales();
});

// Función para cargar materiales
const cargarMateriales = async () => {
  cargando.value = true;
  error.value = '';
  
  try {
    const res = await fetch('http://localhost:3000/materiales');
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    materiales.value = data;
  } catch (err) {
    console.error('Error al cargar materiales:', err);
    error.value = 'Error al cargar los materiales. Verifica que el servidor esté funcionando.';
  } finally {
    cargando.value = false;
  }
};

// Función para agregar material
const agregarMaterial = async () => {
  const nombre = prompt('Nombre del artículo:');
  const codigo = prompt('Código del artículo:');
  const cantidadStr = prompt('Cantidad disponible:');
  
  if (!nombre || !codigo || !cantidadStr) {
    alert('Todos los campos son obligatorios');
    return;
  }
  
  const cantidad = parseInt(cantidadStr, 10);
  
  if (isNaN(cantidad) || cantidad < 0) {
    alert('La cantidad debe ser un número válido mayor o igual a 0');
    return;
  }

  // Verificar si el código ya existe
  if (materiales.value.some(material => material.codigo === codigo)) {
    alert('Ya existe un material con ese código');
    return;
  }

  const disponibilidad = cantidad > 0 ? 'Disponible' : 'Agotado';

  try {
    const res = await fetch('http://localhost:3000/materiales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, codigo, cantidad, disponibilidad })
    });
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    materiales.value.push(data);
    alert('Material agregado correctamente');
  } catch (err) {
    console.error('Error al agregar material:', err);
    alert('Error al agregar material. Verifica la conexión con el servidor.');
  }
};

// Función para eliminar material específico
const eliminarMaterial = async (codigo) => {
  if (!confirm(`¿Estás seguro de eliminar el material con código ${codigo}?`)) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/materiales/${codigo}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Remover el material del array local
    materiales.value = materiales.value.filter(material => material.codigo !== codigo);
    
    alert(data.mensaje || 'Material eliminado correctamente');
  } catch (err) {
    console.error('Error al eliminar material:', err);
    alert('Error al eliminar material. Verifica la conexión con el servidor.');
  }
};

// Función para eliminar el último material
const eliminarUltimo = async () => {
  if (materiales.value.length === 0) {
    alert('No hay materiales para eliminar');
    return;
  }
  
  const ultimoMaterial = materiales.value[materiales.value.length - 1];
  await eliminarMaterial(ultimoMaterial.codigo);
};

// Computed para filtrar materiales
const materialesFiltrados = computed(() => {
  if (!busqueda.value) {
    return materiales.value;
  }
  
  return materiales.value.filter(material =>
    material.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    material.codigo.toLowerCase().includes(busqueda.value.toLowerCase())
  );
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6d0f1f;
  color: white;
  padding: 10px 20px;
}

.menu-title {
  font-size: 16px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  background-color: white;
  color: #333;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.container {
  display: flex;
  height: calc(100vh - 40px);
}

.sidebar {
  width: 230px;
  background-color: #212121;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.sidebar-icons {
  display: flex;
  justify-content: center;
  padding: 15px 0;
  border-bottom: 1px solid #333;
}

.sidebar-icons a {
  color: white;
  font-size: 20px;
  margin: 0 10px;
  text-decoration: none;
}

.sidebar-menu {
  flex-grow: 1;
  padding: 20px 0;
}

.sidebar-menu a {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  transition: all 0.3s;
}

.sidebar-menu a:hover,
.sidebar-menu a.active {
  background-color: #333;
}

.sidebar-menu a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.profile-section {
  padding: 20px;
  display: flex;
  align-items: center;
  border-top: 1px solid #333;
}

.profile-pic {
  font-size: 40px;
  margin-right: 15px;
}

.profile-info p {
  margin-bottom: 5px;
}

.edit-profile-btn {
  background-color: #333;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: white;
}

.main-content h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.action-buttons {
  display: flex;
  margin-bottom: 20px;
}

.action-buttons button {
  margin-right: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
}

.action-buttons button i {
  margin-right: 5px;
}

.add-btn {
  background-color: #4caf50;
}

.delete-btn {
  background-color: #f44336;
}

.delete-item-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.delete-item-btn:hover {
  background-color: #d32f2f;
}

.search-bar {
  margin-bottom: 20px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.search-hint {
  position: absolute;
  right: 10px;
  bottom: -20px;
  font-size: 12px;
  color: #888;
}

.materials-table {
  margin-bottom: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #fbe4d6;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

th:first-child {
  width: 50px;
  text-align: center;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.bottom-note {
  margin-top: 20px;
  font-size: 12px;
  color: #888;
  text-align: right;
}

.loading-message,
.error-message,
.no-materials {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
}

.loading-message {
  color: #666;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  border-radius: 5px;
}

.retry-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.no-materials {
  color: #666;
  font-style: italic;
}
</style>