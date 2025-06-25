<template>
  <div class="home-container">
    <div class="campus-container">
      <img src="/src/assets/img/fondo.jpg" alt="Campus UNSIS" class="campus-image">
      
      <!-- Botones de navegación -->
      <button @click="navigateToLogin" class="option-button" id="ceti">CETI</button>
      <button class="option-button" id="opcion3">Opción 3</button>
      <button class="option-button" id="cedge">CEDGE</button>
      <button class="option-button" id="opcion4">Opción 4</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; 

const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* Estilos específicos del Home */
.home-container {
  flex: 1;
}

.campus-container {
  position: relative;
  height: calc(100vh - 120px); /* Ajuste por header/footer */
  overflow: hidden;
}

.campus-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.option-button {
  position: absolute;
  width: 250px;
  height: 60px;
  background: linear-gradient(to bottom, #000000, #a4a3a1);
  border: 3px solid #000000;
  border-radius: 5px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.option-button:hover {
  transform: translateY(-3px);
}

#ceti {
  top: 30%;
  left: 30%;
}

#opcion3 {
  top: 30%;
  right: 30%;
}

#cedge {
  bottom: 30%;
  left: 30%;
}

#opcion4 {
  bottom: 30%;
  right: 30%;
}

/* Responsive */
@media (max-width: 768px) {
  .option-button {
    width: 150px;
    height: 50px;
    font-size: 18px;
  }
}
</style>