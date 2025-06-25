<template>
  <div class="prestamos-container">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="menu-title">UNSIS</div>
      <div class="dropdown">
        <button class="dropdown-btn">Selección de campos</button>
        <div class="dropdown-content">
          <a href="#">Opción 1</a>
          <a href="#">Opción 2</a>
          <a href="#">Opción 3</a>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Sidebar -->
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

      <!-- Main Content -->
      <div class="main-content">
        <h1>Préstamos</h1>

        <div class="formulario-solicitud">
          <div class="form-columns">
            <div class="form-column">
              <div>
                <label for="nombre">Nombre del solicitante</label>
                <input 
                  type="text" 
                  id="nombre"
                  v-model="formulario.nombre" 
                  placeholder="Nombre completo" 
                />
              </div>

              <div>
                <label for="grupo">Grupo</label>
                <input 
                  type="text" 
                  id="grupo"
                  v-model="formulario.grupo" 
                  placeholder="Ej. 601" 
                />
              </div>

              <div>
                <label for="material">Seleccionar el tipo de material</label>
                <select 
                  id="material"
                  v-model="formulario.tipoMaterial"
                  @change="cargarMaterialesPorTipo"
                >
                  <option value="">-- Seleccione una opción --</option>
                  <option value="electronico">Equipo electrónico</option>
                  <option value="hardware">Hardware</option>
                  <option value="libros">Libros o manuales</option>
                  <option value="herramientas">Herramientas</option>
                  <option value="cables">Cables</option>
                </select>
              </div>
            </div>

            <div class="form-column">
              <div>
                <label for="fecha-solicitud">Fecha de Solicitud</label>
                <input 
                  type="date" 
                  id="fecha-solicitud"
                  v-model="formulario.fechaSolicitud" 
                />
              </div>

              <div>
                <label for="fecha-entrega">Fecha de Entrega</label>
                <input 
                  type="date" 
                  id="fecha-entrega"
                  v-model="formulario.fechaEntrega" 
                />
              </div>
            </div>
          </div>
        </div>

        <div class="search-bar">
          <input 
            type="text" 
            v-model="busqueda"
            @input="buscarMateriales"
            placeholder="Buscar material..." 
          />
        </div>

        <!-- Mensaje de carga -->
        <div v-if="cargandoMateriales" class="loading-message">
          <p>Cargando materiales...</p>
        </div>

        <!-- Tabla de materiales -->
        <div v-if="!cargandoMateriales" class="materials-table">
          <table>
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Artículo</th>
                <th>Código</th>
                <th>Cantidad Disponible</th>
                <th>Cantidad a Prestar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="material in materialesDisponibles" :key="material.id">
                <td>
                  <input 
                    type="checkbox" 
                    :value="material.id"
                    @change="toggleMaterialSeleccion(material)"
                  />
                </td>
                <td>{{ material.nombre }}</td>
                <td>{{ material.codigo }}</td>
                <td>{{ material.cantidad }}</td>
                <td>
                  <input 
                    type="number" 
                    min="1" 
                    :max="material.cantidad"
                    v-model.number="material.cantidadPrestada"
                    :disabled="!esMaterialSeleccionado(material.id)"
                    @input="validarCantidad(material)"
                    class="cantidad-input"
                  />
                </td>
              </tr>
              <tr v-if="materialesDisponibles.length === 0">
                <td colspan="5" class="no-materials">
                  {{ formulario.tipoMaterial ? 'No hay materiales disponibles para este tipo' : 'Seleccione un tipo de material para ver los disponibles' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="floating-buttons">
          <button 
            class="save-btn" 
            @click="guardarPrestamo"
            :disabled="!puedeGuardar"
          >
            <i class="fas fa-save"></i> Guardar Préstamo
          </button>
          <button class="clear-btn" @click="limpiarFormulario">
            <i class="fas fa-broom"></i> Limpiar
          </button>
        </div>

        <!-- Resumen de materiales seleccionados -->
        <div v-if="materialesSeleccionados.length > 0" class="resumen-seleccion">
          <h3>Materiales seleccionados:</h3>
          <ul>
            <li v-for="material in materialesSeleccionados" :key="material.id">
              {{ material.nombre }} - Cantidad: {{ material.cantidadPrestada }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Variables reactivas
const formulario = ref({
  nombre: '',
  grupo: '',
  tipoMaterial: '',
  fechaSolicitud: '',
  fechaEntrega: ''
});

const materialesDisponibles = ref([]);
const materialesSeleccionados = ref([]);
const busqueda = ref('');
const cargandoMateriales = ref(false);
const timeoutBusqueda = ref(null);

// Computed properties
const puedeGuardar = computed(() => {
  return formulario.value.nombre &&
         formulario.value.grupo &&
         formulario.value.tipoMaterial &&
         formulario.value.fechaSolicitud &&
         formulario.value.fechaEntrega &&
         materialesSeleccionados.value.length > 0;
});

// Watchers
watch(() => formulario.value.fechaSolicitud, (nuevaFecha) => {
  if (nuevaFecha && !formulario.value.fechaEntrega) {
    // Establecer fecha de entrega mínima como el día siguiente
    const fechaMinima = new Date(nuevaFecha);
    fechaMinima.setDate(fechaMinima.getDate() + 1);
    formulario.value.fechaEntrega = fechaMinima.toISOString().split('T')[0];
  }
});

// Funciones
const cargarMaterialesPorTipo = async () => {
  if (!formulario.value.tipoMaterial) {
    materialesDisponibles.value = [];
    return;
  }

  cargandoMateriales.value = true;
  try {
    const response = await fetch(`http://localhost:3000/materiales/tipo/${formulario.value.tipoMaterial}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const materiales = await response.json();
    
    // Transformar los datos para incluir cantidadPrestada y seleccionado
    materialesDisponibles.value = materiales.map(material => ({
      ...material,
      cantidadPrestada: 1,  // Valor por defecto
      seleccionado: false   // Estado inicial
    }));
    
  } catch (error) {
    console.error('Error al cargar materiales por tipo:', error);
    alert('Error al cargar materiales. Por favor intente nuevamente.');
  } finally {
    cargandoMateriales.value = false;
  }
};

const buscarMateriales = async () => {
  if (timeoutBusqueda.value) {
    clearTimeout(timeoutBusqueda.value);
  }

  timeoutBusqueda.value = setTimeout(async () => {
    if (!busqueda.value.trim()) {
      if (formulario.value.tipoMaterial) {
        await cargarMaterialesPorTipo();
      }
      return;
    }

    cargandoMateriales.value = true;
    try {
      const response = await fetch(`http://localhost:3000/materiales/buscar/${encodeURIComponent(busqueda.value)}`);
      if (response.ok) {
        const materiales = await response.json();
        materialesDisponibles.value = materiales.map(material => ({
          ...material,
          cantidadPrestada: 1,
          seleccionado: false
        }));
      }
    } catch (error) {
      console.error('Error al buscar materiales:', error);
      alert('Error al buscar materiales');
    } finally {
      cargandoMateriales.value = false;
    }
  }, 500);
};

const toggleMaterialSeleccion = (material) => {
  const index = materialesSeleccionados.value.findIndex(m => m.id === material.id);
  
  if (index > -1) {
    materialesSeleccionados.value.splice(index, 1);
    material.seleccionado = false;
  } else {
    materialesSeleccionados.value.push({...material, seleccionado: true});
    material.seleccionado = true;
  }
};

const esMaterialSeleccionado = (materialId) => {
  return materialesSeleccionados.value.some(m => m.id === materialId);
};

const validarCantidad = (material) => {
  if (material.cantidadPrestada > material.cantidad) {
    material.cantidadPrestada = material.cantidad;
    alert(`La cantidad máxima disponible es ${material.cantidad}`);
  }
  if (material.cantidadPrestada < 1) {
    material.cantidadPrestada = 1;
  }
  
  // Actualizar en materialesSeleccionados
  const index = materialesSeleccionados.value.findIndex(m => m.id === material.id);
  if (index > -1) {
    materialesSeleccionados.value[index].cantidadPrestada = material.cantidadPrestada;
  }
};

const guardarPrestamo = async () => {
  if (!puedeGuardar.value) {
    alert('Complete todos los campos y seleccione al menos un material');
    return;
  }

  // Validar fechas
  if (new Date(formulario.value.fechaEntrega) <= new Date(formulario.value.fechaSolicitud)) {
    alert('La fecha de entrega debe ser posterior a la fecha de solicitud');
    return;
  }

  try {
    const prestamoData = {
      nombre_solicitante: formulario.value.nombre,
      grupo: formulario.value.grupo,
      tipo_material: formulario.value.tipoMaterial,
      fecha_solicitud: formulario.value.fechaSolicitud,
      fecha_entrega: formulario.value.fechaEntrega,
      materiales: materialesSeleccionados.value.map(material => ({
        id: material.id,
        cantidad_prestada: material.cantidadPrestada
      }))
    };

    const response = await fetch('http://localhost:3000/prestamos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prestamoData)
    });

    if (response.ok) {
      const resultado = await response.json();
      alert('Préstamo guardado correctamente');
      limpiarFormulario();
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error al guardar préstamo:', error);
    alert('Error al guardar el préstamo');
  }
};

const limpiarFormulario = () => {
  formulario.value = {
    nombre: '',
    grupo: '',
    tipoMaterial: '',
    fechaSolicitud: '',
    fechaEntrega: ''
  };
  materialesDisponibles.value = [];
  materialesSeleccionados.value = [];
  busqueda.value = '';
};

// Establecer fecha actual al montar el componente
onMounted(() => {
  const hoy = new Date().toISOString().split('T')[0];
  formulario.value.fechaSolicitud = hoy;
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
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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

.sidebar-menu a:hover, .sidebar-menu a.active {
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

/* === Main Content === */
.main-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
}

.main-content h1 {
    margin-top: 0;
    margin-bottom: 30px;
    color: #333;
}

/* === Form Section === */
.formulario-solicitud {
    background-color: white;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-columns {
    display: flex;
    gap: 40px;
}

.form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-column label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #444;
}

.form-column input, 
.form-column select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    background-color: #f9f9f9;
}

.form-column input:focus,
.form-column select:focus {
    outline: none;
    border-color: #71172c;
    box-shadow: 0 0 0 2px rgba(113, 23, 44, 0.2);
}

/* === Search Bar === */
.search-bar {
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 25px;
    font-size: 14px;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.search-bar input:focus {
    outline: none;
    border-color: #71172c;
    box-shadow: 0 0 0 2px rgba(113, 23, 44, 0.2);
}

/* === Materials Table === */
.materials-table {
    overflow-x: auto;
    margin-bottom: 20px;
}

.materials-table table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.materials-table th {
    background-color: #71172c;
    color: white;
    text-align: left;
    padding: 15px;
}

.materials-table td {
    padding: 15px;
    border-bottom: 1px solid #eee;
    text-align: center;
}

.materials-table tbody tr:hover {
    background-color: #f9f9f9;
}

.cantidad-input {
    width: 80px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
}

.cantidad-input:disabled {
    background-color: #f5f5f5;
    color: #999;
}

.no-materials {
    text-align: center;
    color: #666;
    font-style: italic;
}

.loading-message {
    text-align: center;
    padding: 20px;
    color: #666;
}

/* === Floating Buttons === */
.floating-buttons {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.floating-buttons button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 25px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.save-btn {
    background-color: #2e7d32;
    color: white;
}

.save-btn:hover:not(:disabled) {
    background-color: #1b5e20;
}

.save-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.clear-btn {
    background-color: #ff9800;
    color: white;
}

.clear-btn:hover {
    background-color: #f57c00;
}

.floating-buttons i {
    margin-right: 8px;
}

/* === Resumen === */
.resumen-seleccion {
    background-color: #e8f5e8;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
}

.resumen-seleccion h3 {
    margin-bottom: 10px;
    color: #2e7d32;
}

.resumen-seleccion ul {
    list-style-type: none;
    padding: 0;
}

.resumen-seleccion li {
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
}

/* === Responsive Adjustments === */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        height: auto;
    }
    
    .form-columns {
        flex-direction: column;
    }
    
    .form-column {
        margin-bottom: 20px;
    }
}
</style>