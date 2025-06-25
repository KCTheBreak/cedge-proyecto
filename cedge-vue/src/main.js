import { createApp } from 'vue';
import App from '/src/App.vue';
import router from '/src/router/index.js';
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App)
  .use(router)
  .mount('#app');
