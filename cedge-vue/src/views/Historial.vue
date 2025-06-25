<template>
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

    <div class="main-content">
      <h1>Historial de solicitudes</h1>

      <div class="search-bar">
        <input type="text" placeholder="Buscar..." />
      </div>

      <div class="filters">
        <select>
          <option value="">Todos los tipos</option>
          <option value="electronico">Equipo electrónico</option>
          <option value="hardware">Hardware</option>
          <option value="libros">Libros o manuales</option>
          <option value="herramientas">Herramientas</option>
          <option value="cables">Cables</option>
        </select>
        <select>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Grupo</th>
              <th>Fecha de Solicitud</th>
              <th>Fecha de Entrega</th>
              <th>Tipo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Juan Pérez</td>
              <td>601</td>
              <td>01/05/2025</td>
              <td>03/05/2025</td>
              <td>Equipo electrónico</td>
              <td class="estado entregado">Entregado</td>
            </tr>
            <tr>
              <td>002</td>
              <td>Lucía Gómez</td>
              <td>602</td>
              <td>05/05/2025</td>
              <td>07/05/2025</td>
              <td>Libros</td>
              <td class="estado pendiente">Pendiente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// sin lógica aún
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
    background-color: #4CAF50;
}

.delete-btn {
    background-color: #F44336;
}

.update-btn {
    background-color: #2196F3;
}

.request-btn {
    background-color: white;
    border: 1px dashed #999 !important;
    color: #333 !important;
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
    background-color: #FBE4D6;
}

th, td {
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

.content h1 {
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #aaa;
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .filters {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .filters select {
    padding: 8px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #aaa;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table-container table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
  }
  
  .table-container th,
  .table-container td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .table-container thead {  
    background-color: #f5f5f5;
  }
  
  .estado.entregado {
    color: green;
    font-weight: bold;
  }
  
  .estado.pendiente {
    color: orange;
    font-weight: bold;
  }
  
  .estado.rechazado {
    color: red;
    font-weight: bold;
  }
  
</style>
