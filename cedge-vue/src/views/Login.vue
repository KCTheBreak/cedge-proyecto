<template>
  <div class="container">
    <div class="welcome-text">
      <h2>Bienvenido de nuevo</h2>
      <p>Portal para la gestión de préstamos de equipo dentro del CEDGE</p>
    </div>

    <div class="login-box">
      <h2>Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input v-model="username" type="text" placeholder="Nombre del usuario" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Contraseña" required />
        </div>
        <label class="remember-me">
          <input v-model="rememberMe" type="checkbox" />
          Recordar nombre de usuario
        </label>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Error al iniciar sesión');
      return;
    }

    localStorage.setItem('authToken', data.token);
    router.push('/Prestamos');
  } catch (err) {
    console.error(err);
    alert('Error de conexión con el servidor');
  }
};

</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  height: 100vh;
  overflow: hidden;
}

.container {
  background: url('/src/assets/img/fondo.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  position: relative;
}

/* Banner */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #6d0f1f;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
  color: white;
}

.logo {
  height: 45px;
  margin-right: 10px;
}

/* Texto izquierda */
.welcome-text {
  position: absolute;
  top: 200px;
  left: 60px;
  color: white;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
  max-width: 400px;
}

/* Caja de login */
.login-box {
  position: absolute;
  top: 180px;
  right: 60px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 30px 25px;
  border-radius: 8px;
  width: 350px;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

input[type="text"], input[type="password"] {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
}

.remember-me {
  font-size: 14px;
  margin: 10px 0 15px;
  display: block;
  color: #ddd;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #6d0f1f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #520c17;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-text {
    position: static;
    text-align: center;
    margin-top: 120px;
  }

  .login-box {
    position: static;
    margin: 20px auto;
    width: 90%;
  }
}
</style>