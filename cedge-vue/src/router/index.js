import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '/src/views/HomeView.vue';
import Login from '/src/views/Login.vue';
import Prestamos from '/src/views/Prestamos.vue';
import HistorialView from '/src/views/Historial.vue';
import Materiales from '/src/views/Materiales.vue';
import Entregados from '/src/views/Entregados.vue';
import Pendientes from '/src/views/Pendientes.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/prestamos',
    name: 'prestamos',
    component: Prestamos
  },
  {
    path: '/historial',
    name: 'Historial',
    component: HistorialView
  },
  {
    path: '/materiales',
    name: 'materiales',
    component: Materiales
  },
  {
    path: '/entregados',
    name: 'entregados', 
    component: Entregados
  },
  {
    path: '/pendientes',
    name: 'pendientes',
    component: Pendientes
  }
  // Puedes agregar más rutas después, como /dashboard, etc.
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;