import { createRouter, createWebHistory } from 'vue-router'
import { loadView } from '@/utils/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView('/home')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

