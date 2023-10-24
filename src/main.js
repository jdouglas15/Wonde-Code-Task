import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Import Vue Router

// Create a new router instance
const router = createRouter({
  history: createWebHistory(),
  base: '/',
  routes: [
  ],
});

const app = createApp(App);

app.use(router); // Use Vue Router
app.mount('#app');
